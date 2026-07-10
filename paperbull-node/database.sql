CREATE TABLE IF NOT EXISTS user_auth (
    id                SERIAL PRIMARY KEY,
    email             VARCHAR(255)    NOT NULL UNIQUE,
    password_hash     VARCHAR(255),
    google_id         VARCHAR(255)    UNIQUE,
    email_verified    BOOLEAN         DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token       VARCHAR(255),
    last_login        TIMESTAMP,
    created_at        TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE user_auth ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE user_auth ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;

CREATE TABLE IF NOT EXISTS users (
    id               SERIAL PRIMARY KEY,
    auth_id          INTEGER         NOT NULL UNIQUE,
    display_name     VARCHAR(100),
    profile_picture  VARCHAR(255),
    virtual_balance  NUMERIC(15, 2)  DEFAULT 100000.00,
    portfolio_value  NUMERIC(15, 2)  DEFAULT 0.00,
    realized_pnl     NUMERIC(15, 2)  DEFAULT 0.00,
    total_trades     INTEGER         DEFAULT 0,
    created_at       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_auth
        FOREIGN KEY (auth_id)
        REFERENCES user_auth(id)
        ON DELETE CASCADE
);
