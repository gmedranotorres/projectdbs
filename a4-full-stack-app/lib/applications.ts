import {
  addDays,
  dayOf,
  daysBetween,
  formatDay,
  formatShortDay,
  isDay,
  type Day,
} from "./dates";
import { newId, readApplication, readSettings } from "./records";
import {
  OPEN_STATUSES,
  type Application,
  type ClosedStatus,
  type OpenStatus,
  type Settings,
  type Sponsorship,
  type Status,
} from "./types";

export { CLOSED_STATUSES, OPEN_STATUSES, SPONSORSHIPS } from "./types";
export type { Application, ClosedStatus, OpenStatus, Sponsorship, Status } from "./types";

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

// The choices on the form.
export const SPONSORSHIP_LABELS: Record<Sponsorship, string> = {
  sponsors: "Sponsors",
  doesnt_sponsor: "Doesn't sponsor",
  unknown: "Unknown",
};

// The tag on the list, which has to make sense without the field's label.
export const SPONSORSHIP_TAGS: Record<Sponsorship, string> = {
  sponsors: "Sponsors",
  doesnt_sponsor: "Doesn't sponsor",
  unknown: "Sponsorship unknown",
};

export function isOpen(status: Status | "closed"): status is OpenStatus {
  return (OPEN_STATUSES as readonly string[]).includes(status);
}

// ---- Follow-up rules ----------------------------------------------------

// Applied or Followed up, with no update for this many days, goes quiet.
export const QUIET_AFTER_DAYS = 14;

// What the Status field offers. Followed up shows as Applied, and the
// three closed statuses as Closed, with the reason chosen separately.
export const STAGES = ["applied", "interviewing", "offer", "closed"] as const;
export type Stage = (typeof STAGES)[number];

export const STAGE_LABELS: Record<Stage, string> = {
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  closed: "Closed",
};

export function stageOf(status: Status | "closed"): Stage {
  if (status === "followed-up") return "applied";
  return isOpen(status) ? status : "closed";
}

// The follow-up date Seguimiento suggests for a status, and why. Offer and
// the closed ones get none: an offer keeps the date it had, and a closed
// application has no follow-up.
export function suggestFollowUp(
  status: Status | "closed",
  dates: { appliedOn: Day; today: Day },
): { day: Day | null; reason: string } {
  switch (status) {
    case "applied":
      return isDay(dates.appliedOn)
        ? { day: addDays(dates.appliedOn, 7), reason: "1 week after applying" }
        : { day: null, reason: "1 week after applying" };
    case "followed-up":
      return { day: addDays(dates.today, 7), reason: "1 week after following up" };
    case "interviewing":
      return { day: addDays(dates.today, 3), reason: "3 days from today" };
    default:
      return { day: null, reason: "" };
  }
}

// "Followed up": ask again a week from today. An application that's
// Interviewing or has an offer keeps its status; anything else becomes
// Followed up.
export function markFollowedUp(app: Application, today: Day): Application {
  // A week from today, unless a later date was already chosen: following up
  // never pulls a follow-up earlier.
  const weekOut = addDays(today, 7);
  return {
    ...app,
    status: app.status === "interviewing" || app.status === "offer" ? app.status : "followed-up",
    followUpOn: app.followUpOn && app.followUpOn > weekOut ? app.followUpOn : weekOut,
    lastTouchedOn: today,
    updatedAt: new Date().toISOString(),
  };
}

// "Snooze a week": ask again a week from today (not a week after the old
// date, which for a late one could still be in the past). Deciding counts
// as an update, so it doesn't send the application to Gone quiet.
export function postpone(app: Application, today: Day): Application {
  return setFollowUp(app, addDays(today, 7), today);
}

// "Set a follow-up" on a quiet application: the date you picked. Like
// Snooze, it's an update, so the application leaves Gone quiet and comes
// back under Follow-ups due on that day.
export function setFollowUp(app: Application, day: Day, today: Day): Application {
  return {
    ...app,
    followUpOn: day,
    lastTouchedOn: today,
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

// The last update: applying, following up, a status change, snoozing or
// setting a follow-up. An interview still to come counts too.
function lastNews(app: Application): Day {
  return app.interviewOn && app.interviewOn > app.lastTouchedOn
    ? app.interviewOn
    : app.lastTouchedOn;
}

export function daysQuiet(app: Application, today: Day): number {
  return daysBetween(lastNews(app), today);
}

// Where an application sits on the check-in:
// - due: open, with a follow-up date today or earlier.
// - quiet: Applied or Followed up, not due, no update for 14 days or more.
//   (Interviewing and Offer wait on a date you set, so they don't go quiet.)
// - upcoming: open, with the next follow-up still ahead.
export function groupOf(app: Application, today: Day): Group {
  if (!isOpen(app.status)) return "closed";
  if (app.followUpOn && app.followUpOn <= today) return "due";
  const waiting = app.status === "applied" || app.status === "followed-up";
  if (waiting && daysQuiet(app, today) >= QUIET_AFTER_DAYS) return "quiet";
  // An offer saved before offers had follow-up dates has nothing to remind
  // about.
  if (app.status === "offer" && !app.followUpOn) return "closed";
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

// How many were logged on or after `monday`, by this device's calendar.
export function addedSince(apps: Application[], monday: Day): number {
  return apps.filter((a) => dayOf(a.createdAt) >= monday).length;
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

// "Email Sam at Example Co" when there's a contact, else the company.
export function whoToContact(app: Application): string {
  return app.contact ? `${app.contact} at ${app.company}` : app.company;
}

// ---- The form -----------------------------------------------------------

export type FormValues = {
  company: string;
  role: string;
  // "closed" while Closed is chosen but not yet why.
  status: Status | "closed";
  sponsorship: Sponsorship;
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
  "sponsorship",
  "appliedOn",
  "status",
  "interviewOn",
  "followUpOn",
  "link",
  "notes",
  "contact",
];

export function emptyForm(today: Day): FormValues {
  return {
    company: "",
    role: "",
    status: "applied",
    sponsorship: "unknown",
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
    sponsorship: app.sponsorship,
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

// The longest each field can be, in characters.
export const LIMITS = { company: 80, role: 80, notes: 1000 } as const;

// One line of text as it's saved: no spaces at either end, and runs of
// spaces inside made one. "  Example   Co " is "Example Co".
export function oneLine(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

// The form as it's checked and saved. Notes keep their line breaks.
export function clean(values: FormValues): FormValues {
  return {
    ...values,
    company: oneLine(values.company),
    role: oneLine(values.role),
    contact: oneLine(values.contact),
    link: values.link.trim(),
    notes: values.notes.trim(),
  };
}

// Checks the form as it will be saved, so spaces at the ends never count.
// Every message says what to do next.
export function validate(input: FormValues, today: Day): FormErrors {
  const values = clean(input);
  const errors: FormErrors = {};
  const applied = values.appliedOn;

  if (!values.company) {
    errors.company = "Enter the company name.";
  } else if (values.company.length > LIMITS.company) {
    errors.company = `Shorten the company name to ${LIMITS.company} characters or fewer.`;
  }
  if (!values.role) {
    errors.role = "Enter the role title.";
  } else if (values.role.length > LIMITS.role) {
    errors.role = `Shorten the role title to ${LIMITS.role} characters or fewer.`;
  }
  if (values.notes.length > LIMITS.notes) {
    errors.notes = `Shorten the notes to ${LIMITS.notes.toLocaleString("en-US")} characters or fewer.`;
  }

  if (!isDay(applied)) {
    errors.appliedOn = "Enter the date you applied.";
  } else if (applied > today) {
    errors.appliedOn = "Choose today or an earlier date.";
  }

  const afterApplied = isDay(applied)
    ? `Pick a date on or after ${formatShortDay(applied)}, the day you applied.`
    : null;

  if (values.status === "closed") {
    errors.status = "Choose why it closed.";
  }

  // The interview date is optional; if given, it can't be before applying.
  if (values.status === "interviewing" && isDay(values.interviewOn)) {
    if (afterApplied && values.interviewOn < applied) {
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

  if (values.link && !isWebLink(values.link)) {
    errors.link = "Enter a full link starting with https://, or leave it blank.";
  }

  return errors;
}

export function findDuplicate(
  apps: Application[],
  values: Pick<FormValues, "company" | "role">,
  exceptId?: string,
): Application | undefined {
  // Case and extra spaces don't make a different application.
  const same = (a: string, b: string) => oneLine(a).toLowerCase() === oneLine(b).toLowerCase();
  if (!oneLine(values.company) || !oneLine(values.role)) return undefined;
  return apps.find(
    (app) =>
      app.id !== exceptId &&
      same(app.company, values.company) &&
      same(app.role, values.role),
  );
}

// Turns a valid form into a record. `before` is the saved version when
// editing. Only call it once validate() finds nothing, so a closed status
// has its reason. A new one's id and times are only placeholders: the
// database sets them when it's saved.
export function toApplication(
  input: FormValues,
  today: Day,
  before?: Application,
): Application {
  const values = clean(input);
  const now = new Date().toISOString();
  const open = isOpen(values.status);
  const statusChanged = before && before.status !== values.status;
  return {
    id: before?.id ?? newId(),
    company: values.company,
    role: values.role,
    status: values.status as Status,
    sponsorship: values.sponsorship,
    appliedOn: values.appliedOn,
    interviewOn: values.status === "interviewing" && values.interviewOn ? values.interviewOn : null,
    followUpOn: open ? values.followUpOn : null,
    contact: values.contact,
    link: values.link,
    notes: values.notes,
    lastTouchedOn: !before
      ? values.appliedOn
      : statusChanged
        ? today
        : before.lastTouchedOn,
    createdAt: before?.createdAt ?? now,
    updatedAt: now,
  };
}

// ---- Export, import and moving between devices --------------------------

// One file for all three: "Export my data" on the check-in, "Download
// backup" on Move data, and what Import and Combine read. It holds the
// applications and the settings, named seguimiento-YYYY-MM-DD.json.

export const BACKUP_APP = "seguimiento";

export function toBackup(apps: Application[], settings: Settings): string {
  return JSON.stringify(
    {
      app: BACKUP_APP,
      version: 1,
      exportedAt: new Date().toISOString(),
      applications: apps,
      settings,
    },
    null,
    2,
  );
}

export type Export = {
  applications: Application[];
  // Null in backups made before exports held settings.
  settings: Settings | null;
  exportedAt: string | null;
};

// Checks the shape: a JSON object marked as Seguimiento's, version 1, with
// a list of applications that are all readable. Settings that are there
// are read field by field, with defaults for anything odd. Null otherwise.
export function readExport(text: string): Export | null {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof data !== "object" || data === null) return null;
  const d = data as Record<string, unknown>;
  if (d.app !== BACKUP_APP || (d.version !== undefined && d.version !== 1)) return null;
  if (!Array.isArray(d.applications)) return null;
  const apps = d.applications.map(readApplication);
  if (!apps.every((a) => a !== null)) return null;
  const hasSettings = typeof d.settings === "object" && d.settings !== null;
  return {
    applications: apps as Application[],
    settings: hasSettings ? readSettings(d.settings) : null,
    exportedAt: typeof d.exportedAt === "string" && !Number.isNaN(Date.parse(d.exportedAt)) ? d.exportedAt : null,
  };
}

// Just the applications, for Combine on Move data.
export function readBackup(text: string): Application[] | null {
  return readExport(text)?.applications ?? null;
}

// Combines a backup with what's saved in your account. Matching ids keep the copy
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
