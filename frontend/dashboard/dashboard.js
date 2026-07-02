document.addEventListener('DOMContentLoaded', () => {
  const storedUser = localStorage.getItem('paperbull_user');

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      const avatar = document.querySelector('.avatar');

      if (avatar && user.fullName) {
        avatar.textContent = user.fullName.trim().charAt(0).toUpperCase();
      }

      const moneyAmount = document.querySelector('.money-amount');

      if (moneyAmount && typeof user.balance === 'number') {
        moneyAmount.textContent = '₹' + user.balance.toLocaleString('en-IN');
      }
    } catch (err) {}
  }

  const pills = document.querySelectorAll('.pill-tabs .pill');

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.sticky-header-wrapper');
  let isScrolling;

  window.addEventListener('scroll', () => {
    header.classList.add('hidden');
    
    window.clearTimeout(isScrolling);

    isScrolling = setTimeout(() => {
      header.classList.remove('hidden');
    }, 250);
  }, { passive: true });
});

const DASHBOARD_API_BASE = 'http://localhost:5000';
const DASHBOARD_API_ENDPOINT = `${DASHBOARD_API_BASE}/api/gainers`;
let currentMoversEndpoint = DASHBOARD_API_ENDPOINT;
const MAX_MOVERS_COUNT = 7;

document.addEventListener('DOMContentLoaded', () => {
  console.log("1. Dashboard.js is loaded and running!");

  const moversTableBody = document.getElementById('movers-table-body');
  const pills = document.querySelectorAll('.pill-tabs .pill');
  
  if (moversTableBody) {
    fetchTopMovers(moversTableBody, currentMoversEndpoint);

    setInterval(() => {
      fetchTopMovers(moversTableBody, currentMoversEndpoint);
    }, 60000);

    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        // Change visual active state
        pills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');

        if (pill.textContent.trim() === 'Losers') {
          currentMoversEndpoint = `${DASHBOARD_API_BASE}/api/losers`;
        } else {
          currentMoversEndpoint = `${DASHBOARD_API_BASE}/api/gainers`;
        }

        moversTableBody.innerHTML = `
          <tr>
            <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 40px 0;">
              Fetching live market data...
            </td>
          </tr>
        `;
        
        fetchTopMovers(moversTableBody, currentMoversEndpoint);
      });
    });

  } 
  
  else {
    console.error("ERROR: Could not find 'movers-table-body' in the HTML. Did you save the index.html file?");
  }
});

async function fetchTopMovers(container, endpoint = DASHBOARD_API_ENDPOINT) {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Network error fetching market assets');
    
    const stocks = await response.json();
    
    if (!Array.isArray(stocks) || stocks.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 40px 0;">
            No market data available right now.
          </td>
        </tr>
      `;
      return;
    }

    container.innerHTML = '';
    
    stocks.slice(0, MAX_MOVERS_COUNT).forEach(stock => {
      const changeValue = typeof stock.change_percent === 'number'
        ? stock.change_percent
        : parseFloat(String(stock.change_percent).replace('%', '')) || 0;
      
      const prevClose = stock.previous_close || (stock.price / (1 + (changeValue / 100)));
      const absChange = (stock.price - prevClose).toFixed(2);
      
      const sign = absChange >= 0 ? '+' : '';
      const changeText = `${sign}${absChange} (${Math.abs(changeValue).toFixed(2)}%)`;
      const scoreClass = changeValue >= 0 ? 'up' : 'down';
      const sparkClass = changeValue >= 0 ? 'spark-up' : 'spark-down';
      
      const volumeText = stock.volume != null ? Number(stock.volume).toLocaleString('en-IN') : '—';
      const symbolText = stock.symbol || 'NSE';
      const priceValue = Number(stock.price || 0);

      let sparkPoints = "";
      let baselineLine = "";
      
      if (stock.chart && stock.chart.length > 0) {
          const prices = stock.chart;
          const minP = Math.min(...prices, prevClose);
          const maxP = Math.max(...prices, prevClose);
          const range = maxP - minP || 1; 
          
          sparkPoints = prices.map((p, index) => {
              const x = (index / (prices.length - 1)) * 100;
              const y = 22 - (((p - minP) / range) * 20); 
              return `${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(' ');

          const baselineY = 22 - (((prevClose - minP) / range) * 20);
          baselineLine = `<line x1="0" y1="${baselineY.toFixed(1)}" x2="100" y2="${baselineY.toFixed(1)}" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="2 2" opacity="0.4"></line>`;
      }

      const row = document.createElement('tr');

      row.style.cursor = 'pointer';
      row.addEventListener('click', () => {
        window.location.href = `../stocks/index.html?symbol=${stock.symbol}`;
      });

      row.innerHTML = `
        <td class="col-company">
          <div class="company-cell">
            <span class="company-symbol">${symbolText}</span>
          </div>
        </td>
        <td class="col-graph">
          <svg class="spark ${sparkClass}" viewBox="0 0 100 24">
            ${baselineLine}
            <polyline points="${sparkPoints}"></polyline>
          </svg>
        </td>
        <td class="col-price">
          <div class="price">₹${priceValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <div class="change ${scoreClass}">${changeText}</div>
        </td>
        <td class="col-volume">${volumeText}</td>
      `;
            
      container.appendChild(row);
    });
    
  } catch (error) {
    console.error('Frontend error mounting table rows:', error);
    container.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: #ef4444; padding: 20px 0; font-size: 14px;">
          Failed to fetch live prices. Ensure backend server is active on ${DASHBOARD_API_BASE}.
        </td>
      </tr>
    `;
  }
}