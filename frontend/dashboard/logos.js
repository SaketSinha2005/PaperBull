/* ============================================================
   PaperBull — Shared stock logo helper
   Tries, in order, for every symbol:
     1. A hand-curated symbol -> domain map (most accurate — used
        for names we know for certain), fetched via Brandfetch's
        free Logo API first, then Clearbit's as a backup source.
     2. A handful of "guessed" domains built from the company name
        (strip Ltd/Limited/India/Industries/etc, slugify, try
        .com / .in / .co.in), each also tried against both
        providers. This covers a lot of the long tail of the full
        2000+ NSE universe without us hand-typing every domain.
     3. The plain initials avatar, if nothing above loads.

   Brandfetch requires a free client ID for reliable, unthrottled
   access — see BRANDFETCH_CLIENT_ID below. Guessing a domain can
   occasionally 404 or (rarely) hit an unrelated site that happens to
   have a logo there — to keep that risk low we only try domains
   derived directly from the company's own name (never arbitrary
   lookalikes), and any candidate that fails is silently skipped in
   favor of the next, ending at the safe initials fallback.

   Exposes `window.PBLogos` with:
     getLogoCandidates(symbol, name) -> string[] of candidate URLs (may be empty)
     avatarHtml(symbol, name, opts)  -> HTML string (chained img fallback + initials)
   ============================================================ */

(function (global) {
  // symbol -> company domain (used as https://logo.clearbit.com/<domain>)
  // These are hand-verified, not guessed — kept separate from the
  // guessing tier below because they're the ones we're sure about.
  const DOMAIN_MAP = {
    RELIANCE: "ril.com",
    TCS: "tcs.com",
    HDFCBANK: "hdfcbank.com",
    ICICIBANK: "icicibank.com",
    BHARTIARTL: "airtel.in",
    INFY: "infosys.com",
    LT: "larsentoubro.com",
    SBIN: "sbi.co.in",
    HINDUNILVR: "hul.co.in",
    ITC: "itcportal.com",
    HCLTECH: "hcltech.com",
    WIPRO: "wipro.com",
    MARUTI: "marutisuzuki.com",
    TATAMOTORS: "tatamotors.com",
    TATASTEEL: "tatasteel.com",
    JSWSTEEL: "jsw.in",
    SUNPHARMA: "sunpharma.com",
    DRREDDY: "drreddys.com",
    CIPLA: "cipla.com",
    ASIANPAINT: "asianpaints.com",
    NESTLEIND: "nestle.in",
    TITAN: "titancompany.in",
    BAJFINANCE: "bajajfinserv.in",
    BAJAJFINSV: "bajajfinserv.in",
    KOTAKBANK: "kotak.com",
    AXISBANK: "axisbank.com",
    ULTRACEMCO: "ultratechcement.com",
    POWERGRID: "powergrid.in",
    NTPC: "ntpc.co.in",
    ONGC: "ongcindia.com",
    COALINDIA: "coalindia.in",
    ADANIENT: "adani.com",
    ADANIPORTS: "adaniports.com",
    "M&M": "mahindra.com",
    HEROMOTOCO: "heromotocorp.com",
    EICHERMOT: "eichermotors.com",
    DIVISLAB: "divislabs.com",
    BRITANNIA: "britannia.co.in",
    HDFCLIFE: "hdfclife.com",
    SBILIFE: "sbilife.co.in",
    TECHM: "techmahindra.com",
    INDUSINDBK: "indusind.com",
    BPCL: "bharatpetroleum.in",
    TATACONSUM: "tataconsumer.com",
    APOLLOHOSP: "apollohospitals.com",
    UPL: "upl-ltd.com",
    SHREECEM: "shreecement.com",
    VEDL: "vedantalimited.com",
    LTTS: "ltts.com",
    MPHASIS: "mphasis.com",
    LTIM: "ltimindtree.com",
    PIDILITIND: "pidilite.com",
    DABUR: "dabur.com",
    GODREJCP: "godrejcp.com",
    HAVELLS: "havells.com",
    DLF: "dlf.in",
    SIEMENS: "siemens.co.in",
    ABB: "global.abb",
    PNB: "pnbindia.in",
    BANKBARODA: "bankofbaroda.in",
    CANBK: "canarabank.com",
    IOC: "iocl.com",
    GAIL: "gailonline.com",
    ZOMATO: "eternal.com",
    PAYTM: "paytm.com",
    NYKAA: "nykaa.com",
    IRCTC: "irctc.co.in",
    DMART: "dmartindia.com",
    TRENT: "trent-tata.com",
    PGHH: "pg.com",
    COLPAL: "colgatepalmolive.co.in",
    MARICO: "marico.com",
    BOSCHLTD: "bosch.in",
    MOTHERSON: "motherson.com",
    BEL: "bel-india.in",
    HAL: "hal-india.co.in",
    IRFC: "irfc.co.in",
    RECLTD: "recindia.nic.in",
    PFC: "pfcindia.com",
    YESBANK: "yesbank.in",
    IDFCFIRSTB: "idfcfirstbank.com",
    FEDERALBNK: "federalbank.co.in",
    BANDHANBNK: "bandhanbank.com",
    AUBANK: "aubank.in",
    PEL: "piramal.com",
    LUPIN: "lupin.com",
    AUROPHARMA: "aurobindo.com",
    ALKEM: "alkemlabs.com",
    TORNTPHARM: "torrentpharma.com",
    ABBOTINDIA: "abbott.co.in",
    GLAND: "glandpharma.com",
    BIOCON: "biocon.com",
    UBL: "unitedbreweries.com",
    VBL: "varunbeverages.com",
    EMAMILTD: "emamigroup.com",
    JUBLFOOD: "jubilantfoodworks.com",
    HONAUT: "honeywell.com",
    CUMMINSIND: "cummins.com",
    ABFRL: "abfrl.com",
    PAGEIND: "jockeyindia.com",
    RAYMOND: "raymond.in",
    BATAINDIA: "bata.in",
    VOLTAS: "voltas.com",
    BLUESTARCO: "bluestarindia.com",
    CROMPTON: "crompton.co.in",
    WHIRLPOOL: "whirlpoolindia.com",
    POLYCAB: "polycab.com",
    ASTRAL: "astralpipes.com",
    SUPREMEIND: "supreme.co.in",
    SRF: "srf.com",
    DEEPAKNTR: "deepaknitrite.com",
    AARTIIND: "aartiindustries.com",
    NAVINFLUOR: "navinfluorine.com",
    TATAPOWER: "tatapower.com",
    TATACOMM: "tatacommunications.com",
    TATAELXSI: "tataelxsi.com",
    TATACHEM: "tatachemicals.com",
    BHEL: "bhel.com",
    SAIL: "sail.co.in",
    NMDC: "nmdc.co.in",
    HINDALCO: "hindalco.com",
    NATIONALUM: "nalcoindia.com",
    JINDALSTEL: "jindalsteel.com",
    APLAPOLLO: "aplapollo.com",
    WELCORP: "welspuncorp.com",
    GMRINFRA: "gmrgroup.in",
    IRB: "irb.co.in",
    NBCC: "nbccindia.in",
    RVNL: "rvnl.org",
    CONCOR: "concorindia.co.in",
    IEX: "iexindia.com",
    CDSL: "cdslindia.com",
    BSE: "bseindia.com",
    MCX: "mcxindia.com",
    ANGELONE: "angelone.in",
    ICICIGI: "icicilombard.com",
    ICICIPRULI: "iciciprulife.com",
    LICI: "licindia.in",
    MAXHEALTH: "maxhealthcare.in",
    FORTIS: "fortishealthcare.com",
    NARAYANA: "narayanahealth.org",
    METROPOLIS: "metropolisindia.com",
    LALPATHLAB: "lalpathlabs.com",
    SYNGENE: "syngeneintl.com",
    LAURUSLABS: "lauruslabs.com",
    GLENMARK: "glenmarkpharma.com",
    ZYDUSLIFE: "zyduslife.com",
    IPCALAB: "ipca.com",
    NATCOPHARM: "natcopharma.co.in",
    GRANULES: "granulesindia.com",
    GILLETTE: "gillette.co.in",
    JYOTHYLAB: "jyothylaboratories.com",
    RADICO: "radicokhaitan.com",
    CGPOWER: "cgglobal.com",
    THERMAX: "thermaxglobal.com",
    ESCORTS: "escortskubota.com",
    ASHOKLEY: "ashokleyland.com",
    BHARATFORG: "bharatforge.com",
    EXIDEIND: "exideindustries.com",
    MRF: "mrftyres.com",
    CEATLTD: "ceat.com",
    APOLLOTYRE: "apollotyres.com",
    BALKRISIND: "balkrishnaindustries.com",
    SCHAEFFLER: "schaeffler.co.in",
    SKFINDIA: "skf.com",
    BERGEPAINT: "bergerpaints.com",
    AKZOINDIA: "akzonobel.co.in",
    INDIGO: "goindigo.in",
    SPICEJET: "spicejet.com",
    ADANIGREEN: "adanigreenenergy.com",
    ADANIPOWER: "adanipower.com",
    TORNTPOWER: "torrentpower.com",
    CESC: "cesc.co.in",
    NHPC: "nhpcindia.com",
    SJVN: "sjvn.nic.in",
    IGL: "iglonline.net",
    MGL: "mahanagargas.com",
    GUJGASLTD: "gujaratgas.com",
    PETRONET: "petronetlng.com",
    OIL: "oil-india.com",
    HINDPETRO: "hindustanpetroleum.com",
    MFSL: "maxlifeinsurance.com",
    CHOLAFIN: "cholamandalam.com",
    MUTHOOTFIN: "muthootfinance.com",
    MANAPPURAM: "manappuram.com",
    SHRIRAMFIN: "shriramfinance.in",
  };

  // ------------------------------------------------------------------
  // Brandfetch Logo API — free, but each request should include a
  // client ID for reliable, non-rate-limited access. Requests still
  // work without one, just with Brandfetch's shared fair-use pool
  // rather than your own quota (500k req/mo free either way).
  // Docs: https://docs.brandfetch.com/logo-api/overview
  //
  // The client ID itself lives in nse-node/.env as BRANDFETCH_CLIENT_ID
  // and is served to the frontend (rather than hardcoded here) via the
  // backend's GET /api/config endpoint.
  // ------------------------------------------------------------------
  const CONFIG_API_BASE = "http://localhost:5000";

  let brandfetchClientId = "";
  let brandfetchClientIdReady = fetch(`${CONFIG_API_BASE}/api/config`)
    .then((res) => res.json())
    .then((cfg) => {
      brandfetchClientId = (cfg && cfg.brandfetchClientId) || "";
    })
    .catch(() => {
      // Backend unreachable — fall back to Brandfetch's shared pool
      // (still functional, just unauthenticated) rather than failing.
      brandfetchClientId = "";
    });

  function brandfetchUrl(domain) {
    const cid = brandfetchClientId ? `?c=${encodeURIComponent(brandfetchClientId)}` : "";
    // fallback/transparent means a failed lookup returns a 1x1 transparent
    // image instead of a broken/404 image, so our initials letter shows
    // through cleanly underneath without even needing the onerror chain.
    return `https://cdn.brandfetch.io/${domain}/w/128/h/128/fallback/transparent/icon${cid}`;
  }

  function clearbitUrl(domain) {
    return `https://logo.clearbit.com/${domain}?size=64`;
  }


  // name into a domain guess.
  const STRIP_WORDS = new Set([
    "limited", "ltd", "industries", "industry", "corporation", "corp",
    "company", "co", "india", "group", "enterprises", "enterprise",
    "holdings", "financial", "financials", "services", "pvt", "private",
    "and",
  ]);

  function slugify(name) {
    if (!name) return "";
    const words = String(name)
      .toLowerCase()
      .replace(/[().,'&]/g, "")
      .split(/\s+/)
      .filter((w) => w && !STRIP_WORDS.has(w));
    return words.join("").replace(/[^a-z0-9]/g, "");
  }

  // Builds a short list of plausible domains from the company name
  // itself (never from anything unrelated to the name), tried in
  // order until one actually resolves to an image.
  function guessDomains(name) {
    const slug = slugify(name);
    if (!slug || slug.length < 3) return [];
    return [`${slug}.com`, `${slug}.in`, `${slug}.co.in`];
  }

  function getLogoCandidates(symbol, name) {
    const domains = [];
    const known = symbol ? DOMAIN_MAP[String(symbol).toUpperCase()] : null;
    if (known) domains.push(known);
    guessDomains(name).forEach((d) => {
      if (!domains.includes(d)) domains.push(d);
    });

    const urls = [];
    domains.forEach((domain) => {
      urls.push(brandfetchUrl(domain));
      urls.push(clearbitUrl(domain));
    });
    return urls;
  }

  // Back-compat single-URL accessor (curated map only — used where a
  // caller just wants the one "best guess" URL rather than a chain).
  function getLogoUrl(symbol) {
    const known = symbol ? DOMAIN_MAP[String(symbol).toUpperCase()] : null;
    return known ? brandfetchUrl(known) : null;
  }

  // Chains through the candidate list on <img> error, only revealing
  // the initials fallback (already in the DOM, underneath) once every
  // candidate has failed.
  function pbLogoErr(imgEl) {
    try {
      const urls = JSON.parse(imgEl.getAttribute("data-fallbacks") || "[]");
      const next = urls.shift();
      if (next) {
        imgEl.setAttribute("data-fallbacks", JSON.stringify(urls));
        imgEl.src = next;
      } else {
        imgEl.style.display = "none";
      }
    } catch (err) {
      imgEl.style.display = "none";
    }
  }
  global.pbLogoErr = pbLogoErr;

  // Returns a small self-contained HTML snippet: a real logo image
  // (tried across all candidates) layered over an initials fallback.
  function avatarHtml(symbol, name, opts) {
    opts = opts || {};
    const wrapClass = opts.wrapClass || "w-logo";
    const letter = (String(name || symbol || "?").trim().charAt(0) || "?").toUpperCase();
    const candidates = getLogoCandidates(symbol, name);

    if (!candidates.length) {
      return `<div class="${wrapClass}"><span class="pb-logo-fallback">${letter}</span></div>`;
    }

    const first = candidates[0];
    const rest = JSON.stringify(candidates.slice(1)).replace(/"/g, "&quot;");

    return (
      `<div class="${wrapClass} pb-has-logo">` +
      `<span class="pb-logo-fallback">${letter}</span>` +
      `<img class="pb-logo-img" src="${first}" alt="" loading="lazy" ` +
      `data-fallbacks="${rest}" onerror="window.pbLogoErr(this)">` +
      `</div>`
    );
  }

  global.PBLogos = { getLogoUrl, getLogoCandidates, avatarHtml, DOMAIN_MAP };
})(window);
