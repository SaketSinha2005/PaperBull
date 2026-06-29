// server.js — PaperBull Express server
// Drop-in replacement for the Python FastAPI backend.
// Exposes the same API surface so the existing frontend needs zero changes.

require("dotenv").config();

const express = require("express");
const cors    = require("cors");

const authRoutes   = require("./routes/auth");
const marketRoutes = require("./routes/market");

const app  = express();
const PORT = process.env.PORT || 8000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());                        // allow all origins (mirrors Python allow_origins=["*"])
app.use(express.json());                // parse JSON request bodies

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api", authRoutes);            // POST /api/signup, POST /api/login
app.use("/api", marketRoutes);          // GET  /api/live-indices, GET /api/chart/:symbol

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ─── 404 fallback ─────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  PaperBull backend running at http://localhost:${PORT}`);
});
