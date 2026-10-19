# SMDC Travels — Bus E-Ticketing Prototype

A single-file, static UI prototype of an **E-Ticketing for Buses** system for **SMDC Travels** (India, currency ₹).
Built for **ISM3113 Assignment 6** — a working prototype of **Group 5's system**, implemented from the requirements
captured in **Group 12's Assignment 4**. Everything runs in the browser: HTML + CSS + vanilla JS, no build step,
state persisted in `localStorage`. The bank and email are simulated (persistent banner reminds the user).

**Live demo:** https://theom720.github.io/smdc-bus-eticketing/

**AI model used:** Qwen3.8-27B — OBLITERATED, Fable 5

## Demo credentials

| Role | Email | Password |
|------|-------|----------|
| Customer | `customer@smdc.test` | `Travel@123` |
| Manager | `manager@smdc.test` | `Manage@123` |
| Admin | `admin@smdc.test` | `Admin@123` |

**Demo payment PIN:** `4321`

The login screen shows a "Demo credentials" help card — click any row to auto-fill.
Use **Reset demo data** (footer) to clear `localStorage` and re-seed.

## Requirement → feature map

| ID | Requirement | Where it is visible in the UI |
|----|-------------|-------------------------------|
| FR-01 | Register (name, email, gov ID, password) with validation | Register page — rejects blanks, bad email, short ID, weak password |
| FR-02 | Login (email + password) | Login page |
| FR-03 | Lock after failed attempts; admin unlock | 5 wrong passwords → account locked + unlock email; Admin → User accounts → Unlock |
| FR-04 | Show schedules with date, time, price, seats remaining | Browse page route cards + per-date seats-left count |
| FR-05 | Seat map with live availability (available/held/booked) | Booking page seat grid + colour legend |
| FR-06 | Selecting a seat locks it with a visible hold timer | Tap seat → countdown pill "Seat held: m:ss" appears |
| FR-07 | Confirmed booking + emailed receipt | Correct PIN + bank up → Confirmed, receipt in Inbox |
| FR-08 | Customer cancellation | My bookings → Cancel entire booking / cancel single seat |
| FR-09 | Manager: manage bookings, edit schedule times, sales report | Manager dashboard (Bookings / Schedule / Sales report tabs) |
| FR-10 | Admin: manage routes, vehicles, user accounts | Admin console (Routes & vehicles / User accounts tabs) |
| NFR-01 | Usable, branded, responsive UI | Whole app — SMDC brand palette, mobile-responsive layout |
| NFR-02 | Timely confirmation / notification | Toast + Inbox email on confirm/pending |
| NFR-05 | Manager dashboard refresh indicator | "Refreshed Xs ago · auto-refreshes every 5 min" — real 5-min `setInterval`, live ticking label |
| DR-01 | Reject duplicate email / invalid input on register | Register with `customer@smdc.test` → "account already exists" |
| DR-03 | One source of truth for seat state across users | Shared `localStorage` seat-state keyed route+date+time+seat; others' holds show as unavailable |
| SR-01 | Display seats remaining | Seats-left count on each date pill (Browse) |
| SR-03 | Account lockout after repeated failures | 5 failures → lock + simulated unlock email |
| SR-04 | Admin audit log (user, action, date, time) | Admin → Audit log; every admin mutation appends an entry |
| IR-01 | Bank API integration (PIN) decision logic | Payment section; PIN `4321`; decision table in code + `selfcheck.js` |
| IR-04 | Email receipt pushed on confirmation | Inbox receives "Booking confirmed" email |
| BR-02 | Seat held for a fixed window (5 min) | `SEAT_HOLD_MS = 5 * 60 * 1000` |
| BR-03 | Hold auto-releases on expiry | Countdown hits 0 → seats released, toast shown |
| BR-04 | Confirm only when bank up + PIN correct + seat locked | Payment decision table (`decidePayment`) |
| BR-05 | Bank down → PENDING, hold retained, notification | "Simulate bank API down" toggle → Pending booking + email |
| BR-06 | Block deleting a route with active bookings | Admin → Routes → Delete on a booked route is blocked ("deactivate instead") |
| Q-03 | Cancel a single seat of a multi-seat booking | My bookings → ✕ on an individual seat chip |
| Q-04 | Audit trail of admin actions | Admin → Audit log |

## Files

- `index.html` — the entire application (inline `<style>` + `<script>`).
- `selfcheck.js` — Node self-check of the payment-decision, seat-lock, and money logic (`node selfcheck.js`).
- `DEMO-SCRIPT.md` — click-by-click walkthrough for the MS Teams recording.

## Notes / simplifications

- Bank, email, and government-ID verification are **simulated** (prototype scope). The Inbox is a single shared demo
  mailbox so graders can see every generated message in one place.
- Each route has one departure time per day; seats are a flat grid of 40 (2 + aisle + 2 per row).
