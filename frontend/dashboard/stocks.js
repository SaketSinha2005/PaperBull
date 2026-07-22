const { useState, useMemo, useEffect, useRef, Fragment } = React;

const Icon = ({ path, className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    {path}
  </svg>
);

const SearchIcon = (p) => (
  <Icon
    className={p.className}
    path={
      <>
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    }
  />
);

const BellIcon = (p) => (
  <Icon
    className={p.className}
    path={
      <>
        <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    }
  />
);

const PlusIcon = (p) => (
  <Icon
    className={p.className}
    path={<path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
  />
);

const CheckIcon = (p) => (
  <Icon
    className={p.className}
    path={<path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
  />
);

const ArrowRightIcon = (p) => (
  <Icon
    className={p.className}
    path={<path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
  />
);

const Repeat2Icon = (p) => (
  <Icon
    className={p.className}
    path={
      <>
        <path d="M17 2l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 22l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    }
  />
);

const InfoIcon = (p) => (
  <Icon
    className={p.className}
    path={
      <>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    }
  />
);

const Building2Icon = (p) => (
  <Icon
    className={p.className}
    path={
      <>
        <rect x="4" y="3" width="10" height="18" rx="1" stroke="currentColor" strokeWidth="2" />
        <path d="M14 8h6v13h-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8 7h2M8 11h2M8 15h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    }
  />
);

const CalendarIcon = (p) => (
  <Icon
    className={p.className}
    path={
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M16 3v4M8 3v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    }
  />
);

const MapPinIcon = (p) => (
  <Icon
    className={p.className}
    path={
      <>
        <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
      </>
    }
  />
);

const GlobeIcon = (p) => (
  <Icon
    className={p.className}
    path={
      <>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" stroke="currentColor" strokeWidth="2" />
      </>
    }
  />
);

const ExternalLinkIcon = (p) => (
  <Icon
    className={p.className}
    path={
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    }
  />
);

const ChevronRightIcon = (p) => (
  <Icon
    className={p.className}
    path={<path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
  />
);

const SparklesIcon = (p) => (
  <Icon
    className={p.className}
    path={
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    }
  />
);

const SendIcon = (p) => (
  <Icon
    className={p.className}
    path={<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
  />
);

const SlidersIcon = (p) => (
  <Icon
    className={p.className}
    path={
      <>
        <line x1="4" y1="21" x2="4" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="4" y1="10" x2="4" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="21" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="8" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="21" x2="20" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="12" x2="20" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="4" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="2" />
        <circle cx="20" cy="14" r="2" stroke="currentColor" strokeWidth="2" />
      </>
    }
  />
);

const XIcon = (p) => (
  <Icon
    className={p.className}
    path={<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
  />
);

const ArrowLeftIcon = (p) => (
  <Icon
    className={p.className}
    path={<path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
  />
);

const navTabs = ["Dashboard", "Stocks", "Watchlist", "Orders", "Portfolio"];

const stock = {
  name: "Tata Consultancy Services",
  symbol: "TCS",
  exchange: "NSE",
  cap: "Large Cap",
  sector: "IT - Services",
  price: "3,546.70",
  change: "+8.70",
  pct: "(0.25%)",
  up: true,
  status: "Market closed",
  time: "Mar 26, 04:00 PM IST",
  todaysLow: "3,489.90",
  todaysHigh: "3,569.70",
  weekLow: "2,039.90",
  weekHigh: "4,592.25",
  open: "3,507.00",
  prevClose: "3,537.00",
  volume: "21,26,765",
  lowerCircuit: "3,183.30",
  upperCircuit: "3,890.70",
  about: "Tata Consultancy Services Limited (TCS) is an Indian multinational information technology (IT) services and consulting company. It is a part of the Tata Group and operates in 55+ countries, delivering solutions in digital, cloud, data, and engineering.",
  industry: "IT - Services",
  founded: "1968",
  headquarters: "Mumbai, India",
  website: "tcs.com",
};

const STOCKS_API_BASE = "http://localhost:5000";

// Mutates the shared `stock` object with whatever fields are present on
// `entry`, leaving everything else (about/fundamentals/etc.) as-is until a
// live fetch fills it in. Used both for the initial query-string handoff
// and for clicks on a row in the All Stocks list.
function applyEntryToStock(entry) {
  if (!entry) return;
  if (entry.symbol) stock.symbol = entry.symbol;
  if (entry.name) stock.name = entry.name;
  if (entry.price != null) stock.price = String(entry.price);
  if (entry.change != null) stock.change = String(entry.change);
  if (entry.pct != null) stock.pct = entry.pct;
  if (entry.up != null) stock.up = entry.up === true || entry.up === "true";
  if (entry.sector) stock.sector = entry.sector;
  if (entry.cap) stock.cap = entry.cap.includes("Cap") ? entry.cap : `${entry.cap} Cap`;
}

// Merges a `/api/stock/:symbol` response into the shared `stock` object and
// the module-level `fundamentals` list, only overwriting fields the backend
// actually returned so a slow/failed fetch never blanks out what's on screen.
function mergeStockDetail(data) {
  if (!data) return;
  const fields = [
    "name", "exchange", "cap", "sector", "industry", "price", "change", "pct", "up",
    "status", "time", "todaysLow", "todaysHigh", "weekLow", "weekHigh", "open",
    "prevClose", "volume", "about", "headquarters", "website",
  ];
  fields.forEach((f) => {
    if (data[f] !== undefined && data[f] !== null) stock[f] = data[f];
  });

  if (data.fundamentals) {
    const map = {
      marketCap: "Market Cap",
      peRatio: "P/E Ratio (TTM)",
      eps: "EPS (TTM)",
      pbRatio: "P/B Ratio",
      dividendYield: "Dividend Yield",
      bookValue: "Book Value",
    };
    Object.entries(map).forEach(([key, label]) => {
      const value = data.fundamentals[key];
      if (value == null) return;
      const row = fundamentals.find((f) => f.label === label);
      if (row) row.value = value;
    });
  }
}

async function fetchStocksList() {
  const res = await fetch(`${STOCKS_API_BASE}/api/stocks`);
  if (!res.ok) throw new Error("Failed to fetch stocks");
  return res.json();
}

async function fetchStockDetail(symbol) {
  const res = await fetch(`${STOCKS_API_BASE}/api/stock/${encodeURIComponent(symbol)}`);
  if (!res.ok) throw new Error("Failed to fetch stock detail");
  return res.json();
}

// If we arrived here from a click on a stock elsewhere in the app (dashboard, watchlist, etc.)
// the symbol/name/price were passed along in the URL — reflect them on the header so the
// page actually matches whichever stock was clicked instead of always showing TCS demo data.
const initialSymbolFromQuery = new URLSearchParams(window.location.search).get("symbol");

(function applyStockFromQueryString() {
  const params = new URLSearchParams(window.location.search);
  const symbol = params.get("symbol");
  if (!symbol) return;

  applyEntryToStock({
    symbol,
    name: params.get("name") || undefined,
    price: params.get("price") || undefined,
    change: params.get("change") || undefined,
    pct: params.get("pct") || undefined,
    up: params.has("up") ? params.get("up") === "true" : undefined,
  });
})();

// ---------------------------------------------------------------
// Playlists (a.k.a. watchlists). This reads/writes the exact same
// localStorage shape the Watchlist page uses ("paperbull_watchlists_v2":
// { activeId, lists: [{ id, name, symbols: [] }] }) so a stock added or
// removed here shows up there, and vice versa. We still migrate the old
// single flat-list format ("paperbull_watchlist") the first time either
// page runs on it.
// ---------------------------------------------------------------
const PLAYLISTS_KEY = "paperbull_watchlists_v2";
const LEGACY_WATCHLIST_KEY = "paperbull_watchlist";
const DEFAULT_SEED_SYMBOLS = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK"];

function uidPlaylist() {
  return "wl_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function migrateLegacyWatchlist() {
  let legacySymbols = [];
  try {
    const raw = localStorage.getItem(LEGACY_WATCHLIST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        legacySymbols = parsed.map((s) => (s && s.symbol ? String(s.symbol).toUpperCase() : null)).filter(Boolean);
      }
    }
  } catch (err) {}

  const list = {
    id: uidPlaylist(),
    name: "My Watchlist",
    symbols: legacySymbols.length ? Array.from(new Set(legacySymbols)) : DEFAULT_SEED_SYMBOLS.slice(),
  };
  return { activeId: list.id, lists: [list] };
}

function loadPlaylistState() {
  try {
    const raw = localStorage.getItem(PLAYLISTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.lists)) return parsed;
    }
  } catch (err) {}

  const migrated = migrateLegacyWatchlist();
  savePlaylistState(migrated);
  return migrated;
}

function savePlaylistState(state) {
  try {
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(state));
  } catch (err) {}
}

function getPlaylists() {
  return loadPlaylistState().lists;
}

function isInWatchlist(symbol) {
  return getPlaylists().some((l) => l.symbols.includes(symbol));
}

function createPlaylist(name) {
  const trimmed = String(name || "").trim();
  if (!trimmed) return null;
  const state = loadPlaylistState();
  const list = { id: uidPlaylist(), name: trimmed.slice(0, 40), symbols: [] };
  state.lists.push(list);
  state.activeId = list.id;
  savePlaylistState(state);
  return list;
}

function addSymbolToPlaylist(playlistId, symbol) {
  const state = loadPlaylistState();
  const list = state.lists.find((l) => l.id === playlistId);
  if (!list) return false;
  const sym = String(symbol).toUpperCase();
  if (!list.symbols.includes(sym)) {
    list.symbols.push(sym);
    savePlaylistState(state);
  }
  return true;
}

function removeSymbolFromPlaylist(playlistId, symbol) {
  const state = loadPlaylistState();
  const list = state.lists.find((l) => l.id === playlistId);
  if (!list) return false;
  list.symbols = list.symbols.filter((s) => s !== symbol);
  savePlaylistState(state);
  return true;
}

function showToast(text) {
  let toast = document.getElementById("pbToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "pbToast";
    toast.className = "pb-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2600);
}

// Popup shown whenever the user hits the +/tick add-to-watchlist button
// anywhere on the Stocks pages, so they can pick which playlist to file
// the stock under (or create a new one on the spot).
function PlaylistPickerModal({ symbol, name, onClose, onChange }) {
  const [playlists, setPlaylists] = useState(() => getPlaylists());
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  const refresh = () => {
    setPlaylists(getPlaylists());
    if (onChange) onChange(isInWatchlist(symbol));
  };

  const handleToggle = (playlist) => {
    const has = playlist.symbols.includes(symbol);
    if (has) {
      removeSymbolFromPlaylist(playlist.id, symbol);
      showToast(`Removed ${symbol} from ${playlist.name}`);
    } else {
      addSymbolToPlaylist(playlist.id, symbol);
      showToast(`Added ${symbol} to ${playlist.name}`);
    }
    refresh();
  };

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setError("Please enter a name for your playlist.");
      return;
    }
    const list = createPlaylist(trimmed);
    if (list) {
      addSymbolToPlaylist(list.id, symbol);
      setNewName("");
      setError("");
      showToast(`Created "${list.name}" and added ${symbol}`);
      refresh();
    }
  };

  return ReactDOM.createPortal(
    <div
      className="wl-modal-overlay open"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="wl-modal playlist-picker-modal">
        <div className="wl-modal-head">
          <h3>Add to playlist</h3>
          <button className="wl-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="wl-modal-sub">Choose a watchlist for {name || symbol}.</div>

        <div className="playlist-picker-list">
          {playlists.length === 0 && (
            <div className="playlist-picker-empty">You don't have any playlists yet. Create one below.</div>
          )}
          {playlists.map((p) => {
            const has = p.symbols.includes(symbol);
            return (
              <button
                key={p.id}
                type="button"
                className={`playlist-picker-item${has ? " added" : ""}`}
                onClick={() => handleToggle(p)}
              >
                <span className="playlist-picker-item-name">{p.name}</span>
                <span className="playlist-picker-item-count">{p.symbols.length} stock{p.symbols.length === 1 ? "" : "s"}</span>
                <span className="playlist-picker-item-check">
                  {has ? <CheckIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="playlist-picker-create">
          <input
            type="text"
            placeholder="New playlist name"
            value={newName}
            maxLength={40}
            className="wl-modal-input"
            onChange={(e) => { setNewName(e.target.value); setError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
          />
          <button type="button" className="playlist-picker-create-btn" onClick={handleCreate}>+ Create</button>
        </div>
        {error && <div className="wl-modal-error">{error}</div>}

        <div className="wl-modal-actions">
          <button className="wl-modal-cancel" onClick={onClose} style={{ flex: "none", width: "100%" }}>Done</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

const stockTabs = ["Overview"];
const timeRanges = ["1D", "1W", "1M", "3M", "6M", "1Y", "3Y", "5Y", "Max"];

const fundamentals = [
  { label: "Market Cap", value: "₹12,90,904 Cr" },
  { label: "ROE", value: "57.98%" },
  { label: "P/E Ratio (TTM)", value: "27.61" },
  { label: "EPS (TTM)", value: "128.56" },
  { label: "P/B Ratio", value: "9.86" },
  { label: "Dividend Yield", value: "3.40%" },
  { label: "Industry P/E", value: "28.41" },
  { label: "Book Value", value: "359.81" },
  { label: "Debt to Equity", value: "0.08" },
  { label: "Face Value", value: "1" },
];

const financials = {
  quarterly: [
    { q: "Mar '25", revenue: 62000, profit: 11500 },
    { q: "Jun '25", revenue: 64500, profit: 12100 },
    { q: "Sep '25", revenue: 66800, profit: 12500 },
    { q: "Dec '25", revenue: 68200, profit: 13000 },
    { q: "Mar '26", revenue: 71455, profit: 13784 },
  ],
  yearly: [
    { q: "FY22", revenue: 191754, profit: 38327 },
    { q: "FY23", revenue: 225458, profit: 42147 },
    { q: "FY24", revenue: 240893, profit: 45908 },
    { q: "FY25", revenue: 255324, profit: 48000 },
    { q: "FY26", revenue: 270980, profit: 51384 },
  ],
};

const aiSuggestions = [
  "How has TCS performed in the last 1 year?",
  "What are the key strengths of TCS?",
  "Compare TCS with similar stocks",
];

const SECTOR_OPTIONS = [
  "Agriculture", "Banking", "Construction Materials", "Consumer Durables", "Diversified",
  "Energy", "FMCG", "Financial", "Healthcare", "Infrastructure", "IT - Services",
  "Metals & Mining", "Telecom", "Automobile & Ancillaries", "Other",
];

const INDEX_OPTIONS = [
  "Nifty 50", "Nifty Next 50", "Nifty Midcap 150", "Nifty Smallcap 250",
  "Bank Nifty", "Fin Nifty", "Nifty 100",
];

const CAP_RANGE_MAX = 2000000;
const PRICE_RANGE_MAX = 10000;

const navRoutes = {
  Dashboard: "index.html",
  Stocks: "#",
  Watchlist: "watchlist.html",
  Orders: "orders.html",
  Portfolio: "portfolio.html",
};

function getAvatarInitial() {
  try {
    const stored = localStorage.getItem("paperbull_user");
    if (stored) {
      const user = JSON.parse(stored);
      if (user.fullName) return user.fullName.trim().charAt(0).toUpperCase();
    }
  } catch (err) {}
  return "S";
}

function getUserName() {
  try {
    const stored = localStorage.getItem("paperbull_user");
    if (stored) {
      const user = JSON.parse(stored);
      if (user.fullName) return user.fullName;
    }
  } catch (err) {}
  return "Guest Trader";
}

function getPortfolioSummary() {
  let portfolio = {};
  let user = {};

  try {
    portfolio = JSON.parse(localStorage.getItem("paperbull_portfolio") || "{}");
  } catch (err) {}

  try {
    user = JSON.parse(localStorage.getItem("paperbull_user") || "{}");
  } catch (err) {}

  const moneyAvailable = typeof portfolio.moneyAvailable === "number"
    ? portfolio.moneyAvailable
    : (typeof user.balance === "number" ? user.balance : 100000);

  return {
    stocksBought: typeof portfolio.stocksBought === "number" ? portfolio.stocksBought : 0,
    moneyAvailable,
    profitLoss: typeof portfolio.profitLoss === "number" ? portfolio.profitLoss : 0,
    profitLossPct: typeof portfolio.profitLossPct === "number" ? portfolio.profitLossPct : 0,
  };
}

function handleLogout() {
  try {
    localStorage.removeItem("paperbull_user");
  } catch (err) {}
  window.location.href = "../index.html";
}

function ProfileMenu() {
  const initial = getAvatarInitial();
  const name = getUserName();
  const summary = getPortfolioSummary();
  const sign = summary.profitLoss > 0 ? "+" : "";
  const plClass = summary.profitLoss > 0 ? "up" : summary.profitLoss < 0 ? "down" : "";

  return (
    <div className="profile-menu">
      <div className="avatar">{initial}</div>
      <div className="profile-dropdown">
        <div className="profile-dropdown-inner">
          <div className="profile-dropdown-header">
            <div className="profile-dropdown-avatar">{initial}</div>
            <div>
              <div className="profile-dropdown-name">{name}</div>
              <div className="profile-dropdown-email">Paper trading account</div>
            </div>
          </div>
          <div className="profile-dropdown-stats">
            <div className="profile-stat">
              <span className="profile-stat-label">Total stocks bought</span>
              <span className="profile-stat-value">{summary.stocksBought.toLocaleString("en-IN")}</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-label">Money available</span>
              <span className="profile-stat-value">₹{summary.moneyAvailable.toLocaleString("en-IN")}</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-label">Profit / Loss</span>
              <span className={`profile-stat-value ${plClass}`}>
                {sign}₹{summary.profitLoss.toLocaleString("en-IN")} ({sign}{summary.profitLossPct.toFixed(2)}%)
              </span>
            </div>
          </div>
          <button className="profile-dropdown-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

function TopNav({ active, onChange }) {
  const [navQuery, setNavQuery] = useState("");
  const [navResults, setNavResults] = useState([]);
  const [navOpen, setNavOpen] = useState(false);
  const navBoxRef = useRef(null);
  const navStocksRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (navBoxRef.current && !navBoxRef.current.contains(e.target)) setNavOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const ensureNavStocks = () => {
    if (navStocksRef.current) return Promise.resolve(navStocksRef.current);
    return fetchStocksList()
      .then((data) => {
        navStocksRef.current = Array.isArray(data) ? data : [];
        return navStocksRef.current;
      })
      .catch(() => {
        navStocksRef.current = [];
        return navStocksRef.current;
      });
  };

  const handleNavInput = (value) => {
    setNavQuery(value);
    const q = value.trim().toLowerCase();
    if (!q) {
      setNavResults([]);
      setNavOpen(false);
      return;
    }
    ensureNavStocks().then((stocks) => {
      const matches = stocks
        .filter((s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
        .slice(0, 8);
      setNavResults(matches);
      setNavOpen(true);
    });
  };

  const goToStock = (symbol) => {
    window.location.href = `stocks.html?symbol=${encodeURIComponent(symbol)}`;
  };

  const handleNavKeyDown = (e) => {
    if (e.key === "Enter") {
      const term = navQuery.trim();
      if (!term) return;
      if (navResults.length > 0) {
        goToStock(navResults[0].symbol);
      } else {
        window.location.href = `stocks.html?q=${encodeURIComponent(term)}`;
      }
    } else if (e.key === "Escape") {
      setNavOpen(false);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="logo-mark"></div>
        <span className="logo-text">PaperBull</span>
        <nav className="nav-links">
          {navTabs.map((t) => {
            const href = navRoutes[t];
            const isActive = active === t;
            return (
              <a
                key={t}
                href={href}
                className={`nav-link${isActive ? " active" : ""}`}
                onClick={(e) => {
                  if (href === "#") {
                    e.preventDefault();
                    onChange(t);
                  }
                }}
              >
                {t}
              </a>
            );
          })}
        </nav>
      </div>
      <div className="navbar-right">
        <div className="search-box" ref={navBoxRef}>
          <svg viewBox="0 0 24 24" fill="none"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <input
            type="text"
            placeholder="Search stocks, options..."
            value={navQuery}
            onChange={(e) => handleNavInput(e.target.value)}
            onFocus={() => {
              ensureNavStocks();
              if (navQuery.trim() && navResults.length) setNavOpen(true);
            }}
            onKeyDown={handleNavKeyDown}
          />
          {navOpen && (
            <div className="navbar-search-results open">
              {navResults.length === 0 ? (
                <div className="navbar-search-empty">No matching stocks</div>
              ) : (
                navResults.map((s) => (
                  <div key={s.symbol} className="navbar-search-result" onClick={() => goToStock(s.symbol)}>
                    <div>
                      <div className="navbar-search-result-name">{s.name}</div>
                      <div className="navbar-search-result-sym">{s.symbol} &middot; NSE</div>
                    </div>
                    <div className="navbar-search-result-price">
                      ₹{Number(s.price || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <ProfileMenu />
      </div>
    </header>
  );
}

function IndicesTicker() {
  const [indices, setIndices] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      fetch(`${STOCKS_API_BASE}/api/header-indices`)
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return;
          if (Array.isArray(data) && data.length) setIndices(data);
        })
        .catch(() => {});
    };

    load();

    // Keep the index strip ticking on its own instead of only ever
    // fetching once, mirroring the live refresh used elsewhere on this page.
    const LIVE_REFRESH_MS = 5000;
    const timer = setInterval(() => {
      if (!document.hidden) load();
    }, LIVE_REFRESH_MS);

    const onVisibility = () => {
      if (!document.hidden) load();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="ticker-strip">
      <div className="ticker-left">
        {indices.map((i) => (
          <span key={i.name} className="ticker-item">
            <span className="ticker-name">{i.name}</span> <span className="ticker-val">{i.value}</span>{" "}
            <span className={i.is_up ? "up" : "down"}>{i.change} ({i.pct})</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function StatBlock({ label, value }) {
  return (
    <div>
      <div className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">{label}</div>
      <div className="text-[var(--text-primary)] text-[15px] font-medium mt-1">{value}</div>
    </div>
  );
}

function useMarketStatus() {
  const getStatus = () =>
    window.PaperBullMarketHours ? window.PaperBullMarketHours.getMarketStatus() : { isOpen: false, message: "Market status unavailable" };
  const [status, setStatus] = useState(getStatus);

  useEffect(() => {
    const t = setInterval(() => setStatus(getStatus()), 30000);
    return () => clearInterval(t);
  }, []);

  return status;
}

function StockHeaderLogo({ symbol, name }) {
  const candidates = window.PBLogos ? window.PBLogos.getLogoCandidates(symbol, name) : [];
  const [failed, setFailed] = useState(false);
  const initial = (name || symbol || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--blue)] to-[var(--blue)] flex items-center justify-center shrink-0 ring-1 ring-[var(--border-color)] relative overflow-hidden">
      {candidates.length > 0 && !failed && (
        <ChainedLogoImg
          candidates={candidates}
          className="absolute inset-0 w-full h-full object-contain p-2 bg-white"
          onExhausted={() => setFailed(true)}
        />
      )}
      {(!candidates.length || failed) && (
        <span className="text-[var(--text-primary)] font-bold text-lg tracking-tight">{initial}</span>
      )}
    </div>
  );
}

function StockHeader() {
  const [added, setAdded] = useState(() => isInWatchlist(stock.symbol));
  const [pickerOpen, setPickerOpen] = useState(false);
  const marketStatus = useMarketStatus();

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <StockHeaderLogo symbol={stock.symbol} name={stock.name} />
          <div>
            <h1 className="text-[var(--text-primary)] text-[22px] font-semibold leading-tight">{stock.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-[12px]">
              <span className="px-2 py-0.5 rounded-md bg-[var(--bg-pill)] text-[var(--text-secondary)] font-medium">{stock.symbol}</span>
              <span className="px-2 py-0.5 rounded-md bg-[var(--bg-pill)] text-[var(--text-secondary)] font-medium">{stock.exchange}</span>
              <span className="px-2 py-0.5 rounded-md bg-[var(--bg-pill)] text-[var(--text-secondary)] font-medium">{stock.cap}</span>
              <span className="px-2 py-0.5 rounded-md bg-[var(--bg-pill)] text-[var(--text-secondary)] font-medium">{stock.sector}</span>
              <span className={`px-2 py-0.5 rounded-md font-medium ${marketStatus.isOpen ? "bg-[var(--green)]/10 text-[var(--green)]" : "bg-[var(--red)]/10 text-[var(--red)]"}`}>
                {marketStatus.isOpen ? "Market Open" : "Market Closed"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setPickerOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${added ? "bg-[var(--green)]/10 border-[var(--green)]/40 text-[var(--green)]" : "bg-[var(--bg-card-alt)] border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-pill)]"}`}
          >
            {added ? <CheckIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />} {added ? "In Watchlist" : "Watchlist"}
          </button>
          <a
            href={`orders.html?symbol=${encodeURIComponent(stock.symbol)}&side=buy`}
            onClick={(e) => { if (!marketStatus.isOpen) e.preventDefault(); }}
            title={marketStatus.isOpen ? "" : marketStatus.message}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${marketStatus.isOpen ? "bg-[var(--green)] text-[#06211f] hover:brightness-110" : "bg-[var(--bg-pill)] text-[var(--text-secondary)] cursor-not-allowed"}`}
          >
            {marketStatus.isOpen ? "Buy" : "Market Closed"}
          </a>
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between flex-wrap gap-6">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-[var(--text-primary)] text-[34px] font-semibold tracking-tight">₹{stock.price}</span>
            <span className={`text-sm font-medium ${stock.up ? "text-[var(--green)]" : "text-[var(--red)]"}`}>{stock.change} {stock.pct}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[12px] text-[var(--text-secondary)]">
            <span>{stock.status}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
            <span>{stock.time}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8">
          <StatBlock label="Today's low" value={stock.todaysLow} />
          <StatBlock label="Today's high" value={stock.todaysHigh} />
          <StatBlock label="52 week low" value={stock.weekLow} />
          <StatBlock label="52 week high" value={stock.weekHigh} />
        </div>
      </div>

      {pickerOpen && (
        <PlaylistPickerModal
          symbol={stock.symbol}
          name={stock.name}
          onClose={() => setPickerOpen(false)}
          onChange={setAdded}
        />
      )}
    </div>
  );
}


function StockTabs({ active, onChange }) {
  return (
    <div className="flex items-center gap-1 border-b border-[var(--border-soft)]">
      {stockTabs.map((t) => {
        const isActive = active === t;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`relative px-4 py-3 text-[13px] font-medium transition-colors ${isActive ? "text-[var(--green)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
          >
            {t}
            {isActive && <span className="absolute left-2 right-2 -bottom-[1px] h-[2px] bg-[var(--green)] rounded-full" />}
          </button>
        );
      })}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div>
      <div className="text-[11px] text-[var(--text-secondary)]">{label}</div>
      <div className="text-[var(--text-primary)] text-[15px] font-medium mt-1">{value}</div>
    </div>
  );
}

function PerformanceChart() {
  const [range, setRange] = useState("1Y");
  const [series, setSeries] = useState({ points: [], is_up: true });
  const [status, setStatus] = useState("loading"); // loading | ready | error | empty

  useEffect(() => {
    let cancelled = false;

    // `silent` refreshes update the series in place without flashing the
    // loading/empty/error state — used for the live polling below so the
    // chart doesn't flicker every few seconds.
    const load = (silent) => {
      if (!silent) setStatus("loading");
      fetch(`${STOCKS_API_BASE}/api/series/${encodeURIComponent(stock.symbol)}?range=${range}`)
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return;
          if (Array.isArray(data.points) && data.points.length > 1) {
            setSeries(data);
            setStatus("ready");
          } else if (!silent) {
            setSeries({ points: [], is_up: true });
            setStatus("empty");
          }
        })
        .catch(() => {
          if (cancelled) return;
          if (!silent) {
            setSeries({ points: [], is_up: true });
            setStatus("error");
          }
        });
    };

    load(false);

    // Keep the chart ticking with live prices while it's on screen — not
    // just on the first load or when the range is changed — so intraday
    // ranges (1D/1W) stay current while the market is open.
    const LIVE_REFRESH_MS = 5000;
    const timer = setInterval(() => {
      if (document.hidden) return;
      load(true);
    }, LIVE_REFRESH_MS);

    const onVisibility = () => {
      if (!document.hidden) load(true);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [range, stock.symbol]);

  const { path, area, points, yLabels, xLabels } = useMemo(() => {
    const w = 900;
    const h = 260;
    const padL = 10;
    const padR = 10;
    const padT = 10;
    const padB = 30;
    const seriesPoints = series.points || [];
    if (seriesPoints.length < 2) {
      return { path: "", area: "", points: [], yLabels: [], xLabels: [] };
    }
    const vals = seriesPoints.map((p) => p.close);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const span = max - min || 1;
    const dx = (w - padL - padR) / (seriesPoints.length - 1);
    const dy = h - padT - padB;
    const points = seriesPoints.map((p, i) => {
      const x = padL + i * dx;
      const y = padT + dy - ((p.close - min) / span) * dy;
      return { x, y, ...p };
    });
    const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const area = `${path} L${points[points.length - 1].x},${h - padB} L${points[0].x},${h - padB} Z`;

    const yLabels = [0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => max - t * span);

    const xCount = Math.min(6, points.length);
    const xLabels = Array.from({ length: xCount }, (_, i) => {
      const idx = xCount === 1 ? 0 : Math.round((i / (xCount - 1)) * (points.length - 1));
      return points[idx].label;
    });

    return { path, area, points, yLabels, xLabels };
  }, [series]);

  const up = series.is_up !== false;
  const lineColor = up ? "var(--green)" : "var(--red)";

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-[var(--text-primary)] text-[15px] font-semibold">Performance</h3>
          <InfoIcon className="w-3.5 h-3.5 text-[var(--text-muted)]" />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {timeRanges.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`h-8 px-3 rounded-full text-[12px] font-medium transition-colors border ${range === r ? "bg-[var(--green)]/10 text-[var(--green)] border-[var(--green)]/40" : "bg-transparent text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)] hover:border-[var(--border-color)]"}`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="relative">
        {status !== "ready" ? (
          <div className="w-full h-[260px] flex items-center justify-center text-[13px] text-[var(--text-muted)]">
            {status === "loading" ? "Loading chart\u2026" : "Chart data isn't available for this range right now."}
          </div>
        ) : (
          <Fragment>
            <svg viewBox="0 0 900 260" className="w-full h-[260px]" preserveAspectRatio="none">
              <defs>
                <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lineColor} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0.2, 0.4, 0.6, 0.8].map((t) => (
                <line key={t} x1="0" x2="900" y1={10 + t * 220} y2={10 + t * 220} stroke="#ffffff" strokeOpacity="0.04" />
              ))}
              <path d={area} fill="url(#perfGrad)" />
              <path d={path} fill="none" stroke={lineColor} strokeWidth="2" />
              <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="5" fill={lineColor} />
              <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="10" fill={lineColor} fillOpacity="0.2" />
            </svg>
            <div className="absolute right-0 top-0 h-[230px] flex flex-col justify-between text-[11px] text-[var(--text-secondary)] pr-1">
              {yLabels.map((v, i) => (
                <span key={i}>{formatINR(v, 0)}</span>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[11px] text-[var(--text-secondary)] px-1">
              {xLabels.map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </div>
          </Fragment>
        )}
      </div>

      <div className="grid grid-cols-5 gap-6 mt-8 pt-6 border-t border-[var(--border-soft)]">
        <MiniStat label="Open" value={stock.open} />
        <MiniStat label="Prev close" value={stock.prevClose} />
        <MiniStat label="Volume" value={stock.volume} />
        <MiniStat label="Lower circuit" value={stock.lowerCircuit} />
        <MiniStat label="Upper circuit" value={stock.upperCircuit} />
      </div>
    </div>
  );
}

function MetaItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-[var(--bg-card-alt)] border border-[var(--border-color)] flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <div className="text-[11px] text-[var(--text-secondary)]">{label}</div>
        <div className="text-[var(--text-primary)] text-[13px] font-medium mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="card">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-full bg-[var(--bg-card-alt)] border border-[var(--border-color)] flex items-center justify-center shrink-0">
          <Building2Icon className="w-5 h-5 text-[var(--text-secondary)]" />
        </div>
        <div className="flex-1">
          <h3 className="text-[var(--text-primary)] text-[15px] font-semibold">About {stock.name}</h3>
          <p className="text-[var(--text-secondary)] text-[13px] leading-relaxed mt-2">{stock.about}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">
        <MetaItem icon={<Building2Icon className="w-4 h-4 text-[var(--text-secondary)]" />} label="Industry" value={stock.industry} />
        <MetaItem icon={<CalendarIcon className="w-4 h-4 text-[var(--text-secondary)]" />} label="Founded" value={stock.founded} />
        <MetaItem icon={<MapPinIcon className="w-4 h-4 text-[var(--text-secondary)]" />} label="Headquarters" value={stock.headquarters} />
        <MetaItem
          icon={<GlobeIcon className="w-4 h-4 text-[var(--text-secondary)]" />}
          label="Website"
          value={
            <span className="inline-flex items-center gap-1 text-[var(--green)]">
              {stock.website} <ExternalLinkIcon className="w-3 h-3" />
            </span>
          }
        />
      </div>
    </div>
  );
}

function FundRow({ item }) {
  if (!item) return <div />;
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[var(--border-soft)] last:border-0">
      <span className="text-[13px] text-[var(--text-secondary)]">{item.label}</span>
      <span className="text-[13px] text-[var(--text-primary)] font-medium">{item.value}</span>
    </div>
  );
}

function FundamentalsSection() {
  const rows = [];
  for (let i = 0; i < fundamentals.length; i += 2) {
    rows.push([fundamentals[i], fundamentals[i + 1]]);
  }
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-5">
        <h3 className="text-[var(--text-primary)] text-[15px] font-semibold">Fundamentals</h3>
        <InfoIcon className="w-3.5 h-3.5 text-[var(--text-muted)]" />
      </div>
      <div className="grid grid-cols-2 gap-x-12">
        {rows.map((pair, idx) => (
          <Fragment key={idx}>
            <FundRow item={pair[0]} />
            <FundRow item={pair[1]} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
      <span className="text-[11px] text-[var(--text-secondary)]">{label}</span>
    </div>
  );
}

function RowStat({ label, value, positive }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[13px] text-[var(--text-secondary)]">{label}</span>
      <span className={`text-[13px] font-medium ${positive ? "text-[var(--green)]" : "text-[var(--red)]"}`}>{value}</span>
    </div>
  );
}

function FinancialPerformance() {
  const [mode, setMode] = useState("quarterly");
  const [live, setLive] = useState(null); // { quarterly, yearly } once fetched
  const [loadState, setLoadState] = useState("loading"); // loading | ready | unavailable
  const symbol = stock.symbol;

  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");
    fetch(`${STOCKS_API_BASE}/api/financials/${encodeURIComponent(symbol)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("request failed"))))
      .then((data) => {
        if (cancelled) return;
        if (data && data.quarterly && data.quarterly.length >= 2 && data.yearly && data.yearly.length >= 2) {
          setLive(data);
          setLoadState("ready");
        } else {
          setLoadState("unavailable");
        }
      })
      .catch(() => { if (!cancelled) setLoadState("unavailable"); });
    return () => { cancelled = true; };
  }, [symbol]);

  const source = live || financials;
  const data = source[mode];

  const { bars, maxV } = useMemo(() => {
    const maxV = Math.max(...data.map((d) => d.revenue)) * 1.1;
    return { bars: data, maxV };
  }, [data]);

  if (loadState === "loading") {
    return (
      <div className="card">
        <h3 className="text-[var(--text-primary)] text-[15px] font-semibold mb-4">Financial performance</h3>
        <div className="text-[13px] text-[var(--text-secondary)] py-8 text-center">Loading live financials for {symbol}...</div>
      </div>
    );
  }

  if (loadState === "unavailable") {
    return (
      <div className="card">
        <h3 className="text-[var(--text-primary)] text-[15px] font-semibold mb-4">Financial performance</h3>
        <div className="text-[13px] text-[var(--text-secondary)] py-8 text-center">
          Financial performance data isn't available for {symbol} right now.
        </div>
      </div>
    );
  }

  const last = data[data.length - 1];
  const prev = data[data.length - 2];
  const revChangePct = (((last.revenue - prev.revenue) / prev.revenue) * 100).toFixed(2);
  const profChangePct = (((last.profit - prev.profit) / prev.profit) * 100).toFixed(2);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[var(--text-primary)] text-[15px] font-semibold">Financial performance</h3>
        <button className="flex items-center gap-1 text-[var(--green)] text-[13px] font-medium hover:opacity-80 transition-opacity">
          All Financials <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {["quarterly", "yearly"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`h-8 px-4 rounded-full text-[12px] font-medium capitalize transition-colors border ${mode === m ? "bg-[var(--green)]/10 text-[var(--green)] border-[var(--green)]/40" : "bg-transparent text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)]"}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-3">
        <Legend color="var(--blue)" label="Revenue (Cr)" />
        <Legend color="var(--green)" label="Profit (Cr)" />
      </div>

      <div className="grid grid-cols-[1fr_180px] gap-6">
        <div className="relative">
          <svg viewBox="0 0 500 240" className="w-full h-[240px]" preserveAspectRatio="none">
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--blue)" />
                <stop offset="100%" stopColor="var(--blue)" />
              </linearGradient>
              <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--green)" />
                <stop offset="100%" stopColor="var(--green)" />
              </linearGradient>
            </defs>
            {[0, 0.25, 0.5, 0.75, 1].map((t) => (
              <line key={t} x1="30" x2="500" y1={20 + t * 180} y2={20 + t * 180} stroke="#ffffff" strokeOpacity="0.04" />
            ))}
            {bars.map((b, i) => {
              const groupW = 470 / bars.length;
              const barW = 16;
              const gap = 4;
              const cx = 30 + i * groupW + groupW / 2;
              const revH = (b.revenue / maxV) * 180;
              const profH = (b.profit / maxV) * 180;
              return (
                <g key={i}>
                  <rect x={cx - barW - gap / 2} y={200 - revH} width={barW} height={revH} rx="3" fill="url(#revGrad)" />
                  <rect x={cx + gap / 2} y={200 - profH} width={barW} height={profH} rx="3" fill="url(#profGrad)" />
                </g>
              );
            })}
          </svg>
          <div className="absolute left-0 top-0 h-[200px] flex flex-col justify-between text-[10px] text-[var(--text-muted)]">
            <span>80k</span>
            <span>60k</span>
            <span>40k</span>
            <span>20k</span>
            <span>0</span>
          </div>
          <div className="flex justify-around mt-1 text-[11px] text-[var(--text-secondary)] pl-8">
            {bars.map((b) => (
              <span key={b.q}>{b.q}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-1 text-right">
          <div className="text-[11px] text-[var(--text-secondary)]">{last.q.toUpperCase()}</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-2">Revenue (Cr)</div>
          <div className="text-[var(--text-primary)] text-[18px] font-semibold">₹{last.revenue.toLocaleString("en-IN")}</div>
          <div className={`text-[12px] font-medium ${revChangePct >= 0 ? "text-[var(--green)]" : "text-[var(--red)]"}`}>
            {revChangePct >= 0 ? "+" : ""}{revChangePct}%
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-3">Profit (Cr)</div>
          <div className="text-[var(--text-primary)] text-[18px] font-semibold">₹{last.profit.toLocaleString("en-IN")}</div>
          <div className={`text-[12px] font-medium ${profChangePct >= 0 ? "text-[var(--green)]" : "text-[var(--red)]"}`}>
            {profChangePct >= 0 ? "+" : ""}{profChangePct}%
          </div>
        </div>
      </div>

      {(() => {
        const yearly = source.yearly;
        const lastY = yearly[yearly.length - 1];
        const prevY = yearly[yearly.length - 2];
        const oldY = yearly[Math.max(0, yearly.length - 4)]; // ~3 years back if available
        const yearsBack = yearly.length - 1 - Math.max(0, yearly.length - 4);
        const pctChange = (curr, base) => (base ? (((curr - base) / base) * 100).toFixed(1) : null);
        const cagr = (curr, base, years) =>
          base > 0 && curr > 0 && years > 0 ? ((Math.pow(curr / base, 1 / years) - 1) * 100).toFixed(1) : null;

        const rev1Y = pctChange(lastY.revenue, prevY.revenue);
        const prof1Y = pctChange(lastY.profit, prevY.profit);
        const revCagr = yearsBack > 0 ? cagr(lastY.revenue, oldY.revenue, yearsBack) : null;
        const profCagr = yearsBack > 0 ? cagr(lastY.profit, oldY.profit, yearsBack) : null;

        const fmt = (v) => (v == null ? "—" : `${v >= 0 ? "+" : ""}${v}%`);

        return (
          <div className="grid grid-cols-2 gap-6 mt-6 pt-5 border-t border-[var(--border-soft)]">
            <div>
              <RowStat label="1Y (TTM)" value={fmt(rev1Y)} positive={rev1Y == null || rev1Y >= 0} />
              <RowStat label="3Y CAGR" value={fmt(revCagr)} positive={revCagr == null || revCagr >= 0} />
            </div>
            <div>
              <RowStat label="1Y (TTM)" value={fmt(prof1Y)} positive={prof1Y == null || prof1Y >= 0} />
              <RowStat label="3Y CAGR" value={fmt(profCagr)} positive={profCagr == null || profCagr >= 0} />
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function RangeBar({ low, high, current }) {
  const pct = ((current - low) / (high - low)) * 100;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-[var(--text-secondary)]">L</span>
      <div className="relative flex-1 h-1 rounded-full bg-gradient-to-r from-[var(--red)] via-[var(--yellow)] to-[var(--green)]">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white ring-2 ring-[var(--bg-card)]"
          style={{ left: `calc(${pct}% - 5px)` }}
        />
      </div>
      <span className="text-[11px] text-[var(--text-secondary)]">H</span>
    </div>
  );
}

// Renders an <img> that walks through a list of candidate logo URLs on
// error (curated domain first, then a couple of name-guessed ones from
// logos.js), calling onExhausted once none of them load so the caller
// can fall back to its own initials placeholder.
function ChainedLogoImg({ candidates, className, onExhausted }) {
  const [idx, setIdx] = useState(0);
  if (!candidates || idx >= candidates.length) return null;
  return (
    <img
      src={candidates[idx]}
      alt=""
      loading="lazy"
      className={className}
      onError={() => {
        if (idx + 1 >= candidates.length) onExhausted && onExhausted();
        setIdx((i) => i + 1);
      }}
    />
  );
}

// Real data has no curated logoBg/short-logo text (that was hand-picked for
// the 4 hardcoded demo rows), so derive both deterministically from the
// symbol: a stable hashed color plus its first letter as the fallback.
const LOGO_BG_PALETTE = ["#1E2A3A", "#3B2A20", "#1B2340", "#1F3520", "#3A1F2E", "#2A2A1E", "#1E3A38"];
function fallbackLogoBg(symbol) {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) hash = (hash * 31 + symbol.charCodeAt(i)) >>> 0;
  return LOGO_BG_PALETTE[hash % LOGO_BG_PALETTE.length];
}

function SimilarStockLogo({ stock }) {
  const candidates = window.PBLogos ? window.PBLogos.getLogoCandidates(stock.symbol, stock.name) : [];
  const [failed, setFailed] = useState(false);
  const initial = (stock.symbol || stock.name || "?").trim().charAt(0).toUpperCase();

  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-[var(--text-primary)] ring-1 ring-[var(--border-color)] relative overflow-hidden"
      style={{ background: fallbackLogoBg(stock.symbol || stock.name || "?") }}
    >
      {candidates.length > 0 && !failed && (
        <ChainedLogoImg
          candidates={candidates}
          className="absolute inset-0 w-full h-full object-contain p-1.5 bg-white"
          onExhausted={() => setFailed(true)}
        />
      )}
      {(!candidates.length || failed) && initial}
    </div>
  );
}

function SimilarStocks() {
  const [rows, setRows] = useState([]);
  const [loadState, setLoadState] = useState("loading"); // loading | ready | error
  const symbol = stock.symbol;

  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");
    fetch(`${STOCKS_API_BASE}/api/similar/${encodeURIComponent(symbol)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("request failed"))))
      .then((data) => {
        if (cancelled) return;
        setRows(Array.isArray(data) ? data : []);
        setLoadState("ready");
      })
      .catch(() => { if (!cancelled) setLoadState("error"); });
    return () => { cancelled = true; };
  }, [symbol]);

  const goToStock = (sym) => {
    window.location.href = `?symbol=${encodeURIComponent(sym)}`;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[var(--text-primary)] text-[15px] font-semibold">Similar stocks</h3>
      </div>

      <div className="grid grid-cols-[1.6fr_1fr_1.4fr_1fr_0.8fr] gap-4 py-2 text-[11px] text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-soft)]">
        <span>Stock</span>
        <span>Mkt price (1D)</span>
        <span>52 week performance</span>
        <span className="flex items-center gap-1">Market cap <ChevronRightIcon className="w-3 h-3 rotate-90" /></span>
        <span className="text-right">P/E ratio</span>
      </div>

      {loadState === "loading" && (
        <div className="py-8 text-center text-[13px] text-[var(--text-secondary)]">Loading similar stocks...</div>
      )}
      {loadState === "error" && (
        <div className="py-8 text-center text-[13px] text-[var(--text-secondary)]">Couldn't load similar stocks right now.</div>
      )}
      {loadState === "ready" && rows.length === 0 && (
        <div className="py-8 text-center text-[13px] text-[var(--text-secondary)]">No similar stocks found for {symbol}.</div>
      )}

      {loadState === "ready" && rows.length > 0 && (
        <div>
          {rows.map((s) => (
            <div
              key={s.symbol}
              onClick={() => goToStock(s.symbol)}
              className="grid grid-cols-[1.6fr_1fr_1.4fr_1fr_0.8fr] gap-4 items-center py-4 border-b border-[var(--border-soft)] last:border-0 hover:bg-[var(--bg-card-alt)] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <SimilarStockLogo stock={s} />
                <div>
                  <div className="text-[var(--text-primary)] text-[13px] font-medium">{s.name}</div>
                  <div className="text-[var(--text-muted)] text-[11px]">{s.symbol}</div>
                </div>
              </div>
              <div>
                <div className="text-[var(--text-primary)] text-[13px] font-medium">₹{Number(s.price).toLocaleString("en-IN")}</div>
                <div className={`text-[11px] ${s.is_up ? "text-[var(--green)]" : "text-[var(--red)]"}`}>
                  {s.is_up ? "+" : ""}{s.change} ({s.changePct}%)
                </div>
              </div>
              {s.weekLow != null && s.weekHigh != null ? (
                <RangeBar low={s.weekLow} high={s.weekHigh} current={s.price} />
              ) : (
                <span className="text-[12px] text-[var(--text-muted)]">—</span>
              )}
              <div className="text-[var(--text-primary)] text-[13px]">
                {s.marketCapCr != null ? `₹${Number(s.marketCapCr).toLocaleString("en-IN")} Cr` : "—"}
              </div>
              <div className="text-[var(--text-primary)] text-[13px] text-right">{s.peRatio != null ? s.peRatio : "—"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RobotSVG() {
  return (
    <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
      <line x1="40" y1="12" x2="36" y2="2" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="80" y1="12" x2="84" y2="2" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="36" cy="2" r="2" fill="var(--green)" />
      <circle cx="84" cy="2" r="2" fill="var(--green)" />
      <rect x="22" y="12" width="76" height="64" rx="18" fill="#0A0F1D" stroke="var(--green)" strokeOpacity="0.6" strokeWidth="1.5" />
      <rect x="30" y="22" width="60" height="44" rx="12" fill="#050914" />
      <ellipse cx="48" cy="42" rx="6" ry="7" fill="var(--green)" />
      <ellipse cx="72" cy="42" rx="6" ry="7" fill="var(--green)" />
      <path d="M50 54 Q60 60 70 54" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <rect x="52" y="76" width="16" height="6" fill="#1B2537" />
      <rect x="18" y="82" width="84" height="48" rx="14" fill="#0F1626" stroke="var(--green)" strokeOpacity="0.5" strokeWidth="1.5" />
      <circle cx="60" cy="106" r="6" fill="var(--green)" fillOpacity="0.4" />
      <circle cx="60" cy="106" r="3" fill="var(--green)" />
      <rect x="6" y="90" width="10" height="26" rx="5" fill="#0F1626" stroke="var(--green)" strokeOpacity="0.5" strokeWidth="1.5" />
      <rect x="104" y="90" width="10" height="26" rx="5" fill="#0F1626" stroke="var(--green)" strokeOpacity="0.5" strokeWidth="1.5" />
    </svg>
  );
}

function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;

    const historyForRequest = messages; // snapshot before appending the new turn
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);

    // Send along whatever we currently know about the stock so the model
    // can ground its answer instead of guessing at numbers.
    const stockContext = {
      symbol: stock.symbol,
      name: stock.name,
      exchange: stock.exchange,
      sector: stock.sector,
      cap: stock.cap,
      price: stock.price,
      change: stock.change,
      pct: stock.pct,
      todaysLow: stock.todaysLow,
      todaysHigh: stock.todaysHigh,
      weekLow: stock.weekLow,
      weekHigh: stock.weekHigh,
      open: stock.open,
      prevClose: stock.prevClose,
      volume: stock.volume,
      about: stock.about,
    };

    try {
      const res = await fetch(`${STOCKS_API_BASE}/api/ai-assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          stockContext,
          history: historyForRequest,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setMessages((m) => [...m, { role: "ai", text: data.reply || "Sorry, I couldn't get an answer for that." }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "ai", text: "Couldn't reach the AI Assistant. Make sure the backend server is running on http://localhost:5000." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="card sticky top-[92px] h-fit">
      <div className="flex items-center gap-2">
        <SparklesIcon className="w-4 h-4 text-[var(--green)]" />
        <h3 className="text-[var(--text-primary)] text-[15px] font-semibold">AI Assistant</h3>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="relative w-[180px] h-[180px] rounded-2xl bg-gradient-to-br from-[#0F1B2E] to-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,var(--green)_0%,transparent_60%)] opacity-20" />
          <RobotSVG />
        </div>
      </div>

      <div className="mt-6">
        <div className="text-[var(--text-primary)] text-[15px] font-semibold">Hi! I'm PaperBull AI <span>👋</span></div>
        <p className="text-[var(--text-secondary)] text-[13px] mt-1 leading-relaxed">Ask me anything about TCS or the stock market.</p>
      </div>

      {messages.length === 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-2">
          {aiSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-left px-3 py-2.5 rounded-xl bg-[var(--bg-card-alt)] border border-[var(--border-color)] text-[var(--text-primary)] text-[12px] hover:bg-[var(--bg-pill)] hover:border-[var(--border-color)] transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-2 max-h-[240px] overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`px-3 py-2 rounded-xl text-[12px] leading-relaxed ${m.role === "user" ? "bg-[var(--green)]/10 text-[var(--text-primary)] border border-[var(--green)]/20 ml-6" : "bg-[var(--bg-card-alt)] text-[var(--text-primary)] border border-[var(--border-color)] mr-6"}`}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="px-3 py-2 rounded-xl text-[12px] leading-relaxed bg-[var(--bg-card-alt)] text-[var(--text-secondary)] border border-[var(--border-color)] mr-6">
              Thinking...
            </div>
          )}
        </div>
      )}

      <div className="mt-4 relative">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask anything..."
          disabled={loading}
          className="w-full h-11 pl-4 pr-12 rounded-xl bg-[var(--bg-card-alt)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--green)]/40 transition-colors disabled:opacity-60"
        />
        <button
          onClick={() => send()}
          disabled={loading}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[var(--green)] hover:bg-[var(--green)] flex items-center justify-center transition-colors disabled:opacity-60"
        >
          <SendIcon className="w-3.5 h-3.5 text-[var(--bg-card)]" />
        </button>
      </div>
    </aside>
  );
}

function formatINR(n, decimals = 2) {
  if (n == null || Number.isNaN(n)) return "—";
  return Number(n).toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function FilterCheckGroup({ title, options, selected, onToggle, searchable, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const [q, setQ] = useState("");
  const visible = searchable && q ? options.filter((o) => o.toLowerCase().includes(q.toLowerCase())) : options;

  return (
    <div className="filter-group">
      <div className="filter-group-header" onClick={() => setOpen((o) => !o)}>
        <span className="filter-group-title">{title}</span>
        <ChevronRightIcon className={`filter-group-chevron${open ? " open" : ""}`} />
      </div>
      {open && (
        <>
          {searchable && (
            <div className="filter-search">
              <SearchIcon />
              <input placeholder={`Search for ${title.toLowerCase()}`} value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          )}
          <div className="filter-checklist">
            {visible.map((opt) => (
              <label key={opt} className="filter-checkbox-row">
                <input type="checkbox" checked={selected.has(opt)} onChange={() => onToggle(opt)} />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DualRangeFilter({ title, min, max, value, onChange, prefix = "" }) {
  const [lo, hi] = value;
  const pctLo = (lo / max) * 100;
  const pctHi = (hi / max) * 100;

  return (
    <div className="filter-group">
      <div className="filter-group-header">
        <span className="filter-group-title">{title}</span>
      </div>

      <div className="range-inputs">
        <input
          type="number"
          value={lo}
          min={min}
          max={hi}
          onChange={(e) => onChange([Math.min(Number(e.target.value) || 0, hi), hi])}
        />
        <span className="range-inputs-sep">To</span>
        <input
          type="number"
          value={hi}
          min={lo}
          max={max}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value) || 0, lo)])}
        />
      </div>

      <div className="range-slider-track">
        <div className="range-slider-fill" style={{ left: `${pctLo}%`, width: `${pctHi - pctLo}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
        />
      </div>
    </div>
  );
}

function FiltersPanel({ filters, setFilters, onClearAll }) {
  const toggleSector = (s) => {
    setFilters((f) => {
      const next = new Set(f.sectors);
      next.has(s) ? next.delete(s) : next.add(s);
      return { ...f, sectors: next };
    });
  };

  const toggleIndex = (i) => {
    setFilters((f) => {
      const next = new Set(f.indices);
      next.has(i) ? next.delete(i) : next.add(i);
      return { ...f, indices: next };
    });
  };

  const setCapBucket = (bucket) => {
    setFilters((f) => ({ ...f, capBucket: f.capBucket === bucket ? null : bucket }));
  };

  return (
    <aside className="filters-panel">
      <div className="filters-panel-header">
        <span className="filters-panel-title">Filters</span>
        <button className="filters-clear-all" onClick={onClearAll}>Clear all</button>
      </div>

      <FilterCheckGroup title="Sectors" options={SECTOR_OPTIONS} selected={filters.sectors} onToggle={toggleSector} searchable />
      <FilterCheckGroup title="Indices" options={INDEX_OPTIONS} selected={filters.indices} onToggle={toggleIndex} />

      <div className="filter-group">
        <DualRangeFilter
          title="Market Cap (Cr)"
          min={0}
          max={CAP_RANGE_MAX}
          value={filters.marketCap}
          onChange={(v) => setFilters((f) => ({ ...f, marketCap: v }))}
        />
        <div className="filter-quick-buttons">
          {["Small Cap", "Mid Cap", "Large Cap"].map((label) => {
            const bucket = label.replace(" Cap", "");
            return (
              <button
                key={label}
                className={`filter-quick-btn${filters.capBucket === bucket ? " active" : ""}`}
                onClick={() => setCapBucket(bucket)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="filter-group">
        <DualRangeFilter
          title="Price Range (₹)"
          min={0}
          max={PRICE_RANGE_MAX}
          value={filters.price}
          onChange={(v) => setFilters((f) => ({ ...f, price: v }))}
        />
      </div>
    </aside>
  );
}

// Module-level cache so a row's real chart, once fetched via /api/series,
// survives re-renders/re-mounts (filtering, re-sorting, navigating back from
// a stock's detail page) instead of re-fetching every time.
const rowSeriesCache = new Map(); // symbol -> number[] of closes

function StockListRow({ item, onSelect }) {
  const [added, setAdded] = useState(() => isInWatchlist(item.symbol));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [rowSeries, setRowSeries] = useState(() => rowSeriesCache.get(item.symbol) || null);
  const rowRef = useRef(null);
  const up = item.is_up;
  const initial = (item.symbol || item.name || "?").trim().charAt(0).toUpperCase();
  const logoCandidates = window.PBLogos ? window.PBLogos.getLogoCandidates(item.symbol, item.name) : [];
  const [logoFailed, setLogoFailed] = useState(false);

  // Pull the row's chart from the exact same endpoint (`/api/series/:symbol`)
  // that already renders correctly on the stock detail page, instead of
  // depending on the bulk /api/stocks snapshot's `spark` field (which needs
  // the whole-universe quote batch to succeed for this symbol). Fetches only
  // once the row actually scrolls into view — with 2000+ rows in the table,
  // firing off a request for every row on mount would hammer the backend —
  // and keeps it refreshing every 15s while visible so it stays live.
  useEffect(() => {
    const el = rowRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    let cancelled = false;
    let timer = null;

    const load = () => {
      fetch(`${STOCKS_API_BASE}/api/series/${encodeURIComponent(item.symbol)}?range=1D`)
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return;
          if (Array.isArray(data.points) && data.points.length >= 2) {
            const closes = data.points.map((p) => p.close).filter((c) => typeof c === "number");
            if (closes.length >= 2) {
              rowSeriesCache.set(item.symbol, closes);
              setRowSeries(closes);
            }
          }
        })
        .catch(() => {});
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting;
        if (visible) {
          if (!rowSeriesCache.has(item.symbol)) load();
          if (!timer) timer = setInterval(load, 15000);
        } else if (timer) {
          clearInterval(timer);
          timer = null;
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [item.symbol]);

  // Prefer the row's real chart from /api/series (rowSeries). Fall back to
  // whatever the bulk snapshot sent (item.spark) if that hasn't loaded yet,
  // and only fall back to a deterministic placeholder squiggle if neither
  // has real data (e.g. first paint before the row has scrolled into view).
  const sparkPoints = useMemo(() => {
    const closes = Array.isArray(rowSeries) && rowSeries.length >= 2
      ? rowSeries
      : (Array.isArray(item.spark) ? item.spark.filter((c) => typeof c === "number") : []);
    if (closes.length >= 2) {
      const min = Math.min(...closes);
      const max = Math.max(...closes);
      const span = max - min || 1;
      return closes
        .map((c, i) => {
          const x = (i / (closes.length - 1)) * 100;
          const y = 23 - ((c - min) / span) * 21;
          return `${x.toFixed(2)},${y.toFixed(1)}`;
        })
        .join(" ");
    }

    let seed = 0;
    for (let i = 0; i < item.symbol.length; i++) seed = (seed * 17 + item.symbol.charCodeAt(i)) % 97;
    const pts = [];
    let v = 12;
    for (let i = 0; i < 8; i++) {
      seed = (seed * 53 + 7) % 97;
      v += ((seed % 9) - (up ? 3 : 5)) * 0.8;
      v = Math.max(2, Math.min(22, v));
      pts.push(`${(i / 7) * 100},${(24 - v).toFixed(1)}`);
    }
    return pts.join(" ");
  }, [item.symbol, item.spark, rowSeries, up]);

  const handleAdd = (e) => {
    e.stopPropagation();
    setPickerOpen(true);
  };

  return (
    <tr ref={rowRef} onClick={() => onSelect(item)}>
      <td>
        <div className="stock-row-company">
          <div className="stock-row-logo">
            {logoCandidates.length > 0 && !logoFailed && (
              <ChainedLogoImg candidates={logoCandidates} onExhausted={() => setLogoFailed(true)} />
            )}
            {(!logoCandidates.length || logoFailed) && initial}
          </div>
          <div>
            <div className="stock-row-name">{item.name}</div>
            <div className="stock-row-symbol">{item.symbol}</div>
          </div>
        </div>
      </td>
      <td>
        <svg className={`stock-row-spark ${up ? "spark-up" : "spark-down"}`} viewBox="0 0 100 24" preserveAspectRatio="none">
          <polyline points={sparkPoints} />
        </svg>
      </td>
      <td className="num">
        <div className="stock-row-price tnum">₹{formatINR(item.price)}</div>
        <div className={`stock-row-change tnum ${up ? "up" : "down"}`}>
          {up ? "+" : ""}{formatINR(item.change)} ({up ? "+" : ""}{formatINR(item.changePct)}%)
        </div>
      </td>
      <td className="num">
        <div className="stock-row-mcap tnum">{item.marketCapCr != null ? `₹${Number(item.marketCapCr).toLocaleString("en-IN")}` : "—"}</div>
      </td>
      <td>
        <button className={`stock-row-add${added ? " added" : ""}`} onClick={handleAdd} title={added ? "In watchlist" : "Add to watchlist"}>
          {added ? <CheckIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
        </button>
        {pickerOpen && (
          <PlaylistPickerModal
            symbol={item.symbol}
            name={item.name}
            onClose={() => setPickerOpen(false)}
            onChange={setAdded}
          />
        )}
      </td>
    </tr>
  );
}

function AllStocksPage({ navActive, onNavChange, onSelectStock }) {
  const [stocksData, setStocksData] = useState([]);
  const [loadState, setLoadState] = useState("loading"); // loading | ready | error
  const [searchTerm, setSearchTerm] = useState(
    () => new URLSearchParams(window.location.search).get("q") || ""
  );
  const [filters, setFilters] = useState({
    sectors: new Set(),
    indices: new Set(),
    capBucket: null,
    marketCap: [0, CAP_RANGE_MAX],
    price: [0, PRICE_RANGE_MAX],
  });

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("q")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = (silent) => {
      if (!silent) setLoadState("loading");
      fetchStocksList()
        .then((data) => {
          if (cancelled) return;
          setStocksData(Array.isArray(data) ? data : []);
          setLoadState("ready");
        })
        .catch(() => {
          if (!cancelled && !silent) setLoadState("error");
        });
    };

    load(false);

    // Keep prices and sparklines live while this page is open instead of
    // only ever fetching once on mount.
    const LIVE_REFRESH_MS = 15000;
    const timer = setInterval(() => {
      if (document.hidden) return;
      load(true);
    }, LIVE_REFRESH_MS);

    const onVisibility = () => {
      if (!document.hidden) load(true);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const clearAll = () => {
    setFilters({
      sectors: new Set(),
      indices: new Set(),
      capBucket: null,
      marketCap: [0, CAP_RANGE_MAX],
      price: [0, PRICE_RANGE_MAX],
    });
    setSearchTerm("");
  };

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return stocksData.filter((s) => {
      if (term && !s.name.toLowerCase().includes(term) && !s.symbol.toLowerCase().includes(term)) return false;
      if (filters.sectors.size > 0 && !filters.sectors.has(s.sector)) return false;
      if (filters.indices.size > 0 && !(s.indices || []).some((i) => filters.indices.has(i))) return false;
      if (filters.capBucket && s.cap !== filters.capBucket) return false;
      if (s.marketCapCr != null && (s.marketCapCr < filters.marketCap[0] || s.marketCapCr > filters.marketCap[1])) return false;
      if (s.price < filters.price[0] || s.price > filters.price[1]) return false;
      return true;
    });
  }, [stocksData, searchTerm, filters]);

  const chips = [];
  filters.sectors.forEach((s) =>
    chips.push({ key: `sector-${s}`, label: s, onRemove: () => setFilters((f) => { const n = new Set(f.sectors); n.delete(s); return { ...f, sectors: n }; }) })
  );
  filters.indices.forEach((i) =>
    chips.push({ key: `index-${i}`, label: i, onRemove: () => setFilters((f) => { const n = new Set(f.indices); n.delete(i); return { ...f, indices: n }; }) })
  );
  if (filters.capBucket) {
    chips.push({ key: "cap", label: `${filters.capBucket} Cap`, onRemove: () => setFilters((f) => ({ ...f, capBucket: null })) });
  }
  if (filters.marketCap[0] > 0 || filters.marketCap[1] < CAP_RANGE_MAX) {
    chips.push({
      key: "mcap-range",
      label: `Market Cap ₹${filters.marketCap[0].toLocaleString("en-IN")}–₹${filters.marketCap[1].toLocaleString("en-IN")} Cr`,
      onRemove: () => setFilters((f) => ({ ...f, marketCap: [0, CAP_RANGE_MAX] })),
    });
  }
  if (filters.price[0] > 0 || filters.price[1] < PRICE_RANGE_MAX) {
    chips.push({
      key: "price-range",
      label: `Price ₹${filters.price[0].toLocaleString("en-IN")}–₹${filters.price[1].toLocaleString("en-IN")}`,
      onRemove: () => setFilters((f) => ({ ...f, price: [0, PRICE_RANGE_MAX] })),
    });
  }

  return (
    <div className="stocks-page">
      <div className="sticky-header-wrapper">
        <TopNav active={navActive} onChange={onNavChange} />
        <IndicesTicker />
      </div>

      <main className="max-w-[1600px] mx-auto px-8 py-6">
        <h1 className="text-[var(--text-primary)] text-2xl font-semibold mb-5">All Stocks</h1>

        <div className="all-stocks-layout">
          <FiltersPanel filters={filters} setFilters={setFilters} onClearAll={clearAll} />

          <div className="stocks-list-col">
            <div className="stocks-toolbar">
              <div className="stocks-search-box">
                <SearchIcon />
                <input placeholder="Search stocks, e.g. Reliance, TCS..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <button className="stocks-toolbar-btn text-btn" onClick={clearAll}>Clear All</button>
            </div>

            <div className="stocks-results-row">
              <div className="stocks-results-count">
                Search results: <span>{loadState === "ready" ? filtered.length : "…"} stocks</span>
              </div>
              {chips.length > 0 && (
                <div className="active-filter-chips">
                  {chips.map((c) => (
                    <span key={c.key} className="filter-chip">
                      {c.label}
                      <button onClick={c.onRemove}><XIcon className="w-2.5 h-2.5" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="stocks-table-wrap">
              {loadState === "loading" && (
                <div className="stocks-empty-state">Loading live market data...</div>
              )}
              {loadState === "error" && (
                <div className="stocks-empty-state">
                  Failed to load stocks. Ensure the backend server is running on {STOCKS_API_BASE}.
                </div>
              )}
              {loadState === "ready" && filtered.length === 0 && (
                <div className="stocks-empty-state">No stocks match your filters.</div>
              )}
              {loadState === "ready" && filtered.length > 0 && (
                <table className="stocks-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th></th>
                      <th className="num">Market Price</th>
                      <th className="num">Market Cap (Cr)</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <StockListRow key={s.symbol} item={s} onSelect={onSelectStock} />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StocksPage({ navActive, onNavChange, onBackToList }) {
  const [tab, setTab] = useState("Overview");
  const [, forceUpdate] = useState(0);

  // Pull live price/fundamentals/company-profile for whichever stock is
  // currently selected (works whether we got here via the All Stocks list,
  // the dashboard, watchlist, or a direct URL with ?symbol=...).
  useEffect(() => {
    let cancelled = false;
    fetchStockDetail(stock.symbol)
      .then((data) => {
        if (cancelled) return;
        mergeStockDetail(data);
        forceUpdate((n) => n + 1);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [stock.symbol]);

  return (
    <div className="stocks-page">
      <div className="sticky-header-wrapper">
        <TopNav active={navActive} onChange={onNavChange} />
        <IndicesTicker />
      </div>

      <main className="max-w-[1600px] mx-auto px-8 py-6">
        {onBackToList && (
          <button className="stocks-back-link mb-4" onClick={onBackToList}>
            <ArrowLeftIcon /> All Stocks
          </button>
        )}
        <div className="grid grid-cols-[1fr_380px] gap-6">
          <div className="space-y-4">
            <StockHeader />
            <StockTabs active={tab} onChange={setTab} />
            <PerformanceChart />
            <AboutSection />
            <FundamentalsSection />
            <FinancialPerformance />
            <SimilarStocks />
            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-2 pb-6">
              <span>Source: NSE India</span>
              <span>* All values are approximate</span>
            </div>
          </div>

          <div>
            <AIAssistant />
          </div>
        </div>
      </main>
    </div>
  );
}

function PlaceholderPage({ title, navActive, onNavChange }) {
  return (
    <div className="stocks-page">
      <div className="sticky-header-wrapper">
        <TopNav active={navActive} onChange={onNavChange} />
        <IndicesTicker />
      </div>
      <div className="max-w-[1600px] mx-auto px-8 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--green)]/10 border border-[var(--green)]/30 text-[var(--green)] text-[12px] font-medium">
          Coming soon
        </div>
        <h1 className="mt-4 text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-[var(--text-secondary)]">This section is part of the PaperBull demo.</p>
      </div>
    </div>
  );
}

function useStickyHeaderOnScroll() {

}

function App() {
  const [navActive, setNavActive] = useState("Stocks");
  // Land on the All Stocks browsing page unless we arrived via a direct
  // stock link (e.g. clicked from the dashboard), in which case go straight
  // to that stock's detail page.
  const [stocksView, setStocksView] = useState(initialSymbolFromQuery ? "detail" : "list");
  useStickyHeaderOnScroll();

  const handleNavChange = (t) => {
    setNavActive(t);
    if (t === "Stocks") setStocksView("list");
  };

  const handleSelectStock = (entry) => {
    applyEntryToStock(entry);
    window.history.replaceState(null, "", `?symbol=${encodeURIComponent(entry.symbol)}`);
    setStocksView("detail");
  };

  if (navActive === "Stocks") {
    if (stocksView === "list") {
      return <AllStocksPage navActive={navActive} onNavChange={handleNavChange} onSelectStock={handleSelectStock} />;
    }
    return (
      <StocksPage
        navActive={navActive}
        onNavChange={handleNavChange}
        onBackToList={() => setStocksView("list")}
      />
    );
  }

  return <PlaceholderPage title={navActive} navActive={navActive} onNavChange={handleNavChange} />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);