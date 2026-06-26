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

/* ---------- ticker strip (landing page only) ---------- */
const tickerData = [
  {sym:'RELIANCE', chg:'+1.24%'},
  {sym:'TCS', chg:'-0.32%'},
  {sym:'NIFTY 25', chg:'+0.45%'},
  {sym:'HDFCBANK', chg:'+1.08%'},
  {sym:'INFY', chg:'+0.62%'},
  {sym:'ICICIBANK', chg:'+1.23%'},
  {sym:'SBIN', chg:'+0.53%'},
  {sym:'ITC', chg:'-0.16%'},
  {sym:'KOTAKBANK', chg:'+0.29%'},
];
function buildTicker(){
  const track = document.getElementById('tickerTrack');
  if(!track) return;
  const set = tickerData.map(t=>{
    const cls = t.chg.startsWith('-') ? 'down' : 'up';
    const arrow = cls === 'up' ? '▲' : '▼';
    return `<span class="tick">${t.sym} <b>${(24000+Math.random()*900).toFixed(2)}</b> <span class="${cls}">${arrow} ${t.chg}</span></span>`;
  }).join('');
  track.innerHTML = set + set; // duplicate for seamless loop
}

/* ---------- live price tick animation ---------- */
let basePrice = 24523;
function tickPrice(){
  basePrice += (Math.random()-0.45)*4;
  const formatted = basePrice.toLocaleString('en-IN', {maximumFractionDigits:0});
  const heroPrice = document.getElementById('heroPrice');
  const livePrice = document.getElementById('livePrice');
  if(heroPrice) heroPrice.textContent = formatted;
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
function handleLoginSubmit(e){
  e.preventDefault();
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  if(!email.value || !password.value) return;
  // Placeholder: wire this up to a real auth endpoint.
  alert('Login submitted for ' + email.value + ' (demo only — no backend connected).');
}

function handleSignupSubmit(e){
  e.preventDefault();
  const fullname = document.getElementById('fullname');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirm');
  const terms = document.getElementById('terms');

  if(password.value !== confirm.value){
    alert("Passwords don't match.");
    confirm.focus();
    return;
  }
  if(password.value.length < 8){
    alert('Password must be at least 8 characters.');
    password.focus();
    return;
  }
  if(!terms.checked){
    alert('Please agree to the Terms of Service and Privacy Policy.');
    return;
  }
  // Placeholder: wire this up to a real signup endpoint.
  alert('Account created for ' + fullname.value + ' (demo only — no backend connected).');
}

/* ---------- page init ---------- */
document.addEventListener('DOMContentLoaded', function(){

  /* Landing page hero + live-demo charts */
  if(document.getElementById('heroChart') && document.getElementById('liveChart')){
    const heroCandles = genCandles(46, 24300, 7);
    renderCandles('heroChart', heroCandles, {
      width: 560, height: 230,
      xLabels: ['15:00','15:30','16:00','16:30','17:00','17:30']
    });

    const liveCandles = genCandles(60, 24200, 23);
    renderCandles('liveChart', liveCandles, {
      width: 640, height: 230,
      xLabels: ['09:30','10:00','10:30','11:00','11:30','12:00','12:30']
    });
  }
  /* Login / signup hero chart only */
  else if(document.getElementById('heroChart')){
    const heroCandles = genCandles(46, 24300, 7);
    renderCandles('heroChart', heroCandles, {
      width: 560, height: 230,
      xLabels: ['15:00','15:30','16:00','16:30','17:00','17:30']
    });
  }

  buildTicker();
  setInterval(tickPrice, 2600);

  /* Wire up forms if present on this page */
  const loginForm = document.getElementById('loginForm');
  if(loginForm) loginForm.addEventListener('submit', handleLoginSubmit);

  const signupForm = document.getElementById('signupForm');
  if(signupForm) signupForm.addEventListener('submit', handleSignupSubmit);

  const confirmInput = document.getElementById('confirm');
  if(confirmInput) confirmInput.addEventListener('input', checkPwMatch);

});
