/* ============================================================
   PaperBull — Market hours helper
   Single source of truth (client-side) for "is the market open
   right now" and "is it time to auto square-off intraday
   positions", based on NSE cash market hours:
     Monday–Friday, 9:15 AM – 3:30 PM IST
   This does not account for exchange holidays — only weekday +
   time-of-day — since PaperBull has no holiday calendar feed.
   Loaded before dashboard.js / orders.js on every page that needs
   to know the market status.
   ============================================================ */

(function () {
  const OPEN_HOUR = 9, OPEN_MIN = 15;
  const CLOSE_HOUR = 15, CLOSE_MIN = 30;
  // Intraday (MIS) positions still open this many minutes before close
  // get auto square-off'd, mirroring how real brokers square off MIS
  // positions shortly before the bell rather than exactly at it.
  const SQUAREOFF_BUFFER_MIN = 5;

  const WEEKDAY_MAP = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

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

    return {
      year: Number(parts.year),
      month: Number(parts.month),
      day: Number(parts.day),
      hour: parts.hour === "24" ? 0 : Number(parts.hour),
      minute: Number(parts.minute),
      dayOfWeek: WEEKDAY_MAP[parts.weekday],
      dateKey: `${parts.year}-${parts.month}-${parts.day}`,
    };
  }

  function fmtClock(hour, minute) {
    const h12 = ((hour + 11) % 12) + 1;
    const ampm = hour < 12 ? "AM" : "PM";
    return `${h12}:${String(minute).padStart(2, "0")} ${ampm}`;
  }

  const OPEN_LABEL = fmtClock(OPEN_HOUR, OPEN_MIN);
  const CLOSE_LABEL = fmtClock(CLOSE_HOUR, CLOSE_MIN);

  function getMarketStatus(date) {
    const ist = getISTParts(date || new Date());
    const minutesNow = ist.hour * 60 + ist.minute;
    const openMin = OPEN_HOUR * 60 + OPEN_MIN;
    const closeMin = CLOSE_HOUR * 60 + CLOSE_MIN;
    const squareOffMin = closeMin - SQUAREOFF_BUFFER_MIN;

    const isWeekday = ist.dayOfWeek >= 1 && ist.dayOfWeek <= 5;
    const isOpen = isWeekday && minutesNow >= openMin && minutesNow < closeMin;
    const isPastSquareOff = isWeekday && minutesNow >= squareOffMin;

    let message;
    if (isOpen) {
      message = `Market open · closes at ${CLOSE_LABEL} IST`;
    } else if (isWeekday && minutesNow < openMin) {
      message = `Market closed · opens today at ${OPEN_LABEL} IST`;
    } else {
      message = `Market closed · opens ${OPEN_LABEL} IST on the next trading day`;
    }

    return {
      isOpen,
      isWeekday,
      isPastSquareOff,
      minutesNow,
      openMin,
      closeMin,
      squareOffMin,
      dateKey: ist.dateKey,
      openLabel: OPEN_LABEL,
      closeLabel: CLOSE_LABEL,
      message,
    };
  }

  window.PaperBullMarketHours = {
    getMarketStatus,
    OPEN_LABEL,
    CLOSE_LABEL,
  };
})();
