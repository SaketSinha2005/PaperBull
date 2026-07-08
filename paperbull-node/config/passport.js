// config/passport.js — Google OAuth 2.0 strategy setup for Passport.js
// This runs alongside the existing email/password auth in routes/auth.js
// without touching it.

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("../db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:8000/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email =
          profile.emails && profile.emails[0] && profile.emails[0].value;
        const displayName = profile.displayName || "";

        if (!email) {
          return done(null, false, {
            message: "Google account has no accessible email address.",
          });
        }

        // 1. Look for an account already linked to this Google ID
        let result = await pool.query(
          `SELECT ua.id, ua.email, u.display_name, u.virtual_balance
           FROM user_auth ua
           JOIN users u ON ua.id = u.auth_id
           WHERE ua.google_id = $1`,
          [googleId],
        );

        if (result.rows.length === 0) {
          // 2. Otherwise, see if an email/password account with this email exists
          const existing = await pool.query(
            `SELECT ua.id, ua.email, u.display_name, u.virtual_balance
             FROM user_auth ua
             JOIN users u ON ua.id = u.auth_id
             WHERE ua.email = $1`,
            [email],
          );

          if (existing.rows.length > 0) {
            // Link the Google ID to the existing account
            await pool.query(
              "UPDATE user_auth SET google_id=$1 WHERE id=$2",
              [googleId, existing.rows[0].id],
            );
            result = existing;
          } else {
            // 3. Brand-new user signing up via Google
            const authResult = await pool.query(
              `INSERT INTO user_auth(email, google_id)
               VALUES($1,$2)
               RETURNING id`,
              [email, googleId],
            );
            const authId = authResult.rows[0].id;

            const userResult = await pool.query(
              `INSERT INTO users(auth_id, display_name)
               VALUES($1,$2)
               RETURNING *`,
              [authId, displayName],
            );

            result = {
              rows: [
                {
                  id: authId,
                  email,
                  display_name: userResult.rows[0].display_name,
                  virtual_balance: userResult.rows[0].virtual_balance,
                },
              ],
            };
          }
        }

        const row = result.rows[0];

        await pool.query("UPDATE user_auth SET last_login=NOW() WHERE id=$1", [
          row.id,
        ]);

        return done(null, {
          fullName: row.display_name,
          email: row.email,
          balance: Number(row.virtual_balance),
        });
      } catch (err) {
        return done(err);
      }
    },
  ),
);

module.exports = passport;
