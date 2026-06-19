from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Optional

import nse_data
from cache import cache_get, cache_set


app = FastAPI(
    title="PaperBull API",
    description="Backend for PaperBull — NSE paper trading simulator",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",   
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "service": "PaperBull API", "timestamp": datetime.now().isoformat()}



@app.get("/quote/{symbol}", tags=["market data"])
def quote(symbol: str):
    symbol = symbol.upper().strip()
    cache_key = f"quote:{symbol}"

    # Cache hit
    cached = cache_get(cache_key)
    if cached:
        cached["from_cache"] = True
        return cached

    # Fetch fresh
    try:
        data = nse_data.get_quote(symbol)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch quote for {symbol}: {str(e)}")

    if not data or data.get("price", 0) == 0:
        raise HTTPException(status_code=404, detail=f"Symbol not found: {symbol}")

    cache_set(cache_key, data, ttl=30)
    data["from_cache"] = False
    return data


@app.get("/ohlcv/{symbol}", tags=["market data"])
def ohlcv(
    symbol: str,
    interval: str = Query(
        default="1d",
        description="Candle interval: 1m | 5m | 15m | 1h | 1d | 1w"
    )
):
    symbol = symbol.upper().strip()
    valid_intervals = {"1m", "5m", "15m", "1h", "1d", "1w"}

    if interval not in valid_intervals:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid interval '{interval}'. Must be one of: {', '.join(valid_intervals)}"
        )

    cache_key = f"ohlcv:{symbol}:{interval}"
    ttl = 60 if interval in ("1m", "5m", "15m") else 300  # intraday refreshes more often

    cached = cache_get(cache_key)
    if cached:
        return {"symbol": symbol, "interval": interval, "candles": cached, "from_cache": True}

    try:
        candles = nse_data.get_ohlcv(symbol, interval)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch OHLCV for {symbol}: {str(e)}")

    if not candles:
        raise HTTPException(status_code=404, detail=f"No OHLCV data for {symbol}")

    cache_set(cache_key, candles, ttl=ttl)
    return {"symbol": symbol, "interval": interval, "candles": candles, "from_cache": False}



@app.get("/options/{symbol}", tags=["derivatives"])
def options_chain(
    symbol: str,
    expiry: Optional[str] = Query(
        default=None,
        description="Filter by specific expiry date (YYYY-MM-DD). Returns all expiries if omitted."
    )
):
    
    symbol = symbol.upper().strip()
    cache_key = f"options:{symbol}"

    cached = cache_get(cache_key)
    if cached:
        result = cached
        result["from_cache"] = True
    else:
        try:
            result = nse_data.get_options_chain(symbol)
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Failed to fetch options chain for {symbol}: {str(e)}")

        if not result.get("chain"):
            raise HTTPException(
                status_code=404,
                detail=f"No options data for {symbol}. Make sure it's an F&O eligible NSE symbol."
            )

        cache_set(cache_key, result, ttl=60)
        result["from_cache"] = False

    if expiry:
        result["chain"] = [row for row in result["chain"] if expiry in str(row["expiry"])]

    return result


@app.get("/search", tags=["utility"])
def search(q: str = Query(..., min_length=1, description="Search query (symbol or company name)")):
    results = nse_data.search_symbols(q)
    return {"query": q, "results": results, "count": len(results)}