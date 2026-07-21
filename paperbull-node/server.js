require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const passport = require("./config/passport");

const authRoutes      = require("./routes/auth");
const portfolioRoutes = require("./routes/portfolio");
const pool             = require("./db");
const { startIntradaySquareOffJob } = require("./intradaySquareOff");

const app  = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/api", authRoutes);
app.use("/api/portfolio", portfolioRoutes);


app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`🚀  PaperBull backend running at http://localhost:${PORT}`);
  startIntradaySquareOffJob(pool);
  console.log("🕒  Intraday (MIS) auto square-off job started");
});
