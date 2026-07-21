const express = require("express");
const router  = express.Router();
const fs = require("fs");
const path = require("path");
const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

// Small, hand-curated set of the best-known large/mid caps. This is no
// longer the full tradable universe (see getStockUniverse() below), but we
// keep it around for two things: (1) accurate sector/cap labels for these
// well-known names, since NSE's master list doesn't include that, and
// (2) an offline fallback if we can't reach NSE at all and there's no
// on-disk cache yet.
const CURATED_UNIVERSE = [
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

// ---------------------------------------------------------------------
// Index membership, used by the "Indices" filter on the All Stocks page.
// NSE's public equity master list (EQUITY_L.csv) doesn't include index
// constituents, and there's no other free endpoint in use here that does
// either, so this is necessarily an approximation:
//  - Nifty 50 / Bank Nifty / Fin Nifty below are real, hand-maintained
//    constituent lists (accurate as of writing — NSE reshuffles these
//    periodically, so treat as indicative rather than authoritative).
//  - Nifty 100 / Nifty Next 50 / Nifty Midcap 150 / Nifty Smallcap 250
//    are derived from each stock's market-cap bucket (Large/Mid/Small)
//    since we don't have the real constituent lists for those.
// ---------------------------------------------------------------------
const NIFTY_50_SYMBOLS = new Set([
  "ADANIENT", "ADANIPORTS", "APOLLOHOSP", "ASIANPAINT", "AXISBANK", "BAJAJ-AUTO", "BAJFINANCE",
  "BAJAJFINSV", "BEL", "BHARTIARTL", "CIPLA", "COALINDIA", "DRREDDY", "EICHERMOT", "GRASIM",
  "HCLTECH", "HDFCBANK", "HDFCLIFE", "HEROMOTOCO", "HINDALCO", "HINDUNILVR", "ICICIBANK",
  "INDUSINDBK", "INFY", "ITC", "JSWSTEEL", "KOTAKBANK", "LT", "LTIM", "M&M", "MARUTI",
  "NESTLEIND", "NTPC", "ONGC", "POWERGRID", "RELIANCE", "SBILIFE", "SBIN", "SHRIRAMFIN",
  "SUNPHARMA", "TATACONSUM", "TATAMOTORS", "TATASTEEL", "TCS", "TECHM", "TITAN", "TRENT",
  "ULTRACEMCO", "WIPRO",
]);

const BANK_NIFTY_SYMBOLS = new Set([
  "HDFCBANK", "ICICIBANK", "SBIN", "KOTAKBANK", "AXISBANK", "INDUSINDBK",
  "BANKBARODA", "PNB", "IDFCFIRSTB", "AUBANK", "FEDERALBNK", "CANBK",
]);

const NIFTY_FIN_SERVICE_SYMBOLS = new Set([
  "HDFCBANK", "ICICIBANK", "SBIN", "KOTAKBANK", "AXISBANK", "BAJFINANCE", "BAJAJFINSV",
  "HDFCLIFE", "SBILIFE", "SHRIRAMFIN", "CHOLAFIN", "PFC", "RECLTD", "ICICIPRULI",
  "ICICIGI", "MUTHOOTFIN", "HDFCAMC", "LICHSGFIN", "PNBHOUSING", "JIOFIN",
]);

function getIndicesForStock(symbol, cap) {
  const list = [];
  if (NIFTY_50_SYMBOLS.has(symbol)) list.push("Nifty 50");
  if (BANK_NIFTY_SYMBOLS.has(symbol)) list.push("Bank Nifty");
  if (NIFTY_FIN_SERVICE_SYMBOLS.has(symbol)) list.push("Fin Nifty");

  if (cap === "Large") {
    list.push("Nifty 100");
    if (!NIFTY_50_SYMBOLS.has(symbol)) list.push("Nifty Next 50");
  } else if (cap === "Mid") {
    list.push("Nifty Midcap 150");
  } else if (cap === "Small") {
    list.push("Nifty Smallcap 250");
  }
  return list;
}

const yfSymbol = (symbol) => (symbol.includes(".") ? symbol : `${symbol}.NS`);

// ---------------------------------------------------------------------
// Full NSE universe (2000+ equities), built from NSE's own master list
// instead of a hand-typed array. Cached on disk for a day so we're not
// re-fetching it on every server restart, and we fall back to whatever
// we have (disk cache, then the curated list above) if NSE can't be
// reached at all.
// ---------------------------------------------------------------------
const EQUITY_LIST_URL = "https://nsearchives.nseindia.com/content/equities/EQUITY_L.csv";
const EQUITY_CACHE_PATH = path.join(__dirname, "equity-universe-cache.json");
const EQUITY_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // the master list barely changes intraday

function parseEquityCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length);
  const rows = [];
  // Skip the header row.
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < 3) continue;
    const symbol = (cols[0] || "").trim();
    const name = (cols[1] || "").trim();
    const series = (cols[2] || "").trim();
    if (!symbol || !name) continue;
    rows.push({ symbol, name, series });
  }
  return rows;
}

async function fetchEquityListFromNSE() {
  const resp = await fetch(EQUITY_LIST_URL, { headers: YF_HEADERS });
  if (!resp.ok) throw new Error(`NSE equity list request failed: ${resp.status}`);
  const text = await resp.text();
  const rows = parseEquityCsv(text);
  // "EQ" is the regular main-board equity series. BE/BZ/etc. are
  // trade-to-trade or suspended series that are usually illiquid/rarely
  // relevant for a general "browse all stocks" page.
  return rows.filter((r) => r.series === "EQ");
}

function loadCachedEquityList() {
  try {
    const raw = fs.readFileSync(EQUITY_CACHE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.rows) && parsed.fetchedAt) return parsed;
  } catch (err) {}
  return null;
}

function saveCachedEquityList(rows) {
  try {
    fs.writeFileSync(EQUITY_CACHE_PATH, JSON.stringify({ fetchedAt: Date.now(), rows }));
  } catch (err) {
    console.error("Failed to write NSE equity universe cache:", err.message);
  }
}

let universePromise = null;

async function getStockUniverse() {
  if (universePromise) return universePromise;

  universePromise = (async () => {
    const cached = loadCachedEquityList();
    const isFresh = cached && Date.now() - cached.fetchedAt < EQUITY_CACHE_TTL_MS;
    let rows = cached ? cached.rows : null;

    if (!isFresh) {
      try {
        rows = await fetchEquityListFromNSE();
        saveCachedEquityList(rows);
        console.log(`Loaded ${rows.length} NSE-listed equities.`);
      } catch (err) {
        console.error("Failed to fetch NSE equity master list, using cache/fallback instead:", err.message);
      }
    }

    if (!rows || !rows.length) {
      console.warn(`Falling back to the curated ${CURATED_UNIVERSE.length}-stock list (no NSE master list available).`);
      return CURATED_UNIVERSE;
    }

    const curatedBySymbol = new Map(CURATED_UNIVERSE.map((s) => [s.symbol, s]));
    return rows.map((r) => {
      const known = curatedBySymbol.get(r.symbol);
      return {
        symbol: r.symbol,
        name: known ? known.name : r.name,
        sector: known ? known.sector : "Other",
        cap: known ? known.cap : null, // filled in from live market cap once we have a quote
      };
    });
  })();

  return universePromise;
}


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
//
// Uses a 5-day window (not just "today") and then picks out the most recent
// trading day that actually has data. Requesting only "today" breaks over
// weekends/holidays/after-hours, since there's no session for the current
// calendar day yet — this way we always fall back to the last real session
// instead of coming back empty when the market's closed.
async function fetchSparkline(symbol) {
  try {
    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
      `?range=5d&interval=15m&includePrePost=false`;
    const resp = await fetch(url, { headers: YF_HEADERS });
    if (!resp.ok) return [];
    const json = await resp.json();
    const result = json?.chart?.result?.[0];
    if (!result) return [];

    const timestamps = result.timestamp || [];
    const closes = result?.indicators?.quote?.[0]?.close || [];
    if (!timestamps.length) return [];

    const tz = result.meta?.exchangeTimezoneName || "Asia/Kolkata";
    const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: tz });
    const rows = timestamps
      .map((ts, i) => ({ dateStr: dayFmt.format(new Date(ts * 1000)), close: closes[i] }))
      .filter((r) => r.close != null);
    if (!rows.length) return [];

    const lastDate = rows[rows.length - 1].dateStr;
    return rows.filter((r) => r.dateStr === lastDate).map((r) => Math.round(r.close * 100) / 100);
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
  "1D": { range: "5d", interval: "5m" },
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

  for (const [symbol, indexInfo] of Object.entries(INDICES)) {
    try {
      const { meta } = await fetchHistory(symbol, 1);

      const current = meta.regularMarketPrice;
      const prev    = meta.chartPreviousClose || meta.previousClose;

      if (!current || !prev) continue;

      const changePct = ((current - prev) / prev) * 100;
      const sign      = changePct >= 0 ? "+" : "";

      results.push({
        sym:   indexInfo.display,
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

// Fetches quotes for a big symbol list in manageable chunks (Yahoo's quote
// endpoint gets unreliable/URL-length-limited if you throw thousands of
// symbols at it in one go). A failed chunk is skipped rather than aborting
// the whole batch, so one bad symbol doesn't take down the rest.
// Raw-fetch version of a quote batch, same style as fetchSeries/fetchHistory
// above (plain HTTP + YF_HEADERS, no crumb/cookie handshake). The
// yahoo-finance2 library's .quote() needs a session crumb from Yahoo, which
// is the part of Yahoo's API that tends to get blocked/rate-limited from
// server environments — this sidesteps that entirely, the same way the
// working single-stock chart endpoint does.
async function fetchQuoteChunkRaw(chunk) {
  const url =
    `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(chunk.join(","))}`;
  const resp = await fetch(url, { headers: YF_HEADERS });
  if (!resp.ok) throw new Error(`Yahoo quote endpoint returned ${resp.status}`);
  const json = await resp.json();
  const list = json?.quoteResponse?.result || [];
  if (json?.quoteResponse?.error) throw new Error(json.quoteResponse.error);
  return list;
}

async function fetchQuotesInBatches(symbols, batchSize = 120) {
  const bySymbol = {};
  for (let i = 0; i < symbols.length; i += batchSize) {
    const chunk = symbols.slice(i, i + batchSize);
    let list = [];
    try {
      list = await fetchQuoteChunkRaw(chunk);
    } catch (err) {
      console.error(`Raw quote batch starting at ${chunk[0]} failed, falling back to yahoo-finance2:`, err.message);
      try {
        const quotes = await yahooFinance.quote(chunk);
        list = Array.isArray(quotes) ? quotes : [quotes];
      } catch (err2) {
        console.error(`Fallback quote batch starting at ${chunk[0]} also failed:`, err2.message);
      }
    }
    list.forEach((q) => {
      if (q && q.symbol) bySymbol[q.symbol] = q;
    });
    // Small pause between chunks so we don't hammer Yahoo.
    await new Promise((r) => setTimeout(r, 150));
  }
  return bySymbol;
}

const LARGE_CAP_THRESHOLD = 2e11; // ~₹20,000 Cr
const MID_CAP_THRESHOLD = 5e10;   // ~₹5,000 Cr

function inferCapBucket(marketCap) {
  if (marketCap == null) return "Small";
  if (marketCap >= LARGE_CAP_THRESHOLD) return "Large";
  if (marketCap >= MID_CAP_THRESHOLD) return "Mid";
  return "Small";
}

// True per-symbol intraday sparklines cost one extra HTTP request each —
// fetching all 2000+ at once, every cache refresh, would hammer Yahoo and
// take far too long. Instead we keep a persistent cache and fetch a rotating
// batch of it every refresh cycle (biggest names first, then whichever
// symbols haven't been fetched yet, then whichever are stalest). Within a
// few refresh cycles every stock in the universe has a real, fetched
// intraday sparkline — and it keeps quietly refreshing after that so none
// of them go stale for long. Until a symbol's first real fetch comes back,
// it shows a genuine (not fake) placeholder built for free from the bulk
// quote's open/day-low/day-high/previous-close fields.
const SPARKLINE_BATCH_SIZE = 150;
const SPARKLINE_REFRESH_MS = 5 * 60 * 1000; // re-fetch each symbol at most every 5 min
const sparkCache = new Map(); // symbol -> { data, updatedAt }

function buildQuickSpark(q, isUp) {
  const { regularMarketPreviousClose: prevClose, regularMarketOpen: open,
    regularMarketDayLow: low, regularMarketDayHigh: high, regularMarketPrice: price } = q;
  const ordered = isUp ? [prevClose, open, low, high, price] : [prevClose, open, high, low, price];
  return ordered.filter((v) => typeof v === "number").map((v) => Math.round(v * 100) / 100);
}

// Picks which symbols to actually hit Yahoo for this cycle: symbols that
// have never been fetched (biggest market cap first) take priority, then
// symbols whose cached sparkline is old enough to need refreshing.
function pickSparkTargets(results) {
  const now = Date.now();
  const stale = results.filter((s) => {
    const cached = sparkCache.get(s.symbol);
    return !cached || now - cached.updatedAt > SPARKLINE_REFRESH_MS;
  });
  stale.sort((a, b) => {
    const ca = sparkCache.get(a.symbol);
    const cb = sparkCache.get(b.symbol);
    if (!ca && !cb) return (b.marketCapCr || 0) - (a.marketCapCr || 0);
    if (!ca) return -1;
    if (!cb) return 1;
    return ca.updatedAt - cb.updatedAt;
  });
  return stale.slice(0, SPARKLINE_BATCH_SIZE);
}

async function buildStocksSnapshot() {
  const universe = await getStockUniverse();
  const symbols = universe.map((s) => yfSymbol(s.symbol));
  const bySymbol = await fetchQuotesInBatches(symbols);

  const results = universe
    .map((s) => {
      const q = bySymbol[yfSymbol(s.symbol)];
      if (!q || q.regularMarketPrice == null) return null;

      const price = q.regularMarketPrice;
      const change = q.regularMarketChange ?? 0;
      const changePct = q.regularMarketChangePercent ?? 0;
      const marketCapCr = q.marketCap ? Math.round(q.marketCap / 1e7) : null;
      const cap = s.cap || inferCapBucket(q.marketCap);

      return {
        symbol: s.symbol,
        name: q.longName || q.shortName || s.name,
        sector: s.sector,
        cap,
        price: Math.round(price * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePct: Math.round(changePct * 100) / 100,
        is_up: change >= 0,
        marketCapCr,
        weekLow: q.fiftyTwoWeekLow ?? null,
        weekHigh: q.fiftyTwoWeekHigh ?? null,
        peRatio: q.trailingPE != null ? Math.round(q.trailingPE * 100) / 100 : null,
        indices: getIndicesForStock(s.symbol, cap),
        spark: buildQuickSpark(q, change >= 0),
      };
    })
    .filter(Boolean);

  // Apply whatever real sparklines earlier cycles already fetched.
  results.forEach((s) => {
    const cached = sparkCache.get(s.symbol);
    if (cached) s.spark = cached.data;
  });

  // Fetch this cycle's rotating batch and fold the fresh results straight
  // into both the cache (for next time) and this response (for right now).
  const sparkTargets = pickSparkTargets(results);
  const sparkLists = await Promise.all(sparkTargets.map((s) => fetchSparkline(yfSymbol(s.symbol))));
  sparkTargets.forEach((s, i) => {
    const data = sparkLists[i];
    if (Array.isArray(data) && data.length >= 2) {
      sparkCache.set(s.symbol, { data, updatedAt: Date.now() });
      s.spark = data;
    }
  });

  return results;
}

// Building a full snapshot of 2000+ quotes takes real time (many chunked
// Yahoo calls), so we don't do it on every request. Instead we serve
// whatever's cached and kick off a background refresh once it's stale,
// only blocking a request if the cache is completely empty (first hit
// after a fresh server start).
const STOCKS_CACHE_TTL_MS = 60 * 1000;
let stocksCache = { data: [], updatedAt: 0, refreshing: null };

async function refreshStocksCache() {
  try {
    const data = await buildStocksSnapshot();
    stocksCache = { data, updatedAt: Date.now(), refreshing: null };
  } catch (err) {
    console.error("Failed to refresh the full stock universe cache:", err.message);
    stocksCache.refreshing = null;
  }
}

router.get("/stocks", async (_req, res) => {
  try {
    if (!stocksCache.data.length) {
      await refreshStocksCache(); // cold start: block once so it isn't empty
    } else if (Date.now() - stocksCache.updatedAt > STOCKS_CACHE_TTL_MS && !stocksCache.refreshing) {
      stocksCache.refreshing = refreshStocksCache();
    }
    res.json(stocksCache.data);
  } catch (err) {
    console.error("Error fetching /api/stocks:", err.message);
    res.status(500).json({ error: "Failed to fetch stock list" });
  }
});

router.get("/stock/:symbol", async (req, res) => {
  const rawSymbol = req.params.symbol.toUpperCase();
  const symbol = yfSymbol(rawSymbol);
  const universe = await getStockUniverse();
  const universeEntry = universe.find((s) => s.symbol === rawSymbol);

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
      indices: getIndicesForStock(rawSymbol, universeEntry ? universeEntry.cap : inferCapBucket(quote.marketCap)),
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

// Real quarterly/yearly revenue & profit (used by the "Financial performance"
// chart on the stock detail page) straight from Yahoo's income statement
// modules, instead of the fixed TCS demo numbers that used to show for
// every stock.
router.get("/financials/:symbol", async (req, res) => {
  const rawSymbol = req.params.symbol.toUpperCase();
  const symbol = yfSymbol(rawSymbol);

  const toCr = (v) => (typeof v === "number" ? Math.round(v / 1e7) : null);
  const sortByEndDate = (arr) =>
    [...arr].sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

  try {
    const summary = await yahooFinance.quoteSummary(symbol, {
      modules: ["incomeStatementHistory", "incomeStatementHistoryQuarterly"],
    });

    const yearlyRaw = (summary.incomeStatementHistory && summary.incomeStatementHistory.incomeStatementHistory) || [];
    const quarterlyRaw =
      (summary.incomeStatementHistoryQuarterly && summary.incomeStatementHistoryQuarterly.incomeStatementHistory) || [];

    const yearly = sortByEndDate(yearlyRaw)
      .map((entry) => {
        const d = new Date(entry.endDate);
        return { q: `FY${String(d.getFullYear()).slice(-2)}`, revenue: toCr(entry.totalRevenue), profit: toCr(entry.netIncome) };
      })
      .filter((r) => r.revenue != null && r.profit != null);

    const quarterly = sortByEndDate(quarterlyRaw)
      .map((entry) => {
        const d = new Date(entry.endDate);
        const month = d.toLocaleString("en-IN", { month: "short" });
        return { q: `${month} '${String(d.getFullYear()).slice(-2)}`, revenue: toCr(entry.totalRevenue), profit: toCr(entry.netIncome) };
      })
      .filter((r) => r.revenue != null && r.profit != null);

    res.json({ symbol: rawSymbol, quarterly, yearly });
  } catch (err) {
    console.error(`Error fetching /api/financials/${rawSymbol}:`, err.message);
    res.status(502).json({ error: "Failed to fetch financial performance", quarterly: [], yearly: [] });
  }
});

// Real "similar stocks" — other names in the same sector, ranked by market
// cap — pulled from the same cached universe snapshot /api/stocks uses, so
// this doesn't cost any extra Yahoo calls on top of that.
router.get("/similar/:symbol", async (req, res) => {
  const rawSymbol = req.params.symbol.toUpperCase();
  try {
    if (!stocksCache.data.length) {
      await refreshStocksCache();
    }
    const target = stocksCache.data.find((s) => s.symbol === rawSymbol);
    if (!target || !target.sector) return res.json([]);

    const similar = stocksCache.data
      .filter((s) => s.symbol !== rawSymbol && s.sector === target.sector)
      .sort((a, b) => (b.marketCapCr || 0) - (a.marketCapCr || 0))
      .slice(0, 4);

    res.json(similar);
  } catch (err) {
    console.error(`Error fetching /api/similar/${rawSymbol}:`, err.message);
    res.status(500).json({ error: "Failed to fetch similar stocks" });
  }
});

module.exports = router;