import { emptyForm, type FormValues } from "./applications";
import { addDays, isDay, type Day } from "./dates";
import { SPONSORSHIPS, type Sponsorship } from "./types";

// Small things this device remembers between visits, each under its own
// key; the applications themselves are in Supabase. They're conveniences:
// if one can't be read or saved, it's simply forgotten, and none of them go
// into a backup. Only call these in the browser.

export const FILTER_KEY = "seguimiento:list-filter";
export const DRAFT_KEY = "seguimiento:add-draft";

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Private window or full storage: this visit just won't be remembered.
  }
}

// ---- The filter on All applications -----------------------------------

// The last status chip chosen, or null for All.
export function readListFilter<T extends string>(allowed: readonly T[]): T | null {
  const saved = read(FILTER_KEY);
  return allowed.find((f) => f === saved) ?? null;
}

export function rememberListFilter(filter: string) {
  write(FILTER_KEY, filter === "all" ? null : filter);
}

// ---- The draft on Add ---------------------------------------------------

// Only what the person typed or chose is kept. Dates still at their
// defaults (today, a week later) aren't, so a draft restored on another day
// gets that day's defaults, not stale ones. A follow-up that's just Applied
// on + 7 isn't kept either; it's worked out again.
const TEXT_FIELDS = ["company", "role", "link", "notes", "contact"] as const;
const DATE_FIELDS = ["appliedOn", "followUpOn"] as const;

type Draft = Partial<
  Pick<FormValues, (typeof TEXT_FIELDS)[number] | (typeof DATE_FIELDS)[number] | "sponsorship">
>;

export function saveAddDraft(values: FormValues, today: Day) {
  const defaults = emptyForm(today);
  const draft: Draft = {};
  for (const f of [...TEXT_FIELDS, ...DATE_FIELDS]) {
    if (values[f] !== defaults[f]) draft[f] = values[f];
  }
  if (values.sponsorship !== defaults.sponsorship) draft.sponsorship = values.sponsorship;
  if (draft.followUpOn !== undefined && isDay(values.appliedOn) && draft.followUpOn === addDays(values.appliedOn, 7)) {
    delete draft.followUpOn;
  }
  // Nothing typed is no draft; it also clears one when every field is emptied.
  const typed = TEXT_FIELDS.some((f) => (draft[f] ?? "").trim());
  write(DRAFT_KEY, typed ? JSON.stringify(draft) : null);
}

// The form to start from, or null when there's no draft.
export function readAddDraft(today: Day): FormValues | null {
  const raw = read(DRAFT_KEY);
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    write(DRAFT_KEY, null);
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const saved = parsed as Record<string, unknown>;
  const form = emptyForm(today);
  for (const f of TEXT_FIELDS) if (typeof saved[f] === "string") form[f] = saved[f];
  for (const f of DATE_FIELDS) if (isDay(saved[f])) form[f] = saved[f];
  if ((SPONSORSHIPS as readonly unknown[]).includes(saved.sponsorship)) {
    form.sponsorship = saved.sponsorship as Sponsorship;
  }
  if (!isDay(saved.followUpOn) && isDay(saved.appliedOn)) form.followUpOn = addDays(saved.appliedOn, 7);
  return TEXT_FIELDS.some((f) => form[f].trim()) ? form : null;
}

export function hasAddDraft(): boolean {
  return read(DRAFT_KEY) !== null;
}

export function clearAddDraft() {
  write(DRAFT_KEY, null);
}
