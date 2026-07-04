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
async function fetchMovers(indexType) {
    const baseResponse = await axios.get("https://www.nseindia.com", { headers: HEADERS });
    let cookieString = '';
    if (baseResponse.headers['set-cookie']) {
        cookieString = baseResponse.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
    }

    const reqHeaders = { ...HEADERS, "Cookie": cookieString };
    const url = `https://www.nseindia.com/api/live-analysis-variations?index=${indexType}`;
    const response = await axios.get(url, { headers: reqHeaders });
    
    const categoryOrder = [
        'NIFTY',
        'BANKNIFTY',
        'NIFTYNEXT50',
        'SecGtr20',
        'SecLwr20',
        'FOSec',
        'allSec'
    ];

    let moversData = [];
    for (const category of categoryOrder) {
        const categoryData = response.data[category];
        if (categoryData && Array.isArray(categoryData.data) && categoryData.data.length > 0) {
            moversData = categoryData.data;
            console.log(`Using ${category} category for ${indexType}`);
            break;
        }
    }

    if (!moversData.length && Array.isArray(response.data.data) && response.data.data.length > 0) {
        moversData = response.data.data;
    }

    const dataList = moversData.slice(0, 7);
    const mappedStocks = [];
    
    for (const stock of dataList) {
        let chartPoints = [];
        try {
            // Attempt 1: Real NSE Data
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
            // Attempt 2: Real Yahoo Finance Fallback
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

// Endpoint 1: Gainers
app.get('/api/gainers', async (req, res) => {
    try {
        const data = await fetchMovers('gainers');
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to collect real-time data" });
    }
});

// Endpoint 2: Losers (Using NSE's typo 'loosers')
app.get('/api/losers', async (req, res) => {
    try {
        const data = await fetchMovers('loosers');
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to collect real-time data" });
    }
});

app.listen(PORT, () => {
    console.log(`NSE Backend service running on http://localhost:${PORT}`);
});