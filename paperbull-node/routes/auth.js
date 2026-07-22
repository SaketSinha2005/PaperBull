const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const router = express.Router();
const pool = require("../db");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:4321";

// POST /api/signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName } = req.body;

    if (!email || !password || !firstName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if email already exists
    const existing = await pool.query(
      "SELECT id FROM user_auth WHERE email=$1",
      [email],
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Insert into user_auth
    const authResult = await pool.query(
      `INSERT INTO user_auth(email,password_hash)
       VALUES($1,$2)
       RETURNING id`,
      [email, passwordHash],
    );

    const authId = authResult.rows[0].id;

    // Insert into users
    const userResult = await pool.query(
      `INSERT INTO users(auth_id,firstName)
       VALUES($1,$2)
       RETURNING *`,
      [authId, firstName],
    );

    return res.json({
      success: true,
      user: {
        id: userResult.rows[0].id,
        fullName: userResult.rows[0].display_name,
        email,
        balance: Number(userResult.rows[0].virtual_balance),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// POST /api/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT
          ua.id,
          ua.email,
          ua.password_hash,
          u.display_name,
          u.virtual_balance
       FROM user_auth ua
       JOIN users u
       ON ua.id=u.auth_id
       WHERE ua.email=$1`,
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    await pool.query("UPDATE user_auth SET last_login=NOW() WHERE id=$1", [
      user.id,
    ]);

    res.json({
      success: true,
      user: {
        fullName: user.display_name,
        email: user.email,
        balance: Number(user.virtual_balance),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// GET /api/auth/google — kick off the Google OAuth flow
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

// GET /api/auth/google/callback — Google redirects here after consent
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${FRONTEND_URL}/?error=google_auth_failed`,
  }),
  (req, res) => {
    // req.user was set by the GoogleStrategy verify callback in config/passport.js
    const payload = Buffer.from(JSON.stringify(req.user)).toString("base64");
    res.redirect(
      `${FRONTEND_URL}/auth/callback.html?u=${encodeURIComponent(payload)}`,
    );
  },
);

module.exports = router;
