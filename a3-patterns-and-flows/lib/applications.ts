import {
  addDays,
  daysBetween,
  endOfWeek,
  formatDay,
  formatShortDay,
  isDay,
  type Day,
} from "./dates";
import { newId, readApplication } from "./storage";
import { OPEN_STATUSES, type Application, type ClosedStatus, type OpenStatus, type Status } from "./types";

export { CLOSED_STATUSES, OPEN_STATUSES } from "./types";
export type { Application, ClosedStatus, OpenStatus, Status } from "./types";

// ---- The record ---------------------------------------------------------

export const STATUS_LABELS: Record<Status, string> = {
  applied: "Applied",
  "followed-up": "Followed up",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
  "no-response": "No response",
};

export function isOpen(status: Status): status is OpenStatus {
  return (OPEN_STATUSES as readonly string[]).includes(status);
}

// ---- Follow-up rules ----------------------------------------------------

export const QUIET_AFTER_DAYS = 21;

// The follow-up date Seguimiento suggests for a status, and why.
export function suggestFollowUp(
  status: Status,
  dates: { appliedOn: Day; interviewOn: Day | null; today: Day },
): { day: Day | null; reason: string } {
  switch (status) {
    case "applied":
      return isDay(dates.appliedOn)
        ? { day: addDays(dates.appliedOn, 7), reason: "1 week after applying" }
        : { day: null, reason: "1 week after applying" };
    case "followed-up":
      return { day: addDays(dates.today, 14), reason: "2 weeks after following up" };
    case "interviewing":
      return dates.interviewOn && isDay(dates.interviewOn)
        ? { day: addDays(dates.interviewOn, 3), reason: "3 days after the interview" }
        : { day: null, reason: "3 days after the interview" };
    default:
      return { day: null, reason: "" };
  }
}

// "I followed up today." An application that's Interviewing stays
// Interviewing; anything else becomes Followed up.
export function markFollowedUp(app: Application, today: Day): Application {
  return {
    ...app,
    status: app.status === "interviewing" ? "interviewing" : "followed-up",
    followUpOn: addDays(today, 14),
    lastTouchedOn: today,
    updatedAt: new Date().toISOString(),
  };
}

// "Not yet": ask again in a week. It isn't news, so the application still
// goes quiet on schedule.
export function postpone(app: Application, today: Day): Application {
  return {
    ...app,
    followUpOn: addDays(today, 7),
    updatedAt: new Date().toISOString(),
  };
}

export function closeAs(
  app: Application,
  status: ClosedStatus,
  today: Day,
): Application {
  return {
    ...app,
    status,
    followUpOn: null,
    interviewOn: null,
    lastTouchedOn: today,
    updatedAt: new Date().toISOString(),
  };
}

// ---- Where each application belongs this week ---------------------------

export type Group = "due" | "quiet" | "upcoming" | "closed";

// An interview still to come counts as news, so it can't go quiet before it.
function lastNews(app: Application): Day {
  return app.interviewOn && app.interviewOn > app.lastTouchedOn
    ? app.interviewOn
    : app.lastTouchedOn;
}

export function daysQuiet(app: Application, today: Day): number {
  return daysBetween(lastNews(app), today);
}

export function groupOf(app: Application, today: Day): Group {
  if (!isOpen(app.status)) return "closed";
  if (daysQuiet(app, today) >= QUIET_AFTER_DAYS) return "quiet";
  if (!app.followUpOn || app.followUpOn <= endOfWeek(today)) return "due";
  return "upcoming";
}

export function groupAll(
  apps: Application[],
  today: Day,
): Record<Group, Application[]> {
  const groups: Record<Group, Application[]> = {
    due: [],
    quiet: [],
    upcoming: [],
    closed: [],
  };
  for (const app of apps) groups[groupOf(app, today)].push(app);
  const byFollowUp = (a: Application, b: Application) =>
    (a.followUpOn ?? "").localeCompare(b.followUpOn ?? "");
  groups.due.sort(byFollowUp);
  groups.upcoming.sort(byFollowUp);
  groups.quiet.sort((a, b) => lastNews(a).localeCompare(lastNews(b)));
  groups.closed.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return groups;
}

export function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

// "4 days late", "Due today", "Due Thu, Oct 22"
export function dueLabel(app: Application, today: Day): string {
  if (!app.followUpOn) return "Due today";
  const days = daysBetween(today, app.followUpOn);
  if (days < 0) return `${plural(-days, "day")} late`;
  if (days === 0) return "Due today";
  return `Due ${formatDay(app.followUpOn)}`;
}

// "Email Priya at Morningstar" when there's a contact, else the company.
export function whoToContact(app: Application): string {
  return app.contact ? `${app.contact} at ${app.company}` : app.company;
}

// ---- The form -----------------------------------------------------------

export type FormValues = {
  company: string;
  role: string;
  status: Status;
  appliedOn: string;
  interviewOn: string;
  followUpOn: string;
  contact: string;
  link: string;
  notes: string;
};

export type FieldName = keyof FormValues;
export type FormErrors = Partial<Record<FieldName, string>>;

// The order errors are checked and focused in, top of the form first.
export const FIELD_ORDER: FieldName[] = [
  "company",
  "role",
  "appliedOn",
  "status",
  "interviewOn",
  "followUpOn",
  "contact",
  "link",
  "notes",
];

export function emptyForm(today: Day): FormValues {
  return {
    company: "",
    role: "",
    status: "applied",
    appliedOn: today,
    interviewOn: "",
    followUpOn: addDays(today, 7),
    contact: "",
    link: "",
    notes: "",
  };
}

export function formFrom(app: Application): FormValues {
  return {
    company: app.company,
    role: app.role,
    status: app.status,
    appliedOn: app.appliedOn,
    interviewOn: app.interviewOn ?? "",
    followUpOn: app.followUpOn ?? "",
    contact: app.contact,
    link: app.link,
    notes: app.notes,
  };
}

function isWebLink(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

// Every message says what to do next.
export function validate(values: FormValues, today: Day): FormErrors {
  const errors: FormErrors = {};
  const applied = values.appliedOn;

  if (!values.company.trim()) {
    errors.company = "Enter the company name.";
  }
  if (!values.role.trim()) {
    errors.role = "Enter the role title.";
  }

  if (!isDay(applied)) {
    errors.appliedOn = "Enter the date you applied.";
  } else if (applied > today) {
    errors.appliedOn = "Choose today or an earlier date.";
  }

  const afterApplied = isDay(applied)
    ? `Pick a date on or after ${formatShortDay(applied)}, the day you applied.`
    : null;

  if (values.status === "interviewing") {
    if (!isDay(values.interviewOn)) {
      errors.interviewOn = "Enter the interview date. A best guess is fine; you can change it later.";
    } else if (afterApplied && values.interviewOn < applied) {
      errors.interviewOn = afterApplied;
    }
  }

  if (isOpen(values.status)) {
    if (!isDay(values.followUpOn)) {
      errors.followUpOn = "Pick a follow-up date, or use the suggestion below.";
    } else if (isDay(applied) && values.followUpOn < applied) {
      errors.followUpOn = "Choose a follow-up date on or after the application date.";
    }
  }

  if (values.link.trim() && !isWebLink(values.link.trim())) {
    errors.link = "Enter a full link starting with https://, or leave it blank.";
  }

  return errors;
}

export function findDuplicate(
  apps: Application[],
  values: FormValues,
  exceptId?: string,
): Application | undefined {
  const same = (a: string, b: string) =>
    a.trim().toLowerCase() === b.trim().toLowerCase();
  return apps.find(
    (app) =>
      app.id !== exceptId &&
      same(app.company, values.company) &&
      same(app.role, values.role),
  );
}

// Turns a valid form into a record. `before` is the saved version when
// editing.
export function toApplication(
  values: FormValues,
  today: Day,
  before?: Application,
): Application {
  const now = new Date().toISOString();
  const open = isOpen(values.status);
  const statusChanged = before && before.status !== values.status;
  return {
    id: before?.id ?? newId(),
    company: values.company.trim(),
    role: values.role.trim(),
    status: values.status,
    appliedOn: values.appliedOn,
    interviewOn: values.status === "interviewing" ? values.interviewOn : null,
    followUpOn: open ? values.followUpOn : null,
    contact: values.contact.trim(),
    link: values.link.trim(),
    notes: values.notes.trim(),
    lastTouchedOn: !before
      ? values.appliedOn
      : statusChanged
        ? today
        : before.lastTouchedOn,
    createdAt: before?.createdAt ?? now,
    updatedAt: now,
  };
}

// ---- Moving between devices ---------------------------------------------

export const BACKUP_APP = "seguimiento";

export function toBackup(apps: Application[]): string {
  return JSON.stringify(
    {
      app: BACKUP_APP,
      version: 1,
      exportedAt: new Date().toISOString(),
      applications: apps,
    },
    null,
    2,
  );
}

// Null when the file isn't a Seguimiento backup or any record is damaged.
export function readBackup(text: string): Application[] | null {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof data !== "object" || data === null) return null;
  const d = data as Record<string, unknown>;
  if (d.app !== BACKUP_APP || !Array.isArray(d.applications)) return null;
  const apps = d.applications.map(readApplication);
  return apps.every((a) => a !== null) ? (apps as Application[]) : null;
}

// Combines a backup with what's on this device. Matching ids keep the copy
// changed most recently; nothing is deleted.
export function combine(
  local: Application[],
  incoming: Application[],
): { applications: Application[]; added: number; updated: number } {
  const byId = new Map(local.map((app) => [app.id, app]));
  let added = 0;
  let updated = 0;
  for (const app of incoming) {
    const mine = byId.get(app.id);
    if (!mine) {
      added++;
      byId.set(app.id, app);
    } else if (app.updatedAt > mine.updatedAt) {
      updated++;
      byId.set(app.id, app);
    }
  }
  return { applications: [...byId.values()], added, updated };
}
