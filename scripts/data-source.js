/**
 * Dummy JSON data adapter.
 *
 * This is the only module that knows where or how the POC data is stored.
 * A future Google Sheets-backed adapter should replace the fetch portion here
 * while continuing to return the same normalized record array.
 */

const DATA_URL = new URL("../data/departures.json", import.meta.url);
const REQUIRED_FIELDS = [
  "id",
  "departureDate",
  "departureTime",
  "customerLastName",
  "unitNumber",
  "destination",
  "departureType",
  "status",
];
const ACCEPTED_STATUSES = new Set(["Ready", "Pending", "Attention", "Delayed"]);
const ACCEPTED_TYPES = new Set(["Pickup", "Delivery"]);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export class DepartureDataError extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = "DepartureDataError";
  }
}

function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function validateAndNormalize(rawRecord, index, seenIds) {
  if (!rawRecord || typeof rawRecord !== "object" || Array.isArray(rawRecord)) {
    throw new TypeError(`Record ${index + 1} is not an object.`);
  }

  const normalized = {};
  for (const field of REQUIRED_FIELDS) {
    if (typeof rawRecord[field] !== "string" || rawRecord[field].trim() === "") {
      throw new TypeError(`Record ${index + 1} has a missing or invalid ${field}.`);
    }
    normalized[field] = rawRecord[field].trim();
  }

  if (seenIds.has(normalized.id)) {
    throw new TypeError(`Record ${index + 1} uses duplicate id ${normalized.id}.`);
  }
  if (!DATE_PATTERN.test(normalized.departureDate) || !parseLocalDate(normalized.departureDate)) {
    throw new TypeError(`Record ${normalized.id} has an invalid departureDate.`);
  }
  if (!TIME_PATTERN.test(normalized.departureTime)) {
    throw new TypeError(`Record ${normalized.id} has an invalid departureTime.`);
  }
  if (!ACCEPTED_TYPES.has(normalized.departureType)) {
    throw new TypeError(`Record ${normalized.id} has an unsupported departureType.`);
  }
  if (!ACCEPTED_STATUSES.has(normalized.status)) {
    throw new TypeError(`Record ${normalized.id} has an unsupported status.`);
  }

  seenIds.add(normalized.id);
  normalized.warning = typeof rawRecord.warning === "string" ? rawRecord.warning.trim() : "";
  return Object.freeze(normalized);
}

export function sortDepartures(records) {
  return [...records].sort((first, second) => {
    const firstSchedule = `${first.departureDate}T${first.departureTime}`;
    const secondSchedule = `${second.departureDate}T${second.departureTime}`;
    const scheduleComparison = firstSchedule < secondSchedule
      ? -1
      : firstSchedule > secondSchedule
        ? 1
        : 0;
    if (scheduleComparison !== 0) return scheduleComparison;

    const nameComparison = first.customerLastName.localeCompare(
      second.customerLastName,
      undefined,
      { sensitivity: "base" },
    );
    if (nameComparison !== 0) return nameComparison;
    return first.id.localeCompare(second.id);
  });
}

function shiftExpiredDemoSchedule(records, today) {
  if (records.length === 0) return records;

  const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  const latestDate = parseLocalDate(records.at(-1).departureDate);
  if (latestDate >= localToday) return records;

  const earliestDate = parseLocalDate(records[0].departureDate);
  const dayOffset = Math.round((localToday - earliestDate) / 86_400_000);

  return records.map((record) => {
    const shiftedDate = parseLocalDate(record.departureDate);
    shiftedDate.setDate(shiftedDate.getDate() + dayOffset);
    return Object.freeze({ ...record, departureDate: formatLocalDate(shiftedDate) });
  });
}

export async function getDepartures(options = {}) {
  const { shiftExpiredDemoData = true, today = new Date() } = options;
  let response;

  try {
    response = await fetch(DATA_URL, { cache: "no-cache" });
  } catch (error) {
    console.error("Departure data request failed.", error);
    throw new DepartureDataError("The departure schedule could not be reached.", error);
  }

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status} ${response.statusText}`);
    console.error("Departure data returned an unsuccessful response.", error);
    throw new DepartureDataError("The departure schedule is unavailable.", error);
  }

  let payload;
  try {
    payload = await response.json();
  } catch (error) {
    console.error("Departure data contains invalid JSON.", error);
    throw new DepartureDataError("The departure schedule could not be read.", error);
  }

  const rawRecords = Array.isArray(payload) ? payload : payload?.departures;
  if (!Array.isArray(rawRecords)) {
    const error = new TypeError("Expected an array or a departures array property.");
    console.error("Departure data has an invalid top-level structure.", error);
    throw new DepartureDataError("The departure schedule has an invalid format.", error);
  }

  const seenIds = new Set();
  const records = [];
  rawRecords.forEach((rawRecord, index) => {
    try {
      records.push(validateAndNormalize(rawRecord, index, seenIds));
    } catch (error) {
      console.warn("Skipping an invalid fictional departure record.", error);
    }
  });

  const sortedRecords = sortDepartures(records);
  const finalRecords = shiftExpiredDemoData
    ? shiftExpiredDemoSchedule(sortedRecords, today)
    : sortedRecords;

  return Object.freeze(sortDepartures(finalRecords));
}
