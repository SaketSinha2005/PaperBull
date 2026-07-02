const { useState, useMemo, Fragment } = React;

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

function TopNav({ active, onChange }) {
  return (
    <header className="w-full border-b border-white/5 bg-[#050914]/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto flex items-center gap-8 px-8 h-[68px]">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5B8] to-[#00A88A] flex items-center justify-center">
            <span className="text-[#050914] font-bold text-sm">PB</span>
          </div>
          <span className="text-white text-lg font-semibold tracking-tight">PaperBull</span>
        </div>

        <nav className="flex items-center gap-1 flex-1">
          {navTabs.map((t) => {
            const isActive = active === t;
            return (
              <button
                key={t}
                onClick={() => onChange(t)}
                className={`relative px-5 py-2 text-sm font-medium transition-colors ${isActive ? "text-white" : "text-white/50 hover:text-white/80"}`}
              >
                {t}
                {isActive && <span className="absolute left-3 right-3 -bottom-[22px] h-[2px] bg-[#00E5B8] rounded-full" />}
              </button>
            );
          })}
        </nav>

        <div className="relative w-[360px]">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            placeholder="Search stocks, ETFs, more"
            className="w-full h-10 pl-10 pr-4 rounded-full bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00E5B8]/40 transition-colors"
          />
        </div>

        <button className="relative w-10 h-10 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-center transition-colors">
          <BellIcon className="w-4 h-4 text-white/70" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#00E5B8]" />
        </button>

        <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/10">
          <img
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}

function IndicesTicker() {
  return (
    <div className="w-full border-b border-white/5 bg-[#050914]">
      <div className="max-w-[1600px] mx-auto px-8 py-3 flex items-center justify-between gap-6 overflow-x-auto">
        {indices.map((i) => (
          <div key={i.name} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-white/70 text-[13px] font-medium tracking-wide">{i.name}</span>
            <span className="text-white text-[13px] font-semibold">{i.value}</span>
            <span className={`text-[12px] font-medium ${i.up ? "text-[#00E5B8]" : "text-[#FF5B6E]"}`}>
              {i.change} <span className="opacity-80">({i.pct.replace("+", "").replace("-", "")})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBlock({ label, value }) {
  return (
    <div>
      <div className="text-[11px] text-white/50 uppercase tracking-wider">{label}</div>
      <div className="text-white text-[15px] font-medium mt-1">{value}</div>
    </div>
  );
}

function StockHeader() {
  const [added, setAdded] = useState(false);
  return (
    <div className="bg-[#0B1120] border border-white/5 rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] flex items-center justify-center shrink-0 ring-1 ring-white/10">
            <span className="text-white font-bold text-lg tracking-tight">TCS</span>
          </div>
          <div>
            <h1 className="text-white text-[22px] font-semibold leading-tight">{stock.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-[12px]">
              <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-white/70 font-medium">{stock.symbol}</span>
              <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-white/70 font-medium">{stock.exchange}</span>
              <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-white/70 font-medium">{stock.cap}</span>
              <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-white/70 font-medium">{stock.sector}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setAdded((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${added ? "bg-[#00E5B8]/10 border-[#00E5B8]/40 text-[#00E5B8]" : "bg-white/[0.03] border-white/10 text-white/80 hover:bg-white/[0.06]"}`}
        >
          {added ? <CheckIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />} Watchlist
        </button>
      </div>

      <div className="mt-6 flex items-end justify-between flex-wrap gap-6">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-white text-[34px] font-semibold tracking-tight">₹{stock.price}</span>
            <span className={`text-sm font-medium ${stock.up ? "text-[#00E5B8]" : "text-[#FF5B6E]"}`}>{stock.change} {stock.pct}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[12px] text-white/50">
            <span>{stock.status}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
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
    <button className="group w-full flex items-center gap-4 p-4 rounded-2xl bg-[#0B1120] border border-white/5 hover:border-[#00E5B8]/30 transition-colors text-left">
      <div className="w-11 h-11 rounded-xl bg-[#00E5B8]/10 border border-[#00E5B8]/20 flex items-center justify-center shrink-0">
        <Repeat2Icon className="w-5 h-5 text-[#00E5B8]" />
      </div>
      <div className="flex-1">
        <div className="text-white text-[15px] font-semibold">Create Stock SIP</div>
        <div className="text-white/50 text-[12px] mt-0.5">Automate your investments in this Stock</div>
      </div>
      <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:bg-[#00E5B8]/10 group-hover:border-[#00E5B8]/30 transition-colors">
        <ArrowRightIcon className="w-4 h-4 text-white/70 group-hover:text-[#00E5B8]" />
      </div>
    </button>
  );
}

function StockTabs({ active, onChange }) {
  return (
    <div className="flex items-center gap-1 border-b border-white/5">
      {stockTabs.map((t) => {
        const isActive = active === t;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`relative px-4 py-3 text-[13px] font-medium transition-colors ${isActive ? "text-[#00E5B8]" : "text-white/60 hover:text-white"}`}
          >
            {t}
            {isActive && <span className="absolute left-2 right-2 -bottom-[1px] h-[2px] bg-[#00E5B8] rounded-full" />}
          </button>
        );
      })}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div>
      <div className="text-[11px] text-white/50">{label}</div>
      <div className="text-white text-[15px] font-medium mt-1">{value}</div>
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
    <div className="bg-[#0B1120] border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-white text-[15px] font-semibold">Performance</h3>
          <InfoIcon className="w-3.5 h-3.5 text-white/40" />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {timeRanges.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`h-8 px-3 rounded-full text-[12px] font-medium transition-colors border ${range === r ? "bg-[#00E5B8]/10 text-[#00E5B8] border-[#00E5B8]/40" : "bg-transparent text-white/60 border-white/10 hover:text-white hover:border-white/20"}`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="relative">
        <svg viewBox="0 0 900 260" className="w-full h-[260px]" preserveAspectRatio="none">
          <defs>
            <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5B8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#00E5B8" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.2, 0.4, 0.6, 0.8].map((t) => (
            <line key={t} x1="0" x2="900" y1={10 + t * 220} y2={10 + t * 220} stroke="#ffffff" strokeOpacity="0.04" />
          ))}
          <path d={area} fill="url(#perfGrad)" />
          <path d={path} fill="none" stroke="#00E5B8" strokeWidth="2" />
          <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="5" fill="#00E5B8" />
          <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="10" fill="#00E5B8" fillOpacity="0.2" />
        </svg>
        <div className="absolute right-0 top-0 h-[230px] flex flex-col justify-between text-[11px] text-white/50 pr-1">
          <span>4,800</span>
          <span>4,200</span>
          <span>3,600</span>
          <span>3,000</span>
          <span>2,400</span>
          <span>1,800</span>
        </div>
        <div className="flex justify-between mt-2 text-[11px] text-white/50 px-1">
          <span>May '25</span>
          <span>Jul '25</span>
          <span>Sep '25</span>
          <span>Nov '25</span>
          <span>Jan '26</span>
          <span>Mar '26</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6 mt-8 pt-6 border-t border-white/5">
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
      <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <div className="text-[11px] text-white/50">{label}</div>
        <div className="text-white text-[13px] font-medium mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <div className="bg-[#0B1120] border border-white/5 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
          <Building2Icon className="w-5 h-5 text-white/70" />
        </div>
        <div className="flex-1">
          <h3 className="text-white text-[15px] font-semibold">About {stock.name}</h3>
          <p className="text-white/60 text-[13px] leading-relaxed mt-2">{stock.about}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">
        <MetaItem icon={<Building2Icon className="w-4 h-4 text-white/60" />} label="Industry" value={stock.industry} />
        <MetaItem icon={<CalendarIcon className="w-4 h-4 text-white/60" />} label="Founded" value={stock.founded} />
        <MetaItem icon={<MapPinIcon className="w-4 h-4 text-white/60" />} label="Headquarters" value={stock.headquarters} />
        <MetaItem
          icon={<GlobeIcon className="w-4 h-4 text-white/60" />}
          label="Website"
          value={
            <span className="inline-flex items-center gap-1 text-[#00E5B8]">
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
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
      <span className="text-[13px] text-white/60">{item.label}</span>
      <span className="text-[13px] text-white font-medium">{item.value}</span>
    </div>
  );
}

function FundamentalsSection() {
  const rows = [];
  for (let i = 0; i < fundamentals.length; i += 2) {
    rows.push([fundamentals[i], fundamentals[i + 1]]);
  }
  return (
    <div className="bg-[#0B1120] border border-white/5 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <h3 className="text-white text-[15px] font-semibold">Fundamentals</h3>
        <InfoIcon className="w-3.5 h-3.5 text-white/40" />
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
      <span className="text-[11px] text-white/60">{label}</span>
    </div>
  );
}

function RowStat({ label, value, positive }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[13px] text-white/60">{label}</span>
      <span className={`text-[13px] font-medium ${positive ? "text-[#00E5B8]" : "text-[#FF5B6E]"}`}>{value}</span>
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
    <div className="bg-[#0B1120] border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-[15px] font-semibold">Financial performance</h3>
        <button className="flex items-center gap-1 text-[#00E5B8] text-[13px] font-medium hover:opacity-80 transition-opacity">
          All Financials <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {["quarterly", "yearly"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`h-8 px-4 rounded-full text-[12px] font-medium capitalize transition-colors border ${mode === m ? "bg-[#00E5B8]/10 text-[#00E5B8] border-[#00E5B8]/40" : "bg-transparent text-white/60 border-white/10 hover:text-white"}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-3">
        <Legend color="#2563EB" label="Revenue (Cr)" />
        <Legend color="#00E5B8" label="Profit (Cr)" />
      </div>

      <div className="grid grid-cols-[1fr_180px] gap-6">
        <div className="relative">
          <svg viewBox="0 0 500 240" className="w-full h-[240px]" preserveAspectRatio="none">
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E5B8" />
                <stop offset="100%" stopColor="#00A88A" />
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
          <div className="absolute left-0 top-0 h-[200px] flex flex-col justify-between text-[10px] text-white/40">
            <span>80k</span>
            <span>60k</span>
            <span>40k</span>
            <span>20k</span>
            <span>0</span>
          </div>
          <div className="flex justify-around mt-1 text-[11px] text-white/50 pl-8">
            {bars.map((b) => (
              <span key={b.q}>{b.q}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-1 text-right">
          <div className="text-[11px] text-white/50">{last.q.toUpperCase()}</div>
          <div className="text-[11px] text-white/50 mt-2">Revenue (Cr)</div>
          <div className="text-white text-[18px] font-semibold">₹{last.revenue.toLocaleString("en-IN")}</div>
          <div className={`text-[12px] font-medium ${revChangePct >= 0 ? "text-[#00E5B8]" : "text-[#FF5B6E]"}`}>
            {revChangePct >= 0 ? "+" : ""}{revChangePct}%
          </div>
          <div className="text-[11px] text-white/50 mt-3">Profit (Cr)</div>
          <div className="text-white text-[18px] font-semibold">₹{last.profit.toLocaleString("en-IN")}</div>
          <div className={`text-[12px] font-medium ${profChangePct >= 0 ? "text-[#00E5B8]" : "text-[#FF5B6E]"}`}>
            {profChangePct >= 0 ? "+" : ""}{profChangePct}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6 pt-5 border-t border-white/5">
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

const BAR_COLORS = ["#00E5B8", "#3B82F6", "#F59E0B", "#8B5CF6"];

function ShareholdingPattern() {
  const [q, setQ] = useState("Mar '26");
  const data = shareholding.data[q];

  return (
    <div className="bg-[#0B1120] border border-white/5 rounded-2xl p-6">
      <h3 className="text-white text-[15px] font-semibold">Shareholding Pattern</h3>
      <div className="flex items-center gap-2 mt-4 mb-6">
        {shareholding.quarters.map((qq) => (
          <button
            key={qq}
            onClick={() => setQ(qq)}
            className={`h-8 px-3 rounded-full text-[12px] font-medium border transition-colors ${q === qq ? "bg-[#00E5B8]/10 text-[#00E5B8] border-[#00E5B8]/40" : "bg-transparent text-white/60 border-white/10 hover:text-white"}`}
          >
            {qq}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {data.map((d, i) => (
          <div key={d.label}>
            <div className="flex items-center justify-between text-[13px] mb-1.5">
              <span className="text-white/70">{d.label}</span>
              <span className="text-white font-medium">{d.pct.toFixed(2)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
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
      <span className="text-[11px] text-white/50">L</span>
      <div className="relative flex-1 h-1 rounded-full bg-gradient-to-r from-[#FF5B6E] via-[#F59E0B] to-[#00E5B8]">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white ring-2 ring-[#0B1120]"
          style={{ left: `calc(${pct}% - 5px)` }}
        />
      </div>
      <span className="text-[11px] text-white/50">H</span>
    </div>
  );
}

function SimilarStocks() {
  return (
    <div className="bg-[#0B1120] border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-[15px] font-semibold">Similar stocks</h3>
      </div>

      <div className="grid grid-cols-[1.6fr_1fr_1.4fr_1fr_0.8fr] gap-4 py-2 text-[11px] text-white/50 uppercase tracking-wider border-b border-white/5">
        <span>Stock</span>
        <span>Mkt price (1D)</span>
        <span>52 week performance</span>
        <span className="flex items-center gap-1">Market cap <ChevronRightIcon className="w-3 h-3 rotate-90" /></span>
        <span className="text-right">P/E ratio</span>
      </div>

      <div>
        {similarStocks.map((s) => (
          <div key={s.symbol} className="grid grid-cols-[1.6fr_1fr_1.4fr_1fr_0.8fr] gap-4 items-center py-4 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white ring-1 ring-white/10" style={{ background: s.logoBg }}>
                {s.logo}
              </div>
              <div>
                <div className="text-white text-[13px] font-medium">{s.name}</div>
                <div className="text-white/40 text-[11px]">{s.symbol}</div>
              </div>
            </div>
            <div>
              <div className="text-white text-[13px] font-medium">₹{s.price}</div>
              <div className={`text-[11px] ${s.up ? "text-[#00E5B8]" : "text-[#FF5B6E]"}`}>{s.change} {s.pct}</div>
            </div>
            <RangeBar low={s.low} high={s.high} current={s.current} />
            <div className="text-white text-[13px]">{s.mcap}</div>
            <div className="text-white text-[13px] text-right">{s.pe}</div>
          </div>
        ))}
      </div>

      <button className="mt-4 flex items-center gap-1 text-[#00E5B8] text-[13px] font-medium hover:opacity-80 transition-opacity">
        See more <ChevronRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

function RobotSVG() {
  return (
    <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
      <line x1="40" y1="12" x2="36" y2="2" stroke="#00E5B8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="80" y1="12" x2="84" y2="2" stroke="#00E5B8" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="36" cy="2" r="2" fill="#00E5B8" />
      <circle cx="84" cy="2" r="2" fill="#00E5B8" />
      <rect x="22" y="12" width="76" height="64" rx="18" fill="#0A0F1D" stroke="#00E5B8" strokeOpacity="0.6" strokeWidth="1.5" />
      <rect x="30" y="22" width="60" height="44" rx="12" fill="#050914" />
      <ellipse cx="48" cy="42" rx="6" ry="7" fill="#00E5B8" />
      <ellipse cx="72" cy="42" rx="6" ry="7" fill="#00E5B8" />
      <path d="M50 54 Q60 60 70 54" stroke="#00E5B8" strokeWidth="2" strokeLinecap="round" fill="none" />
      <rect x="52" y="76" width="16" height="6" fill="#1B2537" />
      <rect x="18" y="82" width="84" height="48" rx="14" fill="#0F1626" stroke="#00E5B8" strokeOpacity="0.5" strokeWidth="1.5" />
      <circle cx="60" cy="106" r="6" fill="#00E5B8" fillOpacity="0.4" />
      <circle cx="60" cy="106" r="3" fill="#00E5B8" />
      <rect x="6" y="90" width="10" height="26" rx="5" fill="#0F1626" stroke="#00E5B8" strokeOpacity="0.5" strokeWidth="1.5" />
      <rect x="104" y="90" width="10" height="26" rx="5" fill="#0F1626" stroke="#00E5B8" strokeOpacity="0.5" strokeWidth="1.5" />
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
    <aside className="bg-[#0B1120] border border-white/5 rounded-2xl p-5 sticky top-[92px] h-fit">
      <div className="flex items-center gap-2">
        <SparklesIcon className="w-4 h-4 text-[#00E5B8]" />
        <h3 className="text-white text-[15px] font-semibold">AI Assistant</h3>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="relative w-[180px] h-[180px] rounded-2xl bg-gradient-to-br from-[#0F1B2E] to-[#0B1120] border border-white/5 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#00E5B8_0%,transparent_60%)] opacity-20" />
          <RobotSVG />
        </div>
      </div>

      <div className="mt-6">
        <div className="text-white text-[15px] font-semibold">Hi! I'm PaperBull AI <span>👋</span></div>
        <p className="text-white/60 text-[13px] mt-1 leading-relaxed">Ask me anything about TCS or the stock market.</p>
      </div>

      {messages.length === 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-2">
          {aiSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-left px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white/80 text-[12px] hover:bg-white/[0.06] hover:border-white/20 transition-colors"
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
              className={`px-3 py-2 rounded-xl text-[12px] leading-relaxed ${m.role === "user" ? "bg-[#00E5B8]/10 text-white border border-[#00E5B8]/20 ml-6" : "bg-white/[0.03] text-white/80 border border-white/10 mr-6"}`}
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
          className="w-full h-11 pl-4 pr-12 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00E5B8]/40 transition-colors"
        />
        <button
          onClick={() => send()}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#00E5B8] hover:bg-[#00CFA6] flex items-center justify-center transition-colors"
        >
          <SendIcon className="w-3.5 h-3.5 text-[#0B1120]" />
        </button>
      </div>
    </aside>
  );
}

function StocksPage({ navActive, onNavChange }) {
  const [tab, setTab] = useState("Overview");
  return (
    <div className="min-h-screen bg-[#050914] text-white">
      <TopNav active={navActive} onChange={onNavChange} />
      <IndicesTicker />

      <main className="max-w-[1600px] mx-auto px-8 py-6">
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
            <div className="flex items-center justify-between text-[11px] text-white/40 pt-2 pb-6">
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
    <div className="min-h-screen bg-[#050914] text-white">
      <TopNav active={navActive} onChange={onNavChange} />
      <IndicesTicker />
      <div className="max-w-[1600px] mx-auto px-8 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5B8]/10 border border-[#00E5B8]/30 text-[#00E5B8] text-[12px] font-medium">
          Coming soon
        </div>
        <h1 className="mt-4 text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-white/50">This section is part of the PaperBull demo.</p>
      </div>
    </div>
  );
}

function App() {
  const [navActive, setNavActive] = useState("Stocks");

  if (navActive === "Stocks") {
    return <StocksPage navActive={navActive} onNavChange={setNavActive} />;
  }

  return <PlaceholderPage title={navActive} navActive={navActive} onNavChange={setNavActive} />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
