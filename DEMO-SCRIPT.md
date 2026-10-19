# SMDC Travels E-Ticketing — Demo Script (MS Teams recording)

Click-by-click path that exercises every feature. Requirement IDs noted per step.
Start at the live site: https://theom720.github.io/smdc-bus-eticketing/
Tip: click **Reset demo data** (footer) first for a clean slate.

> Persistent banner at top: "UI prototype — bank & email are simulated." Point it out once.

## 1. Register a new account (FR-01, DR-01)
1. Top-right → **Register**.
2. First show validation: submit empty → inline errors appear. Enter a bad email (`foo`) → "Enter a valid email address." Enter password `abc` → "needs 8+ characters, a letter and a number."
3. Try email `customer@smdc.test` → **"An account with this email already exists."** (DR-01 duplicate rejection).
4. Now register clean: Name `Priya Rao`, email `priya@smdc.test`, Gov ID `AADH-9988-7766`, password `Travel@2026`. → account created, logged in as a customer.

## 2. Browse while blocked from booking (FR-04, SR-01)
1. (Optional: log out first to show the logged-out block.) Click **Log out**, then **Browse**.
2. Show the route cards: each shows **date, departure time, price (₹), seats remaining** per date (FR-04, SR-01).
3. Click any date pill while logged out → toast **"Please log in to book."** and redirect to Login (book-blocked).

## 3. Log in (FR-02)
1. On **Login**, in the **Demo credentials** card click the **Customer** row → fields auto-fill. Note PIN hint `4321`.
2. Click **Log in** → "Welcome back."

## 4. Pick route / date / time → seat map (FR-05, DR-03)
1. **Browse** → choose **Mumbai → Pune** (₹350, departs 8:00 AM).
2. Click a date pill → opens the **seat map**: real seat grid, legend with **Available / Selected / Held / Booked** colours (FR-05).

## 5. Select a seat → hold timer starts (FR-06, BR-02, BR-03)
1. Tap seat **12** → turns to your hold colour; **"Seat held: 4:59"** countdown pill appears top-right (FR-06, BR-02).
2. Tap seat **13** too (multi-seat). Total updates to ₹700.
3. (Mention: if the timer hits 0 the seats auto-release — BR-03.)

## 6. Pay → confirm → receipt email (IR-01, BR-04, FR-07, IR-04, NFR-02)
1. Leave **"Simulate bank API down"** unchecked.
2. Enter PIN `4321` → **Pay & confirm booking**.
3. Booking **CONFIRMED** toast; lands on **My bookings** with a green Confirmed pill (BR-04, FR-07).
4. Open **Inbox** → "Booking confirmed · SMDC…" receipt email (IR-04, NFR-02).

## 7. Simulate bank down → PENDING (BR-05)
1. **Browse** → **Delhi → Jaipur**, pick a date, select seat **5**.
2. Check **"Simulate bank API down."** Enter PIN `4321` → **Pay**.
3. Toast "Bank unavailable — booking saved as PENDING, seats still held." My bookings shows **Payment pending** pill; seats stay held (BR-05).
4. Inbox → "Booking pending — payment could not be confirmed" email.

## 8. Wrong PIN (BR-04) — optional
1. New booking, bank up, enter PIN `0000` → **REJECTED**, inline "Incorrect PIN. Your seats are still held." (hold retained for retry).

## 9. Partial cancellation (FR-08, Q-03)
1. **My bookings** → on the confirmed Mumbai → Pune booking (seats 12 & 13), click the **✕** on **Seat 12** only.
2. Toast "Seat 12 cancelled and returned to inventory." Booking now shows only Seat 13 — the booking is NOT cancelled (Q-03, FR-08).
3. (Browse back to that route/date to show seat 12 is available again — returned to inventory.)

## 10. Manager report + refresh indicator (FR-09, NFR-05)
1. **Log out** → log in as **Manager** (`manager@smdc.test` / `Manage@123`).
2. **Dashboard** → top-right shows **"Refreshed Xs ago · auto-refreshes every 5 min"** with a pulsing dot; the "Xs ago" label ticks live (NFR-05).
3. **Bookings** tab: view/cancel any booking. **Schedule** tab: change Mumbai → Pune departure to `8:15 AM` → Save (edit schedule). **Sales report** tab: passenger list + **₹ total** (FR-09).

## 11. Admin route delete-guard (FR-10, BR-06)
1. **Log out** → log in as **Admin** (`admin@smdc.test` / `Admin@123`).
2. **Routes & vehicles** tab. Click **Delete** on **Mumbai → Pune** (it has the active Seat-13 booking) → **blocked**: "Cannot delete… it has 1 active booking(s). Deactivate it instead." (BR-06).
3. Click **Deactivate** on that route instead → status flips to Inactive (allowed).
4. (Optional: **Add route** to show create; **Delete** a route with no bookings to show allowed delete.)

## 12. Admin unlock a locked account (FR-03, SR-03)
1. First create a lock: log out, go to **Login**, use `customer@smdc.test` with a wrong password **5 times** → "your account is now locked. We've emailed an unlock link." (SR-03). Check the locked-user Inbox note if desired.
2. Log back in as **Admin** → **User accounts** tab → the customer shows a red **Locked** pill → click **Unlock** (FR-03).

## 13. View audit log (SR-04, Q-04)
1. Still in **Admin** → **Audit log** tab.
2. Show the table: every admin action (deactivate route, unlock account, add route…) logged with **user, action, date, time** (SR-04, Q-04).

— End of demo —
