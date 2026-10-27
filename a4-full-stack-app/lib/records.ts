import { isDay } from "./dates";
import {
  CLOSED_STATUSES,
  OPEN_STATUSES,
  SPONSORSHIPS,
  type Application,
  type Settings,
  type Sponsorship,
  type Status,
} from "./types";

// Checking records that come from outside the database: a backup or export
// file. What the database sends back is already checked by its own
// constraints (hooks/useData.ts).

export const DEFAULT_SETTINGS: Settings = { weeklyGoal: 3, dismissedHints: [] };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// A new id in the database's uuid form. randomUUID only exists on https and
// localhost; a phone testing over the local network gets one built from
// getRandomValues instead.
export function newId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function isStatus(value: unknown): value is Status {
  return (
    (OPEN_STATUSES as readonly unknown[]).includes(value) ||
    (CLOSED_STATUSES as readonly unknown[]).includes(value)
  );
}

function isSponsorship(value: unknown): value is Sponsorship {
  return (SPONSORSHIPS as readonly unknown[]).includes(value);
}

// Checks one record from a backup file. Returns null when it isn't a
// Seguimiento application. Backups made before Sponsorship existed say
// Unknown. An id the database can't hold (older backups made over the local
// network had short ones) gets a new one.
export function readApplication(raw: unknown): Application | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const text = (v: unknown) => (typeof v === "string" ? v : "");
  const optionalDay = (v: unknown) => (isDay(v) ? v : null);
  if (
    typeof r.id !== "string" ||
    !r.id ||
    typeof r.company !== "string" ||
    !isStatus(r.status) ||
    !isDay(r.appliedOn) ||
    !isDay(r.lastTouchedOn) ||
    typeof r.updatedAt !== "string"
  ) {
    return null;
  }
  return {
    id: UUID.test(r.id) ? r.id.toLowerCase() : newId(),
    company: r.company,
    role: text(r.role),
    status: r.status,
    sponsorship: isSponsorship(r.sponsorship) ? r.sponsorship : "unknown",
    appliedOn: r.appliedOn,
    interviewOn: optionalDay(r.interviewOn),
    followUpOn: optionalDay(r.followUpOn),
    contact: text(r.contact),
    link: text(r.link),
    notes: text(r.notes),
    lastTouchedOn: r.lastTouchedOn,
    createdAt: text(r.createdAt) || r.updatedAt,
    updatedAt: r.updatedAt,
  };
}

// Missing or odd settings fall back to the defaults, one by one. Backups
// made before settings existed have none, which isn't damage.
export function readSettings(raw: unknown): Settings {
  const r = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};
  const goal = r.weeklyGoal;
  return {
    weeklyGoal:
      typeof goal === "number" && Number.isInteger(goal) && goal > 0
        ? goal
        : DEFAULT_SETTINGS.weeklyGoal,
    ...(r.goalChosen === true ? { goalChosen: true as const } : {}),
    ...(isDay(r.lastCheckInOn) ? { lastCheckInOn: r.lastCheckInOn } : {}),
    ...(typeof r.checkInDay === "number" &&
    Number.isInteger(r.checkInDay) &&
    r.checkInDay >= 0 &&
    r.checkInDay <= 6
      ? { checkInDay: r.checkInDay }
      : {}),
    dismissedHints: Array.isArray(r.dismissedHints)
      ? r.dismissedHints.filter((h): h is string => typeof h === "string")
      : [],
  };
}
