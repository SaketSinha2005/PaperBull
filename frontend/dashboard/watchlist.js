(function () {
  const MARKET_API_BASE = "http://localhost:5000";
  const STATE_KEY = "paperbull_watchlists_v2";
  const LEGACY_KEY = "paperbull_watchlist"; // old single flat-list format
  const LIVE_REFRESH_MS = 10000;
  const DEFAULT_SEED_SYMBOLS = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK"];

  const $ = (id) => document.getElementById(id);

  // ---------------- state (multiple watchlists) ----------------
  function uid() {
    return "wl_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function migrateLegacyIfNeeded() {
    let legacySymbols = [];
    try {
      const raw = localStorage.getItem(LEGACY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          legacySymbols = parsed.map((s) => (s && s.symbol ? String(s.symbol).toUpperCase() : null)).filter(Boolean);
        }
      }
    } catch (err) {}

    const list = {
      id: uid(),
      name: "My Watchlist",
      symbols: legacySymbols.length ? Array.from(new Set(legacySymbols)) : DEFAULT_SEED_SYMBOLS.slice(),
    };

    return { activeId: list.id, lists: [list] };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.lists)) return parsed;
      }
    } catch (err) {}

    const migrated = migrateLegacyIfNeeded();
    saveState(migrated);
    return migrated;
  }

  function saveState(state) {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch (err) {}
  }

  function getActiveList(state) {
    return state.lists.find((l) => l.id === state.activeId) || null;
  }

  function ensureActiveValid(state) {
    if (!state.lists.length) {
      state.activeId = null;
    } else if (!getActiveList(state)) {
      state.activeId = state.lists[0].id;
    }
  }

  let state = loadState();
  ensureActiveValid(state);
  saveState(state);

  // ---------------- market data ----------------
  let allStocks = [];       // full /api/stocks universe, cached for search + prices
  let quotesBySymbol = {};  // symbol -> latest quote

  async function loadUniverse() {
    try {
      const res = await fetch(`${MARKET_API_BASE}/api/stocks`);
      if (!res.ok) throw new Error("Failed to load stock universe");
      const data = await res.json();
      if (Array.isArray(data)) {
        allStocks = data;
        quotesBySymbol = {};
        data.forEach((s) => {
          if (s && s.symbol) quotesBySymbol[s.symbol] = s;
        });
      }
    } catch (err) {
      console.error("Watchlist: failed to load live stock data. Is the backend running on", MARKET_API_BASE, err);
    }
  }

  // ---------------- helpers ----------------
  const initials = (name) => {
    if (!name) return "?";
    const parts = String(name).trim().split(/\s+/);
    return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
  };

  function fmtPrice(n) {
    if (n == null || Number.isNaN(Number(n))) return "—";
    return "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Real intraday sparkline built from today's closes (sent by the backend
  // as q.spark on /api/stocks — the same live series the Stocks page uses).
  // Falls back to a deterministic squiggle only if live data hasn't come
  // back yet (e.g. first paint, or the market-data backend is unreachable).
  function sparkPoints(symbol, spark, up) {
    const closes = Array.isArray(spark) ? spark.filter((c) => typeof c === "number") : [];
    if (closes.length >= 2) {
      const min = Math.min(...closes);
      const max = Math.max(...closes);
      const span = max - min || 1;
      return closes
        .map((c, i) => {
          const x = (i / (closes.length - 1)) * 100;
          const y = 28 - ((c - min) / span) * 26;
          return `${x.toFixed(2)},${y.toFixed(1)}`;
        })
        .join(" ");
    }

    let seed = 0;
    for (let i = 0; i < symbol.length; i++) seed = (seed * 17 + symbol.charCodeAt(i)) % 97;
    const pts = [];
    let v = 15;
    for (let i = 0; i < 8; i++) {
      seed = (seed * 53 + 7) % 97;
      v += ((seed % 9) - (up ? 3 : 5)) * 0.8;
      v = Math.max(2, Math.min(28, v));
      pts.push(`${((i / 7) * 100).toFixed(2)},${(30 - v).toFixed(1)}`);
    }
    return pts.join(" ");
  }

  function sparkSvg(symbol, spark, up) {
    const points = sparkPoints(symbol, spark, up);
    return `<svg class="spark ${up ? "spark-up" : "spark-down"}" viewBox="0 0 100 30" preserveAspectRatio="none"><polyline points="${points}" /></svg>`;
  }

  let editMode = false;

  // ---------------- rendering: tabs ----------------
  function renderTabs() {
    const container = $("watchlistTabs");
    const addBtn = $("btnNewWatchlist");
    container.querySelectorAll(".watchlist-tab-btn").forEach((el) => el.remove());

    state.lists.forEach((list) => {
      const btn = document.createElement("button");
      btn.className = "watchlist-tab-btn" + (list.id === state.activeId ? " active" : "");
      btn.setAttribute("data-id", list.id);
      btn.innerHTML = `${escapeHtml(list.name)} <span class="tab-count">${list.symbols.length}</span>`;
      btn.title = "Double-click to rename";

      btn.addEventListener("click", () => {
        if (state.activeId === list.id) return;
        state.activeId = list.id;
        saveState(state);
        editMode = false;
        renderAll();
      });

      btn.addEventListener("dblclick", () => {
        const next = prompt("Rename watchlist", list.name);
        if (next == null) return;
        const trimmed = next.trim();
        if (!trimmed) return;
        list.name = trimmed.slice(0, 40);
        saveState(state);
        renderAll();
      });

      container.insertBefore(btn, addBtn);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------------- rendering: rows ----------------
  function renderRows() {
    const body = $("watchlistBody");
    const table = document.querySelector(".watchlist-table");
    const emptyState = $("watchlistEmptyState");
    const noneState = $("watchlistNoneState");
    const toolbar = document.querySelector(".watchlist-toolbar");
    const headerLabel = $("watchlistCompanyHeader");
    const deleteBtn = $("btnDeleteWatchlist");

    const activeList = getActiveList(state);
    const filterQuery = ($("watchlistFilterInput").value || "").trim().toLowerCase();

    // No watchlists at all yet.
    if (!activeList) {
      table.hidden = true;
      emptyState.hidden = true;
      toolbar.hidden = true;
      noneState.hidden = false;
      return;
    }

    toolbar.hidden = false;
    noneState.hidden = true;
    deleteBtn.hidden = state.lists.length < 1;

    headerLabel.textContent = `Company (${activeList.symbols.length})`;

    if (!activeList.symbols.length) {
      table.hidden = true;
      emptyState.hidden = false;
      body.innerHTML = "";
      return;
    }

    const rows = activeList.symbols
      .map((symbol) => {
        const q = quotesBySymbol[symbol];
        const name = q ? q.name : symbol;
        const price = q ? q.price : null;
        const change = q ? q.change : null;
        const changePct = q ? q.changePct : null;
        const up = q ? q.is_up : true;
        const spark = q ? q.spark : null;
        const sign = change != null && change >= 0 ? "+" : "";

        return { symbol, name, price, change, changePct, up, spark, sign };
      })
      .filter((r) => !filterQuery || r.symbol.toLowerCase().includes(filterQuery) || r.name.toLowerCase().includes(filterQuery));

    table.hidden = false;
    emptyState.hidden = true;

    if (!rows.length) {
      body.innerHTML = `<tr><td colspan="6" style="padding:24px 0; color:var(--text-muted); text-align:center;">No stocks match "${escapeHtml(filterQuery)}"</td></tr>`;
      return;
    }

    body.innerHTML = rows
      .map((r) => {
        // When live quote data hasn't loaded yet (or the market-data backend
        // is unreachable), `name` falls back to the raw symbol — rendering
        // both lines in that case would show the same text twice (e.g.
        // "RELIANCE" / "RELIANCE"). Only show the symbol sub-line once it's
        // actually distinct from the display name.
        const showSymbolLine = r.name && r.name.toUpperCase() !== r.symbol.toUpperCase();
        return `
        <tr class="watchlist-row-user" data-symbol="${r.symbol}">
          <td class="col-w-company">
            <div class="row-co">
              ${window.PBLogos ? window.PBLogos.avatarHtml(r.symbol, r.name, { wrapClass: "w-logo" }) : `<div class="w-logo">${initials(r.name).charAt(0)}</div>`}
              <div>
                <div class="h-name">${escapeHtml(r.name)}</div>
                ${showSymbolLine ? `<div class="h-symbol">${r.symbol}</div>` : ""}
              </div>
            </div>
          </td>
          <td class="col-w-trend">${sparkSvg(r.symbol, r.spark, r.up)}</td>
          <td class="col-w-price"><div class="w-price">${fmtPrice(r.price)}</div></td>
          <td class="col-w-change">
            <div class="w-change ${r.up ? "up" : "down"}">
              ${r.change != null ? `${r.sign}${r.change} (${r.sign}${r.changePct}%)` : "—"}
            </div>
          </td>
          <td class="col-w-vol"><div class="w-vol">—</div></td>
          <td class="col-w-remove">
            <button class="watchlist-row-remove" data-symbol="${r.symbol}" title="Remove from watchlist" ${editMode ? "" : "hidden"}>
              <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </td>
        </tr>`;
      })
      .join("");

    body.querySelectorAll(".watchlist-row-user").forEach((row) => {
      row.addEventListener("click", (e) => {
        if (e.target.closest(".watchlist-row-remove")) return;
        window.location.href = `stocks.html?symbol=${encodeURIComponent(row.getAttribute("data-symbol"))}`;
      });
    });

    body.querySelectorAll(".watchlist-row-remove").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeStock(btn.getAttribute("data-symbol"));
      });
    });
  }

  function renderAll() {
    renderTabs();
    renderRows();
  }

  // ---------------- mutations ----------------
  function createWatchlist(name) {
    const trimmed = String(name || "").trim();
    if (!trimmed) return null;

    const list = { id: uid(), name: trimmed.slice(0, 40), symbols: [] };
    state.lists.push(list);
    state.activeId = list.id;
    saveState(state);
    renderAll();
    showToast(`Created "${list.name}"`);
    return list;
  }

  // ---------------- new-watchlist modal ----------------
  function openCreateModal() {
    $("wlModalError").textContent = "";
    $("wlModalInput").value = "";
    $("wlModalOverlay").classList.add("open");
    $("wlModalInput").focus();
  }

  function closeCreateModal() {
    $("wlModalOverlay").classList.remove("open");
  }

  function confirmCreateModal() {
    const input = $("wlModalInput");
    const name = input.value.trim();
    if (!name) {
      $("wlModalError").textContent = "Please enter a name for your watchlist.";
      input.focus();
      return;
    }
    createWatchlist(name);
    closeCreateModal();
  }

  function deleteActiveWatchlist() {
    const activeList = getActiveList(state);
    if (!activeList) return;
    if (!confirm(`Delete "${activeList.name}"? This can't be undone.`)) return;

    state.lists = state.lists.filter((l) => l.id !== activeList.id);
    ensureActiveValid(state);
    saveState(state);
    editMode = false;
    renderAll();
    showToast(`Deleted "${activeList.name}"`);
  }

  function addStock(symbol) {
    const activeList = getActiveList(state);
    if (!activeList) return false;
    const sym = symbol.toUpperCase();
    if (activeList.symbols.includes(sym)) return false;
    activeList.symbols.push(sym);
    saveState(state);
    renderRows();
    renderTabActiveCount();
    return true;
  }

  function removeStock(symbol) {
    const activeList = getActiveList(state);
    if (!activeList) return;
    activeList.symbols = activeList.symbols.filter((s) => s !== symbol);
    saveState(state);
    renderAll();
  }

  function renderTabActiveCount() {
    const btn = document.querySelector(`.watchlist-tab-btn[data-id="${state.activeId}"] .tab-count`);
    const activeList = getActiveList(state);
    if (btn && activeList) btn.textContent = activeList.symbols.length;
  }

  // ---------------- add-stock search panel ----------------
  function renderAddPanelResults(query) {
    const box = $("addStockResults");
    const q = query.trim().toLowerCase();
    const activeList = getActiveList(state);
    if (!activeList) return;

    const source = q
      ? allStocks.filter((s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
      : allStocks;

    const matches = source.slice(0, 20);

    if (!matches.length) {
      box.innerHTML = `<div class="watchlist-add-empty">No matching stocks</div>`;
      return;
    }

    box.innerHTML = matches
      .map((s) => {
        const added = activeList.symbols.includes(s.symbol);
        return `
        <div class="watchlist-add-result" data-symbol="${s.symbol}">
          <div>
            <div class="watchlist-add-result-name">${escapeHtml(s.name)}</div>
            <div class="watchlist-add-result-sym">${s.symbol} · ₹${Number(s.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
          </div>
          <button class="watchlist-add-result-btn ${added ? "added" : ""}" data-symbol="${s.symbol}" ${added ? "disabled" : ""}>
            ${added ? "Added" : "Add"}
          </button>
        </div>`;
      })
      .join("");

    box.querySelectorAll(".watchlist-add-result-btn:not(.added)").forEach((btn) => {
      btn.addEventListener("click", () => {
        const symbol = btn.getAttribute("data-symbol");
        if (addStock(symbol)) {
          btn.textContent = "Added";
          btn.classList.add("added");
          btn.disabled = true;
          showToast(`Added ${symbol} to ${getActiveList(state).name}`);
        }
      });
    });
  }

  function openAddPanel() {
    if (!getActiveList(state)) {
      showToast("Create a watchlist first");
      return;
    }
    $("watchlistAddPanel").hidden = false;
    $("addStockSearchInput").value = "";
    $("addStockSearchInput").focus();
    renderAddPanelResults("");
  }

  function closeAddPanel() {
    $("watchlistAddPanel").hidden = true;
  }

  // ---------------- toast ----------------
  function showToast(text) {
    let toast = $("watchlistToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "watchlistToast";
      toast.className = "pb-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  // ---------------- live price refresh ----------------
  async function refreshLive() {
    await loadUniverse();
    renderRows();
  }

  // ---------------- wire up ----------------
  function init() {
    if (!$("watchlistTabs")) return; // not on the watchlist page

    renderAll();
    loadUniverse().then(renderRows);

    setInterval(() => {
      if (!document.hidden) refreshLive();
    }, LIVE_REFRESH_MS);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) refreshLive();
    });

    $("btnNewWatchlist").addEventListener("click", openCreateModal);
    $("btnDeleteWatchlist").addEventListener("click", deleteActiveWatchlist);
    const createFirstBtn = $("btnCreateFirstWatchlist");
    if (createFirstBtn) createFirstBtn.addEventListener("click", openCreateModal);

    $("wlModalClose").addEventListener("click", closeCreateModal);
    $("wlModalCancel").addEventListener("click", closeCreateModal);
    $("wlModalCreate").addEventListener("click", confirmCreateModal);
    $("wlModalOverlay").addEventListener("click", (e) => {
      if (e.target === $("wlModalOverlay")) closeCreateModal();
    });
    $("wlModalInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter") confirmCreateModal();
    });
    $("wlModalInput").addEventListener("input", () => {
      $("wlModalError").textContent = "";
    });

    $("btnEditWatchlist").addEventListener("click", () => {
      editMode = !editMode;
      $("btnEditWatchlist").textContent = editMode ? "Done" : "";
      if (editMode) {
        $("btnEditWatchlist").innerHTML = `<svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Done`;
      } else {
        $("btnEditWatchlist").innerHTML = `<svg viewBox="0 0 24 24" fill="none"><path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Edit`;
      }
      renderRows();
    });

    $("btnAddStocks").addEventListener("click", openAddPanel);
    $("closeAddPanel").addEventListener("click", closeAddPanel);
    $("addStockSearchInput").addEventListener("input", (e) => renderAddPanelResults(e.target.value));

    $("watchlistFilterInput").addEventListener("input", renderRows);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeAddPanel();
        closeCreateModal();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
