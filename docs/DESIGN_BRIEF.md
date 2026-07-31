# Design Brief

## Direction

The visual direction is a premium departure sign inspired by traditional mechanical split-flap boards. It should suggest durable sign hardware and precise operational rhythm, not imitate a toy, game, or novelty animation.

## Visual system

- **Background:** near-black charcoal with a very subtle radial/linear texture created in CSS.
- **Sign housing:** a contained dark panel with quiet borders, inset lines, and modest shadow depth.
- **Text:** warm ivory for primary information, muted gray for secondary labels, and a restrained amber accent.
- **Typography:** local system monospaced stacks only. Letterspacing and tabular numerals provide the split-flap character without downloading a font.
- **Scale:** fluid type and spacing using `clamp()` and CSS custom properties. Primary departure values must remain readable from across a room.
- **Rows:** consistent horizontal bands with strong column alignment and subtle dividers.
- **Status:** short text labels plus distinct symbols and borders. Color reinforces rather than carries meaning.

## Header

The header contains:

- The 84RV Rentals and Service logo.
- The board title, `84RV DEPARTURES`.
- The current local date.
- A live local clock.
- A visible last-refresh time and an unobtrusive online/offline indicator.

The operational controls sit in a low-emphasis toolbar. The Today/Upcoming switch remains visible in normal demonstration mode; presentation mode minimizes nonessential controls while retaining an exit path supplied by the browser for full screen.

## Main departures board

The semantic departures table displays departure time, customer last name, unit number, destination, pickup/delivery type, and status. Desktop and landscape tablet layouts use aligned columns. Narrow layouts retain the table semantics but allow horizontal overflow and reduce nonessential spacing rather than hiding required information.

Empty and error states occupy the board body and use the same sign language as departure rows. A page counter and previous/next buttons appear only when pagination is useful, while the page counter remains available to assistive technology.

## Responsive and kiosk behavior

- **Landscape tablet/wall display:** the preferred layout, using the full table and generous distance-readable sizing.
- **Portrait tablet:** a compact header and tighter but complete table.
- **Desktop:** centered sign housing with a comfortable maximum width.
- **Small phone:** horizontal board scrolling is acceptable for emergency testing; controls wrap and remain touch-friendly.
- **Full screen:** margins and decorative outer framing reduce so the board uses the display efficiently.

Touch targets should be at least approximately 44 CSS pixels where space permits. No essential interaction depends on hover.

## Motion

Motion is restrained:

- A short fade/vertical settling transition on initial rows and page changes.
- No constant whole-board animation.
- Page rotation pauses for the configured interval before the next transition.
- `prefers-reduced-motion: reduce` disables transitions and smooth scrolling.

The design does not attempt a character-by-character simulation unless a later usability review shows it improves the sign without harming legibility.

## Readability and accessibility priorities

High contrast, meaningful text, visible keyboard focus, semantic table markup, labeled icon buttons, and status text are mandatory. Visual density, decoration, and animation must yield to these priorities.
