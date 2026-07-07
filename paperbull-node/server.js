require("dotenv").config();

const express = require("express");
const cors    = require("cors");

const authRoutes   = require("./routes/auth");
const marketRoutes = require("./routes/market");

const app  = express();
const PORT = process.env.PORT || 8000;

app.use(cors());                        
app.use(express.json());             

app.use("/api", authRoutes);            
app.use("/api", marketRoutes);   

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`🚀  PaperBull backend running at http://localhost:${PORT}`);
});
