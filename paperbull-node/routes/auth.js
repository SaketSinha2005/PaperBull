// routes/auth.js — /api/signup and /api/login
// Mirrors the Python FastAPI auth endpoints, ported to Express + pg.

const express = require("express");
const bcrypt  = require("bcrypt");
const pool    = require("../db");

const router = express.Router();
const SALT_ROUNDS = 10;

// ─── POST /api/signup ─────────────────────────────────────────────────────────
// Body: { display_name, email, password }
router.post("/signup", async (req, res) => {
  const { display_name, email, password } = req.body;

  if (!display_name || !email || !password) {
    return res.status(400).json({ error: "display_name, email, and password are required." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Check if email already exists
    const existing = await client.query(
      "SELECT id FROM user_auth WHERE email = $1",
      [email]
    );
    if (existing.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "Email already registered." });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert into user_auth — RETURNING id replaces lastInsertId / lastrowid
    const authResult = await client.query(
      "INSERT INTO user_auth (email, password_hash) VALUES ($1, $2) RETURNING id",
      [email, password_hash]
    );
    const auth_id = authResult.rows[0].id;

    // Insert into users (profile)
    await client.query(
      "INSERT INTO users (auth_id, display_name) VALUES ($1, $2)",
      [auth_id, display_name]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: { email, display_name },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Signup error:", err.message);
    return res.status(500).json({ error: "Internal server error." });
  } finally {
    client.release();
  }
});

// ─── POST /api/login ──────────────────────────────────────────────────────────
// Body: { email, password }
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required." });
  }

  const client = await pool.connect();
  try {
    // Fetch auth record
    const authResult = await client.query(
      "SELECT id, password_hash FROM user_auth WHERE email = $1",
      [email]
    );
    if (authResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const authRow = authResult.rows[0];

    // Verify password
    const valid = await bcrypt.compare(password, authRow.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Update last_login — PostgreSQL uses NOW() just like MySQL
    await client.query(
      "UPDATE user_auth SET last_login = NOW() WHERE id = $1",
      [authRow.id]
    );

    // Fetch user profile
    const userResult = await client.query(
      `SELECT display_name, virtual_balance, portfolio_value,
              realized_pnl, total_trades
       FROM users WHERE auth_id = $1`,
      [authRow.id]
    );
    const userRow = userResult.rows[0];

    return res.json({
      success: true,
      message: "Login successful.",
      user: {
        email,
        display_name:    userRow.display_name,
        virtual_balance: parseFloat(userRow.virtual_balance),
        portfolio_value: parseFloat(userRow.portfolio_value),
        realized_pnl:    parseFloat(userRow.realized_pnl),
        total_trades:    userRow.total_trades,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ error: "Internal server error." });
  } finally {
    client.release();
  }
});

module.exports = router;
