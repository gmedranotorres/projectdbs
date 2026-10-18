// Dates are stored as plain calendar days, "2026-10-19", in the person's own
// time zone. Math on them goes through UTC so a daylight-saving change can't
// shift a day.

export type Day = string;

function toUtc(day: Day): Date {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function fromUtc(date: Date): Day {
  return date.toISOString().slice(0, 10);
}

export function isDay(value: unknown): value is Day {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  return fromUtc(toUtc(value)) === value;
}

// Today on this device. Only call this in the browser.
export function today(): Day {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
}

export function addDays(day: Day, days: number): Day {
  const date = toUtc(day);
  date.setUTCDate(date.getUTCDate() + days);
  return fromUtc(date);
}

// Whole days from `from` to `to`; negative when `to` is earlier.
export function daysBetween(from: Day, to: Day): number {
  return Math.round((toUtc(to).getTime() - toUtc(from).getTime()) / 86400000);
}

// The Monday of the week `day` is in.
export function startOfWeek(day: Day): Day {
  const weekday = toUtc(day).getUTCDay(); // 0 is Sunday
  return addDays(day, weekday === 0 ? -6 : 1 - weekday);
}

export function endOfWeek(day: Day): Day {
  return addDays(startOfWeek(day), 6);
}

// "Mon, Oct 26"
export function formatDay(day: Day): string {
  return toUtc(day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

// "Oct 26"
export function formatShortDay(day: Day): string {
  return toUtc(day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
