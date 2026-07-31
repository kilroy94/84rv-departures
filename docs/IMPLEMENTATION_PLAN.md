# Implementation Plan

Implementation begins only after `PROJECT_GOALS.md`, `DESIGN_BRIEF.md`, `DATA_MODEL.md`, `ARCHITECTURE.md`, and this plan have been completed and reviewed.

## Phased checklist

- [x] 1. Create the static project skeleton and semantic HTML shell.
- [x] 2. Add a clearly fictional, intentionally unsorted dummy JSON data source with enough records to overflow one page.
- [x] 3. Implement the premium dark departure-board layout and local logo placeholder.
- [x] 4. Add the current local date, live clock, and visible last-refresh timestamp.
- [x] 5. Validate, normalize, and sort departures by local date, time, last name, and ID.
- [x] 6. Add textual, symbolic, high-contrast treatments for Ready, Pending, Attention, and Delayed.
- [x] 7. Implement page calculation, automatic rotation, a page indicator, and keyboard-accessible previous/next controls.
- [x] 8. Add landscape-first tablet styles, portrait adaptations, wall-display scaling, and a narrow phone fallback.
- [x] 9. Add the web app manifest, local icons, service worker, scope-relative caching, and online/offline indication.
- [x] 10. Review semantic structure, names/labels, contrast, focus visibility, touch targets, and reduced-motion behavior.
- [x] 11. Verify all asset and cache paths work from a GitHub Pages repository subpath and require no build step.
- [x] 12. Write and perform manual testing instructions covering modes, sorting, pagination, full screen, errors, offline use, and responsive layouts.
- [x] 13. Complete `README.md`, `TEST_CHECKLIST.md`, and `FUTURE_INTEGRATION.md` based on the final implementation.
- [x] 14. Audit the finished files against every stated requirement and correct discrepancies.

## Verification approach

Static verification will check file presence, JSON validity, module imports, referenced assets, manifest data, cache coverage, and absence of external dependencies or sensitive-looking data. Browser verification will use a simple standard-library local HTTP server when Python is available for testing only; running the product does not require Python. Manual testing instructions will cover Android/PWA behavior that cannot be faithfully emulated by static checks alone.

## Configuration location

The final `scripts/app.js` will expose a clearly labeled configuration object containing:

- Rows per page.
- Rotation interval in milliseconds.
- Animation duration in milliseconds.
- Whether the dated sample dataset may shift forward for an always-demonstrable static display.

Documentation will identify the exact names and safe adjustment ranges after implementation.

## Completed verification

On 2026-07-31, the final static audit validated all 18 fictional records, unique IDs, strict dates/times, enum coverage, JSON/manifest parsing, service-worker cache paths, manifest icon paths, ES-module boundaries, and the absence of third-party runtime URLs. Headless Microsoft Edge smoke tests rendered the site at 1280×800, 800×1280, and 360×800. A DOM-level browser check confirmed six sorted records, the `Page 1 of 2` indicator, and the `Abbott`/`Bishop` name tie-break. A separate controlled-browser test stopped the local server and successfully rendered the same board from the installed service-worker cache.

The detailed device, interaction, accessibility, and failure-injection scenarios remain available in `TEST_CHECKLIST.md` for repeatable manual acceptance testing on the eventual target Android hardware.
