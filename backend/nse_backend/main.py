from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import requests
import numpy as np  

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
)

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

            # CRITICAL FIX: Bypass pandas entirely. 
            # Grab the underlying numpy array and forcefully flatten any nested structures.
            close_array = hist['Close'].values.flatten()
            open_array = hist['Open'].values.flatten()
            
            # Filter out any 'NaN' (Not a Number) values mathematically
            close_prices = close_array[~np.isnan(close_array)].tolist()
            open_prices = open_array[~np.isnan(open_array)].tolist()

            if len(close_prices) < 1:
                continue
            
            # Calculate prices using pure, flattened floats
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
        # Use a 5-day lookback so it never fails on weekends, and 5m intervals for stability
        hist = ticker.history(period="5d", interval="5m")
        
        if hist.empty:
            return {"candles": [], "price": 0, "change": 0, "is_up": True}

        all_hist = hist

        # Isolate ONLY the most recent trading day
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
