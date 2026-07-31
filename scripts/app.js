import { createBoardRenderer } from "./board-renderer.js";
import { startClock, toLocalDateKey } from "./clock.js";
import { DepartureDataError, getDepartures } from "./data-source.js";
import { createPagination } from "./pagination.js";

// Demonstration behavior is configured here. CSS reads ANIMATION_DURATION_MS
// through --board-transition-duration, set during startup.
export const BOARD_CONFIG = Object.freeze({
  ROWS_PER_PAGE: 6,
  ROTATION_INTERVAL_MS: 12_000,
  ANIMATION_DURATION_MS: 280,
  SHIFT_EXPIRED_DEMO_DATA: true,
});

const elements = {
  panel: document.querySelector(".departures-panel"),
  tableBody: document.querySelector("#departures-body"),
  message: document.querySelector("#board-message"),
  heading: document.querySelector("#departures-heading"),
  recordCount: document.querySelector("#record-count"),
  pageIndicator: document.querySelector("#page-indicator"),
  previousPage: document.querySelector("#previous-page"),
  nextPage: document.querySelector("#next-page"),
  refreshButton: document.querySelector("#refresh-button"),
  fullscreenButton: document.querySelector("#fullscreen-button"),
  connectionStatus: document.querySelector("#connection-status"),
  connectionLabel: document.querySelector("#connection-label"),
  lastRefresh: document.querySelector("#last-refresh"),
  currentDate: document.querySelector("#current-date"),
  currentTime: document.querySelector("#current-time"),
  modeInputs: [...document.querySelectorAll('input[name="board-mode"]')],
};

const renderer = createBoardRenderer({
  tableBody: elements.tableBody,
  messageElement: elements.message,
});

let allRecords = [];
let activeMode = "today";
let loading = false;

const pagination = createPagination({
  rowsPerPage: BOARD_CONFIG.ROWS_PER_PAGE,
  rotationInterval: BOARD_CONFIG.ROTATION_INTERVAL_MS,
  onPageChange: renderPage,
});

function getVisibleRecords() {
  const todayKey = toLocalDateKey(new Date());
  if (activeMode === "today") {
    return allRecords.filter((record) => record.departureDate === todayKey);
  }
  return allRecords.filter((record) => record.departureDate >= todayKey);
}

function renderPage({ records, currentPage, totalPages, totalRecords }) {
  elements.pageIndicator.textContent = `Page ${currentPage + 1} of ${totalPages}`;
  elements.previousPage.disabled = totalPages <= 1;
  elements.nextPage.disabled = totalPages <= 1;
  elements.recordCount.textContent = `${totalRecords} departure${totalRecords === 1 ? "" : "s"}`;

  if (totalRecords === 0) {
    const isToday = activeMode === "today";
    renderer.renderMessage({
      title: isToday ? "No departures today" : "No upcoming departures",
      detail: isToday
        ? "Switch to Upcoming to view the next scheduled departures."
        : "There are no future departures in the demonstration schedule.",
      symbol: "—",
    });
    return;
  }

  renderer.renderRows(records);
}

function updateMode() {
  elements.heading.textContent = activeMode === "today" ? "Today's departures" : "Upcoming departures";
  pagination.setRecords(getVisibleRecords());
}

function setConnectionState() {
  const online = navigator.onLine;
  elements.connectionStatus.dataset.state = online ? "online" : "offline";
  elements.connectionLabel.textContent = online ? "Online" : "Offline";
}

function setLastRefresh(date) {
  elements.lastRefresh.dateTime = date.toISOString();
  elements.lastRefresh.textContent = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

async function loadDepartures() {
  if (loading) return;
  loading = true;
  elements.panel.setAttribute("aria-busy", "true");
  elements.refreshButton.disabled = true;
  pagination.stop();
  renderer.renderMessage({ title: "Loading schedule", detail: "Please stand by.", symbol: "◌" });

  try {
    allRecords = await getDepartures({
      shiftExpiredDemoData: BOARD_CONFIG.SHIFT_EXPIRED_DEMO_DATA,
    });
    setLastRefresh(new Date());
    updateMode();
  } catch (error) {
    console.error("The departure board could not start its data display.", error);
    allRecords = [];
    elements.recordCount.textContent = "Schedule unavailable";
    elements.pageIndicator.textContent = "Page — of —";
    elements.previousPage.disabled = true;
    elements.nextPage.disabled = true;
    renderer.renderMessage({
      title: navigator.onLine ? "Schedule unavailable" : "Offline — schedule unavailable",
      detail: navigator.onLine
        ? "Check the data file, then use Refresh to try again."
        : "Connect once to cache the demonstration, then try again.",
      symbol: "!",
    });
    if (!(error instanceof DepartureDataError)) {
      console.error("Unexpected departure-board error.", error);
    }
  } finally {
    loading = false;
    elements.panel.setAttribute("aria-busy", "false");
    elements.refreshButton.disabled = false;
  }
}

function bindControls() {
  elements.modeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!input.checked) return;
      activeMode = input.value;
      updateMode();
    });
  });

  elements.previousPage.addEventListener("click", pagination.previous);
  elements.nextPage.addEventListener("click", pagination.next);
  elements.refreshButton.addEventListener("click", loadDepartures);

  window.addEventListener("online", setConnectionState);
  window.addEventListener("offline", setConnectionState);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pagination.stop();
    else pagination.start();
  });

  if (!document.documentElement.requestFullscreen) {
    elements.fullscreenButton.hidden = true;
  } else {
    elements.fullscreenButton.addEventListener("click", async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
      } catch (error) {
        console.warn("Full-screen mode was not available.", error);
      }
    });

    document.addEventListener("fullscreenchange", () => {
      const isFullscreen = Boolean(document.fullscreenElement);
      const label = isFullscreen ? "Exit full screen" : "Enter full screen";
      elements.fullscreenButton.setAttribute("aria-label", label);
      elements.fullscreenButton.title = label;
    });
  }
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) {
    console.info("Offline caching is unavailable in this browser context.");
    return;
  }

  try {
    await navigator.serviceWorker.register("./service-worker.js", { scope: "./" });
  } catch (error) {
    console.warn("Service-worker registration failed; online display can continue.", error);
  }
}

async function startApplication() {
  document.documentElement.style.setProperty(
    "--board-transition-duration",
    `${BOARD_CONFIG.ANIMATION_DURATION_MS}ms`,
  );
  bindControls();
  setConnectionState();
  startClock({
    dateElement: elements.currentDate,
    timeElement: elements.currentTime,
    onDateChange: updateMode,
  });
  await loadDepartures();
  await registerServiceWorker();
}

startApplication();

