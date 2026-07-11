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

-- One row per (user, symbol) currently held. Qty/avg_price are kept up to
-- date server-side every time a buy/sell order is placed.
CREATE TABLE IF NOT EXISTS holdings (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER         NOT NULL,
    symbol      VARCHAR(50)     NOT NULL,
    name        VARCHAR(150),
    qty         NUMERIC(15, 4)  NOT NULL DEFAULT 0,
    avg_price   NUMERIC(15, 2)  NOT NULL DEFAULT 0,
    updated_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_holdings_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_holdings_user_symbol UNIQUE (user_id, symbol)
);

-- Append-only log of every executed buy/sell, used to power the
-- "Recent Buy / Sell Activity" list and to recompute realized P&L.
CREATE TABLE IF NOT EXISTS orders (
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER         NOT NULL,
    symbol        VARCHAR(50)     NOT NULL,
    name          VARCHAR(150),
    side          VARCHAR(4)      NOT NULL CHECK (side IN ('buy', 'sell')),
    order_type    VARCHAR(30)     DEFAULT 'Market',
    product       VARCHAR(30)     DEFAULT 'Delivery',
    qty           NUMERIC(15, 4)  NOT NULL,
    price         NUMERIC(15, 2)  NOT NULL,
    amount        NUMERIC(15, 2)  NOT NULL,
    realized_pnl  NUMERIC(15, 2)  DEFAULT 0,
    created_at    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_holdings_user ON holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at DESC);
