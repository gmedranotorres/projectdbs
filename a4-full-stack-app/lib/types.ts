import type { Day } from "./dates";

// The shapes of what Seguimiento saves. The rules that work on them are in
// applications.ts; reading and writing them in Supabase is in
// hooks/useData.ts.

export type { Day };

// Open ones have a follow-up date. An offer is open: answering it is the
// next step. Interested is a job saved from Find jobs, not applied to yet.
export const OPEN_STATUSES = ["interested", "applied", "followed-up", "interviewing", "offer"] as const;
export const CLOSED_STATUSES = ["rejected", "withdrawn", "no-response"] as const;

export type OpenStatus = (typeof OPEN_STATUSES)[number];
export type ClosedStatus = (typeof CLOSED_STATUSES)[number];
export type Status = OpenStatus | ClosedStatus;

// Whether the employer sponsors work visas. Unknown until the person finds
// out.
export const SPONSORSHIPS = ["sponsors", "doesnt_sponsor", "unknown"] as const;
export type Sponsorship = (typeof SPONSORSHIPS)[number];

export type Application = {
  id: string;
  company: string;
  role: string;
  status: Status;
  sponsorship: Sponsorship;
  // Logged by hand, or saved from The Muse on Find jobs (with its job id).
  source: "manual" | "muse";
  museJobId: number | null;
  // Calendar days, "2026-10-19", in the person's own time zone. While
  // Interested, the day it was saved.
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
  // The weekday the calendar reminder repeats on: 0 is Sunday, 6 Saturday.
  // Monday until the person picks another. Weeks (and the weekly goal)
  // still run Monday to Sunday.
  checkInDay?: number;
  // Hints the person closed, so they stay closed.
  dismissedHints: string[];
};
