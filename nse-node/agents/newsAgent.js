const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Same pattern as ipoAgent.js: in-memory cache backed by a JSON file on disk,
// refreshed on a timer, so /api/news never has to block on a live Gemini call.
const CACHE_PATH = path.join(__dirname, 'newsCache.json');
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

let cachedNews = loadCacheFromDisk();

function loadCacheFromDisk() {
    try {
        const raw = fs.readFileSync(CACHE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveCacheToDisk(data) {
    try {
        fs.writeFileSync(CACHE_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('[newsAgent] Failed to write newsCache.json:', err.message);
    }
}

// Strips ```json fences etc. in case the model wraps its output despite instructions
function extractJsonArray(text) {
    if (!text) return null;
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidate = fenced ? fenced[1] : text;
    const start = candidate.indexOf('[');
    const end = candidate.lastIndexOf(']');
    if (start === -1 || end === -1 || end < start) return null;
    try {
        return JSON.parse(candidate.slice(start, end + 1));
    } catch {
        return null;
    }
}

async function fetchLiveMarketNews() {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set in .env');
    }

    const prompt = `You are the news feed for "PaperBull", an Indian stock market paper-trading dashboard.
Use Google Search to find the 6 most recent REAL news headlines (published within the last few hours,
newest first) relevant to Indian equity traders: NSE/BSE moves, RBI policy, major listed-company news,
IPOs, or macro news that affects Indian markets. Only reputable sources (Economic Times, Moneycontrol,
Live Mint, Business Standard, NDTV Profit, Financial Express, Reuters, Bloomberg, CNBC-TV18, etc).

Respond with ONLY a raw JSON array (no markdown fences, no commentary) of exactly 6 objects, each with:
- "headline": the real headline, faithfully short-paraphrased if needed, under 100 characters
- "source": the actual publication name
- "time_ago": relative time like "12m ago", "1h ago", "3h ago"
- "url": the real article URL you found via search

Do not invent or hallucinate any article. Every item must come from an actual search result.`;

    const response = await axios.post(
        GEMINI_API_URL,
        {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            tools: [{ google_search: {} }],
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': process.env.GEMINI_API_KEY,
            },
            timeout: 60000,
        }
    );

    const candidate = response.data && response.data.candidates && response.data.candidates[0];
    const outputText =
        candidate && candidate.content && candidate.content.parts
            ? candidate.content.parts.map((p) => p.text || '').join('')
            : '';

    const items = extractJsonArray(outputText);

    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Gemini did not return a parseable news array');
    }

    return items
        .filter((item) => item && item.headline && item.source)
        .slice(0, 6)
        .map((item) => ({
            headline: String(item.headline).trim(),
            source: String(item.source).trim(),
            time_ago: item.time_ago ? String(item.time_ago).trim() : '',
            url: item.url ? String(item.url).trim() : '',
        }));
}

async function updateNewsData() {
    try {
        const freshNews = await fetchLiveMarketNews();
        cachedNews = freshNews;
        saveCacheToDisk(cachedNews);
        console.log(`[newsAgent] Refreshed ${cachedNews.length} news items via Gemini`);
    } catch (err) {
        console.error('[newsAgent] Failed to refresh news:', err.response?.data?.error?.message || err.message);
        // Keep serving the last good cache instead of wiping it out
    }
}

function getNewsData() {
    return cachedNews;
}

// Kick off the refresh loop once the module is required
setInterval(updateNewsData, REFRESH_INTERVAL_MS);

module.exports = { getNewsData, updateNewsData };