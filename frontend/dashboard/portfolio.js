/* ============================================================
   PaperBull — Portfolio page: Holdings + Recent Buy/Sell Activity

   Data source: the paperbull-node backend (Postgres) when the user is
   logged in — GET /api/portfolio/:email returns their persisted
   holdings + order history. If that's unavailable (backend not
   running, or a guest session with no email) we fall back to the
   same localStorage ledger orders.js writes to, so the page keeps
   working offline. Either way, live LTP/day-change comes from the
   nse-node market-data backend on a refresh interval.
   ============================================================ */

(function () {
  const PORTFOLIO_API_BASE = "http://localhost:8000";
  const MARKET_API_BASE = "http://localhost:5000";
  const PORTFOLIO_KEY = "paperbull_portfolio";
  const USER_KEY = "paperbull_user";
  const LIVE_REFRESH_MS = 10000;

  const $ = (id) => document.getElementById(id);

  const fmtINR = (n, decimals = 2) =>
    "₹" + Math.abs(n || 0).toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const initials = (name) => {
    if (!name) return "?";
    return String(name).trim().charAt(0).toUpperCase();
  };

  function getEmail() {
    try {
      const user = JSON.parse(localStorage.getItem(USER_KEY) || "{}");
      return user.email || null;
    } catch (err) {
      return null;
    }
  }

  function getLocalHoldings() {
    try {
      const portfolio = JSON.parse(localStorage.getItem(PORTFOLIO_KEY) || "{}");
      return portfolio.holdings && typeof portfolio.holdings === "object" ? portfolio.holdings : {};
    } catch (err) {
      return {};
    }
  }

  // Normalizes backend holdings (array of {symbol,name,qty,avgPrice}) into
  // the same {symbol: {qty,avgPrice,name}} shape the local ledger uses.
  function holdingsArrayToMap(list) {
    const map = {};
    (list || []).forEach((h) => {
      map[h.symbol] = { qty: h.qty, avgPrice: h.avgPrice, name: h.name };
    });
    return map;
  }

  // Fetch persisted holdings + order history from the backend. Returns
  // null (rather than throwing) when the backend can't be reached, so the
  // caller can fall back to the local ledger.
  async function fetchBackendPortfolio(email) {
    try {
      const res = await fetch(`${PORTFOLIO_API_BASE}/api/portfolio/${encodeURIComponent(email)}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (!data || !data.success) return null;
      return {
        holdings: holdingsArrayToMap(data.holdings),
        orders: data.orders || [],
      };
    } catch (err) {
      console.warn("Portfolio: backend unreachable, falling back to local data.", err);
      return null;
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
    if (!card || !body) return { currentValue: 0, investedValue: 0, overallGain: 0, todayGain: 0 };

    const symbols = Object.keys(holdings);
    if (!symbols.length) {
      card.hidden = true;
      return { currentValue: 0, investedValue: 0, overallGain: 0, todayGain: 0 };
    }

    card.hidden = false;
    countEl.textContent = `${symbols.length} stock${symbols.length === 1 ? "" : "s"}`;

    let currentValue = 0;
    let investedValue = 0;
    let todayGain = 0;

    body.innerHTML = symbols
      .map((symbol) => {
        const h = holdings[symbol];
        const live = liveQuotes[symbol];
        const ltp = live ? Number(live.price) : h.avgPrice;
        const invested = h.qty * h.avgPrice;
        const curVal = h.qty * ltp;
        const gain = curVal - invested;
        const gainPct = invested ? (gain / invested) * 100 : 0;
        const gainUp = gain >= 0;

        const dayChangeAmt = live ? Number(live.change) * h.qty : 0;
        const dayChangePct = live ? Number(live.changePct) : 0;
        const dayUp = dayChangeAmt >= 0;

        currentValue += curVal;
        investedValue += invested;
        todayGain += dayChangeAmt;

        return `
        <div class="holding-row" data-symbol="${symbol}">
          <div class="holding-row-left">
            ${window.PBLogos ? window.PBLogos.avatarHtml(symbol, h.name || symbol, { wrapClass: "w-logo" }) : `<div class="w-logo">${initials(h.name || symbol)}</div>`}
            <div>
              <div class="holding-name">${symbol}</div>
              <div class="holding-meta">${h.qty} x Avg ${fmtINR(h.avgPrice)}</div>
            </div>
          </div>
          <div class="holding-row-gain">
            <div class="holding-col-label">Overall Gain</div>
            <div class="holding-gain-amt ${gainUp ? "up" : "down"}">${gainUp ? "" : "-"}${fmtINR(gain)} (${gainUp ? "+" : "-"}${Math.abs(gainPct).toFixed(2)}%)</div>
          </div>
          <div class="holding-row-daychange">
            <div class="holding-col-label">Day Change</div>
            <div class="holding-daychange-amt ${live ? (dayUp ? "up" : "down") : ""}">${live ? `${dayUp ? "" : "-"}${fmtINR(dayChangeAmt)} (${dayUp ? "+" : "-"}${Math.abs(dayChangePct).toFixed(2)}%)` : "—"}</div>
          </div>
          <div class="holding-row-ltp">
            <div class="holding-col-label">LTP</div>
            <div class="holding-ltp-val">${fmtINR(ltp)}</div>
          </div>
        </div>`;
      })
      .join("");

    body.querySelectorAll(".holding-row").forEach((row) => {
      row.addEventListener("click", () => {
        window.location.href = `stocks.html?symbol=${encodeURIComponent(row.getAttribute("data-symbol"))}`;
      });
    });

    const overallGain = currentValue - investedValue;
    return { currentValue, investedValue, overallGain, todayGain };
  }

  function renderHoldingsSummary({ currentValue, investedValue, overallGain, todayGain }) {
    const currentEl = $("holdingsCurrentValue");
    const gainEl = $("holdingsOverallGain");
    const investedEl = $("holdingsInvestedValue");
    const todayEl = $("holdingsTodayGain");
    if (!currentEl) return;

    const overallPct = investedValue ? (overallGain / investedValue) * 100 : 0;
    const openingValue = currentValue - todayGain;
    const todayPct = openingValue ? (todayGain / openingValue) * 100 : 0;
    const gainUp = overallGain >= 0;
    const todayUp = todayGain >= 0;

    currentEl.textContent = fmtINR(currentValue);
    gainEl.classList.toggle("down", !gainUp);
    gainEl.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      Overall Gain ${gainUp ? "+" : "-"}${fmtINR(overallGain)} (${gainUp ? "+" : "-"}${Math.abs(overallPct).toFixed(2)}%)`;

    investedEl.textContent = fmtINR(investedValue);

    todayEl.textContent = `${todayUp ? "+" : "-"}${fmtINR(todayGain)} (${todayUp ? "+" : "-"}${Math.abs(todayPct).toFixed(2)}%)`;
    todayEl.style.color = todayUp ? "var(--green)" : "var(--red)";

    // The "Day Change" stat card near the top of the page reads
    // portfolio.dayChange/dayChangePct out of localStorage, but nothing
    // ever wrote real values there — it always showed ₹0.00 (0.00%).
    // We already have the real, live numbers right here (same todayGain /
    // todayPct that "Today's Gain" below uses), so drive that card from
    // them directly, and persist them so any other page reading
    // paperbull_portfolio picks up the same figures instead of stale zeros.
    const topDayChangeEl = $("portfolioDayChange");
    const topDayChangePctEl = $("portfolioDayChangePct");
    if (topDayChangeEl && topDayChangePctEl) {
      topDayChangeEl.textContent = fmtINR(todayGain);
      topDayChangeEl.classList.remove("up", "down");
      topDayChangeEl.classList.add(todayUp ? "up" : "down");

      topDayChangePctEl.textContent = `${todayUp ? "+" : "-"}${Math.abs(todayPct).toFixed(2)}%`;
      topDayChangePctEl.classList.remove("up", "down");
      topDayChangePctEl.classList.add(todayUp ? "up" : "down");
    }

    try {
      const portfolio = JSON.parse(localStorage.getItem(PORTFOLIO_KEY) || "{}");
      portfolio.dayChange = todayGain;
      portfolio.dayChangePct = todayPct;
      localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
    } catch (err) {}
  }

  function updateEmptyState(hasHoldings) {
    const emptyCard = $("portfolioEmptyCard");
    if (!emptyCard) return;
    emptyCard.hidden = hasHoldings;
  }

  async function refresh() {
    const email = getEmail();
    let holdings = getLocalHoldings();

    if (email) {
      const backendData = await fetchBackendPortfolio(email);
      if (backendData) {
        holdings = backendData.holdings;
      }
    }

    const symbols = Object.keys(holdings);
    if (symbols.length) {
      liveQuotes = await fetchLiveQuotes(symbols);
    }

    const summary = renderHoldings(holdings);
    renderHoldingsSummary(summary);
    updateEmptyState(symbols.length > 0);
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

    const analyseBtn = $("analyseHoldingsBtn");
    if (analyseBtn) {
      analyseBtn.addEventListener("click", () => {
        window.location.href = "stocks.html";
      });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
