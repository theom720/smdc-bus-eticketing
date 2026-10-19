// selfcheck.js — pure-logic self-check for SMDC Travels e-ticketing prototype.
// Mirrors the payment-decision + seat-lock logic embedded in index.html.
// Run:  node selfcheck.js

// ---- Payment decision table (BR-04, BR-05, IR-01) ----
function decidePayment(bankUp, pinCorrect, seatLocked) {
  if (!seatLocked) return 'EXPIRED';     // hold lapsed -> booking fails
  if (!bankUp) return 'PENDING';         // bank down -> hold retained
  if (!pinCorrect) return 'REJECTED';    // wrong PIN -> hold retained, retry
  return 'CONFIRMED';                     // bank up + correct PIN + seat locked
}

// ---- Seat lock evaluation for a viewer (BR-03, DR-03) ----
function isSeatLocked(seatState, userId, now) {
  if (!seatState || !seatState.heldUntil) return false;
  if (seatState.heldUntil <= now) return false;    // expired
  if (seatState.heldBy === userId) return true;      // my live hold
  return 'unavailable';                              // held by someone else
}

// ---- money formatting sanity (INR, grouping) ----
function money(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

// ---- assertions ----
let pass = 0, fail = 0;
function assert(desc, cond) {
  if (cond) { console.log('PASS:', desc); pass++; }
  else { console.error('FAIL:', desc); fail++; }
}

// payment-decision table
assert('CONFIRMED: bank up + correct PIN + seat locked', decidePayment(true, true, true) === 'CONFIRMED');
assert('PENDING: bank down + seat locked', decidePayment(false, true, true) === 'PENDING');
assert('PENDING takes priority when bank down even if PIN wrong', decidePayment(false, false, true) === 'PENDING');
assert('EXPIRED: seat not locked', decidePayment(true, true, false) === 'EXPIRED');
assert('EXPIRED beats everything when seat lost', decidePayment(false, false, false) === 'EXPIRED');
assert('REJECTED: wrong PIN + bank up + seat locked', decidePayment(true, false, true) === 'REJECTED');

// seat-lock
const now = Date.now();
assert('Locked: within hold window', isSeatLocked({ heldBy: 'u1', heldUntil: now + 60000 }, 'u1', now) === true);
assert('Expired: past hold window', isSeatLocked({ heldBy: 'u1', heldUntil: now - 1000 }, 'u1', now) === false);
assert('Other user hold: unavailable', isSeatLocked({ heldBy: 'u2', heldUntil: now + 60000 }, 'u1', now) === 'unavailable');
assert('No state: not locked', isSeatLocked(undefined, 'u1', now) === false);
assert('Other-user expired hold is free', isSeatLocked({ heldBy: 'u2', heldUntil: now - 1 }, 'u1', now) === false);

// money
assert('money formats 350 as rupees', money(350) === '₹350');
assert('money groups 800000 Indian-style', money(800000) === '₹8,00,000');

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
