// routes/market.js — /api/live-indices and /api/chart/:symbol
// Replaces the Python yfinance calls with direct Yahoo Finance v8 API requests
// using Node's built-in fetch (Node 18+) — no extra library needed.

const express = require("express");
const router  = express.Router();

const TICKERS = {
  "^NSEI":                "NIFTY 50",
  "^NSEBANK":             "NIFTY BANK",
  "NIFTY_FIN_SERVICE.NS": "NIFTY FIN SERVICE",
  "^CNXIT":               "NIFTY IT",
  "NIFTY_MIDCAP_100.NS":  "NIFTY MIDCAP 100",
  "^CNXSC":               "NIFTY SMLCAP 100",
  "^CNX100":              "NIFTY 100",
};

// Common headers to mimic a browser — Yahoo Finance blocks bare Node requests
const YF_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

/**
 * Fetch the last N daily closing bars for a symbol from Yahoo Finance v8.
 * Returns an array of { open, high, low, close, timestamp } objects.
 */
async function fetchHistory(symbol, rangeDays = 5) {
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
    `?range=${rangeDays}d&interval=1d&includePrePost=false`;

  const resp = await fetch(url, { headers: YF_HEADERS });
  if (!resp.ok) throw new Error(`Yahoo Finance returned ${resp.status} for ${symbol}`);

  const json = await resp.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(`No data for ${symbol}`);

  const timestamps = result.timestamp || [];
  const q = result.indicators.quote[0];

  return timestamps.map((ts, i) => ({
    timestamp: ts,
    open:  q.open[i],
    high:  q.high[i],
    low:   q.low[i],
    close: q.close[i],
  })).filter(c => c.close != null); // drop nulls (market-closed rows)
}

/**
 * Fetch intraday 5-minute bars for a symbol (today's session).
 */
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

// ─── GET /api/live-indices ────────────────────────────────────────────────────
router.get("/live-indices", async (_req, res) => {
  const results = [];

  for (const [symbol, name] of Object.entries(TICKERS)) {
    try {
      const bars = await fetchHistory(symbol, 5);
      if (bars.length < 1) continue;

      const current = bars[bars.length - 1].close;
      const prev    = bars.length >= 2 ? bars[bars.length - 2].close : bars[0].open;

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

// ─── GET /api/chart/:symbol ───────────────────────────────────────────────────
router.get("/chart/:symbol", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    const { timestamps, q, tz, meta } = await fetchIntraday(symbol);

    if (!timestamps.length) {
      return res.json({ candles: [], price: 0, change: 0, is_up: true });
    }

    // Convert epoch timestamps → "HH:MM" in the exchange's timezone
    const fmt = new Intl.DateTimeFormat("en-IN", {
      timeZone: tz,
      hour:   "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // Determine today's date string in the exchange timezone
    const todayStr = new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date());

    const allCandles = timestamps.map((ts, i) => ({
      dateStr: new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date(ts * 1000)),
      time:    fmt.format(new Date(ts * 1000)),
      open:    q.open[i],
      high:    q.high[i],
      low:     q.low[i],
      close:   q.close[i],
    })).filter(c => c.close != null);

    // Keep only today's bars
    const todayCandles = allCandles.filter(c => c.dateStr === todayStr);
    const candles = (todayCandles.length > 0 ? todayCandles : allCandles).map(
      ({ time, open, high, low, close }) => ({ time, open, high, low, close })
    );

    // Current price — prefer meta.regularMarketPrice (live quote)
    const currentPrice = meta?.regularMarketPrice ?? candles[candles.length - 1].close;

    // Previous close for change %
    const prevClose =
      meta?.chartPreviousClose ??
      meta?.previousClose ??
      candles[0]?.open ??
      currentPrice;

    const changePct = ((currentPrice - prevClose) / prevClose) * 100;

    return res.json({
      candles,
      price:  Math.round(currentPrice * 100) / 100,
      change: Math.round(changePct * 100) / 100,
      is_up:  changePct >= 0,
    });
  } catch (err) {
    console.error(`Error fetching chart for ${symbol}:`, err.message);
    return res.json({ candles: [], price: 0, change: 0, is_up: true });
  }
});

module.exports = router;
