const express = require("express");
const router = express.Router();
const pool = require("../db");
const { getMarketStatus, getTodayIso } = require("../marketHours");

// Look up the `users` row (which holds the trading account) from an email
// address. Returns null if there's no account for that email yet.
async function getUserByEmail(email) {
  const result = await pool.query(
    `SELECT u.id, u.display_name, u.virtual_balance, u.portfolio_value,
            u.realized_pnl, u.total_trades
       FROM users u
       JOIN user_auth ua ON ua.id = u.auth_id
      WHERE ua.email = $1`,
    [email],
  );
  return result.rows[0] || null;
}

// GET /api/portfolio/:email — current holdings + order history + account stats
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found for this email." });
    }

    const todayIso = getTodayIso();
    const holdingsResult = await pool.query(
      `SELECT symbol, name, qty, avg_price,
              CASE WHEN intraday_date = $2 THEN intraday_qty ELSE 0 END AS intraday_qty
         FROM holdings
        WHERE user_id = $1 AND qty > 0
        ORDER BY updated_at DESC`,
      [user.id, todayIso],
    );

    const ordersResult = await pool.query(
      `SELECT symbol, name, side, order_type, product, qty, price, amount, realized_pnl, created_at
         FROM orders
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 100`,
      [user.id],
    );

    res.json({
      success: true,
      user: {
        fullName: user.display_name,
        balance: Number(user.virtual_balance),
        realizedPnl: Number(user.realized_pnl),
        totalTrades: user.total_trades,
      },
      holdings: holdingsResult.rows.map((h) => ({
        symbol: h.symbol,
        name: h.name,
        qty: Number(h.qty),
        avgPrice: Number(h.avg_price),
        intradayQty: Number(h.intraday_qty), // still-open Intraday (MIS) qty, due for auto square-off at close
      })),
      orders: ordersResult.rows.map((o) => ({
        symbol: o.symbol,
        name: o.name,
        side: o.side,
        orderType: o.order_type,
        product: o.product,
        qty: Number(o.qty),
        price: Number(o.price),
        amount: Number(o.amount),
        realizedPnl: Number(o.realized_pnl),
        timestamp: o.created_at,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/portfolio/order — execute a buy/sell, persisted atomically
router.post("/order", async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, symbol, name, side, qty, price, orderType, product } = req.body;

    if (!email || !symbol || !side || !qty || !price) {
      return res.status(400).json({ success: false, message: "Missing required order fields." });
    }
    if (side !== "buy" && side !== "sell") {
      return res.status(400).json({ success: false, message: "side must be 'buy' or 'sell'." });
    }

    const qtyNum = Number(qty);
    const priceNum = Number(price);
    const amount = qtyNum * priceNum;

    await client.query("BEGIN");

    const userResult = await client.query(
      `SELECT u.id, u.virtual_balance, u.realized_pnl, u.total_trades
         FROM users u
         JOIN user_auth ua ON ua.id = u.auth_id
        WHERE ua.email = $1
        FOR UPDATE`,
      [email],
    );

    if (userResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "No account found for this email." });
    }

    const user = userResult.rows[0];

    const holdingResult = await client.query(
      `SELECT id, qty, avg_price, intraday_qty, intraday_avg_price, intraday_date
         FROM holdings WHERE user_id = $1 AND symbol = $2 FOR UPDATE`,
      [user.id, symbol],
    );
    const held = holdingResult.rows[0] || { qty: 0, avg_price: 0, intraday_qty: 0, intraday_avg_price: 0, intraday_date: null };

    // Intraday (MIS) buys/sells are tracked in a separate qty/avg-price
    // bucket (reset daily) so the auto square-off job knows exactly what's
    // still open when the market closes, without touching Delivery holdings.
    const todayKey = getMarketStatus().dateKey;
    const todayIso = getTodayIso();
    const heldIntradayDateKey = held.intraday_date
      ? `${held.intraday_date.getUTCFullYear()}-${held.intraday_date.getUTCMonth() + 1}-${held.intraday_date.getUTCDate()}`
      : null;
    const intradayStillToday = heldIntradayDateKey === todayKey;
    let intradayQty = intradayStillToday ? Number(held.intraday_qty) : 0;
    let intradayAvgPrice = intradayStillToday ? Number(held.intraday_avg_price) : 0;

    let realizedPnl = 0;
    let newBalance = Number(user.virtual_balance);

    if (side === "buy") {
      if (amount > newBalance) {
        await client.query("ROLLBACK");
        return res.status(400).json({ success: false, message: "Insufficient funds for this order." });
      }
      const newQty = Number(held.qty) + qtyNum;
      const newAvg = (Number(held.avg_price) * Number(held.qty) + priceNum * qtyNum) / newQty;
      newBalance -= amount;

      if (product === "Intraday (MIS)") {
        const newIntradayQty = intradayQty + qtyNum;
        intradayAvgPrice = (intradayAvgPrice * intradayQty + priceNum * qtyNum) / newIntradayQty;
        intradayQty = newIntradayQty;
      }

      if (holdingResult.rows.length) {
        await client.query(
          `UPDATE holdings
              SET qty = $1, avg_price = $2, name = $3,
                  intraday_qty = $4, intraday_avg_price = $5, intraday_date = $6,
                  updated_at = NOW()
            WHERE id = $7`,
          [newQty, Math.round(newAvg * 100) / 100, name || symbol,
            intradayQty, Math.round(intradayAvgPrice * 100) / 100, todayIso, held.id],
        );
      } else {
        await client.query(
          `INSERT INTO holdings (user_id, symbol, name, qty, avg_price, intraday_qty, intraday_avg_price, intraday_date)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [user.id, symbol, name || symbol, newQty, Math.round(newAvg * 100) / 100,
            intradayQty, Math.round(intradayAvgPrice * 100) / 100, intradayQty > 0 ? todayIso : null],
        );
      }
    } else {
      if (qtyNum > Number(held.qty)) {
        await client.query("ROLLBACK");
        return res.status(400).json({ success: false, message: "Holding no longer sufficient for this sell." });
      }
      realizedPnl = (priceNum - Number(held.avg_price)) * qtyNum;
      newBalance += amount;
      const remainingQty = Number(held.qty) - qtyNum;
      const remainingIntradayQty = Math.max(0, intradayQty - qtyNum);

      if (remainingQty <= 0) {
        await client.query(`DELETE FROM holdings WHERE id = $1`, [held.id]);
      } else {
        await client.query(
          `UPDATE holdings
              SET qty = $1, intraday_qty = $2, intraday_date = $3, updated_at = NOW()
            WHERE id = $4`,
          [remainingQty, remainingIntradayQty, remainingIntradayQty > 0 ? todayIso : null, held.id],
        );
      }
    }

    await client.query(
      `INSERT INTO orders (user_id, symbol, name, side, order_type, product, qty, price, amount, realized_pnl)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [user.id, symbol, name || symbol, side, orderType || "Market", product || "Delivery", qtyNum, priceNum, amount, realizedPnl],
    );

    await client.query(
      `UPDATE users
          SET virtual_balance = $1,
              realized_pnl = realized_pnl + $2,
              total_trades = total_trades + 1
        WHERE id = $3`,
      [newBalance, realizedPnl, user.id],
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      balance: newBalance,
      realizedPnl: Number(user.realized_pnl) + realizedPnl,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

module.exports = router;
