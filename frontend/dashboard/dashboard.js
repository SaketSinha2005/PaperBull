document.addEventListener('DOMContentLoaded', () => {
  const storedUser = localStorage.getItem('paperbull_user');

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      const avatar = document.querySelector('.avatar');

      if (avatar && user.fullName) {
        avatar.textContent = user.fullName.trim().charAt(0).toUpperCase();
      }

      const moneyAmount = document.querySelector('.money-amount');

      if (moneyAmount && typeof user.balance === 'number') {
        moneyAmount.textContent = '₹' + user.balance.toLocaleString('en-IN');
      }
    } catch (err) {}
  }

  const pills = document.querySelectorAll('.pill-tabs .pill');

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  const navLinks = document.querySelectorAll('.nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');

    if (href === currentPage) {
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    }

    link.addEventListener('click', (e) => {
      if (href === '#') {
        e.preventDefault();
      }
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  async function updateHeaderTicker() {
    const response = await fetch('http://localhost:5000/api/header-indices');
    const data = await response.json();

    if (data && Array.isArray(data)) {
      const tickerLeft = document.querySelector('.ticker-left');
      if (tickerLeft) {
        const doubledData = [...data, ...data];
        
        tickerLeft.innerHTML = data.map(item => `
          <span class="ticker-item">
            <span class="ticker-name">${item.name}</span>
            <span class="ticker-val">${item.value}</span>
            <span class="${item.is_up ? 'up' : 'down'}">
              ${item.change} (${item.pct})
            </span>
          </span>
        `).join('');
      }
    }
  }

  updateHeaderTicker();
  setInterval(updateHeaderTicker, 1000);
});

// NOTE: the Watchlist page's rendering, search, and add/remove logic now
// lives in watchlist.js, which supports multiple named, user-created
// watchlists (like playlists) instead of a single flat list.

function getPortfolioSummary() {
  let portfolio = {};
  let user = {};

  try {
    portfolio = JSON.parse(localStorage.getItem('paperbull_portfolio') || '{}');
  } catch (err) {}

  try {
    user = JSON.parse(localStorage.getItem('paperbull_user') || '{}');
  } catch (err) {}

  const moneyAvailable = typeof portfolio.moneyAvailable === 'number'
    ? portfolio.moneyAvailable
    : (typeof user.balance === 'number' ? user.balance : 100000);

  return {
    stocksBought: typeof portfolio.stocksBought === 'number' ? portfolio.stocksBought : 0,
    moneyAvailable,
    profitLoss: typeof portfolio.profitLoss === 'number' ? portfolio.profitLoss : 0,
    profitLossPct: typeof portfolio.profitLossPct === 'number' ? portfolio.profitLossPct : 0,
  };
}

function renderProfileDropdown() {
  const summary = getPortfolioSummary();

  const stocksEl = document.getElementById('statStocksBought');
  const moneyEl = document.getElementById('statMoneyAvailable');
  const plEl = document.getElementById('statProfitLoss');

  if (stocksEl) stocksEl.textContent = summary.stocksBought.toLocaleString('en-IN');

  if (moneyEl) moneyEl.textContent = '₹' + summary.moneyAvailable.toLocaleString('en-IN');

  if (plEl) {
    const sign = summary.profitLoss > 0 ? '+' : '';
    plEl.textContent = `${sign}₹${summary.profitLoss.toLocaleString('en-IN')} (${sign}${summary.profitLossPct.toFixed(2)}%)`;
    plEl.classList.remove('up', 'down');
    if (summary.profitLoss > 0) plEl.classList.add('up');
    else if (summary.profitLoss < 0) plEl.classList.add('down');
  }

  try {
    const stored = localStorage.getItem('paperbull_user');
    if (stored) {
      const user = JSON.parse(stored);
      if (user.fullName) {
        const initial = user.fullName.trim().charAt(0).toUpperCase();
        document.querySelectorAll('.profile-dropdown-avatar').forEach((el) => (el.textContent = initial));
        const nameEl = document.querySelector('.profile-dropdown-name');
        if (nameEl) nameEl.textContent = user.fullName;
      }
    }
  } catch (err) {}

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('paperbull_user');
      window.location.href = '../index.html';
    });
  }
}

document.addEventListener('DOMContentLoaded', renderProfileDropdown);

function renderPortfolioPage() {
  const valueEl = document.getElementById('portfolioTotalValue');
  if (!valueEl) return; // not on the portfolio page

  const summary = getPortfolioSummary();

  let portfolio = {};
  try {
    portfolio = JSON.parse(localStorage.getItem('paperbull_portfolio') || '{}');
  } catch (err) {}

  const startingCapital = typeof portfolio.startingCapital === 'number' ? portfolio.startingCapital : 100000;
  const totalInvested = typeof portfolio.totalInvested === 'number' ? portfolio.totalInvested : (startingCapital - summary.moneyAvailable);
  const totalReturns = summary.profitLoss;
  const totalReturnsPct = summary.profitLossPct;
  const totalValue = totalInvested + totalReturns;
  const totalValuePct = startingCapital ? (totalValue / startingCapital) * 100 : 0;
  const dayChange = typeof portfolio.dayChange === 'number' ? portfolio.dayChange : 0;
  const dayChangePct = typeof portfolio.dayChangePct === 'number' ? portfolio.dayChangePct : 0;
  const investedPctOfMoney = startingCapital ? (totalInvested / startingCapital) * 100 : 0;

  const fmt = (n) => '₹' + Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const setChange = (el, amount, pct, showSign = true) => {
    if (!el) return;
    const sign = amount > 0 ? '+' : amount < 0 ? '-' : '';
    el.textContent = `${showSign ? sign : ''}${fmt(amount)} (${sign}${Math.abs(pct).toFixed(2)}%)`;
    el.classList.remove('up', 'down');
    if (amount > 0) el.classList.add('up');
    else if (amount < 0) el.classList.add('down');
  };

  document.getElementById('portfolioTotalValue').textContent = fmt(totalValue);
  setChange(document.getElementById('portfolioTotalValueChange'), totalValue, totalValuePct, false);

  document.getElementById('portfolioTotalInvested').textContent = fmt(totalInvested);
  const investedPctEl = document.getElementById('portfolioTotalInvestedPct');
  if (investedPctEl) investedPctEl.textContent = `${investedPctOfMoney.toFixed(0)}% of Available Money`;

  document.getElementById('portfolioTotalReturns').textContent = fmt(totalReturns);
  setChange(document.getElementById('portfolioTotalReturnsPct'), totalReturns, totalReturnsPct, false);
  const returnsEl = document.getElementById('portfolioTotalReturns');
  returnsEl.classList.remove('up', 'down');
  if (totalReturns > 0) returnsEl.classList.add('up');
  else if (totalReturns < 0) returnsEl.classList.add('down');

  document.getElementById('portfolioDayChange').textContent = fmt(dayChange);
  setChange(document.getElementById('portfolioDayChangePct'), dayChange, dayChangePct, false);
  const dayChangeEl = document.getElementById('portfolioDayChange');
  dayChangeEl.classList.remove('up', 'down');
  if (dayChange > 0) dayChangeEl.classList.add('up');
  else if (dayChange < 0) dayChangeEl.classList.add('down');

  const emptyCard = document.getElementById('portfolioEmptyCard');
  if (emptyCard && summary.stocksBought > 0) {
    emptyCard.querySelector('.portfolio-empty-title').textContent = 'Ready to add more?';
    emptyCard.querySelector('.portfolio-empty-text').textContent = 'Keep exploring stocks to grow and diversify your portfolio further.';
  }

  const goToStocks = () => { window.location.href = 'stocks.html'; };
  const addBtn1 = document.getElementById('addToPortfolioBtn');
  const addBtn2 = document.getElementById('addToPortfolioBtn2');
  if (addBtn1) addBtn1.addEventListener('click', goToStocks);
  if (addBtn2) addBtn2.addEventListener('click', goToStocks);
}

document.addEventListener('DOMContentLoaded', renderPortfolioPage);

// ---- Make every stock tile on the dashboard (bought / intraday / etc.) clickable ----
document.addEventListener('DOMContentLoaded', () => {
  const clickableStockTiles = document.querySelectorAll('.bought-item[data-symbol], .intraday-item[data-symbol]');

  clickableStockTiles.forEach((tile) => {
    tile.style.cursor = 'pointer';
    tile.addEventListener('click', () => {
      const { symbol, name, price, change, pct, up } = tile.dataset;
      const params = new URLSearchParams({
        symbol: symbol || '',
        name: name || '',
        price: price || '',
        change: change || '',
        pct: pct || '',
        up: up || 'true',
      });
      window.location.href = `stocks.html?${params.toString()}`;
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.sticky-header-wrapper');
  let isScrolling;

  window.addEventListener('scroll', () => {
    header.classList.add('hidden');
    
    window.clearTimeout(isScrolling);

    isScrolling = setTimeout(() => {
      header.classList.remove('hidden');
    }, 250);
  }, { passive: true });
});

(function () {
  const MARKET_API_BASE = 'http://localhost:5000';
  const PORTFOLIO_API_BASE = 'http://localhost:8000';
  const PORTFOLIO_KEY = 'paperbull_portfolio';
  const USER_KEY = 'paperbull_user';
  const ORDERS_KEY = 'paperbull_orders';
  const PENDING_KEY = 'paperbull_pending_orders';
  const DEFAULT_STARTING_CAPITAL = 100000;
  const CHECK_INTERVAL_MS = 5000;

  function syncOrderToBackend(order) {
    try {
      const user = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
      if (!user.email) return;
      fetch(`${PORTFOLIO_API_BASE}/api/portfolio/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          symbol: order.symbol,
          name: order.name,
          side: order.side,
          qty: order.qty,
          price: order.price,
          orderType: order.orderType || 'Market',
          product: order.product || 'Delivery',
        }),
      }).catch(() => {});
    } catch (err) {}
  }

  function getPortfolio() {
    let portfolio = {};
    try { portfolio = JSON.parse(localStorage.getItem(PORTFOLIO_KEY) || '{}'); } catch (err) {}
    let user = {};
    try { user = JSON.parse(localStorage.getItem(USER_KEY) || '{}'); } catch (err) {}

    return {
      startingCapital: typeof portfolio.startingCapital === 'number' ? portfolio.startingCapital : DEFAULT_STARTING_CAPITAL,
      moneyAvailable: typeof portfolio.moneyAvailable === 'number'
        ? portfolio.moneyAvailable
        : (typeof user.balance === 'number' ? user.balance : DEFAULT_STARTING_CAPITAL),
      totalInvested: typeof portfolio.totalInvested === 'number' ? portfolio.totalInvested : 0,
      stocksBought: typeof portfolio.stocksBought === 'number' ? portfolio.stocksBought : 0,
      profitLoss: typeof portfolio.profitLoss === 'number' ? portfolio.profitLoss : 0,
      profitLossPct: typeof portfolio.profitLossPct === 'number' ? portfolio.profitLossPct : 0,
      holdings: portfolio.holdings && typeof portfolio.holdings === 'object' ? portfolio.holdings : {},
    };
  }

  function savePortfolio(portfolio) {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
    try {
      const user = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
      user.balance = portfolio.moneyAvailable;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (err) {}
  }

  function logOrder(order) {
    let orders = [];
    try { orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); } catch (err) {}
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.slice(0, 200)));
  }

  function getPendingOrders() {
    try {
      const list = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]');
      return Array.isArray(list) ? list : [];
    } catch (err) {
      return [];
    }
  }

  function savePendingOrders(list) {
    localStorage.setItem(PENDING_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('paperbull:pending-orders-changed'));
  }

  function addPendingOrder(order) {
    const list = getPendingOrders();
    const withId = Object.assign(
      { id: 'trg_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8), createdAt: new Date().toISOString() },
      order
    );
    list.unshift(withId);
    savePendingOrders(list);
    return withId;
  }

  function cancelPendingOrder(id) {
    savePendingOrders(getPendingOrders().filter((o) => o.id !== id));
  }

  // ---------------- market hours ----------------
  function getMarketStatus() {
    if (window.PaperBullMarketHours) return window.PaperBullMarketHours.getMarketStatus();
    return { isOpen: false, isWeekday: false, isPastSquareOff: false, dateKey: null, message: "Market status unavailable" };
  }

  // ---------------- intraday (MIS) bookkeeping ----------------
  // Mirrors the same logic in orders.js — kept in sync with whatever
  // currently-held shares were bought under "Intraday (MIS)" today, so
  // checkIntradaySquareOff() knows exactly what to auto-sell before the
  // trading day ends.
  function ensureIntradayFresh(portfolio) {
    const today = getMarketStatus().dateKey;
    if (portfolio.intradayDate !== today) {
      portfolio.intraday = {};
      portfolio.intradayDate = today;
    }
    if (!portfolio.intraday || typeof portfolio.intraday !== 'object') portfolio.intraday = {};
    return portfolio;
  }

  function applyIntradayBookkeeping(portfolio, order) {
    ensureIntradayFresh(portfolio);
    const bucket = portfolio.intraday;
    if (order.side === 'buy') {
      if (order.product === 'Intraday (MIS)') {
        const cur = bucket[order.symbol] || { qty: 0, avgPrice: 0, name: order.name };
        const newQty = cur.qty + order.qty;
        const newAvg = (cur.avgPrice * cur.qty + order.price * order.qty) / newQty;
        bucket[order.symbol] = { qty: newQty, avgPrice: Math.round(newAvg * 100) / 100, name: order.name };
      }
    } else {
      const cur = bucket[order.symbol];
      if (cur && cur.qty > 0) {
        const remaining = cur.qty - Math.min(cur.qty, order.qty);
        if (remaining <= 0) delete bucket[order.symbol];
        else bucket[order.symbol] = Object.assign({}, cur, { qty: remaining });
      }
    }
  }

  function executeOrder(order, execPrice) {
    const portfolio = getPortfolio();
    const qty = order.qty;
    let executed = true;
    let failReason = '';

    if (order.side === 'buy') {
      const amount = qty * execPrice;
      if (amount > portfolio.moneyAvailable) {
        executed = false;
        failReason = 'insufficient funds';
      } else {
        const held = portfolio.holdings[order.symbol] || { qty: 0, avgPrice: 0 };
        const newQty = held.qty + qty;
        const newAvg = ((held.avgPrice * held.qty) + (execPrice * qty)) / newQty;
        portfolio.holdings[order.symbol] = { qty: newQty, avgPrice: Math.round(newAvg * 100) / 100, name: order.name };
        portfolio.moneyAvailable -= amount;
        portfolio.totalInvested += amount;
        portfolio.stocksBought += qty;
      }
    } else {
      const held = portfolio.holdings[order.symbol] || { qty: 0, avgPrice: 0 };
      if (qty > held.qty) {
        executed = false;
        failReason = 'holding no longer sufficient';
      } else {
        const amount = qty * execPrice;
        const realized = (execPrice - held.avgPrice) * qty;
        portfolio.moneyAvailable += amount;
        portfolio.totalInvested = Math.max(0, portfolio.totalInvested - held.avgPrice * qty);
        portfolio.profitLoss += realized;
        portfolio.profitLossPct = portfolio.startingCapital ? (portfolio.profitLoss / portfolio.startingCapital) * 100 : 0;
        const remainingQty = held.qty - qty;
        if (remainingQty <= 0) delete portfolio.holdings[order.symbol];
        else portfolio.holdings[order.symbol] = { qty: remainingQty, avgPrice: held.avgPrice, name: order.name };
      }
    }

    if (executed) {
      applyIntradayBookkeeping(portfolio, { symbol: order.symbol, name: order.name, side: order.side, qty, price: execPrice, product: order.product });
      savePortfolio(portfolio);
      logOrder({
        symbol: order.symbol,
        name: order.name,
        side: order.side,
        orderType: order.orderType || 'Trigger Price',
        product: order.product,
        qty,
        price: execPrice,
        amount: qty * execPrice,
        triggerPrice: order.triggerPrice,
        timestamp: new Date().toISOString(),
      });
      syncOrderToBackend({
        symbol: order.symbol,
        name: order.name,
        side: order.side,
        orderType: order.orderType || 'Trigger Price',
        product: order.product,
        qty,
        price: execPrice,
      });
      if (typeof renderProfileDropdown === 'function') renderProfileDropdown();
    }

    return { executed, failReason };
  }

  function showGlobalToast(text) {
    let toast = document.getElementById('paperbullGlobalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'paperbullGlobalToast';
      toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:#1c2733;color:#fff;padding:12px 20px;border-radius:10px;font-size:14px;box-shadow:0 8px 24px rgba(0,0,0,0.35);z-index:9999;opacity:0;transition:opacity .25s ease, transform .25s ease;max-width:min(420px, 90vw);text-align:center;';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    clearTimeout(showGlobalToast._t);
    showGlobalToast._t = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 4200);
  }

  let checking = false;

  async function checkPendingOrders() {
    if (checking) return;
    const pending = getPendingOrders();
    if (!pending.length) return;
    if (!getMarketStatus().isOpen) return; // trigger orders only fire during market hours
    checking = true;

    try {
      const bySymbol = {};
      pending.forEach((o) => { (bySymbol[o.symbol] = bySymbol[o.symbol] || []).push(o); });

      const remaining = [];
      const toastMessages = [];

      for (const symbol of Object.keys(bySymbol)) {
        let price = null;
        try {
          const res = await fetch(`${MARKET_API_BASE}/api/stock/${encodeURIComponent(symbol)}`);
          if (res.ok) {
            const data = await res.json();
            if (data && !data.error) price = Number(data.price);
          }
        } catch (err) {}

        for (const order of bySymbol[symbol]) {
          if (price == null || Number.isNaN(price)) {
            remaining.push(order);
            continue;
          }
          const reached = order.direction === 'above' ? price >= order.triggerPrice : price <= order.triggerPrice;
          if (!reached) {
            remaining.push(order);
            continue;
          }
          const { executed, failReason } = executeOrder(order, price);
          if (executed) {
            toastMessages.push(`Trigger hit: ${order.side === 'buy' ? 'Buy' : 'Sell'} order for ${order.qty} share${order.qty === 1 ? '' : 's'} of ${order.symbol} executed at ₹${price.toFixed(2)}`);
          } else {
            toastMessages.push(`Trigger order for ${order.symbol} could not be executed (${failReason}) and was cancelled.`);
          }
        }
      }

      if (remaining.length !== pending.length) savePendingOrders(remaining);
      toastMessages.forEach((msg) => showGlobalToast(msg));
    } finally {
      checking = false;
    }
  }

  // ---------------- intraday (MIS) auto square-off ----------------
  // Real brokers force-close any Intraday/MIS position that's still open
  // a few minutes before the market shuts for the day. We mirror that
  // here: once we're inside that window, sell off whatever's left in
  // portfolio.intraday at the live market price, exactly once per
  // trading day.
  const SQUAREOFF_DONE_KEY = 'paperbull_squareoff_done_date';
  let squaringOff = false;

  function getSquareOffDoneDate() {
    try { return localStorage.getItem(SQUAREOFF_DONE_KEY); } catch (err) { return null; }
  }

  function setSquareOffDoneDate(dateKey) {
    try { localStorage.setItem(SQUAREOFF_DONE_KEY, dateKey); } catch (err) {}
  }

  async function checkIntradaySquareOff() {
    if (squaringOff) return;
    const status = getMarketStatus();
    if (!status.isWeekday || !status.dateKey) return;
    if (status.minutesNow < status.squareOffMin) return; // not time yet
    if (getSquareOffDoneDate() === status.dateKey) return; // already handled today

    const portfolio = getPortfolio();
    ensureIntradayFresh(portfolio);
    const symbols = Object.keys(portfolio.intraday).filter((sym) => portfolio.intraday[sym].qty > 0);

    if (!symbols.length) {
      setSquareOffDoneDate(status.dateKey);
      return;
    }

    squaringOff = true;
    try {
      for (const symbol of symbols) {
        const pos = portfolio.intraday[symbol];
        let price = null;
        try {
          const res = await fetch(`${MARKET_API_BASE}/api/stock/${encodeURIComponent(symbol)}`);
          if (res.ok) {
            const data = await res.json();
            if (data && !data.error) price = Number(data.price);
          }
        } catch (err) {}

        if (price == null || Number.isNaN(price)) continue; // retry this symbol next tick

        const { executed } = executeOrder(
          { symbol, name: pos.name, side: 'sell', qty: pos.qty, product: 'Intraday (MIS)', orderType: 'Auto Square-Off (Intraday)' },
          price
        );

        if (executed) {
          showGlobalToast(`Intraday auto square-off: sold ${pos.qty} share${pos.qty === 1 ? '' : 's'} of ${symbol} at ₹${price.toFixed(2)} before day end`);
        }
      }

      const refreshed = getPortfolio();
      ensureIntradayFresh(refreshed);
      const stillOpen = Object.keys(refreshed.intraday).some((sym) => refreshed.intraday[sym].qty > 0);
      if (!stillOpen) setSquareOffDoneDate(status.dateKey);
    } finally {
      squaringOff = false;
    }
  }

  window.PaperBullOrders = {
    getPendingOrders,
    addPendingOrder,
    cancelPendingOrder,
    checkPendingOrders,
    checkIntradaySquareOff,
    syncOrderToBackend,
  };

  document.addEventListener('DOMContentLoaded', () => {
    checkPendingOrders();
    checkIntradaySquareOff();
    setInterval(() => {
      checkPendingOrders();
      checkIntradaySquareOff();
    }, CHECK_INTERVAL_MS);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        checkPendingOrders();
        checkIntradaySquareOff();
      }
    });
  });
})();

const DASHBOARD_API_BASE = 'http://localhost:5000';
const DASHBOARD_API_ENDPOINT = `${DASHBOARD_API_BASE}/api/gainers`;
let currentMoversEndpoint = DASHBOARD_API_ENDPOINT;
const MAX_MOVERS_COUNT = 7;

document.addEventListener('DOMContentLoaded', () => {
  console.log("1. Dashboard.js is loaded and running!");

  const moversTableBody = document.getElementById('movers-table-body');
  const pills = document.querySelectorAll('.movers-bar .pill-tabs .pill');
  
  if (moversTableBody) {
    fetchTopMovers(moversTableBody, currentMoversEndpoint);

    // Refresh every second. Guarded with isFetchingMovers so a slow
    // request (NSE scrape + per-stock chart calls) can't overlap with
    // the next tick and pile up requests.
    let isFetchingMovers = false;
    setInterval(async () => {
      if (isFetchingMovers) return;
      isFetchingMovers = true;
      try {
        await fetchTopMovers(moversTableBody, currentMoversEndpoint);
      } finally {
        isFetchingMovers = false;
      }
    }, 1000);

    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        // Change visual active state
        pills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');

        if (pill.textContent.trim() === 'Losers') {
          currentMoversEndpoint = `${DASHBOARD_API_BASE}/api/losers`;
        } else {
          currentMoversEndpoint = `${DASHBOARD_API_BASE}/api/gainers`;
        }

        moversTableBody.innerHTML = `
          <tr>
            <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 40px 0;">
              Fetching live market data...
            </td>
          </tr>
        `;
        
        fetchTopMovers(moversTableBody, currentMoversEndpoint);
      });
    });

  } 
  
  else {
    console.error("ERROR: Could not find 'movers-table-body' in the HTML. Did you save the index.html file?");
  }
});

async function fetchTopMovers(container, endpoint = DASHBOARD_API_ENDPOINT) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Network error fetching market assets');
    
    const stocks = await response.json();
    
    if (!Array.isArray(stocks) || stocks.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 40px 0;">
            No market data available right now.
          </td>
        </tr>
      `;
      return;
    }

    container.innerHTML = '';
    
    stocks.slice(0, MAX_MOVERS_COUNT).forEach(stock => {
      const changeValue = typeof stock.change_percent === 'number'
        ? stock.change_percent
        : parseFloat(String(stock.change_percent).replace('%', '')) || 0;
      
      const prevClose = stock.previous_close || (stock.price / (1 + (changeValue / 100)));
      const absChange = (stock.price - prevClose).toFixed(2);
      
      const sign = absChange >= 0 ? '+' : '';
      const changeText = `${sign}${absChange} (${Math.abs(changeValue).toFixed(2)}%)`;
      const scoreClass = changeValue >= 0 ? 'up' : 'down';
      const sparkClass = changeValue >= 0 ? 'spark-up' : 'spark-down';
      
      const volumeText = stock.volume != null ? Number(stock.volume).toLocaleString('en-IN') : '—';
      const symbolText = stock.symbol || 'NSE';
      const priceValue = Number(stock.price || 0);

      let sparkPoints = "";
      let baselineLine = "";
      
      if (stock.chart && stock.chart.length > 0) {
          const prices = stock.chart;
          const minP = Math.min(...prices, prevClose);
          const maxP = Math.max(...prices, prevClose);
          const range = maxP - minP || 1; 
          
          sparkPoints = prices.map((p, index) => {
              const x = (index / (prices.length - 1)) * 100;
              const y = 22 - (((p - minP) / range) * 20); 
              return `${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(' ');

          const baselineY = 22 - (((prevClose - minP) / range) * 20);
          baselineLine = `<line x1="0" y1="${baselineY.toFixed(1)}" x2="100" y2="${baselineY.toFixed(1)}" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="2 2" opacity="0.4"></line>`;
      }

      const row = document.createElement('tr');

      row.style.cursor = 'pointer';
      row.addEventListener('click', () => {
        window.location.href = `stocks.html?symbol=${stock.symbol}`;
      });

      const moverLogoHtml = window.PBLogos
        ? window.PBLogos.avatarHtml(stock.symbol, stock.name, { wrapClass: "mover-logo" })
        : `<div class="mover-logo"><span class="pb-logo-fallback">${symbolText.charAt(0)}</span></div>`;

      row.innerHTML = `
        <td class="col-company">
          <div class="company-cell">
            ${moverLogoHtml}
            <span class="company-symbol">${symbolText}</span>
          </div>
        </td>
        <td class="col-graph">
          <svg class="spark ${sparkClass}" viewBox="0 0 100 24">
            ${baselineLine}
            <polyline points="${sparkPoints}"></polyline>
          </svg>
        </td>
        <td class="col-price">
          <div class="price">₹${priceValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <div class="change ${scoreClass}">${changeText}</div>
        </td>
        <td class="col-volume">${volumeText}</td>
      `;
            
      container.appendChild(row);
    });
    
  } catch (error) {
    console.error('Frontend error mounting table rows:', error);
    container.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: #ef4444; padding: 20px 0; font-size: 14px;">
          Failed to fetch live prices. Ensure backend server is active on ${DASHBOARD_API_BASE}.
        </td>
      </tr>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const breakoutGrid = document.getElementById('breakout-cards-grid');
  const highBtn = document.getElementById('breakout-high-btn');
  const lowBtn = document.getElementById('breakout-low-btn');
  
  const DASHBOARD_API_BASE = 'http://localhost:5000';
  
  if (breakoutGrid) {
    let currentBreakoutEndpoint = `${DASHBOARD_API_BASE}/api/52week-high`;

    // Initial fetch
    fetchBreakoutCards(currentBreakoutEndpoint);

    // Toggle to Highs
    highBtn?.addEventListener('click', () => {
      highBtn.classList.add('active');
      lowBtn?.classList.remove('active');
      currentBreakoutEndpoint = `${DASHBOARD_API_BASE}/api/52week-high`;
      breakoutGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px 0;">Loading high breakouts...</div>';
      fetchBreakoutCards(currentBreakoutEndpoint);
    });

    // Toggle to Lows
    lowBtn?.addEventListener('click', () => {
      lowBtn.classList.add('active');
      highBtn?.classList.remove('active');
      currentBreakoutEndpoint = `${DASHBOARD_API_BASE}/api/52week-low`;
      breakoutGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px 0;">Loading low breakouts...</div>';
      fetchBreakoutCards(currentBreakoutEndpoint);
    });

    // Refresh every second, tracking whichever tab (high/low) is active.
    // Guarded so a slow request can't overlap with the next tick.
    let isFetchingBreakouts = false;
    setInterval(async () => {
      if (isFetchingBreakouts) return;
      isFetchingBreakouts = true;
      try {
        await fetchBreakoutCards(currentBreakoutEndpoint);
      } finally {
        isFetchingBreakouts = false;
      }
    }, 1000);
  }
});

async function fetchBreakoutCards(endpoint) {
  const breakoutGrid = document.getElementById('breakout-cards-grid');
  try {
    const response = await fetch(endpoint);
    const stocks = await response.json();
    
    if (!Array.isArray(stocks) || stocks.length === 0) {
      breakoutGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px 0;">No breakout data available right now.</div>';
      return;
    }

    breakoutGrid.innerHTML = '';
    
    // Process up to 15 stocks from the actual market data
    stocks.slice(0, 15).forEach(stock => {
      const changeValue = parseFloat(stock.change_percent) || 0;
      const scoreClass = changeValue >= 0 ? 'up' : 'down';
      const sign = changeValue >= 0 ? '+' : '';

      const card = document.createElement('div');
      card.className = 'bought-item';
      card.style.cursor = 'pointer';

      card.addEventListener('click', () => {
        window.location.href = `stocks.html?symbol=${stock.symbol}`;
      });

      const firstLetter = stock.symbol ? stock.symbol.charAt(0) : 'N';
      const companyName = stock.name && stock.name !== stock.symbol ? stock.name : stock.symbol;
      const series = stock.series || 'EQ';
      const ltp = Number(stock.price || 0);
      const new52 = Number(stock.new52WkPrice || stock.price || 0);

      // Format previous date: show as DD-MMM-YYYY if parseable, else raw
      let prevDateStr = '—';
      if (stock.prevDate) {
        const d = new Date(stock.prevDate);
        if (!isNaN(d)) {
          prevDateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        } else {
          prevDateStr = stock.prevDate;
        }
      }

      const logoHtml = window.PBLogos
        ? window.PBLogos.avatarHtml(stock.symbol, companyName, { wrapClass: "bought-logo" })
        : `<div class="bought-logo" style="color: #1a3fa0;">${firstLetter}</div>`;

      card.innerHTML = `
        ${logoHtml}
        <div class="bought-name">
          <span class="breakout-company-name">${companyName}</span>
          <span class="breakout-company-sym">${stock.symbol}</span>
        </div>
        <div class="bought-series">${series}</div>
        <div class="bought-price">₹${ltp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        <div class="bought-change ${scoreClass}">${sign}${changeValue.toFixed(2)}%</div>
        <div class="bought-new52">₹${new52.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        <div class="bought-prevdate">${prevDateStr}</div>
      `;
      
      breakoutGrid.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading breakout cards:', error);
    breakoutGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 20px 0;">Failed to fetch live breakout cards.</div>';
  }
}

// Continuous real-time cycle tracker for currency derivatives
async function trackLiveCurrencySnapshot() {
  const container = document.getElementById('currency-table-body');
  if (!container) return; // Guard clause if context container is absent

  try {
    const response = await fetch('http://localhost:5000/api/currency-snapshot');
    if (!response.ok) throw new Error('API request breakdown');
    
    const contracts = await response.json();
    
    if (!Array.isArray(contracts) || contracts.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px 0;">
            Waiting for live currency ticks...
          </td>
        </tr>`;
      return;
    }

    container.innerHTML = contracts.map(item => {
      const pct = parseFloat(item.change_percent) || 0;
      const scoreClass = pct >= 0 ? 'up' : 'down';
      const sign = pct >= 0 ? '+' : '';

      return `
        <tr>
            <td class="col-contracts">
                <span class="font-highlight">${item.contract}</span>
            </td>

            <td class="price-heavy">
                ${item.ltp.toFixed(4)}
            </td>

            <td class="${item.change >= 0 ? 'up' : 'down'}">
                ${item.change >= 0 ? '+' : ''}${item.change.toFixed(4)}
            </td>

            <td class="${item.change_percent >= 0 ? 'up' : 'down'}">
                ${item.change_percent.toFixed(2)}%
            </td>

            <td class="font-medium">
                ${item.previousClose.toFixed(4)}
            </td>

            <td class="font-medium">
                ${item.marketState}
            </td>
        </tr>
      `;
    }).join('');

  } catch (error) {
    console.error('Failed to loop active currency stream:', error);
  }
}

// Register inside DOM setup hook
document.addEventListener('DOMContentLoaded', () => {
  trackLiveCurrencySnapshot();
  // Set up execution thread interval sync
  setInterval(trackLiveCurrencySnapshot, 5000);
});

// Fetch and render IPOs from the Agent API
async function fetchUpcomingIPOs() {
  const container = document.getElementById('ipo-table-body');
  if (!container) return; // Exit if not on the dashboard

  try {
    const response = await fetch('http://localhost:5000/api/ipos');
    if (!response.ok) throw new Error('Failed to fetch IPOs');
    
    const ipos = await response.json();
    
    if (!Array.isArray(ipos) || ipos.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 40px 0;">
            No upcoming IPOs found right now.
          </td>
        </tr>`;
      return;
    }

    container.innerHTML = ipos.map(ipo => {
      // Determine color classes
      const gmpClass = ipo.gmp.includes('-') ? 'down' : (ipo.gmp !== '0%' ? 'up' : '');
      const statusClass = ipo.status.toLowerCase() === 'listed' ? 'status-listed' : 'status-upcoming';

      return `
        <tr>
          <td class="col-ipo-company">${ipo.company}</td>
          <td class="col-ipo-status">
            <span class="status-badge ${statusClass}">${ipo.status}</span>
          </td>
          <td class="col-ipo-date">${ipo.expected}</td>
          <td class="col-ipo-gmp ${gmpClass}">${ipo.gmp}</td>
          <td class="col-ipo-insight">${ipo.why_it_matters}</td>
        </tr>
      `;
    }).join('');

  } catch (error) {
    console.error('Error fetching IPO data:', error);
    container.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--red); padding: 20px 0;">
          Failed to connect to IPO AI Agent.
        </td>
      </tr>`;
  }
}

// Hook it into the DOM load alongside your other trackers
document.addEventListener('DOMContentLoaded', () => {
  fetchUpcomingIPOs();
  
  // Optionally refresh IPOs every 5 minutes so users don't have to reload
  setInterval(fetchUpcomingIPOs, 5 * 60 * 1000); 
});

// Fetch and render live market news (sourced via Grok on the backend)
async function fetchMarketNews() {
  const container = document.getElementById('news-list');
  if (!container) return; // Exit if not on the dashboard

  try {
    const response = await fetch('http://localhost:5000/api/news');
    if (!response.ok) throw new Error('Failed to fetch news');

    const newsItems = await response.json();

    if (!Array.isArray(newsItems) || newsItems.length === 0) {
      container.innerHTML = `
        <li class="news-item">
          <div class="news-text">
            <p class="news-headline">No news available right now.</p>
            <p class="news-meta">&nbsp;</p>
          </div>
        </li>`;
      return;
    }

    const thumbClasses = ['thumb-1', 'thumb-2', 'thumb-3', 'thumb-4', 'thumb-5', 'thumb-6'];

    container.innerHTML = newsItems.map((item, i) => {
      const thumbClass = thumbClasses[i % thumbClasses.length];
      const metaParts = [item.source, item.time_ago].filter(Boolean).join(' &middot; ');
      const inner = `
        <div class="news-text">
          <p class="news-headline">${item.headline}</p>
          <p class="news-meta">${metaParts || '&nbsp;'}</p>
        </div>
        <div class="news-thumb ${thumbClass}"></div>
      `;

      return item.url
        ? `<li class="news-item"><a href="${item.url}" target="_blank" rel="noopener noreferrer" style="display:contents; color:inherit; text-decoration:none;">${inner}</a></li>`
        : `<li class="news-item">${inner}</li>`;
    }).join('');

  } catch (error) {
    console.error('Error fetching market news:', error);
    container.innerHTML = `
      <li class="news-item">
        <div class="news-text">
          <p class="news-headline" style="color: var(--red);">Failed to load live news.</p>
          <p class="news-meta">Ensure backend server is active on http://localhost:5000</p>
        </div>
      </li>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchMarketNews();

  // Refresh news every 5 minutes
  setInterval(fetchMarketNews, 5 * 60 * 1000);
});

/* ============================================================
   Sidebar "Your investments" card — was always frozen on the empty
   illustration regardless of whether the user actually held anything.
   This syncs it with the same paperbull_portfolio ledger the Portfolio
   page reads, so the empty state only shows when there truly are no
   holdings, and live holdings show a real summary + top positions
   otherwise.
   ============================================================ */
(function () {
  const MARKET_API_BASE = 'http://localhost:5000';
  const PORTFOLIO_KEY = 'paperbull_portfolio';
  const LIVE_REFRESH_MS = 10000;
  const MAX_ROWS_SHOWN = 4;

  const $ = (id) => document.getElementById(id);

  const fmtINR = (n, decimals = 0) =>
    '₹' + Math.abs(n || 0).toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const initials = (name) => (name ? String(name).trim().charAt(0).toUpperCase() : '?');

  function getLocalHoldings() {
    try {
      const portfolio = JSON.parse(localStorage.getItem(PORTFOLIO_KEY) || '{}');
      return portfolio.holdings && typeof portfolio.holdings === 'object' ? portfolio.holdings : {};
    } catch (err) {
      return {};
    }
  }

  async function fetchLiveQuotes(symbols) {
    if (!symbols.length) return {};
    try {
      const res = await fetch(`${MARKET_API_BASE}/api/stocks`);
      if (!res.ok) throw new Error('Failed to fetch live quotes');
      const list = await res.json();
      const bySymbol = {};
      if (Array.isArray(list)) list.forEach((s) => { if (s && s.symbol) bySymbol[s.symbol] = s; });
      return bySymbol;
    } catch (err) {
      console.error('Sidebar investments: failed to load live prices.', err);
      return {};
    }
  }

  async function renderSidebarInvestments() {
    const emptyState = $('investmentsEmptyState');
    const holdingsState = $('investmentsHoldingsState');
    if (!emptyState || !holdingsState) return; // not on the dashboard page

    const holdings = getLocalHoldings();
    const symbols = Object.keys(holdings);

    if (!symbols.length) {
      emptyState.hidden = false;
      holdingsState.hidden = true;
      return;
    }

    const liveQuotes = await fetchLiveQuotes(symbols);

    let currentValue = 0;
    let investedValue = 0;
    const rows = symbols.map((symbol) => {
      const h = holdings[symbol];
      const live = liveQuotes[symbol];
      const ltp = live ? Number(live.price) : h.avgPrice;
      const invested = h.qty * h.avgPrice;
      const curVal = h.qty * ltp;
      currentValue += curVal;
      investedValue += invested;
      return { symbol, name: h.name || symbol, qty: h.qty, curVal, gain: curVal - invested };
    });

    const overallGain = currentValue - investedValue;
    const overallGainPct = investedValue ? (overallGain / investedValue) * 100 : 0;
    const gainUp = overallGain >= 0;

    emptyState.hidden = true;
    holdingsState.hidden = false;

    const valueEl = $('investmentsCurrentValue');
    if (valueEl) valueEl.textContent = fmtINR(currentValue, 2);

    const gainEl = $('investmentsOverallGain');
    if (gainEl) {
      gainEl.textContent = `${gainUp ? '+' : '-'}${fmtINR(overallGain, 2)} (${gainUp ? '+' : '-'}${Math.abs(overallGainPct).toFixed(2)}%)`;
      gainEl.classList.remove('up', 'down');
      gainEl.classList.add(gainUp ? 'up' : 'down');
    }

    const listEl = $('investmentsHoldingsList');
    if (listEl) {
      const shown = rows.sort((a, b) => b.curVal - a.curVal).slice(0, MAX_ROWS_SHOWN);
      listEl.innerHTML = shown
        .map((r) => {
          const rowGainUp = r.gain >= 0;
          const logoHtml = window.PBLogos
            ? window.PBLogos.avatarHtml(r.symbol, r.name, { wrapClass: 'w-logo' })
            : `<div class="w-logo">${initials(r.name)}</div>`;
          return `
            <div class="inv-holding-item" data-symbol="${r.symbol}">
              <div class="inv-holding-left">
                ${logoHtml}
                <div>
                  <div class="inv-holding-name">${r.symbol}</div>
                  <div class="inv-holding-meta">${r.qty} qty</div>
                </div>
              </div>
              <div class="inv-holding-right">
                <div class="inv-holding-value">${fmtINR(r.curVal, 2)}</div>
                <div class="inv-holding-gain ${rowGainUp ? 'up' : 'down'}">${rowGainUp ? '+' : '-'}${fmtINR(r.gain, 2)}</div>
              </div>
            </div>`;
        })
        .join('');

      if (rows.length > MAX_ROWS_SHOWN) {
        listEl.innerHTML += `<div class="inv-holdings-more">+${rows.length - MAX_ROWS_SHOWN} more</div>`;
      }

      listEl.querySelectorAll('.inv-holding-item').forEach((row) => {
        row.addEventListener('click', () => {
          window.location.href = `stocks.html?symbol=${encodeURIComponent(row.getAttribute('data-symbol'))}`;
        });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const exploreBtn = $('investmentsExploreBtn');
    if (exploreBtn) exploreBtn.addEventListener('click', () => { window.location.href = 'stocks.html'; });

    const portfolioBtn = $('investmentsViewPortfolioBtn');
    if (portfolioBtn) portfolioBtn.addEventListener('click', () => { window.location.href = 'portfolio.html'; });

    renderSidebarInvestments();
    setInterval(renderSidebarInvestments, LIVE_REFRESH_MS);

    // Keeps this in sync if a trade happens in another tab (e.g. buying a
    // stock on the Stocks page) while the dashboard is still open here.
    window.addEventListener('storage', (e) => {
      if (e.key === PORTFOLIO_KEY) renderSidebarInvestments();
    });
  });
})();