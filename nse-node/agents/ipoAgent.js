// nse-node/agents/ipoAgent.js
const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

console.log("Checking API Key:", process.env.GEMINI_API_KEY ? "✅ Found it!" : "❌ MISSING!");

const CACHE = path.join(__dirname, "ipoCache.json");

// Initialize the Gemini client (make sure GEMINI_API_KEY is in your .env file)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// JSON schema Gemini will be forced to conform to (Structured Outputs).
// Gemini's schema support is a subset of OpenAPI/JSON Schema — no
// "additionalProperties", but object/array/string/required all work
// the same way as the old OpenAI schema did.
const ipoListSchema = {
    type: "object",
    properties: {
        ipos: {
            type: "array",
            description: "List of upcoming or recently listed IPOs",
            items: {
                type: "object",
                properties: {
                    company: { type: "string", description: "Name of the company (e.g., 'XYZ Ltd')" },
                    status: { type: "string", description: "Either 'Upcoming' or 'Listed'" },
                    expected: { type: "string", description: "Date format (e.g., '17 Jul' or 'Opens 20 Jul')" },
                    gmp: { type: "string", description: "Grey Market Premium percentage (e.g., '+18%' or '0%')" },
                    why_it_matters: { type: "string", description: "One concise sentence on why this IPO is notable" }
                },
                required: ["company", "status", "expected", "gmp", "why_it_matters"]
            }
        }
    },
    required: ["ipos"]
};

async function callAgentOnce() {
    const start = Date.now();
    console.log("  → calling Gemini (googleSearch + gemini 3.1 flash lite)...");
    // Gemini 3 models can combine Grounding with Google Search and
    // Structured Outputs (responseSchema) in the same call, so we get
    // live web results back already shaped into our JSON schema.
    const response = await ai.models.generateContent({
        model: "gemini-3.1 flash lite",
        contents: `Search the internet for the 5-6 most important upcoming or recently listed IPOs in the Indian Stock Market (NSE/BSE) right now.
        Analyze the data and provide a concise summary for each.
        Do not include markdown links, citation markers, or source URLs anywhere in the output — plain text only.`,
        config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: ipoListSchema
        }
    });

    const rawText = response.text;

    if (!rawText) {
        throw new Error("No text in Gemini response");
    }

    const parsed = JSON.parse(rawText); // throws if truncated/malformed
    if (!Array.isArray(parsed.ipos)) {
        throw new Error("Response JSON did not contain an 'ipos' array");
    }
    console.log(`  ✔ got response in ${Date.now() - start}ms`);

    // Safety net: the prompt asks the model to skip citations, but
    // Google Search grounding sometimes still inlines them as
    // "([source](url?utm_source=...))". Strip any markdown links that
    // slip through so the UI never shows raw markdown/URLs in the
    // "why it matters" cell.
    const stripCitations = (text) =>
        text.replace(/\s*\(\[[^\]]*\]\([^)]*\)\)/g, "").trim();

    return parsed.ipos.map(ipo => ({
        ...ipo,
        why_it_matters: stripCitations(ipo.why_it_matters)
    }));
}

async function updateIPOData() {
    console.log("Agent started: Fetching latest IPO data...");

    // One retry: this call combo (googleSearch + strict schema) occasionally
    // returns malformed/truncated JSON, so a single retry avoids leaving
    // the cache stale over a one-off blip.
    for (let attempt = 1; attempt <= 2; attempt++) {
        try {
            const ipoData = await callAgentOnce();
            fs.writeFileSync(CACHE, JSON.stringify(ipoData, null, 2));
            console.log("✅ IPO cache successfully updated by Agent.");
            return;
        } catch (error) {
            console.error(`❌ Agent attempt ${attempt} failed:`, error.message);
            // error.message alone often hides the real cause (auth, bad model,
            // no billing/access) — log the SDK's status/code when present.
            if (error.status || error.code) {
                console.error(`   details → status: ${error.status}, code: ${error.code}`);
            }
            if (attempt === 2) {
                console.error("❌ Giving up for this cycle; keeping existing cache (if any).");
            }
        }
    }
}

function getIPOData() {
    if (!fs.existsSync(CACHE)) return [];

    try {
        const rawData = fs.readFileSync(CACHE, 'utf8');
        // If the file is empty, return an empty array instead of crashing
        if (!rawData.trim()) return [];
        return JSON.parse(rawData);
    } catch (error) {
        console.error("❌ Error reading IPO cache:", error.message);
        return []; // Return empty array so the frontend doesn't get a 500 error
    }
}

module.exports = { updateIPOData, getIPOData };