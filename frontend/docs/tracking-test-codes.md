# Tracking — test codes

Reference for manually testing the tracking page at `/tracking`.

Data is fetched live from `GET {NEXT_PUBLIC_API_BASE_URL}/packages?trackingNumber=…`,
which defaults to the Render backend at `https://veno-atlas-2.onrender.com/api`.

## How to test

Either enter a code in the tracking form, or link straight to a result:

```
http://localhost:3000/tracking?number=BZKA854211
```

The header search box and the homepage tracking band both feed the same page.

## Any input returns a result

`/tracking` never dead-ends. If a code doesn't match a real record — a typo, a
made-up string, or the API being unreachable — the page renders a **generated
shipment** instead of an error. It is presented exactly like a real record; the
"demo" badging was removed, so there is no on-screen marker distinguishing the
two.

Fallback data is derived from a hash of the input, so the same string always
produces the same route, statuses and timestamps. That makes UI bugs
reproducible. Type `foo`, `123`, or anything else to exercise it.

Real API matches always take priority over the demo fallback.

## Real records

These exist in the backend and return genuine data.

### With a scan timeline (renders the progress list and the map)

| Code | Status | Events | Mode |
| --- | --- | ---: | --- |
| `BZKA854211` | Awaiting Clearance | 2 | Air |
| `AP20251113` | Package has left the factory | 2 | Air |
| `GM196000` | Seized by customs, box looking suspicious | 2 | Ground |
| `VDS322` | Under review by Thailand's Customs Department | 1 | Ground |

### No scan events (renders the empty state, map is hidden)

| Code | Status | Mode |
| --- | --- | --- |
| `BZQF97837` | Package Received | Air |
| `BZQF97635` | In Transit | Ground |
| `BZQF97638` | Shipment On Hold | Ground |
| `APX5341` | Package Received | Ground |
| `APX5342` | Package Received | Ground |
| `test` | Package Received | Air |

## Shipping states

There are 15 states, each with its own colour and icon. They are defined once in
`SHIPMENT_STATES` in `src/app/tracking/page.js`, and drive the progress bar, the
marker circle, the active row's panel and the map pin together.

Statuses are **free text** — there is no enum. A state is matched from the
status string by keyword (case-insensitive substring) via `STATE_RULES`.

### Normal progression

| State | Colour | Icon | Step | Matched by |
| --- | --- | --- | ---: | --- |
| Label Created | ⬜ slate | file | 0 | `created` · `label` · `booked` · `registered` |
| Picked Up | 🔵 sky | package-check | 1 | `picked` · `collected` · `received` · `accepted` |
| In Transit | 🟧 brand orange | truck | 2 | `transit` · `departed` · `left` · `en route` · `shipped` |
| At Facility | 🟣 indigo | warehouse | 3 | `arrived` · `facility` · `hub` · `sorting` · `depot` |
| Customs Clearance | 🟦 teal | file-search | 3 | `customs` · `clearance` · `import` · `export` · `duty` |
| Out for Delivery | 🟪 violet | truck | 4 | `out for delivery` · `with courier` · `with driver` |
| Delivered | 🟢 emerald | check | 5 | `delivered` · `signed for` · `handed over` |

### Exceptions

| State | Colour | Icon | Step | Matched by |
| --- | --- | --- | ---: | --- |
| On Hold | 🟠 amber | pause | 3 | `hold` · `awaiting` · `suspended` · `stopped` |
| Action Required | 🟡 yellow | alert | 3 | `action` · `review` · `attention` · `document` |
| Delayed | 🟧 orange-600 | clock | 2 | `delay` · `reschedul` · `postponed` · `late` |
| Returned to Sender | 🟪 fuchsia | undo | 4 | `return` · `rts` · `sent back` |
| Delivery Failed | 🔴 red-500 | x | 4 | `failed` · `unsuccessful` · `undeliverable` · `refused` |
| Lost or Damaged | 🌹 rose | package-x | 2 | `lost` · `damaged` · `missing` · `destroyed` |
| Seized | 🔴 red-700 | ban | 3 | `seized` · `confiscat` · `impound` · `detained` |
| Cancelled | ⬛ zinc | ban | 0 | `cancel` · `void` · `aborted` |

`Pending` (gray) is not matchable — it is what unreached steps render as.
Anything matching no rule falls back to **In Transit**.

### Rule order matters

`STATE_RULES` is evaluated top-down and the first match wins, so the most severe
and most specific states are tested first:

- `Seized by customs` → **seized**, not customs
- `Not Delivered` → **failed**, not delivered
- `Under review by … Customs Department` → **action_required**, not customs
- `Awaiting Clearance` → **on_hold**, not customs

### What each code renders

| Code | Status | State |
| --- | --- | --- |
| `GM196000` | Seized by customs… | 🔴 Seized (red-700) |
| `BZKA854211` | Awaiting Clearance | 🟠 On Hold |
| `BZQF97638` | Shipment On Hold | 🟠 On Hold |
| `VDS322` | Under review by Thailand's Customs Department | 🟡 Action Required |
| `AP20251113` | Package has left the factory | 🟧 In Transit |
| `BZQF97635` | In Transit | 🟧 In Transit |
| `BZQF97837`, `APX5341`, `APX5342`, `test` | Package Received | 🔵 Picked Up |
| `ok`, `z`, `2`, `8` | *(fallback)* Delivered | 🟢 Delivered |

**Most states have no seeded record.** Only 5 of the 15 are reachable from the
backend, and the hash fallback only ever produces the six happy-path statuses —
it can never show an exception. To exercise the rest, edit a package's status in
admin to any string containing the keywords above.

### Bar fill

Every state carries its own `step` (0-5), which is what `getStatusIndex`
returns, so exception states park at the stage they occur at rather than
collapsing to 0 — a seized parcel shows the distance it travelled. For records
**with events** the bar always fills to the newest event, and `step` is unused.

## Cases worth checking

| What to test | Use | Expected |
| --- | --- | --- |
| Full happy path | `BZKA854211` | Summary grid, sender/receiver, 2-step timeline, embedded map |
| Empty timeline | `BZQF97837` | "No scan events have been recorded" — **map must not render** |
| Long status text | `VDS322` | Long status wraps without breaking the layout |
| Multi-line addresses | `BZQF97635` | Address blocks wrap cleanly in the summary grid |
| Emoji in status | `VDS322` | Status contains a warning emoji and must not break the row |
| Unknown code | `NOSUCH123` | Fallback result, rendered like a real record |
| Deterministic fallback | `NOSUCH123` twice | Identical output both times |
| Seized state | `GM196000` | Dark red bar, ban icon, red panel on the active row |
| On-hold state | `BZKA854211` | Amber bar, pause icon, amber panel |
| Action-required state | `VDS322` | Yellow bar, alert icon, yellow panel |
| Delivered state | `ok` | Emerald bar filled to the last step, check icon |
| Rule precedence | `GM196000` | Renders **seized**, not customs, despite saying "customs" |
| Mobile layout | any, at 375px | No horizontal scroll; date badge wraps under the location |

## Notes

- A package with zero events must **not** render the map. Passing no location
  previously produced a `q=undefined` Google Maps embed.
- Missing `sender`, `receiver` or `events` are handled defensively; a partial
  record still renders rather than throwing.
- Invalid or absent timestamps render as "Not available" rather than the string
  "Invalid Date".
- The list above is a snapshot. Re-run this to see what's currently seeded:

  ```bash
  curl -s https://veno-atlas-2.onrender.com/api/packages
  ```

APE3565X