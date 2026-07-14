const express = require('express');
const cors = require('cors');
const axios = require('axios');
const marketRoutes = require('./market');
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

const app = express();
const PORT = 5000;

app.use(cors());
app.use('/api', marketRoutes);

const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.nseindia.com/"
};

// Reusable function to fetch either Gainers or Losers
async function fetchMovers(indexType, requestedCategory = 'NIFTY') {
    const baseResponse = await axios.get("https://www.nseindia.com", { headers: HEADERS });
    let cookieString = '';
    
    if (baseResponse.headers['set-cookie']) {
        cookieString = baseResponse.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
    }

    const reqHeaders = { ...HEADERS, "Cookie": cookieString };
    const url = `https://www.nseindia.com/api/live-analysis-variations?index=${indexType}`;
    const response = await axios.get(url, { headers: reqHeaders });
    
    let moversData = [];
    const categoryData = response.data[requestedCategory];
    
    if (categoryData && Array.isArray(categoryData.data) && categoryData.data.length > 0) {
        moversData = categoryData.data;
    } else if (Array.isArray(response.data.data) && response.data.data.length > 0) {
        moversData = response.data.data;
    }

    const dataList = moversData.slice(0, 7);
    const mappedStocks = [];
    
    for (const stock of dataList) {
        let chartPoints = [];
        try {
            const symbolStr = encodeURIComponent(stock.symbol + 'EQN');
            const chartUrl = `https://www.nseindia.com/api/chart-databyindex?index=${symbolStr}`;
            const chartRes = await axios.get(chartUrl, { headers: reqHeaders });
            
            if (chartRes.data.grapthData && chartRes.data.grapthData.length > 0) {
                chartPoints = chartRes.data.grapthData.map(pt => pt[1]);
            } else {
                throw new Error("NSE returned empty array");
            }
            await new Promise(resolve => setTimeout(resolve, 250));
            
        } catch (nseErr) {
            console.log(`NSE failed for ${stock.symbol}, falling back to Yahoo...`);
            try {
                const yfSymbol = `${stock.symbol}.NS`;
                const now = new Date();
                const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
                
                const yfResult = await yahooFinance.chart(yfSymbol, { 
                    period1: oneDayAgo,
                    period2: now,
                    interval: '5m',
                    return: 'array' 
                });

                if (yfResult && yfResult.quotes && yfResult.quotes.length > 0) {
                    const lastQuoteDate = new Date(yfResult.quotes[yfResult.quotes.length - 1].date);
                    const lastDayString = lastQuoteDate.toDateString();
                    
                    chartPoints = yfResult.quotes
                        .filter(q => new Date(q.date).toDateString() === lastDayString)
                        .map(q => q.close)
                        .filter(c => c !== null);
                }
            } catch (yfErr) {
                console.error(`Yahoo Finance failed for ${stock.symbol}:`, yfErr.message);
            }
        }

        mappedStocks.push({
            symbol: stock.symbol,
            price: stock.ltp,
            change_percent: stock.perChange,
            volume: stock.trade_quantity,
            previous_close: stock.prev_price,
            chart: chartPoints
        });
    }
    return mappedStocks;
}

// Reusable function to fetch 52-week breakouts from the broader market
async function fetch52WeekBreakouts(type = 'high') {
    const baseResponse = await axios.get("https://www.nseindia.com", { headers: HEADERS });
    let cookieString = '';

    if (baseResponse.headers['set-cookie']) {
        cookieString = baseResponse.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
    }
    const reqHeaders = { ...HEADERS, "Cookie": cookieString };

    let moversData = [];

    // Small helper: NSE nests these responses differently depending on the
    // endpoint (e.g. gainers/losers come back as { NIFTY: { data: [...] } }).
    // Try the flat shape first, then fall back to scanning any object/array
    // values in the payload so we don't silently end up with [].
    function extractList(payload, label) {
        if (!payload) return [];
        if (Array.isArray(payload.data) && payload.data.length) return payload.data;

        // Try common NSE-style nested keys
        const candidateKeys = Object.keys(payload).filter(
            (k) => payload[k] && (Array.isArray(payload[k]) || Array.isArray(payload[k].data))
        );
        for (const key of candidateKeys) {
            const val = payload[key];
            const list = Array.isArray(val) ? val : val.data;
            if (Array.isArray(list) && list.length) {
                console.log(`[52week:${label}] using nested key "${key}" (${list.length} rows)`);
                return list;
            }
        }

        console.log(`[52week:${label}] no usable array found. Top-level keys:`, Object.keys(payload));
        return [];
    }

    try {
        // Primary NSE endpoint for 52 week data
        const url = `https://www.nseindia.com/api/live-analysis-52Week?index=${type}`;
        const response = await axios.get(url, { headers: reqHeaders });
        console.log(`[52week:${type}] primary status ${response.status}, keys:`, Object.keys(response.data || {}));
        moversData = extractList(response.data, `${type}-primary`);
    } catch (nseErr) {
        console.log(`NSE 52 Week API failed for ${type} (${nseErr.response?.status || nseErr.message}), trying fallback...`);
    }

    if (moversData.length === 0) {
        try {
            // Fallback endpoint if the primary NSE route is throttled/renamed
            const fallbackUrl = `https://www.nseindia.com/api/live-analysis-variations?index=52Week${type === 'high' ? 'High' : 'Low'}`;
            const fbResponse = await axios.get(fallbackUrl, { headers: reqHeaders });
            console.log(`[52week:${type}] fallback status ${fbResponse.status}, keys:`, Object.keys(fbResponse.data || {}));
            moversData = extractList(fbResponse.data, `${type}-fallback`);
        } catch (fbErr) {
            console.error("Fallback NSE 52 Week API failed:", fbErr.response?.status || fbErr.message);
        }
    }

    // Capture the top 15 breakout stocks
    const dataList = moversData.slice(0, 15);
    const mappedStocks = [];

    for (const stock of dataList) {
        let chartPoints = [];
        try {
            // Fetch intra-day sparkline from Yahoo Finance using the mapped breakout symbol
            const yfSymbol = `${stock.symbol}.NS`;
            const now = new Date();
            const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

            const yfResult = await yahooFinance.chart(yfSymbol, {
                period1: oneDayAgo,
                period2: now,
                interval: '5m',
                return: 'array'
            });

            if (yfResult && yfResult.quotes && yfResult.quotes.length > 0) {
                const lastQuoteDate = new Date(yfResult.quotes[yfResult.quotes.length - 1].date);
                const lastDayString = lastQuoteDate.toDateString();

                chartPoints = yfResult.quotes
                    .filter(q => new Date(q.date).toDateString() === lastDayString)
                    .map(q => q.close)
                    .filter(c => c !== null);
            }
            await new Promise(resolve => setTimeout(resolve, 200)); // Prevent rate-limit
        } catch (yfErr) {
            console.error(`Yahoo Finance chart failed for ${stock.symbol}:`, yfErr.message);
        }

        // Map the properties depending on which NSE JSON structure was returned
        mappedStocks.push({
            symbol:        stock.symbol,
            name:          stock.companyName || stock.symbol,
            series:        stock.series || 'EQ',
            price:         stock.ltp || stock.lastPrice,
            change_percent: stock.perChange || stock.pChange,
            volume:        stock.trade_quantity || stock.tradedQuantity,
            previous_close: stock.prev_price || stock.previousPrice,
            new52WkPrice:  stock.new52WkHigh || stock.new52WkLow || stock.ltp || stock.lastPrice,
            prevDate:      stock.prevDate || stock.date52WeekHigh || stock.date52WeekLow || null,
            chart:         chartPoints
        });
    }

    if (mappedStocks.length === 0) {
        console.warn(`[52week:${type}] returning empty result — check the [52week:...] logs above for the real NSE payload shape.`);
    }

    return mappedStocks;
}

app.get('/api/gainers', async (req, res) => {
    try {
        const category = req.query.category || 'NIFTY';
        const data = await fetchMovers('gainers', category);
        res.json(data);
    } catch (error) {
        console.error('Error in /api/gainers:', error.message);
        res.status(500).json({ error: 'Failed to fetch gainers' });
    }
});

app.get('/api/losers', async (req, res) => {
    try {
        const category = req.query.category || 'NIFTY';
        const data = await fetchMovers('loosers', category);
        res.json(data);
    } catch (error) {
        console.error('Error in /api/losers:', error.message);
        res.status(500).json({ error: 'Failed to fetch losers' });
    }
});

// These two were missing entirely, which is why the 52 Week Breakouts
// card always 404'd — fetch52WeekBreakouts() existed but had no route
// pointing at it.
app.get('/api/52week-high', async (req, res) => {
    try {
        const data = await fetch52WeekBreakouts('high');
        res.json(data);
    } catch (error) {
        console.error('Error in /api/52week-high:', error.message);
        res.status(500).json({ error: 'Failed to fetch 52 week highs' });
    }
});

app.get('/api/52week-low', async (req, res) => {
    try {
        const data = await fetch52WeekBreakouts('low');
        res.json(data);
    } catch (error) {
        console.error('Error in /api/52week-low:', error.message);
        res.status(500).json({ error: 'Failed to fetch 52 week lows' });
    }
});

// Endpoint 1: Gainers
// app.get('/api/gainers', async (req, res) => {
//     try {
//         const data = await fetchMovers('gainers');
//         res.json(data);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to collect real-time data" });
//     }
// });

// // Endpoint 2: Losers (Using NSE's typo 'loosers')
// app.get('/api/losers', async (req, res) => {
//     try {
//         const data = await fetchMovers('loosers');
//         res.json(data);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to collect real-time data" });
//     }
// });

async function fetchLiveCurrencySnapshot() {
    const symbols = [
        { yahoo: "USDINR=X", name: "USD/INR Spot" },
        { yahoo: "EURINR=X", name: "EUR/INR Spot" },
        { yahoo: "GBPINR=X", name: "GBP/INR Spot" },
        { yahoo: "JPYINR=X", name: "JPY/INR Spot" }
    ];

    const quotes = await Promise.all(
        symbols.map(s => yahooFinance.quote(s.yahoo))
    );

    return quotes.map((q, i) => ({
        contract: symbols[i].name,

        ltp: q.regularMarketPrice,
        previousClose: q.regularMarketPreviousClose,
        change: q.regularMarketChange,
        change_percent: q.regularMarketChangePercent,

        marketState: q.marketState,
        timestamp: q.regularMarketTime
    }));
}

app.get('/api/currency-snapshot', async (req, res) => {
    try {
        const data = await fetchLiveCurrencySnapshot();
        res.json(data);
    } catch (error) {
        console.error('Error in /api/currency-snapshot:', error.message);
        res.status(500).json({ error: 'Failed to fetch currency snapshot' });
    }
});

app.listen(PORT, () => {
    console.log(`NSE Backend service running on http://localhost:${PORT}`);
});