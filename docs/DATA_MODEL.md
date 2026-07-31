# Data Model

## Normalized departure record

Every data source returns an array of normalized records with this shape:

```json
{
  "id": "demo-001",
  "departureDate": "2026-08-10",
  "departureTime": "09:00",
  "customerLastName": "Anderson",
  "unitNumber": "C2451",
  "destination": "Myrtle Beach, SC",
  "departureType": "Pickup",
  "status": "Ready",
  "warning": ""
}
```

## Fields

| Field | Required | Rules |
| --- | --- | --- |
| `id` | Yes | Non-empty unique string. It is a display-system key, not a real reservation number. |
| `departureDate` | Yes | Local calendar date in strict `YYYY-MM-DD` form. |
| `departureTime` | Yes | Local 24-hour time in strict `HH:MM` form. |
| `customerLastName` | Yes | Non-empty display string; fictional in the POC. |
| `unitNumber` | Yes | Non-empty fictional unit label. |
| `destination` | Yes | Non-empty fictional destination label. |
| `departureType` | Yes | Exactly `Pickup` or `Delivery`. |
| `status` | Yes | Exactly `Ready`, `Pending`, `Attention`, or `Delayed`. |
| `warning` | No | Short plain-text context for staff. Empty or omitted means no warning. The initial board exposes it as an accessible/title hint rather than adding another crowded column. |

Unknown fields may be ignored. Records missing required fields, using duplicate IDs, or containing invalid enum/date/time values are rejected individually and reported to the console. Valid records continue to display. This allows a partially imperfect future feed to degrade gracefully.

## Date and time interpretation

Dates and times represent the display location's local civil time. They do not carry a timezone offset. Code must parse the separate numeric components into a local `Date`; it must not rely on `new Date("YYYY-MM-DD")`, which is commonly interpreted as UTC and can shift the visible day.

The POC formats time using the browser locale and a 12-hour clock. Source values remain 24-hour `HH:MM` strings for unambiguous sorting.

## Sorting

Normalized records are sorted ascending by:

1. `departureDate`.
2. `departureTime`.
3. `customerLastName`, compared case-insensitively using the browser locale.
4. `id`, as a final deterministic tie-breaker.

The display never assumes source order is correct.

## Display-mode selection

- **Today:** records whose local `departureDate` equals the browser's current local date.
- **Upcoming:** records scheduled on or after today, in chronological order. If no future records exist in the bundled demonstration dataset, the adapter may shift the fictional sample schedule as a group so the earliest sample day equals today. This keeps a static POC demonstrable over time while preserving relative dates and sorting; the UI labels that behavior as demonstration data.

## Data-source boundary

Only `scripts/data-source.js` knows that the proof of concept loads `data/departures.json`. It exposes an asynchronous `getDepartures()` function that returns normalized, validated, sorted records. The application, renderer, and pagination modules consume only those records and never fetch the JSON themselves.

## Future Google Sheets mapping

A secure backend can later map selected Operations Master columns to the same field names and accepted values. A network-backed adapter would fetch that backend's read-only JSON endpoint, normalize its response, and return the identical record array. The backend—not this static site—would hold Google credentials, handle Google API quotas, and remove sensitive columns. No rendering changes should be required.

