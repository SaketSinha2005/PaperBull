// nse-node/agents/ipoAgent.js
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

console.log("Checking API Key:", process.env.OPENAI_API_KEY ? "✅ Found it!" : "❌ MISSING!");

const CACHE = path.join(__dirname, "ipoCache.json");

// Initialize the OpenAI client (make sure OPENAI_API_KEY is in your .env file)
// timeout: fail loudly instead of hanging forever if the network/proxy blocks api.openai.com
// maxRetries: let the SDK handle transient 429/5xx itself
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30 * 1000,
    maxRetries: 2
});

// JSON schema OpenAI will be forced to conform to (Structured Outputs)
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
                required: ["company", "status", "expected", "gmp", "why_it_matters"],
                additionalProperties: false
            }
        }
    },
    required: ["ipos"],
    additionalProperties: false
};

async function callAgentOnce() {
    const start = Date.now();
    console.log("  → calling OpenAI Responses API (web_search + gpt-5.5)...");
    const response = await openai.responses.create({
        model: "gpt-5.5",
        tools: [{ type: "web_search" }],
        input: `Search the internet for the 5-6 most important upcoming or recently listed IPOs in the Indian Stock Market (NSE/BSE) right now.
        Analyze the data and provide a concise summary for each.
        Do not include markdown links, citation markers, or source URLs anywhere in the output — plain text only.`,
        text: {
            format: {
                type: "json_schema",
                name: "ipo_list",
                schema: ipoListSchema,
                strict: true
            }
        }
    });

    // Web search + strict JSON schema can occasionally return an
    // incomplete/truncated text block, so pull it out explicitly and
    // check status rather than trusting response.output_text blindly.
    const message = response.output?.find(item => item.type === "message");
    const textBlock = message?.content?.find(c => c.type === "output_text");
    const rawText = textBlock?.text ?? response.output_text;

    if (!rawText) {
        throw new Error("No output_text in response (status: " + response.status + ")");
    }

    const parsed = JSON.parse(rawText); // throws if truncated/malformed
    if (!Array.isArray(parsed.ipos)) {
        throw new Error("Response JSON did not contain an 'ipos' array");
    }
    console.log(`  ✔ got response in ${Date.now() - start}ms`);

    // Safety net: the prompt asks the model to skip citations, but web_search
    // sometimes still inlines them as "([source](url?utm_source=openai))".
    // Strip any markdown links that slip through so the UI never shows raw
    // markdown/URLs in the "why it matters" cell.
    const stripCitations = (text) =>
        text.replace(/\s*\(\[[^\]]*\]\([^)]*\)\)/g, "").trim();

    return parsed.ipos.map(ipo => ({
        ...ipo,
        why_it_matters: stripCitations(ipo.why_it_matters)
    }));
}

async function updateIPOData() {
    console.log("Agent started: Fetching latest IPO data...");

    // One retry: this call combo (web_search + strict schema) occasionally
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
            // no billing/access) — log the SDK's status/code/type when present.
            if (error.status || error.code || error.type) {
                console.error(`   details → status: ${error.status}, code: ${error.code}, type: ${error.type}`);
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