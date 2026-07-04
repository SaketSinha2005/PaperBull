const express = require("express");
const router  = express.Router();

const TICKERS = {
  "^NSEI":                "NIFTY 50",
  "^NSEBANK":             "NIFTY BANK",
  "NIFTY_FIN_SERVICE.NS": "NIFTY FIN SERVICE",
  "^CNXIT":               "NIFTY IT",
  "^CRSMID":              "NIFTY MIDCAP 100", 
  "^CNXSC":               "NIFTY SMLCAP 100",
  "^CNX100":              "NIFTY 100",
};

const INDICES = {
  "^NSEI":                { display: "NIFTY",      symbol: "^NSEI" },
  "^BSESN":               { display: "SENSEX",     symbol: "^BSESN" },
  "^NSEBANK":             { display: "BANKNIFTY",  symbol: "^NSEBANK" },
  "^CRSMID":              { display: "MIDCNIFTY",  symbol: "^CRSMID" }, 
  "NIFTY_FIN_SERVICE.NS": { display: "FINNIFTY",   symbol: "NIFTY_FIN_SERVICE.NS" },
};

const YF_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

// 2. Updated to return the 'meta' object which holds the exact live prices
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

    // 3. FIXED: Find the date of the very last available candle, then filter by that.
    // This perfectly handles weekends, market holidays, and live hours.
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

module.exports = router;