// Dates are stored as plain calendar days, "2026-10-19", in the person's own
// time zone, and nothing here converts to UTC. Math on a day happens at
// local noon, so a daylight-saving change (which moves the clock by an hour
// around 2am) can never shift it into the day before or after.

export type Day = string;

function toDate(day: Day): Date {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
}

function fromDate(date: Date): Day {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

export function isDay(value: unknown): value is Day {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  return fromDate(toDate(value)) === value;
}

// Today on this device. Only call this in the browser.
export function today(): Day {
  return fromDate(new Date());
}

export function addDays(day: Day, days: number): Day {
  const date = toDate(day);
  date.setDate(date.getDate() + days);
  return fromDate(date);
}

// Whole days from `from` to `to`; negative when `to` is earlier. Rounding
// absorbs the hour a daylight-saving change adds or removes.
export function daysBetween(from: Day, to: Day): number {
  return Math.round((toDate(to).getTime() - toDate(from).getTime()) / 86400000);
}

// The Monday of the week `day` is in.
export function startOfWeek(day: Day): Day {
  const weekday = toDate(day).getDay(); // 0 is Sunday
  return addDays(day, weekday === 0 ? -6 : 1 - weekday);
}

export function endOfWeek(day: Day): Day {
  return addDays(startOfWeek(day), 6);
}

// "Mon, Oct 26"
export function formatDay(day: Day): string {
  return toDate(day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// "Oct 26"
export function formatShortDay(day: Day): string {
  return toDate(day).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
