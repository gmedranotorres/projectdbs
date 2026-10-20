import type { Day } from "./dates";

// The shapes of what Seguimiento saves. The rules that work on them are in
// applications.ts; reading and writing them is in storage.ts.

export type { Day };

// Open ones have a follow-up date. An offer is open: answering it is the
// next step.
export const OPEN_STATUSES = ["applied", "followed-up", "interviewing", "offer"] as const;
export const CLOSED_STATUSES = ["rejected", "withdrawn", "no-response"] as const;

export type OpenStatus = (typeof OPEN_STATUSES)[number];
export type ClosedStatus = (typeof CLOSED_STATUSES)[number];
export type Status = OpenStatus | ClosedStatus;

export type Application = {
  id: string;
  company: string;
  role: string;
  status: Status;
  // Calendar days, "2026-10-19", in the person's own time zone.
  appliedOn: Day;
  // Only while Interviewing, and only if given.
  interviewOn: Day | null;
  // Empty once the application is closed.
  followUpOn: Day | null;
  // Who to follow up with: a name or an email. Empty when not given.
  contact: string;
  link: string;
  notes: string;
  // The last day there was news: applying, following up, a status change.
  lastTouchedOn: Day;
  // Exact times, used to pick the newer copy when two devices are combined.
  createdAt: string;
  updatedAt: string;
};

// The one-time tip beside the first item on the list, about the suggested
// follow-up date. Kept in Settings.dismissedHints once closed.
export const FOLLOW_UP_HINT = "follow-up-suggestion";

export type Settings = {
  weeklyGoal: number;
  // Set once the person saves a goal of their own; until then the goal is
  // shown as a suggestion.
  goalChosen?: true;
  lastCheckInOn?: Day;
  // Hints the person closed, so they stay closed.
  dismissedHints: string[];
};

// Everything under the one localStorage key.
export type StoreData = {
  version: 1;
  applications: Application[];
  settings: Settings;
};
