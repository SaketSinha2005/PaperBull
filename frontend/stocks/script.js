const { useState, useMemo, useEffect, Fragment } = React;

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

const indices = [
  { name: "NIFTY", value: "24,056.00", change: "+34.35", pct: "+0.14%", up: true },
  { name: "SENSEX", value: "77,100.47", change: "+109.25", pct: "+0.14%", up: true },
  { name: "BANKNIFTY", value: "58,177.05", change: "+26.70", pct: "+0.05%", up: true },
  { name: "MIDCNIFTY", value: "14,434.55", change: "-81.85", pct: "-0.56%", up: false },
  { name: "FINNIFTY", value: "26,770.55", change: "+34.15", pct: "+0.13%", up: true },
];

const navTabs = ["Dashboard", "Stocks", "Options", "Watchlist", "Orders", "Holding"];

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

const WATCHLIST_KEY = "paperbull_watchlist";

function getWatchlist() {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function saveWatchlist(list) {
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
  } catch (err) {}
}

function isInWatchlist(symbol) {
  return getWatchlist().some((s) => s.symbol === symbol);
}

function toggleWatchlist(entry) {
  const list = getWatchlist();
  const idx = list.findIndex((s) => s.symbol === entry.symbol);
  if (idx >= 0) {
    list.splice(idx, 1);
    saveWatchlist(list);
    return false;
  }
  list.push(entry);
  saveWatchlist(list);
  return true;
}

const stockTabs = ["Overview", "Technicals", "News", "Events", "F&O"];
const timeRanges = ["1D", "1W", "1M", "3M", "6M", "1Y", "3Y", "5Y", "Max"];

const perfSeries = [
  { m: "May '25", v: 2100 },
  { m: "Jun '25", v: 2350 },
  { m: "Jul '25", v: 2680 },
  { m: "Aug '25", v: 2900 },
  { m: "Sep '25", v: 3100 },
  { m: "Oct '25", v: 3020 },
  { m: "Nov '25", v: 3450 },
  { m: "Dec '25", v: 3900 },
  { m: "Jan '26", v: 4400 },
  { m: "Feb '26", v: 4100 },
  { m: "Mar '26", v: 3600 },
];

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

const shareholding = {
  quarters: ["Mar '25", "Jun '25", "Sep '25", "Dec '25", "Mar '26"],
  data: {
    "Mar '26": [
      { label: "Promoters", pct: 71.77 },
      { label: "Foreign Institutions", pct: 9.66 },
      { label: "Other Domestic Institutions", pct: 7.64 },
      { label: "Retail & Others", pct: 10.93 },
    ],
    "Dec '25": [
      { label: "Promoters", pct: 71.77 },
      { label: "Foreign Institutions", pct: 10.1 },
      { label: "Other Domestic Institutions", pct: 7.2 },
      { label: "Retail & Others", pct: 10.93 },
    ],
    "Sep '25": [
      { label: "Promoters", pct: 71.77 },
      { label: "Foreign Institutions", pct: 10.44 },
      { label: "Other Domestic Institutions", pct: 7.0 },
      { label: "Retail & Others", pct: 10.79 },
    ],
    "Jun '25": [
      { label: "Promoters", pct: 71.77 },
      { label: "Foreign Institutions", pct: 11.02 },
      { label: "Other Domestic Institutions", pct: 6.6 },
      { label: "Retail & Others", pct: 10.61 },
    ],
    "Mar '25": [
      { label: "Promoters", pct: 71.77 },
      { label: "Foreign Institutions", pct: 11.55 },
      { label: "Other Domestic Institutions", pct: 6.2 },
      { label: "Retail & Others", pct: 10.48 },
    ],
  },
};

const similarStocks = [
  { logo: "HCL", logoBg: "#1E2A3A", name: "HCL Technologies", symbol: "HCLTECH", price: "1,034.20", change: "-37.60", pct: "(3.51%)", up: false, low: 900, high: 1600, current: 1034, mcap: "2,90,904.90", pe: "22.36" },
  { logo: "W", logoBg: "#3B2A20", name: "Wipro", symbol: "WIPRO", price: "170.13", change: "-0.26", pct: "(0.15%)", up: false, low: 130, high: 320, current: 170, mcap: "1,78,980.49", pe: "18.91" },
  { logo: "L&T", logoBg: "#1B2340", name: "L&T Technology Services", symbol: "LTTS", price: "3,546.70", change: "+8.70", pct: "(0.25%)", up: true, low: 2400, high: 5800, current: 3546, mcap: "1,04,955.00", pe: "28.14" },
  { logo: "M", logoBg: "#1F3520", name: "Mphasis", symbol: "MPHASIS", price: "2,126.80", change: "-34.80", pct: "(1.61%)", up: false, low: 1800, high: 3200, current: 2126, mcap: "41,270.44", pe: "21.77" },
];

const aiSuggestions = [
  "How has TCS performed in the last 1 year?",
  "What are the key strengths of TCS?",
  "Compare TCS with similar stocks",
];

const SECTOR_OPTIONS = [
  "Agriculture", "Banking", "Construction Materials", "Consumer Durables", "Diversified",
  "Energy", "FMCG", "Financial", "Healthcare", "Infrastructure", "IT - Services",
  "Metals & Mining", "Telecom", "Automobile & Ancillaries",
];

const INDEX_OPTIONS = [
  "Nifty 50", "Nifty Next 50", "Nifty Midcap 150", "Nifty Smallcap 250",
  "Bank Nifty", "Fin Nifty", "Nifty 100",
];

const CAP_RANGE_MAX = 2000000;
const PRICE_RANGE_MAX = 10000;

const navRoutes = {
  Dashboard: "../dashboard/index.html",
  Stocks: "#",
  Options: "#",
  Watchlist: "../dashboard/watchlist.html",
  Orders: "#",
  Holding: "#",
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
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <input type="text" placeholder="Search stocks, options..." />
        </div>
        <ProfileMenu />
      </div>
    </header>
  );
}

function IndicesTicker() {
  return (
    <div className="ticker-strip">
      <div className="ticker-left">
        {indices.map((i) => (
          <span key={i.name} className="ticker-item">
            <span className="ticker-name">{i.name}</span> <span className="ticker-val">{i.value}</span>{" "}
            <span className={i.up ? "up" : "down"}>{i.change} ({i.pct.replace("+", "").replace("-", "")})</span>
          </span>
        ))}
      </div>
      <div className="ticker-right">9/15</div>
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

function StockHeader() {
  const [added, setAdded] = useState(() => isInWatchlist(stock.symbol));

  const handleToggleWatchlist = () => {
    const nowAdded = toggleWatchlist({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      change: stock.change,
      pct: stock.pct,
      up: stock.up,
    });
    setAdded(nowAdded);
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--blue)] to-[var(--blue)] flex items-center justify-center shrink-0 ring-1 ring-[var(--border-color)]">
            <span className="text-[var(--text-primary)] font-bold text-lg tracking-tight">{stock.symbol}</span>
          </div>
          <div>
            <h1 className="text-[var(--text-primary)] text-[22px] font-semibold leading-tight">{stock.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-[12px]">
              <span className="px-2 py-0.5 rounded-md bg-[var(--bg-pill)] text-[var(--text-secondary)] font-medium">{stock.symbol}</span>
              <span className="px-2 py-0.5 rounded-md bg-[var(--bg-pill)] text-[var(--text-secondary)] font-medium">{stock.exchange}</span>
              <span className="px-2 py-0.5 rounded-md bg-[var(--bg-pill)] text-[var(--text-secondary)] font-medium">{stock.cap}</span>
              <span className="px-2 py-0.5 rounded-md bg-[var(--bg-pill)] text-[var(--text-secondary)] font-medium">{stock.sector}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleToggleWatchlist}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${added ? "bg-[var(--green)]/10 border-[var(--green)]/40 text-[var(--green)]" : "bg-[var(--bg-card-alt)] border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-pill)]"}`}
        >
          {added ? <CheckIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />} {added ? "In Watchlist" : "Watchlist"}
        </button>
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
    </div>
  );
}

function SIPBanner() {
  return (
    <button className="group w-full flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] hover:border-[var(--green)]/30 transition-colors text-left">
      <div className="w-11 h-11 rounded-xl bg-[var(--green)]/10 border border-[var(--green)]/20 flex items-center justify-center shrink-0">
        <Repeat2Icon className="w-5 h-5 text-[var(--green)]" />
      </div>
      <div className="flex-1">
        <div className="text-[var(--text-primary)] text-[15px] font-semibold">Create Stock SIP</div>
        <div className="text-[var(--text-secondary)] text-[12px] mt-0.5">Automate your investments in this Stock</div>
      </div>
      <div className="w-9 h-9 rounded-full bg-[var(--bg-card-alt)] border border-[var(--border-color)] flex items-center justify-center group-hover:bg-[var(--green)]/10 group-hover:border-[var(--green)]/30 transition-colors">
        <ArrowRightIcon className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--green)]" />
      </div>
    </button>
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

  const { path, area, points } = useMemo(() => {
    const w = 900;
    const h = 260;
    const padL = 10;
    const padR = 10;
    const padT = 10;
    const padB = 30;
    const vals = perfSeries.map((p) => p.v);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const dx = (w - padL - padR) / (perfSeries.length - 1);
    const dy = h - padT - padB;
    const points = perfSeries.map((p, i) => {
      const x = padL + i * dx;
      const y = padT + dy - ((p.v - min) / (max - min)) * dy;
      return { x, y, ...p };
    });
    const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const area = `${path} L${points[points.length - 1].x},${h - padB} L${points[0].x},${h - padB} Z`;
    return { path, area, points };
  }, []);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-[var(--text-primary)] text-[15px] font-semibold">Performance</h3>
          <InfoIcon className="w-3.5 h-3.5 text-[var(--text-muted)]" />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
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
        <svg viewBox="0 0 900 260" className="w-full h-[260px]" preserveAspectRatio="none">
          <defs>
            <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--green)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.2, 0.4, 0.6, 0.8].map((t) => (
            <line key={t} x1="0" x2="900" y1={10 + t * 220} y2={10 + t * 220} stroke="#ffffff" strokeOpacity="0.04" />
          ))}
          <path d={area} fill="url(#perfGrad)" />
          <path d={path} fill="none" stroke="var(--green)" strokeWidth="2" />
          <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="5" fill="var(--green)" />
          <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="10" fill="var(--green)" fillOpacity="0.2" />
        </svg>
        <div className="absolute right-0 top-0 h-[230px] flex flex-col justify-between text-[11px] text-[var(--text-secondary)] pr-1">
          <span>4,800</span>
          <span>4,200</span>
          <span>3,600</span>
          <span>3,000</span>
          <span>2,400</span>
          <span>1,800</span>
        </div>
        <div className="flex justify-between mt-2 text-[11px] text-[var(--text-secondary)] px-1">
          <span>May '25</span>
          <span>Jul '25</span>
          <span>Sep '25</span>
          <span>Nov '25</span>
          <span>Jan '26</span>
          <span>Mar '26</span>
        </div>
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
  const data = financials[mode];

  const { bars, maxV } = useMemo(() => {
    const maxV = Math.max(...data.map((d) => d.revenue)) * 1.1;
    return { bars: data, maxV };
  }, [data]);

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

      <div className="grid grid-cols-2 gap-6 mt-6 pt-5 border-t border-[var(--border-soft)]">
        <div>
          <RowStat label="1Y (TTM)" value="+9%" positive />
          <RowStat label="3Y CAGR" value="+6%" positive />
        </div>
        <div>
          <RowStat label="1Y (TTM)" value="+12%" positive />
          <RowStat label="3Y CAGR" value="+5%" positive />
        </div>
      </div>
    </div>
  );
}

const BAR_COLORS = ["var(--green)", "var(--blue)", "var(--yellow)", "var(--purple)"];

function ShareholdingPattern() {
  const [q, setQ] = useState("Mar '26");
  const data = shareholding.data[q];

  return (
    <div className="card">
      <h3 className="text-[var(--text-primary)] text-[15px] font-semibold">Shareholding Pattern</h3>
      <div className="flex items-center gap-2 mt-4 mb-6">
        {shareholding.quarters.map((qq) => (
          <button
            key={qq}
            onClick={() => setQ(qq)}
            className={`h-8 px-3 rounded-full text-[12px] font-medium border transition-colors ${q === qq ? "bg-[var(--green)]/10 text-[var(--green)] border-[var(--green)]/40" : "bg-transparent text-[var(--text-secondary)] border-[var(--border-color)] hover:text-[var(--text-primary)]"}`}
          >
            {qq}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {data.map((d, i) => (
          <div key={d.label}>
            <div className="flex items-center justify-between text-[13px] mb-1.5">
              <span className="text-[var(--text-secondary)]">{d.label}</span>
              <span className="text-[var(--text-primary)] font-medium">{d.pct.toFixed(2)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--bg-card-alt)] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.min(d.pct, 100)}%`, background: BAR_COLORS[i % BAR_COLORS.length] }}
              />
            </div>
          </div>
        ))}
      </div>
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

function SimilarStocks() {
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

      <div>
        {similarStocks.map((s) => (
          <div key={s.symbol} className="grid grid-cols-[1.6fr_1fr_1.4fr_1fr_0.8fr] gap-4 items-center py-4 border-b border-[var(--border-soft)] last:border-0 hover:bg-[var(--bg-card-alt)] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-[var(--text-primary)] ring-1 ring-[var(--border-color)]" style={{ background: s.logoBg }}>
                {s.logo}
              </div>
              <div>
                <div className="text-[var(--text-primary)] text-[13px] font-medium">{s.name}</div>
                <div className="text-[var(--text-muted)] text-[11px]">{s.symbol}</div>
              </div>
            </div>
            <div>
              <div className="text-[var(--text-primary)] text-[13px] font-medium">₹{s.price}</div>
              <div className={`text-[11px] ${s.up ? "text-[var(--green)]" : "text-[var(--red)]"}`}>{s.change} {s.pct}</div>
            </div>
            <RangeBar low={s.low} high={s.high} current={s.current} />
            <div className="text-[var(--text-primary)] text-[13px]">{s.mcap}</div>
            <div className="text-[var(--text-primary)] text-[13px] text-right">{s.pe}</div>
          </div>
        ))}
      </div>

      <button className="mt-4 flex items-center gap-1 text-[var(--green)] text-[13px] font-medium hover:opacity-80 transition-opacity">
        See more <ChevronRightIcon className="w-4 h-4" />
      </button>
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

  const send = (text) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setMessages((m) => [
      ...m,
      { role: "user", text: q },
      { role: "ai", text: "This is a demo response. In the full version, I will analyze TCS financials, technicals and market signals to answer this question." },
    ]);
    setInput("");
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
        </div>
      )}

      <div className="mt-4 relative">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask anything..."
          className="w-full h-11 pl-4 pr-12 rounded-xl bg-[var(--bg-card-alt)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--green)]/40 transition-colors"
        />
        <button
          onClick={() => send()}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[var(--green)] hover:bg-[var(--green)] flex items-center justify-center transition-colors"
        >
          <SendIcon className="w-3.5 h-3.5 text-[var(--bg-card)]" />
        </button>
      </div>
    </aside>
  );
}

// PaperBull executes paper trades at a tiny, deterministic spread off the
// live market price so "Our Price" never has to hit a second data source.
function getOurPrice(symbol, price) {
  if (price == null) return null;
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) hash = (hash * 31 + symbol.charCodeAt(i)) >>> 0;
  const spreadPct = 0.1 + (hash % 90) / 100; // 0.10% – 0.99%
  const sign = hash % 2 === 0 ? -1 : 1;
  return Math.max(0, price * (1 + (sign * spreadPct) / 100));
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

function StockListRow({ item, onSelect }) {
  const [added, setAdded] = useState(() => isInWatchlist(item.symbol));
  const up = item.is_up;
  const ourPrice = getOurPrice(item.symbol, item.price);
  const initial = (item.symbol || item.name || "?").trim().charAt(0).toUpperCase();

  // deterministic-looking little sparkline so every row doesn't look identical
  const sparkPoints = useMemo(() => {
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
  }, [item.symbol, up]);

  const handleAdd = (e) => {
    e.stopPropagation();
    const nowAdded = toggleWatchlist({
      symbol: item.symbol,
      name: item.name,
      price: item.price,
      change: item.change,
      pct: `(${Math.abs(item.changePct).toFixed(2)}%)`,
      up,
    });
    setAdded(nowAdded);
  };

  return (
    <tr onClick={() => onSelect(item)}>
      <td>
        <div className="stock-row-company">
          <div className="stock-row-logo">{initial}</div>
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
        <div className="stock-row-price tnum">₹{formatINR(ourPrice)}</div>
      </td>
      <td className="num">
        <div className="stock-row-mcap tnum">{item.marketCapCr != null ? `₹${Number(item.marketCapCr).toLocaleString("en-IN")}` : "—"}</div>
      </td>
      <td>
        <button className={`stock-row-add${added ? " added" : ""}`} onClick={handleAdd} title={added ? "In watchlist" : "Add to watchlist"}>
          {added ? <CheckIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
        </button>
      </td>
    </tr>
  );
}

function AllStocksPage({ navActive, onNavChange, onSelectStock }) {
  const [stocksData, setStocksData] = useState([]);
  const [loadState, setLoadState] = useState("loading"); // loading | ready | error
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    sectors: new Set(),
    indices: new Set(),
    capBucket: null,
    marketCap: [0, CAP_RANGE_MAX],
    price: [0, PRICE_RANGE_MAX],
  });

  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");
    fetchStocksList()
      .then((data) => {
        if (cancelled) return;
        setStocksData(Array.isArray(data) ? data : []);
        setLoadState("ready");
      })
      .catch(() => {
        if (!cancelled) setLoadState("error");
      });
    return () => { cancelled = true; };
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

          <div>
            <div className="stocks-toolbar">
              <div className="stocks-search-box">
                <SearchIcon />
                <input placeholder="Search stocks, e.g. Reliance, TCS..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <button className="stocks-toolbar-btn"><SlidersIcon className="w-4 h-4" /></button>
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
                      <th className="num">Our Price</th>
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
            <SIPBanner />
            <StockTabs active={tab} onChange={setTab} />
            <PerformanceChart />
            <AboutSection />
            <FundamentalsSection />
            <FinancialPerformance />
            <ShareholdingPattern />
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
