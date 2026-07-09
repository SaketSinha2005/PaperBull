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

        let result = await pool.query(
          `SELECT ua.id, ua.email, u.display_name, u.virtual_balance
           FROM user_auth ua
           JOIN users u ON ua.id = u.auth_id
           WHERE ua.google_id = $1`,
          [googleId],
        );

        if (result.rows.length === 0) {
          const existing = await pool.query(
            `SELECT ua.id, ua.email, u.display_name, u.virtual_balance
             FROM user_auth ua
             JOIN users u ON ua.id = u.auth_id
             WHERE ua.email = $1`,
            [email],
          );

          if (existing.rows.length > 0) {
            await pool.query(
              "UPDATE user_auth SET google_id=$1 WHERE id=$2",
              [googleId, existing.rows[0].id],
            );
            result = existing;
          } else {
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
