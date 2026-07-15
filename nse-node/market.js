const express = require("express");
const router  = express.Router();
const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

const STOCK_UNIVERSE = [
  { symbol: "RELIANCE",   name: "Reliance Industries",        sector: "Energy",                cap: "Large" },
  { symbol: "TCS",        name: "Tata Consultancy Services",  sector: "IT - Services",          cap: "Large" },
  { symbol: "HDFCBANK",   name: "HDFC Bank",                  sector: "Banking",                cap: "Large" },
  { symbol: "ICICIBANK",  name: "ICICI Bank",                 sector: "Banking",                cap: "Large" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel",               sector: "Telecom",                cap: "Large" },
  { symbol: "INFY",       name: "Infosys",                    sector: "IT - Services",          cap: "Large" },
  { symbol: "LT",         name: "Larsen & Toubro",             sector: "Infrastructure",         cap: "Large" },
  { symbol: "SBIN",       name: "State Bank of India",         sector: "Banking",                cap: "Large" },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever",          sector: "Consumer Durables",      cap: "Large" },
  { symbol: "ITC",        name: "ITC",                        sector: "FMCG",                   cap: "Large" },
  { symbol: "HCLTECH",    name: "HCL Technologies",            sector: "IT - Services",          cap: "Large" },
  { symbol: "WIPRO",      name: "Wipro",                      sector: "IT - Services",          cap: "Large" },
  { symbol: "MARUTI",     name: "Maruti Suzuki",               sector: "Automobile & Ancillaries",cap: "Large" },
  { symbol: "TATAMOTORS", name: "Tata Motors",                 sector: "Automobile & Ancillaries",cap: "Large" },
  { symbol: "TATASTEEL",  name: "Tata Steel",                  sector: "Metals & Mining",        cap: "Large" },
  { symbol: "JSWSTEEL",   name: "JSW Steel",                   sector: "Metals & Mining",        cap: "Large" },
  { symbol: "SUNPHARMA",  name: "Sun Pharmaceutical",           sector: "Healthcare",             cap: "Large" },
  { symbol: "DRREDDY",    name: "Dr. Reddy's Laboratories",     sector: "Healthcare",             cap: "Large" },
  { symbol: "CIPLA",      name: "Cipla",                      sector: "Healthcare",             cap: "Large" },
  { symbol: "ASIANPAINT", name: "Asian Paints",                sector: "Consumer Durables",      cap: "Large" },
  { symbol: "NESTLEIND",  name: "Nestle India",                sector: "FMCG",                   cap: "Large" },
  { symbol: "TITAN",      name: "Titan Company",               sector: "Consumer Durables",      cap: "Large" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance",               sector: "Financial",              cap: "Large" },
  { symbol: "BAJAJFINSV", name: "Bajaj Finserv",               sector: "Financial",              cap: "Large" },
  { symbol: "KOTAKBANK",  name: "Kotak Mahindra Bank",          sector: "Banking",                cap: "Large" },
  { symbol: "AXISBANK",   name: "Axis Bank",                   sector: "Banking",                cap: "Large" },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement",             sector: "Construction Materials", cap: "Large" },
  { symbol: "POWERGRID",  name: "Power Grid Corporation",       sector: "Energy",                 cap: "Large" },
  { symbol: "NTPC",       name: "NTPC",                       sector: "Energy",                 cap: "Large" },
  { symbol: "ONGC",       name: "Oil & Natural Gas Corp",       sector: "Energy",                 cap: "Large" },
  { symbol: "COALINDIA",  name: "Coal India",                  sector: "Energy",                 cap: "Large" },
  { symbol: "ADANIENT",   name: "Adani Enterprises",            sector: "Diversified",            cap: "Large" },
  { symbol: "ADANIPORTS", name: "Adani Ports & SEZ",            sector: "Infrastructure",         cap: "Large" },
  { symbol: "M&M",        name: "Mahindra & Mahindra",          sector: "Automobile & Ancillaries",cap: "Large" },
  { symbol: "HEROMOTOCO", name: "Hero MotoCorp",                sector: "Automobile & Ancillaries",cap: "Mid" },
  { symbol: "EICHERMOT",  name: "Eicher Motors",                sector: "Automobile & Ancillaries",cap: "Mid" },
  { symbol: "DIVISLAB",   name: "Divi's Laboratories",          sector: "Healthcare",             cap: "Mid" },
  { symbol: "BRITANNIA",  name: "Britannia Industries",         sector: "FMCG",                   cap: "Mid" },
  { symbol: "HDFCLIFE",   name: "HDFC Life Insurance",          sector: "Financial",              cap: "Mid" },
  { symbol: "SBILIFE",    name: "SBI Life Insurance",           sector: "Financial",              cap: "Mid" },
  { symbol: "TECHM",      name: "Tech Mahindra",                sector: "IT - Services",          cap: "Mid" },
  { symbol: "INDUSINDBK", name: "IndusInd Bank",                sector: "Banking",                cap: "Mid" },
  { symbol: "BPCL",       name: "Bharat Petroleum",             sector: "Energy",                 cap: "Mid" },
  { symbol: "TATACONSUM", name: "Tata Consumer Products",       sector: "FMCG",                   cap: "Mid" },
  { symbol: "APOLLOHOSP", name: "Apollo Hospitals",             sector: "Healthcare",             cap: "Mid" },
  { symbol: "UPL",        name: "UPL",                         sector: "Agriculture",            cap: "Mid" },
  { symbol: "SHREECEM",   name: "Shree Cement",                 sector: "Construction Materials", cap: "Mid" },
  { symbol: "VEDL",       name: "Vedanta",                     sector: "Metals & Mining",        cap: "Mid" },
];

const yfSymbol = (symbol) => (symbol.includes(".") ? symbol : `${symbol}.NS`);

const fmtNumber = (n) =>
  n == null || Number.isNaN(n) ? null : Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });

// const TICKERS = {
//   "^NSEI":                "NIFTY 50",
//   "^NSEBANK":             "NIFTY BANK",
//   "NIFTY_FIN_SERVICE.NS": "NIFTY FIN SERVICE",
//   "^CNXIT":               "NIFTY IT",
//   "^CRSMID":              "NIFTY MIDCAP 100",
//   "^CNXSC":               "NIFTY SMLCAP 100",
//   "^CNX100":              "NIFTY 100",
// };

const INDICES = {
  "^NSEI":                { display: "NIFTY",      symbol: "^NSEI" },
  "^BSESN":               { display: "SENSEX",     symbol: "^BSESN" },
  "^NSEBANK":             { display: "BANKNIFTY",  symbol: "^NSEBANK" },
  "^CRSMID":              { display: "MIDCNIFTY",  symbol: "^CRSMID" },
  "NIFTY_FIN_SERVICE.NS": { display: "FINNIFTY",   symbol: "NIFTY_FIN_SERVICE.NS" },
  "^CNXIT":               { display: "NIFTY IT",   symbol: "^CNXIT" },
  "^CNXAUTO":             { display: "NIFTY AUTO", symbol: "^CNXAUTO" },
  "^CNXPHARMA":           { display: "NIFTY PHRM", symbol: "^CNXPHARMA" },
  "^CNXMETAL":            { display: "NIFTY METL", symbol: "^CNXMETAL" },
  "^CNXFMCG":             { display: "NIFTY FMCG", symbol: "^CNXFMCG" }
};

const YF_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

async function fetchHistory(symbol, rangeDays = 5) {
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
    `?range=${rangeDays}d&interval=1d&includePrePost=false`;

  const resp = await fetch(url, { headers: YF_HEADERS });
  if (!resp.ok) throw new Error(`Yahoo Finance returned ${resp.status} for ${symbol}`);

  const json = await resp.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(`No data for ${symbol}`);

  return { meta: result.meta };
}

// Small set of recent intraday closes, used to draw the little live sparkline
// next to each row on the Stocks list (replaces the old fake/deterministic
// squiggle that had nothing to do with the stock's actual price).
async function fetchSparkline(symbol) {
  try {
    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
      `?range=1d&interval=15m&includePrePost=false`;
    const resp = await fetch(url, { headers: YF_HEADERS });
    if (!resp.ok) return [];
    const json = await resp.json();
    const result = json?.chart?.result?.[0];
    const closes = result?.indicators?.quote?.[0]?.close || [];
    return closes.filter((c) => c != null).map((c) => Math.round(c * 100) / 100);
  } catch (err) {
    return [];
  }
}

async function fetchIntraday(symbol) {
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
    `?range=5d&interval=5m&includePrePost=false`;

  const resp = await fetch(url, { headers: YF_HEADERS });
  if (!resp.ok) throw new Error(`Yahoo Finance returned ${resp.status} for ${symbol}`);

  const json = await resp.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(`No data for ${symbol}`);

  const timestamps = result.timestamp || [];
  const q = result.indicators.quote[0];
  const tz = result.meta?.exchangeTimezoneName || "Asia/Kolkata";

  return { timestamps, q, tz, meta: result.meta };
}

// Range presets used by the order ticket chart on the Orders page.
// Maps the UI's short range labels to Yahoo Finance's `range`/`interval`
// query params.
const RANGE_PRESETS = {
  "1D": { range: "1d", interval: "5m" },
  "1W": { range: "5d", interval: "30m" },
  "1M": { range: "1mo", interval: "1d" },
  "3M": { range: "3mo", interval: "1d" },
  "6M": { range: "6mo", interval: "1d" },
  "1Y": { range: "1y", interval: "1wk" },
  "3Y": { range: "3y", interval: "1wk" },
  "5Y": { range: "5y", interval: "1mo" },
  "MAX": { range: "max", interval: "1mo" },
};

async function fetchSeries(symbol, presetKey) {
  const preset = RANGE_PRESETS[presetKey] || RANGE_PRESETS["1D"];
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
    `?range=${preset.range}&interval=${preset.interval}&includePrePost=false`;

  const resp = await fetch(url, { headers: YF_HEADERS });
  if (!resp.ok) throw new Error(`Yahoo Finance returned ${resp.status} for ${symbol}`);

  const json = await resp.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(`No data for ${symbol}`);

  const timestamps = result.timestamp || [];
  const q = result.indicators.quote[0] || {};
  const closes = q.close || [];
  const tz = result.meta?.exchangeTimezoneName || "Asia/Kolkata";

  const isIntraday = presetKey === "1D" || presetKey === "1W";
  const fmt = new Intl.DateTimeFormat("en-IN", isIntraday
    ? { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false, ...(presetKey === "1W" ? { day: "2-digit", month: "short" } : {}) }
    : { timeZone: tz, day: "2-digit", month: "short", year: ["1Y", "3Y", "5Y", "MAX"].includes(presetKey) ? "2-digit" : undefined });

  let points = timestamps
    .map((ts, i) => ({ t: ts, close: closes[i], label: fmt.format(new Date(ts * 1000)) }))
    .filter((p) => p.close != null);

  // For 1D, restrict to the most recent trading day only (matches /chart/:symbol behaviour).
  if (presetKey === "1D" && points.length) {
    const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: tz });
    const lastDay = dayFmt.format(new Date(points[points.length - 1].t * 1000));
    points = points.filter((p) => dayFmt.format(new Date(p.t * 1000)) === lastDay);
  }

  const currentPrice = result.meta?.regularMarketPrice ?? points[points.length - 1]?.close ?? 0;
  const prevClose = result.meta?.chartPreviousClose ?? result.meta?.previousClose ?? points[0]?.close ?? currentPrice;
  const changePct = prevClose ? ((currentPrice - prevClose) / prevClose) * 100 : 0;

  return {
    points: points.map((p) => ({ label: p.label, close: Math.round(p.close * 100) / 100 })),
    price: Math.round(currentPrice * 100) / 100,
    change: Math.round(changePct * 100) / 100,
    is_up: changePct >= 0,
  };
}

// GET /api/series/:symbol?range=1D|1W|1M|3M|1Y|5Y — powers the price chart
// on the Orders page, with a selectable time range.
router.get("/series/:symbol", async (req, res) => {
  const rawSymbol = req.params.symbol.toUpperCase();
  const symbol = yfSymbol(rawSymbol);
  const presetKey = (req.query.range || "1D").toUpperCase();

  try {
    const series = await fetchSeries(symbol, presetKey);
    res.json(series);
  } catch (err) {
    console.error(`Error fetching /api/series/${rawSymbol}:`, err.message);
    res.status(500).json({ error: err.message, points: [], price: 0, change: 0, is_up: true });
  }
});

router.get("/live-indices", async (_req, res) => {
  const results = [];

  for (const [symbol, name] of Object.entries(TICKERS)) {
    try {
      const { meta } = await fetchHistory(symbol, 1);

      const current = meta.regularMarketPrice;
      const prev    = meta.chartPreviousClose || meta.previousClose;

      if (!current || !prev) continue;

      const changePct = ((current - prev) / prev) * 100;
      const sign      = changePct >= 0 ? "+" : "";

      results.push({
        sym:   name,
        price: Math.round(current * 100) / 100,
        chg:   `${sign}${changePct.toFixed(2)}%`,
        is_up: changePct >= 0,
      });
    } catch (err) {
      console.error(`Error processing ${symbol}:`, err.message);
    }
  }

  res.json(results);
});

router.get("/chart/:symbol", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const { timestamps, q, tz, meta } = await fetchIntraday(symbol);

    if (!timestamps.length) {
      return res.json({ candles: [], price: 0, change: 0, is_up: true });
    }

    const fmt = new Intl.DateTimeFormat("en-IN", {
      timeZone: tz,
      hour:   "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const allCandles = timestamps.map((ts, i) => ({
      dateStr: new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date(ts * 1000)),
      time:    fmt.format(new Date(ts * 1000)),
      open:    q.open[i],
      high:    q.high[i],
      low:     q.low[i],
      close:   q.close[i],
    })).filter(c => c.close != null);

    const lastDate = allCandles[allCandles.length - 1]?.dateStr;
    const latestDayCandles = allCandles.filter(c => c.dateStr === lastDate);

    const candles = latestDayCandles.map(
      ({ time, open, high, low, close }) => ({ time, open, high, low, close })
    );

    const currentPrice = meta?.regularMarketPrice ?? candles[candles.length - 1].close;
    const prevClose = meta?.chartPreviousClose ?? meta?.previousClose ?? candles[0]?.open ?? currentPrice;

    const changePct = ((currentPrice - prevClose) / prevClose) * 100;

    return res.json({
      candles,
      price:  Math.round(currentPrice * 100) / 100,
      change: Math.round(changePct * 100) / 100,
      is_up:  changePct >= 0,
    });
  } catch (err) {
    console.error(`Error fetching chart for ${symbol}:`, err.message);
    return res.status(500).json({ error: err.message, candles: [], price: 0, change: 0, is_up: true });
  }
});

router.get("/header-indices", async (_req, res) => {
  const results = [];

  for (const [symbol, indexInfo] of Object.entries(INDICES)) {
    try {
      const { meta } = await fetchHistory(symbol, 1);

      const current = meta.regularMarketPrice;
      const prev    = meta.chartPreviousClose || meta.previousClose;

      if (!current || !prev) continue;

      const changePct = ((current - prev) / prev) * 100;
      const change = current - prev;
      const sign = changePct >= 0 ? "+" : "";

      results.push({
        name: indexInfo.display,
        value: current.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        change: `${sign}${Math.abs(change).toFixed(2)}`,
        pct: `${sign}${changePct.toFixed(2)}%`,
        is_up: changePct >= 0,
      });
    } catch (err) {
      console.error(`Error processing index ${symbol}:`, err.message);
    }
  }

  res.json(results);
});

router.get("/stocks", async (_req, res) => {
  try {
    const symbols = STOCK_UNIVERSE.map((s) => yfSymbol(s.symbol));
    const quotes = await yahooFinance.quote(symbols);
    const quoteList = Array.isArray(quotes) ? quotes : [quotes];

    const bySymbol = {};
    quoteList.forEach((q) => {
      if (q && q.symbol) bySymbol[q.symbol] = q;
    });

    const results = STOCK_UNIVERSE.map((s) => {
      const q = bySymbol[yfSymbol(s.symbol)];
      if (!q || q.regularMarketPrice == null) return null;

      const price = q.regularMarketPrice;
      const change = q.regularMarketChange ?? 0;
      const changePct = q.regularMarketChangePercent ?? 0;
      const marketCapCr = q.marketCap ? Math.round(q.marketCap / 1e7) : null;

      return {
        symbol: s.symbol,
        name: q.longName || q.shortName || s.name,
        sector: s.sector,
        cap: s.cap,
        price: Math.round(price * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePct: Math.round(changePct * 100) / 100,
        is_up: change >= 0,
        marketCapCr,
      };
    }).filter(Boolean);

    // Pull today's intraday closes for each stock in parallel so the list's
    // sparkline column reflects real price action instead of a fake squiggle.
    const sparkLists = await Promise.all(
      results.map((s) => fetchSparkline(yfSymbol(s.symbol)))
    );
    results.forEach((s, i) => { s.spark = sparkLists[i]; });

    res.json(results);
  } catch (err) {
    console.error("Error fetching /api/stocks:", err.message);
    res.status(500).json({ error: "Failed to fetch stock list" });
  }
});

router.get("/stock/:symbol", async (req, res) => {
  const rawSymbol = req.params.symbol.toUpperCase();
  const symbol = yfSymbol(rawSymbol);
  const universeEntry = STOCK_UNIVERSE.find((s) => s.symbol === rawSymbol);

  try {
    const [quote, summary] = await Promise.all([
      yahooFinance.quote(symbol),
      yahooFinance
        .quoteSummary(symbol, { modules: ["assetProfile", "summaryDetail", "defaultKeyStatistics"] })
        .catch(() => null),
    ]);

    if (!quote || quote.regularMarketPrice == null) {
      return res.status(404).json({ error: "Stock not found" });
    }

    const profile = (summary && summary.assetProfile) || {};
    const detail = (summary && summary.summaryDetail) || {};
    const stats = (summary && summary.defaultKeyStatistics) || {};

    const price = quote.regularMarketPrice;
    const change = quote.regularMarketChange ?? 0;
    const changePct = quote.regularMarketChangePercent ?? 0;
    const marketCapCr = quote.marketCap ? Math.round(quote.marketCap / 1e7) : null;
    const sign = change >= 0 ? "+" : "";

    res.json({
      symbol: rawSymbol,
      name: quote.longName || quote.shortName || (universeEntry && universeEntry.name) || rawSymbol,
      exchange: "NSE",
      cap: universeEntry ? `${universeEntry.cap} Cap` : null,
      sector: profile.sector || (universeEntry && universeEntry.sector) || null,
      industry: profile.industry || null,
      price: fmtNumber(price),
      change: `${sign}${change.toFixed(2)}`,
      pct: `(${Math.abs(changePct).toFixed(2)}%)`,
      up: change >= 0,
      status: quote.marketState === "REGULAR" ? "Market open" : "Market closed",
      time: quote.regularMarketTime
        ? new Date(quote.regularMarketTime).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }) + " IST"
        : null,
      todaysLow: fmtNumber(quote.regularMarketDayLow),
      todaysHigh: fmtNumber(quote.regularMarketDayHigh),
      weekLow: fmtNumber(quote.fiftyTwoWeekLow),
      weekHigh: fmtNumber(quote.fiftyTwoWeekHigh),
      open: fmtNumber(quote.regularMarketOpen),
      prevClose: fmtNumber(quote.regularMarketPreviousClose),
      volume: quote.regularMarketVolume != null ? Number(quote.regularMarketVolume).toLocaleString("en-IN") : null,
      about: profile.longBusinessSummary || null,
      headquarters: [profile.city, profile.country].filter(Boolean).join(", ") || null,
      website: profile.website ? profile.website.replace(/^https?:\/\//, "").replace(/\/$/, "") : null,
      marketCapCr,
      fundamentals: {
        marketCap: marketCapCr != null ? `₹${marketCapCr.toLocaleString("en-IN")} Cr` : null,
        peRatio: detail.trailingPE != null ? detail.trailingPE.toFixed(2) : null,
        eps: stats.trailingEps != null ? stats.trailingEps.toFixed(2) : null,
        pbRatio: stats.priceToBook != null ? stats.priceToBook.toFixed(2) : null,
        dividendYield: detail.dividendYield != null ? `${(detail.dividendYield * 100).toFixed(2)}%` : null,
        bookValue: stats.bookValue != null ? stats.bookValue.toFixed(2) : null,
      },
    });
  } catch (err) {
    console.error(`Error fetching /api/stock/${rawSymbol}:`, err.message);
    res.status(500).json({ error: "Failed to fetch stock detail" });
  }
});

module.exports = router;