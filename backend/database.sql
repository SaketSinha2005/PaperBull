-- ============================================================
--  PaperBull — Database Setup
--  Run this file once to create the database and tables.
--
--  How to run:
--    mysql -u root -p < database.sql
--  Or paste it inside MySQL Workbench / phpMyAdmin.
-- ============================================================

CREATE DATABASE IF NOT EXISTS paperbull;
USE paperbull;

CREATE TABLE IF NOT EXISTS user_auth (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auth_id INT NOT NULL UNIQUE,
    display_name VARCHAR(100),
    profile_picture VARCHAR(255),
    virtual_balance DECIMAL(15,2) DEFAULT 100000.00,
    portfolio_value DECIMAL(15,2) DEFAULT 0.00,
    realized_pnl DECIMAL(15,2) DEFAULT 0.00,
    total_trades INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_auth
    FOREIGN KEY (auth_id)
    REFERENCES user_auth(id)
    ON DELETE CASCADE
);
