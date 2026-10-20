# SMDC Travels E-Ticketing — Demo Script (MS Teams recording)

Click-by-click path that exercises every feature. Requirement IDs noted per step.
Start at the live site: https://theom720.github.io/smdc-bus-eticketing/
Tip: click **Reset demo data** (footer) first for a clean slate.

> Persistent banner at top: "UI prototype — bank & email are simulated." Point it out once.
> Also point out the **moon/sun icon** at the far right of the nav — the **dark-mode toggle** (persists across reloads). Toggle it once now to show the whole app (including charts and seat map) re-theme, then toggle back.

## 0. Browse filters + occupancy (new UI)
1. On **Browse**, note the **search/filter bar** — with 90 routes across 10 cities the filters are the primary way to navigate. Pick **From = Mumbai** → result count updates and the card list narrows live; add **To = Pune** to drill to one route. Pick a **Sort** (e.g. Price: low to high) to reorder. Click **Clear** to reset.
2. Each route card shows an **occupancy bar** ("N / M seats booked across upcoming dates · P% full").
3. (Optional) Set From/To to a combination with no route → graceful **empty state** ("No schedules match your filters").

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

## 4. Pick route / date / time → seat map (FR-04, FR-05, DR-03)
1. **Browse** → use **From = Mumbai**, **To = Pune** to find that route (₹350). Each date now shows a row of **10 departure time pills** (5:30 AM through 10:30 PM), each with its own seats-remaining count for that date+slot (FR-04).
2. Click a time pill (e.g. **9:30 AM**) → opens the **seat map** for that specific route + date + time: real seat grid, legend with **Available / Selected / Held / Booked** colours (FR-05).
3. To show slots are independent: go back and pick the **same date** but a **different time** (e.g. 1:00 PM) — it opens a fresh, independent seat map; a seat booked on the 9:30 AM slot is still available on the 1:00 PM slot (DR-03).

## 5. Select a seat → stepper + hold timer (FR-06, BR-02, BR-03, seat pref)
1. Note the **3-step stepper** at the top (1 Choose seats → 2 Pay → 3 Done) and the **sticky selection summary** on the right.
2. Note each seat is marked **W** (window) or **A** (aisle); hover a seat → tooltip shows **seat # · preference · fare** (seat-preference requirement).
3. Tap seat **12** → turns to your hold colour; **"Seat held: 4:59"** countdown pill appears; stepper advances to **step 2 (Pay)** (FR-06, BR-02).
4. Tap seat **13** too (multi-seat). Total updates to ₹700.
5. (Mention: if the timer hits 0 the seats auto-release — BR-03.)

## 6. Pay → confirm → boarding pass + print (IR-01, BR-04, FR-07, IR-04, NFR-02)
1. Leave **"Simulate bank API down"** unchecked. Note the **refund-policy** line under the Pay button.
2. Enter PIN `4321` → **Pay & confirm booking**.
3. **Animated success screen**: green check draws in, stepper hits **step 3 (Done)**, and a styled **boarding pass** appears — route, date, departure, seats, fare, bus, passenger name, and a deterministic **SVG "QR" code** generated from the booking ref (BR-04, FR-07).
4. Click **Print ticket** → the browser print dialog opens showing only the boarding pass (print CSS isolates it). Cancel the dialog for the recording.
5. Open **Inbox** → "Booking confirmed · SMDC…" receipt email (IR-04, NFR-02).
6. (The pass is reachable again anytime from **My bookings → View ticket**.)

## 7. Simulate bank down → PENDING (BR-05)
1. **Browse** → **Delhi → Jaipur**, pick a date, select seat **5**.
2. Check **"Simulate bank API down."** Enter PIN `4321` → **Pay**.
3. Toast "Bank unavailable — booking saved as PENDING, seats still held." My bookings shows **Payment pending** pill + an explainer note on what pending means; seats stay held (BR-05).
4. Inbox → "Booking pending — payment could not be confirmed" email.

## 7b. Resolve the PENDING booking — Retry payment (Q-02)
1. Still on **My bookings**, on the pending Delhi → Jaipur booking click **Retry payment**.
2. Because the bank is now reachable (the sim toggle only applies on the booking screen), the decision re-runs → **CONFIRMED**: seats move held→booked, a confirmation email is sent, and the **boarding pass** appears (Q-02).
3. (Alternative shown by a Manager in step 10: a manager can also **Resolve** a pending booking from the dashboard.)

## 8. Wrong PIN (BR-04) — optional
1. New booking, bank up, enter PIN `0000` → **REJECTED**, inline "Incorrect PIN. Your seats are still held." (hold retained for retry).

## 9. Partial cancellation + refund (FR-08, Q-03, Q-05)
1. **My bookings** → on the confirmed Mumbai → Pune booking (seats 12 & 13), click the **✕** on **Seat 12** only.
2. Toast "Seat 12 cancelled · ₹350 refunded to your payment method." Booking now shows only Seat 13 and a green **"₹350 refunded"** note — the booking is NOT cancelled (Q-03, FR-08, Q-05).
3. Open **Inbox** → a **"Refund processed"** email stating the amount refunded to the original payment method (Q-05).
4. (Browse back to that route/date to show seat 12 is available again — returned to inventory.)
5. (Contrast: cancelling a **pending** booking instead would release the seats with **no charge/refund** — the toast and email say so.)

## 10. Manager report — charts, counters, CSV, refresh (FR-09, NFR-05, Q-02, Q-05)
1. **Log out** → log in as **Manager** (`manager@smdc.test` / `Manage@123`).
2. **Dashboard** → top-right shows **"Refreshed Xs ago · auto-refreshes every 5 min"** with a pulsing dot; the "Xs ago" label ticks live (NFR-05).
3. **Bookings** tab: view/cancel any booking. If any booking is still **Pending**, click **Resolve** → it becomes Confirmed (manager-side pending resolution, Q-02). Cancelling a confirmed booking here refunds it (Q-05).
4. **Schedule** tab: change Mumbai → Pune departure to `8:15 AM` → Save (edit schedule).
5. **Sales report** tab: **animated stat counters** (Confirmed / Passengers / Gross / Refunds / **Net sales** — refunds reduce net, Q-05), two inline **SVG charts** (net sales by route bar chart + confirmed-vs-pending donut), and the passenger table. Click **Export CSV** → downloads `smdc-sales-report-YYYY-MM-DD.csv` (open it to show the rows + Gross/Refunds/Net totals) (FR-09).

## 11. Admin route delete-guard (FR-10, BR-06)
1. **Log out** → log in as **Admin** (`admin@smdc.test` / `Admin@123`).
2. **Routes & vehicles** tab. Click **Delete** on **Mumbai → Pune** (it has the active Seat-13 booking) → **blocked**: "Cannot delete… it has 1 active booking(s). Deactivate it instead." (BR-06).
3. Click **Deactivate** on that route instead → status flips to Inactive (allowed).
4. (Optional: **Add route** to show create; **Delete** a route with no bookings to show allowed delete.)

## 12. Admin unlock a locked account (FR-03, SR-03)
1. First create a lock: log out, go to **Login**, use `customer@smdc.test` with a wrong password **5 times** → "your account is now locked. We've emailed an unlock link." (SR-03). Check the locked-user Inbox note if desired.
2. Log back in as **Admin** → **User accounts** tab → the customer shows a red **Locked** pill → click **Unlock** (FR-03).

## 13. Admin — delete account (SR-04)
1. Still in **Admin** → **User accounts** tab. Register beforehand (or reuse the Priya account from step 1) so there's a deletable customer.
2. Note the admin row's **Delete** button is **disabled** ("Cannot delete the only admin account") and your own signed-in row is protected too.
3. Click **Delete** on the customer **Priya Rao** → confirm modal → account removed; a **"Deleted account"** entry is written to the audit log (SR-04).

## 14. Admin — payment log (SR-04)
1. **Admin** → **Payment log** tab (admins only).
2. Show the table: every **payment event** — Confirmed / Pending / Rejected / Refunded — with **amount, user, date, time**. Point out the earlier confirmed booking, the pending→confirmed retry, the rejected wrong-PIN attempt, and the ₹350 **Refunded** row from step 9 (shown as −₹350) (SR-04).

## 15. View audit log (SR-04, Q-04)
1. Still in **Admin** → **Audit log** tab.
2. Show the table: every admin action (deactivate route, unlock account, add route, delete account, resolve pending…) logged with **user, action, date, time** (SR-04, Q-04).

— End of demo —
