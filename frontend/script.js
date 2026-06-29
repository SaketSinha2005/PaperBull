/* =========================================================
   PaperBull — shared script
   Used by index.html, login.html, signup.html
   Each section below checks for the elements/data it needs,
   so this one file works across all three pages safely.
   ========================================================= */

/* ---------- seeded RNG (deterministic "live" charts) ---------- */
function rngSeeded(seed){
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function(){
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ---------- candle data generator ---------- */
function genCandles(n, startPrice, seed){
  const rand = rngSeeded(seed);
  let price = startPrice;
  const candles = [];
  for(let i=0;i<n;i++){
    const open = price;
    const drift = (rand() - 0.42) * (startPrice * 0.006);
    const close = open + drift;
    const high = Math.max(open,close) + rand() * (startPrice * 0.0025);
    const low = Math.min(open,close) - rand() * (startPrice * 0.0025);
    candles.push({open, high, low, close});
    price = close;
  }
  return candles;
}

/* ---------- candle SVG renderer ---------- */
function renderCandles(containerId, candles, opts){
  const container = document.getElementById(containerId);
  if(!container) return;

  opts = opts || {};
  const w = opts.width || 540;
  const h = opts.height || 220;
  const padL = 6, padR = 6, padT = 14, padB = 24;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  let min = Infinity, max = -Infinity;
  candles.forEach(c=>{ min = Math.min(min, c.low); max = Math.max(max, c.high); });
  const pad = (max-min) * 0.08;
  min -= pad; max += pad;

  const n = candles.length;
  const slot = innerW / n;
  const bodyW = Math.max(2, slot * 0.6);

  const yFor = v => padT + innerH - ((v - min) / (max - min)) * innerH;

  let gridLines = '';
  const gridCount = 4;
  for(let i=0;i<=gridCount;i++){
    const y = padT + (innerH/gridCount)*i;
    gridLines += `<line x1="${padL}" y1="${y}" x2="${w-padR}" y2="${y}" stroke="#eef0f2" stroke-width="1"/>`;
  }

  let bars = '';
  candles.forEach((c,i)=>{
    const x = padL + i*slot + slot/2;
    const up = c.close >= c.open;
    const color = up ? 'var(--green)' : 'var(--red)';
    const yHigh = yFor(c.high);
    const yLow = yFor(c.low);
    const yOpen = yFor(c.open);
    const yClose = yFor(c.close);
    const bodyTop = Math.min(yOpen, yClose);
    const bodyH = Math.max(1.4, Math.abs(yClose - yOpen));
    bars += `
      <line x1="${x}" y1="${yHigh}" x2="${x}" y2="${yLow}" stroke="${color}" stroke-width="1.2"/>
      <rect x="${x-bodyW/2}" y="${bodyTop}" width="${bodyW}" height="${bodyH}" fill="${color}" rx="1"/>
    `;
  });

  const xLabels = opts.xLabels || [];
  let labels = '';
  xLabels.forEach((lab, idx)=>{
    const fraction = idx/(xLabels.length-1);
    const x = padL + fraction*innerW;
    labels += `<text x="${x}" y="${h-6}" font-size="10" fill="#9aa3ad" text-anchor="middle" font-family="Inter, sans-serif">${lab}</text>`;
  });

  const svg = `
  <svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
    ${gridLines}
    ${bars}
    ${labels}
  </svg>`;
  container.innerHTML = svg;
}

/* ---------- live data integration ---------- */
let isMarketDataLoaded = false;
let basePrice = 24523; // Fallback

async function fetchLiveMarketData() {
  try {
    // Call the Python backend
    const response = await fetch('http://localhost:8000/api/live-indices');
    const data = await response.json();
    
    // 1. Build the scrolling Ticker Strip
    const track = document.getElementById('tickerTrack');
    if (track && data.length > 0) {
      const set = data.map(t => {
        const cls = t.is_up ? 'up' : 'down';
        const arrow = t.is_up ? '▲' : '▼';
        const priceFmt = t.price.toLocaleString('en-IN', {minimumFractionDigits: 2});
        return `<span class="tick">${t.sym} <b>${priceFmt}</b> <span class="${cls}">${arrow} ${t.chg}</span></span>`;
      }).join('');
      
      track.innerHTML = set + set; // duplicate for seamless loop
    }

    // 2. Update the NIFTY 50 live card only
    const nifty50 = data.find(t => t.sym === 'NIFTY 50');
    if (nifty50) {
      const priceFmt = nifty50.price.toLocaleString('en-IN', {minimumFractionDigits: 2});
      const arrow = nifty50.is_up ? '▲' : '▼';
      const colorCls = nifty50.is_up ? 'var(--green)' : 'var(--red)';

      const livePrice = document.getElementById('livePrice');
      const liveChg = document.getElementById('liveChg');

      if (livePrice) livePrice.textContent = priceFmt;
      if (liveChg) {
        liveChg.textContent = `${nifty50.chg}`;
        liveChg.style.color = colorCls;
      }

      // Sync the random fluctuation base with the real live price for the lower card
      basePrice = nifty50.price;
      isMarketDataLoaded = true;
    }

  } catch (error) {
    console.error("Error fetching live indices from backend:", error);
  }
}

/* ---------- simulated live price fluctuation (for visual effect) ---------- */
/* ---------- simulated live price fluctuation (for visual effect) ---------- */
function tickPrice(){
  if (!isMarketDataLoaded) return; 
  
  const tempPrice = basePrice + (Math.random() - 0.45) * 4;
  const formatted = tempPrice.toLocaleString('en-IN', {minimumFractionDigits: 0, maximumFractionDigits: 0});
  
  // ONLY update the lower livePrice box, DO NOT touch the heroPrice anymore
  const livePrice = document.getElementById('livePrice');
  if(livePrice) livePrice.textContent = formatted;
}

/* ---------- password show/hide toggle (login / signup) ---------- */
function togglePw(id, btn){
  const input = document.getElementById(id);
  if(!input) return;
  if(input.type === 'password'){ input.type = 'text'; btn.textContent = '🙈'; }
  else { input.type = 'password'; btn.textContent = '👁'; }
}

/* ---------- password strength hint (signup only) ---------- */
function checkPwLength(){
  const pwInput = document.getElementById('password');
  const hint = document.getElementById('pwHint');
  if(!pwInput || !hint) return;
  const pw = pwInput.value;
  if(pw.length >= 8){
    hint.textContent = '✓ Looks good';
    hint.classList.add('ok');
  } else {
    hint.textContent = 'Minimum 8 characters';
    hint.classList.remove('ok');
  }
}

/* ---------- confirm-password match check (signup only) ---------- */
function checkPwMatch(){
  const pw = document.getElementById('password');
  const confirm = document.getElementById('confirm');
  if(!pw || !confirm) return;
  if(confirm.value.length === 0){
    confirm.style.borderColor = '';
    return;
  }
  confirm.style.borderColor = (confirm.value === pw.value) ? 'var(--green)' : 'var(--red)';
}

/* ---------- simple form submit handlers ---------- */
async function handleLoginSubmit(e) {
  e.preventDefault();

  const email = document.getElementById("email");
  const password = document.getElementById("password");

  try {
    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login successful!");
      console.log(data);
      window.location.href = "index.html";
    } else {
      alert(data.error || "Login failed");
    }
  } catch (err) {
    console.error(err);
    alert("Cannot connect to backend");
  }
}

async function handleSignupSubmit(e) {
  e.preventDefault();

  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirm = document.getElementById("confirm");
  const terms = document.getElementById("terms");

  if (password.value !== confirm.value) {
    alert("Passwords don't match.");
    return;
  }

  if (password.value.length < 8) {
    alert("Password must be at least 8 characters.");
    return;
  }

  if (!terms.checked) {
    alert("Please agree to the Terms and Privacy Policy.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        display_name: `${firstName.value} ${lastName.value}`,
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Account created successfully!");
      window.location.href = "login.html";
    } else {
      alert(data.error || "Signup failed");
    }
  } catch (err) {
    console.error(err);
    alert("Cannot connect to backend");
  }
}

/* ---------- fetch and render live SENSEX chart ---------- */
async function fetchSensexChart() {
  const container = document.getElementById('heroChart');
  if (!container) return; // Only run if the hero chart exists on the page

  try {
    const response = await fetch('http://localhost:8000/api/chart/^BSESN');
    const data = await response.json();
    
    if (!data.candles || data.candles.length === 0) return;

    // 1. Generate evenly spaced X-axis labels (e.g., 5 labels across the day)
    const xLabels = [];
    const labelCount = 5; 
    const step = Math.max(1, Math.floor(data.candles.length / labelCount));
    
    data.candles.forEach((candle, index) => {
       if (index % step === 0 && xLabels.length < labelCount) {
         xLabels.push(candle.time);
       }
    });

    // 2. Render the real candles
    renderCandles('heroChart', data.candles, {
      width: 560, 
      height: 230,
      xLabels: xLabels
    });

    // 3. Update the Price and Change text
    const priceFmt = data.price.toLocaleString('en-IN', {minimumFractionDigits: 2});
    const arrow = data.is_up ? '▲' : '▼';
    const colorCls = data.is_up ? 'var(--green)' : 'var(--red)';

    const heroPrice = document.getElementById('heroPrice');
    const heroChg = document.getElementById('heroChg');

    if (heroPrice) heroPrice.textContent = priceFmt;
    if (heroChg) {
      heroChg.textContent = `${arrow} ${Math.abs(data.change).toFixed(2)}%`;
      heroChg.style.color = colorCls;
    }

  } catch (error) {
    console.error("Error loading Sensex chart:", error);
  }
}

document.addEventListener('DOMContentLoaded', function(){

  if(document.getElementById('liveChart')){
    const liveCandles = genCandles(60, 24200, 23);
    renderCandles('liveChart', liveCandles, {
      width: 640, height: 230,
      xLabels: ['09:30','10:00','10:30','11:00','11:30','12:00','12:30']
    });
  }

  fetchSensexChart();
  setInterval(fetchSensexChart, 15000);

  fetchLiveMarketData();
  setInterval(fetchLiveMarketData, 60000); 
  
  setInterval(tickPrice, 2600);

  const loginForm = document.getElementById('loginForm');
  if(loginForm) loginForm.addEventListener('submit', handleLoginSubmit);

  const signupForm = document.getElementById('signupForm');
  if(signupForm) signupForm.addEventListener('submit', handleSignupSubmit);

  const confirmInput = document.getElementById('confirm');
  if(confirmInput) confirmInput.addEventListener('input', checkPwMatch);

});