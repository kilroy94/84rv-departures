# Manual Test Checklist

Run the site from `http://localhost` or HTTPS. Record the browser/device/version used and restore `data/departures.json` after any destructive test edit. The bundled sample date starts on 2026-07-31; after the sample fully expires, the configured demonstration shift moves the schedule forward while preserving its relative order.

## Setup and smoke test

- [ ] Start a static server from the project root and open the site with the browser console visible.
- [ ] Confirm there are no uncaught JavaScript errors and no failed essential-file requests.
- [ ] Confirm the logo, title, current date, ticking local clock, last-refresh time, and Fictional demo data notice appear.
- [ ] Confirm no content or essential behavior is requested from a third-party origin.

## Desktop layout

- [ ] Test at 1920×1080 and 1280×800.
- [ ] Confirm the board has strong contrast, aligned columns, legible type, restrained framing, and no unintended clipping.
- [ ] Zoom to 200% and confirm controls and required content remain reachable.

## Tablet landscape

- [ ] Test approximately 1280×800 or on the target Android tablet in landscape.
- [ ] Confirm the primary board information is readable at viewing distance.
- [ ] Confirm all buttons are comfortable touch targets and the table remains aligned.
- [ ] Leave the screen running through at least two rotation intervals.

## Tablet portrait

- [ ] Test approximately 800×1280 or rotate the target tablet.
- [ ] Confirm the header compacts without overlap and all controls remain available.
- [ ] Confirm required columns are reachable if horizontal scrolling is necessary.

## Small phone fallback

- [ ] Test approximately 360×800.
- [ ] Confirm the page does not become narrower than the viewport.
- [ ] Confirm the board viewport can scroll horizontally to every required column.
- [ ] Confirm mode, page, and full-screen controls remain keyboard/touch reachable.

## Full-screen mode

- [ ] Select the full-screen icon and confirm the board expands without clipping.
- [ ] Confirm the button's accessible label changes to `Exit full screen`.
- [ ] Exit with the button or browser/Android gesture and confirm the normal layout returns.
- [ ] In a browser that denies or lacks the API, confirm the page remains usable and no raw error appears.

## Today and Upcoming modes

- [ ] In Today mode, confirm only records whose effective fictional date is today appear.
- [ ] Confirm the bundled first sample day contains 12 departures and therefore paginates at the default six rows per page.
- [ ] Switch to Upcoming and confirm today plus later fictional departures appear chronologically.
- [ ] Change all source dates away from today temporarily and confirm `No departures today` appears with guidance to use Upcoming.
- [ ] Use an empty `departures` array temporarily and confirm clean empty states appear in both modes.

## Sorting

- [ ] Confirm source order in `departures.json` is intentionally mixed.
- [ ] Confirm displayed records are ordered by date, then time.
- [ ] At the equal 08:15 sample time, confirm `Abbott` appears before `Bishop`.
- [ ] If two records share date, time, and last name, confirm their IDs provide deterministic final order.

## Pagination and manual controls

- [ ] Confirm `Page 1 of 2` in Today mode with the initial sample schedule/default configuration.
- [ ] Confirm the page advances automatically after approximately 12 seconds and transitions without a full-screen flash.
- [ ] Select Next and Previous; confirm each wraps correctly and remains visible for a fresh interval.
- [ ] With six or fewer visible records, confirm both page buttons are disabled and the indicator says `Page 1 of 1`.
- [ ] Change browser tabs for longer than an interval; confirm rotation pauses while hidden and resumes on return.

## Clock and date

- [ ] Confirm the clock updates every second and uses the device's local settings.
- [ ] Confirm the date is the device's current local calendar date.
- [ ] If practical, cross local midnight and confirm Today filtering refreshes for the new date.

## Status and type presentation

- [ ] Confirm Ready, Pending, Attention, and Delayed each show readable text, a distinct symbol, border, and contrast treatment.
- [ ] Confirm Pickup and Delivery both show text and distinct symbols.
- [ ] Confirm the meaning remains understandable in grayscale or with color-vision emulation.

## Invalid and missing data

- [ ] Temporarily add a record with a missing required field; confirm it is skipped, valid records remain, and a useful console warning appears.
- [ ] Temporarily use an invalid date such as `2026-02-30`; confirm that record is skipped.
- [ ] Temporarily break the JSON syntax; confirm `Schedule unavailable` appears and technical detail is logged only to the console.
- [ ] Temporarily rename `departures.json`; confirm the same board-friendly error and working Refresh control.
- [ ] Restore the original valid fictional data after each test and bump the worker cache version when needed.

## Offline and service worker

- [ ] Complete one successful online load from HTTPS or localhost, then reload once online.
- [ ] Confirm `service-worker.js` is activated and the current versioned cache contains every essential path.
- [ ] Enable browser offline mode or disconnect the tablet and reload.
- [ ] Confirm the complete board and fictional data load from cache and the visible indicator says Offline.
- [ ] Clear site storage, remain offline, and confirm first-time offline startup shows a useful unavailable state (or the browser's own navigation failure when no shell has ever been cached).
- [ ] Restore the network and confirm Refresh/reload recovers.

## Reduced motion and accessibility

- [ ] Enable the operating system/browser `prefers-reduced-motion` setting and confirm row/page transitions become effectively immediate.
- [ ] Navigate all controls using only Tab, Shift+Tab, Space, Enter, and arrow keys where native radio behavior applies.
- [ ] Confirm a visible focus indicator appears and focus is never trapped.
- [ ] With a screen reader, confirm the page title/headings, table headers, mode fieldset, data status, page changes, and icon-button labels are announced meaningfully.
- [ ] Confirm status meaning is present as text rather than color alone.
- [ ] Run a browser accessibility audit and manually review any findings.

## GitHub Pages paths

- [ ] Publish under a repository subpath such as `/rv-departures/`, not only at a domain root.
- [ ] Confirm CSS, ES modules, JSON, SVGs, and the manifest all return HTTP 200 under that subpath.
- [ ] Confirm the service-worker scope is the repository subpath and not the entire domain.
- [ ] Confirm an offline reload from a nested GitHub Pages project URL returns cached `index.html`.
