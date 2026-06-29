from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import yfinance as yf
import requests
import numpy as np
import mysql.connector
import bcrypt
import os

# ─── Database config ──────────────────────────────────────────────────────────
# Change these values to match your MySQL setup, or set them as environment
# variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME).
DB_CONFIG = {
    "host":     os.getenv("DB_HOST",     "localhost"),
    "user":     os.getenv("DB_USER",     "root"),
    "password": os.getenv("DB_PASSWORD", "Ninja@Hattori"),
    "database": os.getenv("DB_NAME",     "paperbull"),
}

def get_db():
    """Return a fresh MySQL connection."""
    return mysql.connector.connect(**DB_CONFIG)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Auth schemas ──────────────────────────────────────────────────────────────
class SignupRequest(BaseModel):
    display_name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str


# ─── Auth endpoints ────────────────────────────────────────────────────────────
@app.post("/api/signup")
def signup(body: SignupRequest):
    """Register a new user and create their profile row."""
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    try:
        # Check if email already exists
        cursor.execute("SELECT id FROM user_auth WHERE email = %s", (body.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=409, detail="Email already registered.")

        # Hash password
        pw_hash = bcrypt.hashpw(body.password.encode(), bcrypt.gensalt()).decode()

        # Insert into user_auth
        cursor.execute(
            "INSERT INTO user_auth (email, password_hash) VALUES (%s, %s)",
            (body.email, pw_hash)
        )
        auth_id = cursor.lastrowid

        # Insert into users (profile)
        cursor.execute(
            "INSERT INTO users (auth_id, display_name) VALUES (%s, %s)",
            (auth_id, body.display_name)
        )
        conn.commit()

        return {
            "success": True,
            "message": "Account created successfully.",
            "user": {
                "email": body.email,
                "display_name": body.display_name,
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()


@app.post("/api/login")
def login(body: LoginRequest):
    """Verify credentials and return user info."""
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    try:
        # Fetch auth record
        cursor.execute(
            "SELECT id, password_hash FROM user_auth WHERE email = %s",
            (body.email,)
        )
        auth_row = cursor.fetchone()
        if not auth_row:
            raise HTTPException(status_code=401, detail="Invalid email or password.")

        # Verify password
        if not bcrypt.checkpw(body.password.encode(), auth_row["password_hash"].encode()):
            raise HTTPException(status_code=401, detail="Invalid email or password.")

        # Update last_login
        cursor.execute(
            "UPDATE user_auth SET last_login = NOW() WHERE id = %s",
            (auth_row["id"],)
        )

        # Fetch user profile
        cursor.execute(
            "SELECT display_name, virtual_balance, portfolio_value, realized_pnl, total_trades "
            "FROM users WHERE auth_id = %s",
            (auth_row["id"],)
        )
        user_row = cursor.fetchone()
        conn.commit()

        return {
            "success": True,
            "message": "Login successful.",
            "user": {
                "email": body.email,
                "display_name": user_row["display_name"],
                "virtual_balance": float(user_row["virtual_balance"]),
                "portfolio_value": float(user_row["portfolio_value"]),
                "realized_pnl": float(user_row["realized_pnl"]),
                "total_trades": user_row["total_trades"],
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()


# ─── Existing market-data endpoints (unchanged) ────────────────────────────────
TICKERS = {
    "^NSEI": "NIFTY 50",
    "^NSEBANK": "NIFTY BANK",
    "NIFTY_FIN_SERVICE.NS": "NIFTY FIN SERVICE",
    "^CNXIT":"NIFTY IT",
    "NIFTY_MIDCAP_100.NS": "NIFTY MIDCAP 100",
    "^CNXSC": "NIFTY SMLCAP 100",
    "^CNX100": "NIFTY 100"
}

@app.get("/api/live-indices")
def get_live_indices():
    results = []

    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    })

    for symbol, name in TICKERS.items():
        try:
            ticker = yf.Ticker(symbol, session=session)
            hist = ticker.history(period="5d")

            if hist.empty or len(hist) < 1:
                continue

            close_array = hist['Close'].values.flatten()
            open_array = hist['Open'].values.flatten()

            close_prices = close_array[~np.isnan(close_array)].tolist()
            open_prices = open_array[~np.isnan(open_array)].tolist()

            if len(close_prices) < 1:
                continue

            if len(close_prices) >= 2:
                current_price = float(close_prices[-1])
                prev_price = float(close_prices[-2])
            else:
                current_price = float(close_prices[0])
                if len(open_prices) >= 1:
                    prev_price = float(open_prices[-1])
                else:
                    continue

            change_val = current_price - prev_price
            change_pct = (change_val / prev_price) * 100
            sign = "+" if change_pct >= 0 else ""

            results.append({
                "sym": name,
                "price": round(current_price, 2),
                "chg": f"{sign}{change_pct:.2f}%",
                "is_up": change_pct >= 0
            })
        except Exception as e:
            print(f"Error processing {symbol}: {e}")
            continue

    return results


@app.get("/api/chart/{symbol}")
def get_chart_data(symbol: str):
    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    })

    try:
        ticker = yf.Ticker(symbol, session=session)
        hist = ticker.history(period="5d", interval="5m")

        if hist.empty:
            return {"candles": [], "price": 0, "change": 0, "is_up": True}

        all_hist = hist

        last_date = hist.index[-1].date()
        hist = hist[hist.index.date == last_date]

        candles = []
        for timestamp, row in hist.iterrows():
            candles.append({
                "time": timestamp.strftime('%H:%M'),
                "open": float(row['Open']),
                "high": float(row['High']),
                "low": float(row['Low']),
                "close": float(row['Close'])
            })

        current_price = candles[-1]['close']
        try:
            current_price = float(ticker.fast_info.get("last_price") or current_price)
        except Exception:
            pass

        prior_data = all_hist[all_hist.index.date < last_date]
        if not prior_data.empty:
            prev_close = float(prior_data.iloc[-1]['Close'])
        else:
            prev_close = float(candles[0]['open'])
            if prev_close == 0:
                prev_close = float(candles[0]['close'])

        change_pct = ((current_price - prev_close) / prev_close) * 100

        return {
            "candles": candles,
            "price": round(current_price, 2),
            "change": round(change_pct, 2),
            "is_up": change_pct >= 0
        }
    except Exception as e:
        print(f"Error fetching chart for {symbol}: {e}")
        return {"candles": [], "price": 0, "change": 0, "is_up": True}
