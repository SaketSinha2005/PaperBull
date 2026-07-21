// marketHours.js — server-side source of truth for NSE cash market hours
// (Mon–Fri, 9:15 AM – 3:30 PM IST). Mirrors frontend/dashboard/market-hours.js
// so the auto square-off job agrees with the UI about when the trading day
// has ended. Does not account for exchange holidays.

const OPEN_HOUR = 9, OPEN_MIN = 15;
const CLOSE_HOUR = 15, CLOSE_MIN = 30;
// Intraday (MIS) positions still open this many minutes before close get
// auto square-off'd, mirroring real brokers.
const SQUAREOFF_BUFFER_MIN = 5;

function getISTParts(date) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  });
  const parts = {};
  fmt.formatToParts(date).forEach((p) => { parts[p.type] = p.value; });

  const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: parts.hour === "24" ? 0 : Number(parts.hour),
    minute: Number(parts.minute),
    dayOfWeek: weekdayMap[parts.weekday],
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
  };
}

function getMarketStatus(date) {
  const ist = getISTParts(date || new Date());
  const minutesNow = ist.hour * 60 + ist.minute;
  const openMin = OPEN_HOUR * 60 + OPEN_MIN;
  const closeMin = CLOSE_HOUR * 60 + CLOSE_MIN;
  const squareOffMin = closeMin - SQUAREOFF_BUFFER_MIN;

  const isWeekday = ist.dayOfWeek >= 1 && ist.dayOfWeek <= 5;
  const isOpen = isWeekday && minutesNow >= openMin && minutesNow < closeMin;
  const isPastSquareOff = isWeekday && minutesNow >= squareOffMin;

  return { isOpen, isWeekday, isPastSquareOff, minutesNow, openMin, closeMin, squareOffMin, dateKey: ist.dateKey };
}

// Zero-padded "YYYY-MM-DD" for today in IST — safe to bind to a Postgres
// DATE column (status.dateKey itself isn't zero-padded).
function getTodayIso(date) {
  const status = getMarketStatus(date);
  const [y, m, d] = status.dateKey.split("-").map(Number);
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

module.exports = { getMarketStatus, getTodayIso };
