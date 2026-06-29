// db.js — PostgreSQL connection pool
// Uses the "pg" library's Pool for efficient connection reuse.

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host:     process.env.DB_HOST     || "localhost",
  port:     parseInt(process.env.DB_PORT || "5432"),
  user:     process.env.DB_USER     || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME     || "paperbull",
});

// Verify connectivity on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌  Failed to connect to PostgreSQL:", err.message);
  } else {
    console.log("✅  Connected to PostgreSQL database:", process.env.DB_NAME || "paperbull");
    release();
  }
});

module.exports = pool;
