# Project Goals

## Purpose

The 84RV Departures proof of concept is a read-only digital sign that gives staff and visitors a quick, room-readable view of scheduled RV departures. It demonstrates how operational departure information could be presented on a wall display or tablet without exposing the underlying planning workbook.

## Audience and hardware

The primary audience is RV rental location staff coordinating pickups and deliveries. Customers in the departure area may also see the board, so it must show only the minimum fictional scheduling details needed for the demonstration.

The design targets, in order:

1. A landscape Android tablet used in a browser or installed as a Progressive Web App (PWA).
2. A wall-mounted full-screen display driven by a browser.
3. Tablet portrait and desktop browsers.
4. A small phone screen for emergency testing, not primary daily use.

## Visual character

The board should feel like a premium, contemporary interpretation of a mechanical train-station departures board: dark sign housing, warm high-contrast lettering, disciplined rows, monospaced typography, subtle separators, and restrained mechanical motion. Readability from across a room takes priority over decorative effects.

## Proof-of-concept scope

This proof of concept:

- Reads fictional records from a local JSON file through a replaceable data-source adapter.
- Shows Today and Upcoming views.
- Sorts, paginates, and automatically rotates departures.
- Shows a live local clock, current date, last refresh time, and connection state.
- Supports keyboard-accessible demonstration controls and browser full screen.
- Uses only static HTML, CSS, JavaScript, JSON, and local assets.
- Is deployable to GitHub Pages with no build step.
- Caches essential files so it can work offline after one successful online load.

## Explicit exclusions

This is not:

- A reservation management system.
- An editable dashboard.
- A customer portal.
- A printable reservation system.
- A replacement for TSD or the Operations Master workbook.
- A full web application with accounts or authentication.

It does not edit reservations, accept payments, show balances or contact details, send messages, connect to Google Sheets, include a backend, or contain credentials. It is a read-only digital sign.

## Future Google Sheets integration

A later production system may read the **Operations Master** Google Sheets workbook through a secure local or hosted backend. That backend would authenticate to Google, select and validate the necessary fields, and expose a narrow read-only JSON endpoint. Only the adapter in `scripts/data-source.js` should need replacement; sorting, pagination, and rendering should continue to consume the same normalized record model.

Google credentials and service-account files must never be shipped in this public static front end.

## Privacy

The demonstration uses fictional names, destinations, unit numbers, and schedules. It contains no real customer, reservation, address, contact, balance, employee, or credential data. A production feed should minimize displayed fields, be read-only, avoid sensitive details, use transport security, and follow the business's access and retention policies. A publicly visible display should be positioned and configured with the same privacy care as any other customer-facing sign.

## Demonstration success criteria

The demonstration succeeds when it:

- Opens from GitHub Pages and on a simple local web server without a build step.
- Presents a legible departures board on landscape tablet, portrait tablet, desktop, wall display, and small phone layouts.
- Correctly normalizes and sorts fictional records by date, time, then customer last name.
- Clearly distinguishes pickup/delivery and Ready/Pending/Attention/Delayed states without relying on color alone.
- Switches between Today and Upcoming, rotates overflowing pages, and provides working manual controls.
- Handles empty, malformed, missing, or offline data with a clean board-style message rather than a raw error.
- Registers its service worker when served securely and reloads offline after a successful cached visit.
- Preserves keyboard access, focus visibility, semantic structure, useful labels, and reduced-motion behavior.

