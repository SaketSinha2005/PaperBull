// intradaySquareOff.js — automatic end-of-day square-off for Intraday (MIS)
// positions.
//
// Real brokers force-close any Intraday/MIS position that's still open a
// few minutes before the market shuts for the day. The frontend already
// mimics this client-side (frontend/dashboard/dashboard.js), but that only
// runs while someone has a PaperBull tab open. This module is the
// authoritative, server-side version: it polls on a timer, and once the
// market is past the square-off window for the day it sells off whatever's
// left in each user's `holdings.intraday_qty` bucket at the current market
// price, regardless of whether anyone is looking at the app.

const axios = require("axios");
const { getMarketStatus, getTodayIso } = require("./marketHours");

const MARKET_API_BASE = process.env.MARKET_API_BASE || "http://localhost:5000";
const CHECK_INTERVAL_MS = 30 * 1000; // poll every 30s — cheap, and close enough to "immediately after close"
const PRICE_CACHE_MS = 15 * 1000;

const priceCache = new Map(); // symbol -> { price, ts }

async function getLatestPrice(symbol) {
  const cached = priceCache.get(symbol);
  if (cached && Date.now() - cached.ts < PRICE_CACHE_MS) return cached.price;

  const { data } = await axios.get(
    `${MARKET_API_BASE}/api/stock/${encodeURIComponent(symbol)}`,
    { timeout: 8000 },
  );
  if (!data || data.error || data.price == null) return null;

  const price = Number(data.price);
  if (!Number.isFinite(price)) return null;

  priceCache.set(symbol, { price, ts: Date.now() });
  return price;
}

// Sells one holding's open intraday bucket. Re-locks and re-checks the row
// inside its own transaction so this is safe to call repeatedly / concurrently
// without double-selling.
async function squareOffHolding(pool, holdingId, todayIso) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `SELECT id, user_id, symbol, name, qty, avg_price, intraday_qty, intraday_avg_price, intraday_date
         FROM holdings WHERE id = $1 FOR UPDATE`,
      [holdingId],
    );
    const held = rows[0];

    if (!held || Number(held.intraday_qty) <= 0 || !held.intraday_date) {
      await client.query("ROLLBACK");
      return;
    }
    const heldDateIso = `${held.intraday_date.getUTCFullYear()}-${String(held.intraday_date.getUTCMonth() + 1).padStart(2, "0")}-${String(held.intraday_date.getUTCDate()).padStart(2, "0")}`;
    if (heldDateIso !== todayIso) {
      // Stale bucket from a previous day that somehow wasn't cleared — treat
      // as no longer intraday rather than force-selling it.
      await client.query(`UPDATE holdings SET intraday_qty = 0, intraday_date = NULL WHERE id = $1`, [held.id]);
      await client.query("COMMIT");
      return;
    }

    const price = await getLatestPrice(held.symbol);
    if (price == null) {
      await client.query("ROLLBACK");
      return; // retry this holding on the next tick
    }

    const qty = Number(held.intraday_qty);
    const avgPrice = Number(held.intraday_avg_price);
    const amount = qty * price;
    const realizedPnl = (price - avgPrice) * qty;
    const remainingQty = Number(held.qty) - qty;

    if (remainingQty <= 0) {
      await client.query(`DELETE FROM holdings WHERE id = $1`, [held.id]);
    } else {
      await client.query(
        `UPDATE holdings SET qty = $1, intraday_qty = 0, intraday_date = NULL, updated_at = NOW() WHERE id = $2`,
        [remainingQty, held.id],
      );
    }

    await client.query(
      `INSERT INTO orders (user_id, symbol, name, side, order_type, product, qty, price, amount, realized_pnl)
       VALUES ($1, $2, $3, 'sell', 'Auto Square-Off (Intraday)', 'Intraday (MIS)', $4, $5, $6, $7)`,
      [held.user_id, held.symbol, held.name, qty, price, amount, realizedPnl],
    );

    await client.query(
      `UPDATE users
          SET virtual_balance = virtual_balance + $1,
              realized_pnl = realized_pnl + $2,
              total_trades = total_trades + 1
        WHERE id = $3`,
      [amount, realizedPnl, held.user_id],
    );

    await client.query("COMMIT");
    console.log(`[intraday square-off] user ${held.user_id}: sold ${qty} ${held.symbol} @ ₹${price}`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`[intraday square-off] failed for holding ${holdingId}:`, err.message);
  } finally {
    client.release();
  }
}

async function runSquareOffPass(pool) {
  const status = getMarketStatus();
  if (!status.isWeekday || !status.isPastSquareOff) return; // not time yet today

  const todayIso = getTodayIso();

  const { rows } = await pool.query(
    `SELECT id FROM holdings WHERE intraday_qty > 0 AND intraday_date = $1`,
    [todayIso],
  );
  if (!rows.length) return;

  for (const row of rows) {
    await squareOffHolding(pool, row.id, todayIso);
  }
}

function startIntradaySquareOffJob(pool) {
  const tick = () => {
    runSquareOffPass(pool).catch((err) => console.error("[intraday square-off] pass failed:", err.message));
  };
  tick();
  return setInterval(tick, CHECK_INTERVAL_MS);
}

module.exports = { startIntradaySquareOffJob, runSquareOffPass };
