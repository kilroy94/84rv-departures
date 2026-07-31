# Architecture

## Planned structure

```text
/
├── index.html
├── styles/
│   ├── base.css
│   ├── board.css
│   └── responsive.css
├── scripts/
│   ├── app.js
│   ├── board-renderer.js
│   ├── clock.js
│   ├── pagination.js
│   └── data-source.js
├── data/
│   └── departures.json
├── assets/
│   ├── logo.webp
│   └── icons/
├── docs/
├── manifest.json
├── service-worker.js
└── README.md
```

The local logo and PWA icons are cached with the application shell. The exact final tree is recorded in the README.

## Module responsibilities

- `index.html`: semantic page shell, board headings, table structure, state/message regions, and accessible controls.
- `styles/base.css`: reset, design tokens, type, page background, common focus and utility rules.
- `styles/board.css`: sign housing, header, table, rows, statuses, controls, state messages, and transitions.
- `styles/responsive.css`: portrait, narrow-screen, large-display, and full-screen adaptations.
- `scripts/data-source.js`: fetch, validate, normalize, and sort fictional source data behind `getDepartures()`.
- `scripts/board-renderer.js`: safe DOM construction for rows and board messages; no data fetching.
- `scripts/pagination.js`: page calculation, current-page state, timed rotation, and previous/next behavior.
- `scripts/clock.js`: current local date/time formatting and updates.
- `scripts/app.js`: startup orchestration, mode selection, refresh, online state, fullscreen controls, and service-worker registration.
- `service-worker.js`: same-origin application-shell and data caching using relative URLs compatible with GitHub Pages project subpaths.

Modern JavaScript ES modules keep responsibilities explicit without a bundler.

## Startup and data flow

1. HTML and CSS render a stable board shell immediately.
2. `app.js` starts the clock, binds controls and connectivity events, then requests records from `getDepartures()`.
3. The data source fetches the JSON, checks the HTTP response, parses it, validates each record, normalizes strings, and sorts valid records.
4. The application filters the normalized records for Today or Upcoming.
5. The pagination controller divides the filtered list using the configured rows-per-page value.
6. `board-renderer.js` creates text nodes and status elements for the active page, avoiding HTML injection.
7. The rotation timer advances the page after the configured interval. User mode/page interactions restart the interval so a manual choice remains visible for a full cycle.
8. The clock module updates the time every second and the date when it changes.

Rows per page, rotation interval, transition duration, and demo-date behavior live together in an exported configuration object in `scripts/app.js` (with the transition value mirrored to a CSS custom property at startup).

## Error handling

The data adapter distinguishes fetch/parse failures from rejected records. It logs technical detail to the console and throws a small user-safe error. The application renders one of these board-friendly states:

- Loading schedule.
- No departures today.
- No upcoming departures.
- Some invalid records were skipped (console warning, valid rows remain).
- Schedule unavailable, with a retry control.
- Offline, using cached data where available.

Unhandled errors are not printed into the document. Service-worker registration failure is logged and does not prevent normal online use.

## Offline strategy

The service worker precaches the versioned application shell, scripts, styles, fictional JSON, manifest, logo, and local icons during installation. Requests for same-origin files use a cache-first strategy with a network fallback and opportunistic cache refresh. Navigation requests fall back to cached `index.html`. The worker uses relative paths derived from its registration scope so deployment under a GitHub Pages repository subpath works.

Offline startup can only succeed after the browser has completed one online load and installed the service worker. Direct `file://` opening does not support service workers or reliable `fetch()` access to JSON.

## Future source replacement

Production integration replaces the implementation behind `getDepartures()` in `scripts/data-source.js` (or selects a second adapter there). It must still return the documented normalized record array. Authentication, Google API access, source-column mapping, secret storage, and privacy filtering belong in a separate secure backend.

## Why no framework

The board has one screen, a small fixed record model, and limited state. Browser-native modules, DOM APIs, CSS Grid/table layout, the Fullscreen API, and Service Workers already provide the needed behavior. A framework would add download weight, version management, a build pipeline, and offline assets without solving a complexity present in this POC.
