# Future Google Sheets Integration

## Safe production shape

```text
Operations Master
        ↓
Secure local or hosted backend
        ↓
Read-only JSON endpoint
        ↓
Departure-board front end
```

This proof of concept stops at the front end and fictional local JSON. It does not build, select, or deploy the backend.

## Why a backend is required

GitHub Pages serves every front-end file publicly. JavaScript, network requests, bundled configuration, and downloaded assets can all be inspected by anyone who can load the page. Placing a Google service-account key, OAuth client secret, refresh token, workbook credential, or unrestricted API key in this repository would expose it. Obfuscation, environment-like JavaScript files, and hiding a file from the interface do not make a browser-delivered secret safe.

A secure backend can keep credentials outside its public document root, authenticate to Google, enforce access policy, select only approved Operations Master columns, normalize values, exclude sensitive data, rate-limit requests, log failures safely, and return a narrow read-only response over HTTPS. Network and device policy should restrict that endpoint further where appropriate.

## Recommended backend responsibilities

- Authenticate to Google Sheets using secrets stored in a proper server-side secret store.
- Read only the necessary worksheet/range and use the least privilege practical.
- Map source column names to the normalized departure model.
- Reject or quarantine malformed rows.
- Remove contact data, addresses, balances, notes, employee data, and identifiers the sign does not need.
- Return only the fields documented in `DATA_MODEL.md`.
- Supply caching headers and a clear freshness timestamp.
- Protect the endpoint with an appropriate network/authentication design without putting reusable secrets in the display bundle.
- Apply HTTPS, request limits, monitoring, and a safe failure mode.

Whether the service runs on the business network or a hosted platform is a later operational decision. A local service can reduce public exposure but requires reliable onsite maintenance. A hosted service can simplify availability but needs carefully designed access control. Neither choice changes the front-end contract.

## Front-end adapter replacement

The current boundary is `getDepartures()` in `scripts/data-source.js`. It currently:

1. Resolves the local `data/departures.json` URL.
2. Fetches and parses the file.
3. Validates and normalizes each record.
4. Sorts and returns normalized records.

A future network adapter should preserve steps 3 and 4 and change only the acquisition layer. Conceptually:

```javascript
async function getDepartures() {
  const response = await fetch(CONFIGURED_READ_ONLY_ENDPOINT, {
    headers: { "Accept": "application/json" }
  });

  // Check the response, validate/map rows, and return the same normalized model.
  return normalizedDepartures;
}
```

The endpoint URL is not a secret, but any credential authorizing access must not be embedded in this code. Depending on the eventual environment, access could use a same-site session established outside the sign app, a managed-device/network gateway, or an authenticated reverse proxy. That design requires a security review.

Because `app.js`, `board-renderer.js`, and `pagination.js` consume only normalized records, they should not need to know whether data originated in a local JSON file, Google Sheets, or another operations system.

## Offline behavior with live data

Production requirements must decide whether cached operational records may be shown offline and for how long. Stale schedules can mislead staff. A future adapter should return or derive a trustworthy `generatedAt` time, and the UI should visibly distinguish fresh, cached, and expired data. The service worker may need a network-first data policy even while keeping the application shell cache-first.

Those freshness and security decisions are intentionally not implemented in this fictional proof of concept.
