/* ============================================================
   PaperBull — Orders page
   Talks to the nse-node market-data backend (http://localhost:5000)
   for live prices/charts/company info, and reads & writes the same
   localStorage "paperbull_portfolio" object that dashboard.js and
   the Stocks detail page already use as this app's paper-trading
   ledger (there's no logged-in-session-aware server API for orders
   yet, so orders are settled client-side against that ledger, exactly
   like the rest of PaperBull's paper trading currently works).
   ============================================================ */

(function () {
  const MARKET_API_BASE = "http://localhost:5000";
  const PORTFOLIO_KEY = "paperbull_portfolio";
  const USER_KEY = "paperbull_user";
  const ORDERS_KEY = "paperbull_orders";
  const DEFAULT_STARTING_CAPITAL = 100000;

  const $ = (id) => document.getElementById(id);

  // ---------------- state ----------------
  let allStocks = [];          // cached /api/stocks list, for the search box
  let currentStock = null;     // full /api/stock/:symbol payload for the selected stock
  let currentSide = "buy";     // 'buy' | 'sell'
  let currentOrderType = "Market";
  let currentProduct = "Delivery";
  let currentRange = "1D";
  let depthLevels = [];        // simulated market depth, regenerated per stock

  // ---------------- helpers ----------------
  const toNum = (v) => {
    if (typeof v === "number") return v;
    if (v == null) return 0;
    const n = parseFloat(String(v).replace(/[^0-9.-]/g, ""));
    return Number.isNaN(n) ? 0 : n;
  };

  const fmtINR = (n, decimals = 2) =>
    "₹" + Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const initials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
  };

  function getPortfolio() {
    let portfolio = {};
    try {
      portfolio = JSON.parse(localStorage.getItem(PORTFOLIO_KEY) || "{}");
    } catch (err) {}
    let user = {};
    try {
      user = JSON.parse(localStorage.getItem(USER_KEY) || "{}");
    } catch (err) {}

    return {
      startingCapital: typeof portfolio.startingCapital === "number" ? portfolio.startingCapital : DEFAULT_STARTING_CAPITAL,
      moneyAvailable: typeof portfolio.moneyAvailable === "number"
        ? portfolio.moneyAvailable
        : (typeof user.balance === "number" ? user.balance : DEFAULT_STARTING_CAPITAL),
      totalInvested: typeof portfolio.totalInvested === "number" ? portfolio.totalInvested : 0,
      stocksBought: typeof portfolio.stocksBought === "number" ? portfolio.stocksBought : 0,
      profitLoss: typeof portfolio.profitLoss === "number" ? portfolio.profitLoss : 0,
      profitLossPct: typeof portfolio.profitLossPct === "number" ? portfolio.profitLossPct : 0,
      dayChange: typeof portfolio.dayChange === "number" ? portfolio.dayChange : 0,
      dayChangePct: typeof portfolio.dayChangePct === "number" ? portfolio.dayChangePct : 0,
      holdings: portfolio.holdings && typeof portfolio.holdings === "object" ? portfolio.holdings : {},
    };
  }

  function savePortfolio(portfolio) {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));

    // Keep the lightweight session-user balance in sync too, since some
    // pages fall back to it before a paperbull_portfolio record exists.
    try {
      const user = JSON.parse(localStorage.getItem(USER_KEY) || "{}");
      user.balance = portfolio.moneyAvailable;
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (err) {}
  }

  function logOrder(order) {
    let orders = [];
    try {
      orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    } catch (err) {}
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.slice(0, 200)));
  }

  // ---------------- stock list / search ----------------
  async function loadStockList() {
    try {
      const res = await fetch(`${MARKET_API_BASE}/api/stocks`);
      const data = await res.json();
      if (Array.isArray(data)) allStocks = data;
    } catch (err) {
      console.error("Failed to load stock list. Ensure the nse-node backend is running on", MARKET_API_BASE, err);
    }
  }

  function renderSearchResults(query) {
    const box = $("orderSearchResults");
    const q = query.trim().toLowerCase();

    if (!q) {
      box.classList.remove("open");
      box.innerHTML = "";
      return;
    }

    const matches = allStocks
      .filter((s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
      .slice(0, 8);

    if (!matches.length) {
      box.innerHTML = `<div class="order-search-empty">No matching stocks</div>`;
      box.classList.add("open");
      return;
    }

    box.innerHTML = matches
      .map(
        (s) => `
        <div class="order-search-result" data-symbol="${s.symbol}">
          <div>
            <div class="order-search-result-name">${s.name}</div>
            <div class="order-search-result-sym">${s.symbol} &middot; NSE</div>
          </div>
          <div class="order-search-result-price">₹${Number(s.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>`
      )
      .join("");

    box.classList.add("open");

    box.querySelectorAll(".order-search-result").forEach((el) => {
      el.addEventListener("click", () => {
        selectStock(el.getAttribute("data-symbol"));
        $("orderStockSearch").value = "";
        box.classList.remove("open");
      });
    });
  }

  // ---------------- selecting a stock ----------------
  async function selectStock(symbol) {
    try {
      const res = await fetch(`${MARKET_API_BASE}/api/stock/${encodeURIComponent(symbol)}`);
      if (!res.ok) throw new Error("Stock not found");
      const stock = await res.json();
      currentStock = stock;
      applySelectedStock();
      generateDepth();
      renderDepth();
      renderAIInsight();
      renderAboutCard();
      loadChart();
      updateAvailability();
      recomputeEstimate();

      const url = new URL(window.location.href);
      url.searchParams.set("symbol", stock.symbol);
      window.history.replaceState({}, "", url);
    } catch (err) {
      console.error("Failed to load stock detail:", err);
      showError("Couldn't load that stock. Is the backend running on " + MARKET_API_BASE + "?");
    }
  }

  function applySelectedStock() {
    if (!currentStock) return;
    const s = currentStock;
    const logoText = initials(s.name).charAt(0) || s.symbol.charAt(0);

    ["orderSelectedLogo", "chartStockLogo", "modalStockLogo"].forEach((id) => ($(id).textContent = logoText));
    $("orderSelectedName").textContent = s.name;
    $("orderSelectedSub").textContent = `${s.symbol} · ${s.exchange || "NSE"}`;
    $("orderSelectedPrice").textContent = "₹" + s.price;
    setChangeEl($("orderSelectedChange"), s.change, s.pct, s.up);

    $("chartStockName").textContent = s.name;
    $("chartStockSub").textContent = `${s.symbol} · ${s.exchange || "NSE"}`;
    $("chartPrice").textContent = "₹" + s.price;
    setChangeEl($("chartChange"), s.change, s.pct, s.up);
    $("chartDayHigh").textContent = s.todaysHigh != null ? "₹" + s.todaysHigh : "—";
    $("chartDayLow").textContent = s.todaysLow != null ? "₹" + s.todaysLow : "—";

    $("aboutStockName").textContent = s.name;
    $("viewDetailsLink").href = `stocks.html?symbol=${encodeURIComponent(s.symbol)}`;
    $("aboutViewDetails").href = `stocks.html?symbol=${encodeURIComponent(s.symbol)}`;
  }

  function setChangeEl(el, change, pct, up) {
    el.textContent = `${change} ${pct}`;
    el.classList.remove("up", "down");
    el.classList.add(up ? "up" : "down");
  }

  function showError(msg) {
    const el = $("orderError");
    el.textContent = msg;
    el.hidden = false;
  }

  function clearError() {
    const el = $("orderError");
    el.hidden = true;
    el.textContent = "";
  }

  // ---------------- market depth (simulated liquidity) ----------------
  // NSE Level-2 order-book data isn't available through this app's free
  // Yahoo-Finance-backed feed, so depth is generated deterministically
  // around the live price — same spirit as a paper-trading simulator.
  function seededRandom(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  function generateDepth() {
    if (!currentStock) return;
    const price = toNum(currentStock.price);
    const seed = currentStock.symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + Math.floor(price);
    const rand = seededRandom(seed);
    const tick = Math.max(0.05, Math.round(price * 0.0006 * 100) / 100);

    depthLevels = [];
    for (let i = 0; i < 5; i++) {
      const bidPrice = Math.round((price - tick * (i + 1)) * 100) / 100;
      const askPrice = Math.round((price + tick * (i + 1)) * 100) / 100;
      const bidQty = Math.round(50 + rand() * 500);
      const askQty = Math.round(50 + rand() * 500);
      depthLevels.push({ bidQty, bidPrice, askPrice, askQty });
    }
  }

  function renderDepth() {
    const rows = $("orderDepthRows");
    rows.innerHTML = depthLevels
      .map(
        (l) => `
        <div class="order-depth-row">
          <span class="order-depth-bid">${l.bidQty}</span>
          <span class="order-depth-price">${l.bidPrice.toFixed(2)} / ${l.askPrice.toFixed(2)}</span>
          <span class="order-depth-ask">${l.askQty}</span>
        </div>`
      )
      .join("");
  }

  function totalAskLiquidity() {
    return depthLevels.reduce((sum, l) => sum + l.askQty, 0);
  }

  // ---------------- AI trade insight (heuristic on live data) ----------------
  // Not a model call — a transparent momentum heuristic computed from the
  // stock's real change% and where price sits in its 52-week range.
  function computeInsight(stock) {
    const changePct = toNum(stock.pct) * (stock.up ? 1 : -1);
    const low = toNum(stock.weekLow);
    const high = toNum(stock.weekHigh);
    const price = toNum(stock.price);

    let posPct = 50;
    if (high > low) posPct = ((price - low) / (high - low)) * 100;

    const momentum = changePct * 3 + (posPct - 50) * 0.4;

    let badge = "Neutral", cls = "neutral";
    if (momentum > 2.5) { badge = "Bullish"; cls = "bullish"; }
    else if (momentum < -2.5) { badge = "Bearish"; cls = "bearish"; }

    let label = badge;
    if (momentum > 8) label = "Strong Bullish";
    else if (momentum < -8) label = "Strong Bearish";

    const confidence = Math.round(Math.min(96, Math.max(52, 58 + Math.abs(momentum) * 2.2)));

    return { badge, cls, label, confidence };
  }

  function renderAIInsight() {
    if (!currentStock) return;
    const insight = computeInsight(currentStock);

    const badgeEl = $("aiPredictionBadge");
    badgeEl.textContent = insight.badge;
    badgeEl.classList.remove("bearish", "neutral");
    if (insight.cls !== "bullish") badgeEl.classList.add(insight.cls);

    $("aiPredictionVal").textContent = insight.label;
    $("aiPredictionVal").className = "order-ai-strong " + (insight.cls === "bullish" ? "up" : insight.cls === "bearish" ? "down" : "");
    $("aiConfidenceVal").textContent = insight.confidence + "%";
    $("aiFullAnalysis").href = `stocks.html?symbol=${encodeURIComponent(currentStock.symbol)}`;
  }

  function renderAboutCard() {
    if (!currentStock) return;
    $("aboutStockText").textContent = currentStock.about || `${currentStock.name} is listed on the NSE under the symbol ${currentStock.symbol}.`;
  }

  // ---------------- availability line under Quantity ----------------
  function updateAvailability() {
    if (!currentStock) return;
    const el = $("orderAvailableShares");
    if (currentSide === "buy") {
      el.textContent = `${totalAskLiquidity()} Shares`;
    } else {
      const portfolio = getPortfolio();
      const held = portfolio.holdings[currentStock.symbol];
      el.textContent = `${held ? held.qty : 0} Shares`;
    }
  }

  // ---------------- chart ----------------
  let chartPoints = [];

  async function loadChart() {
    if (!currentStock) return;
    const loading = $("orderChartLoading");
    loading.hidden = false;
    try {
      const res = await fetch(`${MARKET_API_BASE}/api/series/${encodeURIComponent(currentStock.symbol)}?range=${currentRange}`);
      const data = await res.json();
      chartPoints = Array.isArray(data.points) ? data.points : [];
      drawChart();
    } catch (err) {
      console.error("Failed to load chart series:", err);
      chartPoints = [];
      drawChart();
    } finally {
      loading.hidden = true;
    }
  }

  function drawChart() {
    const canvas = $("orderChartCanvas");
    const wrap = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const width = wrap.clientWidth;
    const height = wrap.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    if (!chartPoints.length) return;

    const closes = chartPoints.map((p) => p.close);
    const min = Math.min(...closes);
    const max = Math.max(...closes);
    const range = max - min || 1;
    const padTop = 16;
    const padBottom = 16;
    const plotH = height - padTop - padBottom;

    const up = closes[closes.length - 1] >= closes[0];
    const lineColor = up ? getCSS("--green") : getCSS("--red");

    const stepX = width / Math.max(1, chartPoints.length - 1);
    const xy = closes.map((c, i) => [i * stepX, padTop + (1 - (c - min) / range) * plotH]);

    // gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, hexToRgba(lineColor, 0.28));
    gradient.addColorStop(1, hexToRgba(lineColor, 0));

    ctx.beginPath();
    ctx.moveTo(xy[0][0], height);
    xy.forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.lineTo(xy[xy.length - 1][0], height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // line
    ctx.beginPath();
    xy.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.stroke();

    // last point marker
    const [lx, ly] = xy[xy.length - 1];
    ctx.beginPath();
    ctx.arc(lx, ly, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = lineColor;
    ctx.fill();
  }

  function getCSS(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || "#62B1BF";
  }

  function hexToRgba(hex, alpha) {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map((ch) => ch + ch).join("");
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  window.addEventListener("resize", () => {
    if (chartPoints.length) drawChart();
  });

  // ---------------- order form logic ----------------
  function recomputeEstimate() {
    const qty = Math.max(0, parseInt($("orderQty").value, 10) || 0);
    let price = currentStock ? toNum(currentStock.price) : 0;

    if (currentOrderType === "Limit" || currentOrderType === "SL Limit") {
      const limitVal = parseFloat($("orderLimitPrice").value);
      if (!Number.isNaN(limitVal) && limitVal > 0) price = limitVal;
    }

    const amount = qty * price;
    $("orderEstimateAmount").textContent = fmtINR(amount);
    return { qty, price, amount };
  }

  function setSide(side) {
    currentSide = side;
    $("sideTabBuy").classList.toggle("active", side === "buy");
    $("sideTabSell").classList.toggle("active", side === "sell");
    updateAvailability();
    clearError();
  }

  function setOrderType(type) {
    currentOrderType = type;
    document.querySelectorAll(".order-type-tab").forEach((t) => t.classList.toggle("active", t.getAttribute("data-type") === type));

    const needsLimit = type === "Limit" || type === "SL Limit";
    const needsTrigger = type === "SL Limit" || type === "SL Market";

    $("orderLimitPriceField").hidden = !needsLimit;
    $("orderTriggerPriceField").hidden = !needsTrigger;
    recomputeEstimate();
  }

  function setProduct(product) {
    currentProduct = product;
    document.querySelectorAll(".order-product-tab").forEach((t) => t.classList.toggle("active", t.getAttribute("data-product") === product));
  }

  // ---------------- review modal ----------------
  function openReviewModal() {
    clearError();

    if (!currentStock) {
      showError("Search and select a stock first.");
      return;
    }

    const qty = Math.max(0, parseInt($("orderQty").value, 10) || 0);
    if (qty <= 0) {
      showError("Enter a valid quantity.");
      return;
    }

    if ((currentOrderType === "Limit" || currentOrderType === "SL Limit")) {
      const limitVal = parseFloat($("orderLimitPrice").value);
      if (Number.isNaN(limitVal) || limitVal <= 0) {
        showError("Enter a valid limit price.");
        return;
      }
    }

    if ((currentOrderType === "SL Limit" || currentOrderType === "SL Market")) {
      const triggerVal = parseFloat($("orderTriggerPrice").value);
      if (Number.isNaN(triggerVal) || triggerVal <= 0) {
        showError("Enter a valid trigger price.");
        return;
      }
    }

    if (currentSide === "sell") {
      const portfolio = getPortfolio();
      const held = portfolio.holdings[currentStock.symbol];
      const heldQty = held ? held.qty : 0;
      if (qty > heldQty) {
        showError(`You only hold ${heldQty} share${heldQty === 1 ? "" : "s"} of ${currentStock.symbol}.`);
        return;
      }
    }

    const { price, amount } = recomputeEstimate();
    const s = currentStock;

    $("modalStockLogo").textContent = initials(s.name).charAt(0) || s.symbol.charAt(0);
    $("modalStockName").textContent = s.name;
    $("modalStockSub").textContent = `${s.symbol} · ${s.exchange || "NSE"}`;
    $("modalStockPrice").textContent = "₹" + s.price;
    setChangeEl($("modalStockChange"), s.change, s.pct, s.up);

    const txEl = $("modalTransaction");
    txEl.textContent = currentSide === "buy" ? "Buy" : "Sell";
    txEl.className = "order-modal-transaction " + currentSide;

    $("modalOrderType").textContent = currentOrderType + " Order";
    $("modalQuantity").textContent = `${qty} Shares`;
    $("modalProductType").textContent = currentProduct;

    const priceRowLabel = $("modalOrderPriceRow").querySelector("span");
    if (currentOrderType === "Market") {
      priceRowLabel.textContent = "Order Price";
      $("modalOrderPrice").textContent = "Market Price";
    } else {
      priceRowLabel.textContent = "Order Price";
      $("modalOrderPrice").textContent = fmtINR(price);
    }

    if (currentOrderType === "SL Limit" || currentOrderType === "SL Market") {
      $("modalTriggerPriceRow").hidden = false;
      $("modalTriggerPrice").textContent = fmtINR(parseFloat($("orderTriggerPrice").value) || 0);
    } else {
      $("modalTriggerPriceRow").hidden = true;
    }

    $("modalEstimatedPrice").textContent = fmtINR(price);
    $("modalEstimatedAmount").textContent = fmtINR(amount);

    $("orderModalNoteText").textContent =
      currentOrderType === "Market"
        ? "Market orders are executed at the best available price in the market."
        : currentOrderType === "Limit"
        ? "Limit orders execute only at your specified price or better, and may not fill immediately."
        : "Stop-loss orders trigger a Market/Limit order once the trigger price is reached.";

    const placeBtn = $("orderModalPlace");
    placeBtn.textContent = currentSide === "buy" ? "Place Order" : "Place Sell Order";
    placeBtn.classList.toggle("sell", currentSide === "sell");

    $("orderModalOverlay").classList.add("open");
  }

  function closeReviewModal() {
    $("orderModalOverlay").classList.remove("open");
  }

  function placeOrder() {
    const { qty, price, amount } = recomputeEstimate();
    const s = currentStock;
    const portfolio = getPortfolio();

    if (currentSide === "buy") {
      if (amount > portfolio.moneyAvailable) {
        showError("Insufficient funds for this order.");
        closeReviewModal();
        return;
      }

      const held = portfolio.holdings[s.symbol] || { qty: 0, avgPrice: 0 };
      const newQty = held.qty + qty;
      const newAvg = ((held.avgPrice * held.qty) + (price * qty)) / newQty;

      portfolio.holdings[s.symbol] = { qty: newQty, avgPrice: Math.round(newAvg * 100) / 100, name: s.name };
      portfolio.moneyAvailable -= amount;
      portfolio.totalInvested += amount;
      portfolio.stocksBought += qty;
    } else {
      const held = portfolio.holdings[s.symbol] || { qty: 0, avgPrice: 0 };
      const realized = (price - held.avgPrice) * qty;

      portfolio.moneyAvailable += amount;
      portfolio.totalInvested = Math.max(0, portfolio.totalInvested - held.avgPrice * qty);
      portfolio.profitLoss += realized;
      portfolio.profitLossPct = portfolio.startingCapital
        ? (portfolio.profitLoss / portfolio.startingCapital) * 100
        : 0;

      const remainingQty = held.qty - qty;
      if (remainingQty <= 0) {
        delete portfolio.holdings[s.symbol];
      } else {
        portfolio.holdings[s.symbol] = { qty: remainingQty, avgPrice: held.avgPrice, name: s.name };
      }
    }

    savePortfolio(portfolio);

    logOrder({
      symbol: s.symbol,
      name: s.name,
      side: currentSide,
      orderType: currentOrderType,
      product: currentProduct,
      qty,
      price,
      amount,
      timestamp: new Date().toISOString(),
    });

    closeReviewModal();
    showToast(`${currentSide === "buy" ? "Buy" : "Sell"} order placed for ${qty} share${qty === 1 ? "" : "s"} of ${s.symbol}`);
    updateAvailability();
    renderProfileStats();
  }

  function showToast(text) {
    const toast = $("orderToast");
    $("orderToastText").textContent = text;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  // Mirrors dashboard.js's renderProfileDropdown() so the header stats
  // refresh immediately after an order, without waiting for a page reload.
  function renderProfileStats() {
    const summary = getPortfolio();
    const stocksEl = $("statStocksBought");
    const moneyEl = $("statMoneyAvailable");
    const plEl = $("statProfitLoss");

    if (stocksEl) stocksEl.textContent = summary.stocksBought.toLocaleString("en-IN");
    if (moneyEl) moneyEl.textContent = fmtINR(summary.moneyAvailable, 0).replace("₹", "₹");
    if (plEl) {
      const sign = summary.profitLoss > 0 ? "+" : summary.profitLoss < 0 ? "-" : "";
      plEl.textContent = `${sign}${fmtINR(summary.profitLoss)} (${sign}${Math.abs(summary.profitLossPct).toFixed(2)}%)`;
      plEl.classList.remove("up", "down");
      if (summary.profitLoss > 0) plEl.classList.add("up");
      else if (summary.profitLoss < 0) plEl.classList.add("down");
    }
  }

  // ---------------- wire up ----------------
  function init() {
    loadStockList();

    $("sideTabBuy").addEventListener("click", () => setSide("buy"));
    $("sideTabSell").addEventListener("click", () => setSide("sell"));

    document.querySelectorAll(".order-type-tab").forEach((tab) =>
      tab.addEventListener("click", () => setOrderType(tab.getAttribute("data-type")))
    );
    document.querySelectorAll(".order-product-tab").forEach((tab) =>
      tab.addEventListener("click", () => setProduct(tab.getAttribute("data-product")))
    );

    $("orderQty").addEventListener("input", recomputeEstimate);
    $("orderLimitPrice").addEventListener("input", recomputeEstimate);

    $("orderStockSearch").addEventListener("input", (e) => renderSearchResults(e.target.value));
    $("orderStockSearch").addEventListener("focus", (e) => renderSearchResults(e.target.value));
    document.addEventListener("click", (e) => {
      const box = $("orderSearchResults");
      if (!box.contains(e.target) && e.target !== $("orderStockSearch")) {
        box.classList.remove("open");
      }
    });

    $("orderSelectedRemove").addEventListener("click", () => {
      currentStock = null;
      $("orderSelectedStock").style.opacity = "0.4";
      $("orderSelectedName").textContent = "No stock selected";
      $("orderSelectedSub").textContent = "Search above to select a stock";
    });

    document.querySelectorAll(".order-range-tab").forEach((tab) =>
      tab.addEventListener("click", () => {
        document.querySelectorAll(".order-range-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        currentRange = tab.getAttribute("data-range");
        loadChart();
      })
    );

    $("orderReviewBtn").addEventListener("click", openReviewModal);
    $("orderModalClose").addEventListener("click", closeReviewModal);
    $("orderModalCancel").addEventListener("click", closeReviewModal);
    $("orderModalPlace").addEventListener("click", placeOrder);
    $("orderModalOverlay").addEventListener("click", (e) => {
      if (e.target === $("orderModalOverlay")) closeReviewModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeReviewModal();
    });

    renderProfileStats();

    // Pick up ?symbol= / ?side= from a "Buy" link on the stock detail page,
    // otherwise default to Reliance Industries like the mockup.
    const params = new URLSearchParams(window.location.search);
    const initialSymbol = params.get("symbol") || "RELIANCE";
    const initialSide = params.get("side");
    if (initialSide === "sell") setSide("sell");

    selectStock(initialSymbol);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
