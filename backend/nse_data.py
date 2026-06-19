import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Optional

try:
    from nsepython import nse_eq, nse_optionchain_scrapper, nsetools_get_quote
except Exception:
    # nsepython import can fail in some envs — handled gracefully below
    nse_eq = None
    nse_optionchain_scrapper = None


def get_quote(symbol: str) -> dict:

    symbol = symbol.upper().strip()

    # --- Primary: nsepython ---
    if nse_eq is not None:
        try:
            data = nse_eq(symbol)
            price_data = data.get("priceInfo", {})
            meta = data.get("metadata", {})
            industry = data.get("industryInfo", {})

            ltp = float(price_data.get("lastPrice", 0))
            prev_close = float(price_data.get("previousClose", ltp))
            change = round(ltp - prev_close, 2)
            change_pct = round((change / prev_close) * 100, 2) if prev_close else 0

            return {
                "symbol": symbol,
                "name": meta.get("companyName", symbol),
                "price": ltp,
                "change": change,
                "change_pct": change_pct,
                "open": float(price_data.get("open", 0)),
                "high": float(price_data.get("intraDayHighLow", {}).get("max", 0)),
                "low": float(price_data.get("intraDayHighLow", {}).get("min", 0)),
                "prev_close": prev_close,
                "volume": int(data.get("securityWiseDP", {}).get("quantityTraded", 0)),
                "week_52_high": float(price_data.get("weekHighLow", {}).get("max", 0)),
                "week_52_low": float(price_data.get("weekHighLow", {}).get("min", 0)),
                "market_cap": None,  # not in nsepython free data
                "pe": None,
                "sector": industry.get("macro", ""),
                "source": "nsepython",
                "timestamp": datetime.now().isoformat(),
            }
        except Exception as e:
            print(f"[nse_eq] failed for {symbol}: {e} — falling back to yfinance")

    return _yf_quote(symbol)


def _yf_quote(symbol: str) -> dict:
    ticker = yf.Ticker(f"{symbol}.NS")
    info = ticker.info

    price = info.get("currentPrice") or info.get("regularMarketPrice", 0)
    prev_close = info.get("previousClose", price)
    change = round(price - prev_close, 2)
    change_pct = round((change / prev_close) * 100, 2) if prev_close else 0

    return {
        "symbol": symbol,
        "name": info.get("longName", symbol),
        "price": price,
        "change": change,
        "change_pct": change_pct,
        "open": info.get("open", 0),
        "high": info.get("dayHigh", 0),
        "low": info.get("dayLow", 0),
        "prev_close": prev_close,
        "volume": info.get("volume", 0),
        "week_52_high": info.get("fiftyTwoWeekHigh", 0),
        "week_52_low": info.get("fiftyTwoWeekLow", 0),
        "market_cap": info.get("marketCap"),
        "pe": info.get("trailingPE"),
        "sector": info.get("sector", ""),
        "source": "yfinance",
        "timestamp": datetime.now().isoformat(),
    }


INTERVAL_MAP = {
    "1m":  ("1d",  "1m"),    # 1-min candles, last 1 day
    "5m":  ("5d",  "5m"),    # 5-min candles, last 5 days
    "15m": ("5d",  "15m"),
    "1h":  ("1mo", "1h"),
    "1d":  ("1y",  "1d"),
    "1w":  ("5y",  "1wk"),
}


def get_ohlcv(symbol: str, interval: str = "1d") -> list[dict]:

    symbol = symbol.upper().strip()
    period, yf_interval = INTERVAL_MAP.get(interval, ("1y", "1d"))

    ticker = yf.Ticker(f"{symbol}.NS")
    df = ticker.history(period=period, interval=yf_interval)

    if df.empty:
        return []

    df.index = pd.to_datetime(df.index)
    candles = []
    for ts, row in df.iterrows():
        candles.append({
            "time": int(ts.timestamp()) if interval in ("1m", "5m", "15m", "1h") else ts.strftime("%Y-%m-%d"),
            "open":   round(float(row["Open"]),   2),
            "high":   round(float(row["High"]),   2),
            "low":    round(float(row["Low"]),    2),
            "close":  round(float(row["Close"]),  2),
            "volume": int(row["Volume"]),
        })

    return candles



def get_options_chain(symbol: str) -> dict:

    symbol = symbol.upper().strip()

    # --- Primary: nsepython ---
    if nse_optionchain_scrapper is not None:
        try:
            return _nse_options_chain(symbol)
        except Exception as e:
            print(f"[nse_optionchain] failed for {symbol}: {e} — falling back to yfinance")

    return _yf_options_chain(symbol)


def _nse_options_chain(symbol: str) -> dict:
    raw = nse_optionchain_scrapper(symbol)
    records = raw["records"]
    underlying_price = float(records["underlyingValue"])
    expiries = records["expiryDates"]
    data_rows = records["data"]

    chain_map: dict = {}

    for row in data_rows:
        strike = float(row["strikePrice"])
        expiry = row["expiryDate"]
        key = (strike, expiry)

        if key not in chain_map:
            chain_map[key] = {"strike": strike, "expiry": expiry, "CE": None, "PE": None}

        if "CE" in row:
            ce = row["CE"]
            chain_map[key]["CE"] = {
                "iv":     round(float(ce.get("impliedVolatility", 0)), 2),
                "oi":     int(ce.get("openInterest", 0)),
                "volume": int(ce.get("totalTradedVolume", 0)),
                "bid":    round(float(ce.get("bidprice", 0)), 2),
                "ask":    round(float(ce.get("askPrice", 0)), 2),
                "ltp":    round(float(ce.get("lastPrice", 0)), 2),
            }

        if "PE" in row:
            pe = row["PE"]
            chain_map[key]["PE"] = {
                "iv":     round(float(pe.get("impliedVolatility", 0)), 2),
                "oi":     int(pe.get("openInterest", 0)),
                "volume": int(pe.get("totalTradedVolume", 0)),
                "bid":    round(float(pe.get("bidprice", 0)), 2),
                "ask":    round(float(pe.get("askPrice", 0)), 2),
                "ltp":    round(float(pe.get("lastPrice", 0)), 2),
            }

    # Sort by expiry then strike
    chain = sorted(chain_map.values(), key=lambda x: (x["expiry"], x["strike"]))

    return {
        "symbol": symbol,
        "expiries": expiries,
        "underlying_price": underlying_price,
        "chain": chain,
        "source": "nsepython",
        "timestamp": datetime.now().isoformat(),
    }


def _yf_options_chain(symbol: str) -> dict:
    """yfinance fallback — limited IV data but works for most symbols."""
    ticker = yf.Ticker(f"{symbol}.NS")
    expiries = ticker.options
    if not expiries:
        return {"symbol": symbol, "expiries": [], "chain": [], "underlying_price": 0}

    underlying_price = ticker.info.get("currentPrice", 0)
    chain = []

    for expiry in expiries[:3]:
        opt = ticker.option_chain(expiry)

        # Calls
        for _, row in opt.calls.iterrows():
            chain.append({
                "strike": float(row["strike"]),
                "expiry": expiry,
                "CE": {
                    "iv":     round(float(row.get("impliedVolatility", 0)) * 100, 2),
                    "oi":     int(row.get("openInterest", 0)),
                    "volume": int(row.get("volume", 0) or 0),
                    "bid":    round(float(row.get("bid", 0)), 2),
                    "ask":    round(float(row.get("ask", 0)), 2),
                    "ltp":    round(float(row.get("lastPrice", 0)), 2),
                },
                "PE": None,
            })

        put_map = {float(r["strike"]): r for _, r in opt.puts.iterrows()}
        for item in chain:
            if item["expiry"] == expiry and item["strike"] in put_map:
                row = put_map[item["strike"]]
                item["PE"] = {
                    "iv":     round(float(row.get("impliedVolatility", 0)) * 100, 2),
                    "oi":     int(row.get("openInterest", 0)),
                    "volume": int(row.get("volume", 0) or 0),
                    "bid":    round(float(row.get("bid", 0)), 2),
                    "ask":    round(float(row.get("ask", 0)), 2),
                    "ltp":    round(float(row.get("lastPrice", 0)), 2),
                }

    return {
        "symbol": symbol,
        "expiries": list(expiries[:3]),
        "underlying_price": underlying_price,
        "chain": chain,
        "source": "yfinance",
        "timestamp": datetime.now().isoformat(),
    }


NSE_POPULAR = [
    {"symbol": "RELIANCE",  "name": "Reliance Industries Ltd",        "sector": "Energy"},
    {"symbol": "TCS",       "name": "Tata Consultancy Services Ltd",   "sector": "IT"},
    {"symbol": "INFY",      "name": "Infosys Ltd",                     "sector": "IT"},
    {"symbol": "HDFCBANK",  "name": "HDFC Bank Ltd",                   "sector": "Banking"},
    {"symbol": "ICICIBANK", "name": "ICICI Bank Ltd",                  "sector": "Banking"},
    {"symbol": "WIPRO",     "name": "Wipro Ltd",                       "sector": "IT"},
    {"symbol": "BAJFINANCE","name": "Bajaj Finance Ltd",               "sector": "Finance"},
    {"symbol": "AXISBANK",  "name": "Axis Bank Ltd",                   "sector": "Banking"},
    {"symbol": "SBIN",      "name": "State Bank of India",             "sector": "Banking"},
    {"symbol": "TATAMOTORS","name": "Tata Motors Ltd",                 "sector": "Auto"},
    {"symbol": "MARUTI",    "name": "Maruti Suzuki India Ltd",         "sector": "Auto"},
    {"symbol": "NIFTY",     "name": "Nifty 50 Index",                  "sector": "Index"},
    {"symbol": "BANKNIFTY", "name": "Nifty Bank Index",                "sector": "Index"},
    {"symbol": "ADANIENT",  "name": "Adani Enterprises Ltd",           "sector": "Conglomerate"},
    {"symbol": "HINDUNILVR","name": "Hindustan Unilever Ltd",          "sector": "FMCG"},
    {"symbol": "ITC",       "name": "ITC Ltd",                         "sector": "FMCG"},
    {"symbol": "KOTAKBANK", "name": "Kotak Mahindra Bank Ltd",         "sector": "Banking"},
    {"symbol": "LT",        "name": "Larsen & Toubro Ltd",             "sector": "Engineering"},
    {"symbol": "ASIANPAINT","name": "Asian Paints Ltd",                "sector": "Consumer"},
    {"symbol": "HCLTECH",   "name": "HCL Technologies Ltd",            "sector": "IT"},
]


def search_symbols(query: str) -> list[dict]:
    """
    Fast local search over popular NSE symbols.
    No API call needed — instant results for the search bar.
    """
    q = query.upper().strip()
    results = []
    for item in NSE_POPULAR:
        if q in item["symbol"] or q in item["name"].upper():
            results.append(item)
    return results[:10]