// Checks lib/dates.ts across month and year boundaries and the November
// daylight-saving change. No packages: Node 23.6+ runs the .ts file directly.
//   npm run check:dates          (Chicago, where Seguimiento is used)
//   TZ=Pacific/Auckland node scripts/check-dates.mjs
const d = await import(new URL("../lib/dates.ts", import.meta.url));
const RealDate = Date;
// today() at a fixed local clock time: new Date() returns that moment.
function todayAt(y, mo, day, h, mi) {
  const fixed = new RealDate(y, mo - 1, day, h, mi);
  globalThis.Date = class extends RealDate { constructor(...a) { super(...(a.length ? a : [fixed.getTime()])); } };
  try { return d.today(); } finally { globalThis.Date = RealDate; }
}
let fails = 0;
const check = (label, got, want) => {
  const ok = got === want; if (!ok) fails++;
  console.log(`${ok ? "ok  " : "FAIL"} ${label.padEnd(58)} → ${JSON.stringify(got)}${ok ? "" : `  (want ${JSON.stringify(want)})`}`);
};
console.log(`TZ=${process.env.TZ}`);
console.log("— Month boundary: Oct 31 / Nov 1");
check('addDays("2026-10-31", 1)', d.addDays("2026-10-31", 1), "2026-11-01");
check('addDays("2026-11-01", -1)', d.addDays("2026-11-01", -1), "2026-10-31");
check('addDays("2026-10-30", 7)  (follow-up a week out)', d.addDays("2026-10-30", 7), "2026-11-06");
check('daysBetween("2026-10-31", "2026-11-01")', d.daysBetween("2026-10-31", "2026-11-01"), 1);
check('formatDay("2026-10-31")', d.formatDay("2026-10-31"), "Sat, Oct 31");
check('formatDay("2026-11-01")', d.formatDay("2026-11-01"), "Sun, Nov 1");
check('today() at Oct 31, 11:30 pm', todayAt(2026, 10, 31, 23, 30), "2026-10-31");
check('today() at Nov 1, 12:30 am', todayAt(2026, 11, 1, 0, 30), "2026-11-01");
console.log("— Month and year boundaries: Nov 30 / Dec 1, Dec 31 / Jan 1");
check('addDays("2026-11-30", 1)', d.addDays("2026-11-30", 1), "2026-12-01");
check('addDays("2026-12-01", -1)', d.addDays("2026-12-01", -1), "2026-11-30");
check('addDays("2026-12-31", 1)', d.addDays("2026-12-31", 1), "2027-01-01");
check('addDays("2027-01-01", -1)', d.addDays("2027-01-01", -1), "2026-12-31");
check('isDay("2026-11-31")  (no such day)', d.isDay("2026-11-31"), false);
console.log("— DST ends Sun, Nov 1, 2026 at 2am (clocks go back to 1am)");
check('addDays("2026-10-31", 2)  (across the change)', d.addDays("2026-10-31", 2), "2026-11-02");
check('addDays("2026-11-02", -2)', d.addDays("2026-11-02", -2), "2026-10-31");
check('addDays("2026-10-25", 14)  (followed up: 2 weeks)', d.addDays("2026-10-25", 14), "2026-11-08");
check('daysBetween("2026-10-31", "2026-11-02")', d.daysBetween("2026-10-31", "2026-11-02"), 2);
check('daysBetween("2026-11-02", "2026-10-31")', d.daysBetween("2026-11-02", "2026-10-31"), -2);
check('daysBetween("2026-10-12", "2026-11-02")  (21 days: quiet)', d.daysBetween("2026-10-12", "2026-11-02"), 21);
check('startOfWeek("2026-11-01")  (a Sunday)', d.startOfWeek("2026-11-01"), "2026-10-26");
check('endOfWeek("2026-10-26")', d.endOfWeek("2026-10-26"), "2026-11-01");
check('startOfWeek("2026-11-02")  (Monday after)', d.startOfWeek("2026-11-02"), "2026-11-02");
check('today() at Nov 1, 1:30 am (happens twice)', todayAt(2026, 11, 1, 1, 30), "2026-11-01");
check('today() at Nov 1, 11:59 pm', todayAt(2026, 11, 1, 23, 59), "2026-11-01");
check('today() at Nov 2, 12:01 am', todayAt(2026, 11, 2, 0, 1), "2026-11-02");
console.log("— Check-in day: the next chosen weekday (0 Sunday … 6 Saturday)");
check('weekdayOf("2026-11-01")  (a Sunday)', d.weekdayOf("2026-11-01"), 0);
check('nextWeekday("2026-10-26", 1)  (Monday is today)', d.nextWeekday("2026-10-26", 1), "2026-10-26");
check('nextWeekday("2026-10-27", 1)  (Tuesday → next Monday)', d.nextWeekday("2026-10-27", 1), "2026-11-02");
check('nextWeekday("2026-10-29", 4)  (Thursday is today)', d.nextWeekday("2026-10-29", 4), "2026-10-29");
check('nextWeekday("2026-10-30", 4)  (Friday → next Thursday)', d.nextWeekday("2026-10-30", 4), "2026-11-05");
check('nextWeekday("2026-10-31", 0)  (across the DST change)', d.nextWeekday("2026-10-31", 0), "2026-11-01");
check('nextWeekday("2026-12-30", 5)  (across the year)', d.nextWeekday("2026-12-30", 5), "2027-01-01");
console.log(fails ? `${fails} failed` : "all passed");
process.exitCode = fails ? 1 : 0;
