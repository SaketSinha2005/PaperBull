// nse-node/agents/test-ipo-agent.js
// Run this directly to debug the IPO agent in isolation:
//   node agents/test-ipo-agent.js
// It bypasses the rest of the server so you can see exactly what
// Gemini returns (or exactly why it's failing/hanging).

const { updateIPOData, getIPOData } = require('./ipoAgent');

(async () => {
    console.log("Running IPO agent standalone test...\n");
    await updateIPOData();
    console.log("\nCurrent cache contents:");
    console.log(JSON.stringify(getIPOData(), null, 2));
    process.exit(0);
})();