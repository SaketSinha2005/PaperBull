/* ============================================================
   PaperBull — Portfolio page: Holdings + Recent Buy/Sell Activity
   Reads the same localStorage ledger orders.js writes to
   ("paperbull_portfolio" for open positions, "paperbull_orders" for
   the buy/sell log) and enriches it with live prices from the
   nse-node market-data backend, refreshed on an interval so the
   page keeps itself up to date.
   ============================================================ */

(function () {
  const MARKET_API_BASE = "http://localhost:5000";
  const PORTFOLIO_KEY = "paperbull_portfolio";
  const ORDERS_KEY = "paperbull_orders";
  const LIVE_REFRESH_MS = 10000;

  const $ = (id) => document.getElementById(id);

  const fmtINR = (n, decimals = 2) =>
    "₹" + Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const initials = (name) => {
    if (!name) return "?";
    const parts = String(name).trim().split(/\s+/);
    return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
  };

  function getHoldings() {
    try {
      const portfolio = JSON.parse(localStorage.getItem(PORTFOLIO_KEY) || "{}");
      return portfolio.holdings && typeof portfolio.holdings === "object" ? portfolio.holdings : {};
    } catch (err) {
      return {};
    }
  }

  function getOrders() {
    try {
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
      return Array.isArray(orders) ? orders : [];
    } catch (err) {
      return [];
    }
  }

  // Cache of the latest live quotes for symbols we currently hold, keyed by symbol.
  let liveQuotes = {};

  async function fetchLiveQuotes(symbols) {
    if (!symbols.length) return {};
    try {
      const res = await fetch(`${MARKET_API_BASE}/api/stocks`);
      if (!res.ok) throw new Error("Failed to fetch live quotes");
      const list = await res.json();
      const bySymbol = {};
      if (Array.isArray(list)) {
        list.forEach((s) => {
          if (s && s.symbol) bySymbol[s.symbol] = s;
        });
      }
      return bySymbol;
    } catch (err) {
      console.error("Portfolio: failed to load live prices. Is the backend running on", MARKET_API_BASE, err);
      return {};
    }
  }

  function renderHoldings(holdings) {
    const card = $("holdingsCard");
    const body = $("holdingsBody");
    const countEl = $("holdingsCount");
    if (!card || !body) return;

    const symbols = Object.keys(holdings);
    if (!symbols.length) {
      card.hidden = true;
      return;
    }

    card.hidden = false;
    countEl.textContent = `${symbols.length} stock${symbols.length === 1 ? "" : "s"}`;

    body.innerHTML = symbols
      .map((symbol) => {
        const h = holdings[symbol];
        const live = liveQuotes[symbol];
        const ltp = live ? Number(live.price) : h.avgPrice;
        const investedVal = h.qty * h.avgPrice;
        const curVal = h.qty * ltp;
        const pl = curVal - investedVal;
        const plPct = investedVal ? (pl / investedVal) * 100 : 0;
        const plUp = pl >= 0;
        const dayUp = live ? live.change >= 0 : true;
        const dayChangeText = live ? `${live.change >= 0 ? "+" : ""}${live.change} (${live.changePct >= 0 ? "+" : ""}${live.changePct}%)` : "—";

        return `
        <tr class="holdings-row" data-symbol="${symbol}">
          <td class="col-h-company">
            <div class="row-co">
              <div class="w-logo">${initials(h.name || symbol).charAt(0)}</div>
              <div>
                <div class="h-name">${h.name || symbol}</div>
                <div class="h-symbol">${symbol} · Day ${live ? `<span class="${dayUp ? "up" : "down"}">${dayChangeText}</span>` : dayChangeText}</div>
              </div>
            </div>
          </td>
          <td class="col-h-qty">${h.qty}</td>
          <td class="col-h-avg">${fmtINR(h.avgPrice)}</td>
          <td class="col-h-ltp">${fmtINR(ltp)}</td>
          <td class="col-h-invested">${fmtINR(investedVal)}</td>
          <td class="col-h-value">${fmtINR(curVal)}</td>
          <td class="col-h-pl">
            <div class="h-pl ${plUp ? "up" : "down"}">${plUp ? "+" : "-"}${fmtINR(pl)}</div>
            <div class="h-pl-pct ${plUp ? "up" : "down"}">${plUp ? "+" : "-"}${Math.abs(plPct).toFixed(2)}%</div>
          </td>
        </tr>`;
      })
      .join("");

    body.querySelectorAll(".holdings-row").forEach((row) => {
      row.addEventListener("click", () => {
        window.location.href = `stocks.html?symbol=${encodeURIComponent(row.getAttribute("data-symbol"))}`;
      });
    });
  }

  function renderTransactions(orders) {
    const card = $("transactionsCard");
    const body = $("transactionsBody");
    const countEl = $("transactionsCount");
    if (!card || !body) return;

    if (!orders.length) {
      card.hidden = true;
      return;
    }

    card.hidden = false;
    countEl.textContent = `${orders.length} order${orders.length === 1 ? "" : "s"}`;

    body.innerHTML = orders
      .slice(0, 25)
      .map((o) => {
        const isBuy = o.side === "buy";
        const when = o.timestamp
          ? new Date(o.timestamp).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "";

        return `
        <div class="tx-row">
          <div class="tx-side-badge ${isBuy ? "buy" : "sell"}">${isBuy ? "BUY" : "SELL"}</div>
          <div class="tx-main">
            <div class="tx-name">${o.name || o.symbol}</div>
            <div class="tx-sub">${o.symbol} · ${o.orderType || "Market"} · ${o.product || "Delivery"}</div>
          </div>
          <div class="tx-qty">${o.qty} sh${o.qty === 1 ? "" : "s"} @ ${fmtINR(o.price)}</div>
          <div class="tx-amount ${isBuy ? "down" : "up"}">${isBuy ? "-" : "+"}${fmtINR(o.amount)}</div>
          <div class="tx-time">${when}</div>
        </div>`;
      })
      .join("");
  }

  function updateEmptyState(hasHoldings, hasOrders) {
    const emptyCard = $("portfolioEmptyCard");
    if (!emptyCard) return;
    emptyCard.hidden = hasHoldings || hasOrders;
  }

  async function refresh() {
    const holdings = getHoldings();
    const orders = getOrders();
    const symbols = Object.keys(holdings);

    if (symbols.length) {
      liveQuotes = await fetchLiveQuotes(symbols);
    }

    renderHoldings(holdings);
    renderTransactions(orders);
    updateEmptyState(symbols.length > 0, orders.length > 0);
  }

  function init() {
    if (!$("holdingsCard")) return; // not on the portfolio page

    refresh();
    setInterval(() => {
      if (!document.hidden) refresh();
    }, LIVE_REFRESH_MS);

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) refresh();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
