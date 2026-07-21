// Wires up the "Search stocks, options..." box next to the profile avatar
// on every dashboard page. Typing shows live matches from the stock
// universe; picking one (or hitting Enter) takes you to that stock's detail
// page on Stocks, and a plain Enter with no exact match falls back to the
// All Stocks list pre-filtered by the typed term.
(function () {
  const API_BASE = "http://localhost:5000";

  let allStocks = null;
  let loadPromise = null;

  function ensureStocksLoaded() {
    if (allStocks) return Promise.resolve(allStocks);
    if (loadPromise) return loadPromise;
    loadPromise = fetch(`${API_BASE}/api/stocks`)
      .then((res) => res.json())
      .then((data) => {
        allStocks = Array.isArray(data) ? data : [];
        return allStocks;
      })
      .catch(() => {
        allStocks = [];
        return allStocks;
      });
    return loadPromise;
  }

  function goToStock(symbol) {
    window.location.href = `stocks.html?symbol=${encodeURIComponent(symbol)}`;
  }

  function goToSearch(term) {
    window.location.href = `stocks.html?q=${encodeURIComponent(term)}`;
  }

  function init() {
    const box = document.querySelector(".navbar-right .search-box");
    if (!box) return;
    const input = box.querySelector("input");
    if (!input) return;

    const results = document.createElement("div");
    results.className = "navbar-search-results";
    box.appendChild(results);

    function close() {
      results.classList.remove("open");
      results.innerHTML = "";
    }

    function render(query) {
      const q = query.trim().toLowerCase();
      if (!q) {
        close();
        return;
      }

      ensureStocksLoaded().then((stocks) => {
        const matches = stocks
          .filter(
            (s) =>
              (s.symbol || "").toLowerCase().includes(q) ||
              (s.name || "").toLowerCase().includes(q)
          )
          .slice(0, 8);

        if (!matches.length) {
          results.innerHTML = `<div class="navbar-search-empty">No matching stocks</div>`;
          results.classList.add("open");
          return;
        }

        results.innerHTML = matches
          .map(
            (s) => `
            <div class="navbar-search-result" data-symbol="${s.symbol}">
              <div>
                <div class="navbar-search-result-name">${s.name}</div>
                <div class="navbar-search-result-sym">${s.symbol} &middot; NSE</div>
              </div>
              <div class="navbar-search-result-price">₹${Number(s.price || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>`
          )
          .join("");
        results.classList.add("open");

        results.querySelectorAll(".navbar-search-result").forEach((el) => {
          el.addEventListener("click", () => goToStock(el.getAttribute("data-symbol")));
        });
      });
    }

    input.addEventListener("focus", () => {
      ensureStocksLoaded();
      if (input.value.trim()) render(input.value);
    });

    input.addEventListener("input", (e) => render(e.target.value));

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const term = input.value.trim();
        if (!term) return;
        const firstMatch = results.querySelector(".navbar-search-result");
        if (firstMatch) {
          goToStock(firstMatch.getAttribute("data-symbol"));
        } else {
          goToSearch(term);
        }
      } else if (e.key === "Escape") {
        input.blur();
        close();
      }
    });

    document.addEventListener("click", (e) => {
      if (!box.contains(e.target)) close();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
