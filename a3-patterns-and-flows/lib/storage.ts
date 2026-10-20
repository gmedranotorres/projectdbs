import { isDay } from "./dates";
import {
  CLOSED_STATUSES,
  OPEN_STATUSES,
  type Application,
  type Settings,
  type Status,
  type StoreData,
} from "./types";

// Everything lives in this browser's localStorage under one key, as
// { version: 1, applications, settings }. The server never sees it. Only
// call these in the browser, after the page has loaded (see
// hooks/useApplications.ts).

export const STORAGE_KEY = "seguimiento:v1";

export const DEFAULT_SETTINGS: Settings = { weeklyGoal: 3, dismissedHints: [] };

export function emptyStore(): StoreData {
  return { version: 1, applications: [], settings: { ...DEFAULT_SETTINGS, dismissedHints: [] } };
}

export function newId(): string {
  // randomUUID only exists on https and localhost; a phone testing over the
  // local network gets the fallback.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isStatus(value: unknown): value is Status {
  return (
    (OPEN_STATUSES as readonly unknown[]).includes(value) ||
    (CLOSED_STATUSES as readonly unknown[]).includes(value)
  );
}

// Checks one record read from storage or a backup file. Returns null when
// it isn't a Seguimiento application.
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
    id: r.id,
    company: r.company,
    role: text(r.role),
    status: r.status,
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

// Missing or odd settings fall back to the defaults, one by one. Data saved
// before settings existed has none, which isn't damage.
export function readSettings(raw: unknown): Settings {
  const r = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};
  const goal = r.weeklyGoal;
  return {
    weeklyGoal:
      typeof goal === "number" && Number.isInteger(goal) && goal > 0
        ? goal
        : DEFAULT_SETTINGS.weeklyGoal,
    ...(isDay(r.lastCheckInOn) ? { lastCheckInOn: r.lastCheckInOn } : {}),
    dismissedHints: Array.isArray(r.dismissedHints)
      ? r.dismissedHints.filter((h): h is string => typeof h === "string")
      : [],
  };
}

// The saved text as a store, and whether any of it was unreadable. Never
// throws: text that isn't a store at all becomes an empty one.
export function parseStore(raw: string): { data: StoreData; damaged: boolean } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { data: emptyStore(), damaged: true };
  }
  const p = typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : null;
  if (!p || (p.version !== undefined && p.version !== 1) || !Array.isArray(p.applications)) {
    return { data: emptyStore(), damaged: true };
  }
  const apps = p.applications.map(readApplication);
  const applications = apps.filter((a): a is Application => a !== null);
  return {
    data: { version: 1, applications, settings: readSettings(p.settings) },
    damaged: applications.length < apps.length,
  };
}

function storageWorks(): boolean {
  try {
    localStorage.setItem(`${STORAGE_KEY}:test`, "1");
    localStorage.removeItem(`${STORAGE_KEY}:test`);
    return true;
  } catch {
    return false;
  }
}

export type Loaded = {
  data: StoreData;
  // "unavailable" when the browser won't save (a private window, blocked
  // site data). Changes then live only in this tab.
  saving: "ok" | "unavailable";
  // Saved data couldn't be read, so it was set aside under another key.
  recovered: boolean;
};

export function loadStore(): Loaded {
  if (!storageWorks()) {
    return { data: emptyStore(), saving: "unavailable", recovered: false };
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    return { data: emptyStore(), saving: "ok", recovered: false };
  }
  const { data, damaged } = parseStore(raw);
  if (damaged) {
    // Keep the original text so nothing is lost for good, then carry on
    // with whatever could be read.
    try {
      localStorage.setItem(`${STORAGE_KEY}:unreadable:${Date.now()}`, raw);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage is full; leave the original where it is.
    }
  }
  return { data, saving: "ok", recovered: damaged };
}

// False when the browser refused to save, usually because storage is full.
export function saveStore(data: StoreData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
