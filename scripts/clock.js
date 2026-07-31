function toLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export { toLocalDateKey };

export function startClock({ dateElement, timeElement, onDateChange = () => {} }) {
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

  let previousDateKey = "";

  function update() {
    const now = new Date();
    const dateKey = toLocalDateKey(now);
    dateElement.textContent = dateFormatter.format(now);
    timeElement.textContent = timeFormatter.format(now);
    timeElement.dateTime = now.toISOString();

    if (previousDateKey && previousDateKey !== dateKey) onDateChange(now);
    previousDateKey = dateKey;
  }

  update();
  const timer = window.setInterval(update, 1_000);
  return () => window.clearInterval(timer);
}

