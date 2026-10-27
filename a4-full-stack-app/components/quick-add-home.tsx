"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import {
  LIMITS,
  addedSince,
  dueLabel,
  emptyForm,
  findDuplicate,
  groupAll,
  groupOf,
  oneLine,
  toApplication,
  validate,
  type Application,
} from "@/lib/applications";
import {
  addDays,
  daysBetween,
  formatDay,
  formatLongDay,
  startOfWeek,
  today as getToday,
} from "@/lib/dates";
import { FOLLOW_UP_HINT } from "@/lib/types";
import { useData } from "@/hooks/useData";
import { useFromHere } from "@/hooks/useBackLink";
import { CalendarReminder } from "./calendar-reminder";
import { DuplicateNotice } from "./duplicate-notice";
import {
  Badge,
  Button,
  Chip,
  ChipGroup,
  ErrorIcon,
  Field,
  Input,
  List,
  ListRow,
  PageHeader,
  StatLink,
  TextLink,
} from "./ui";

// `/`, always: a quick add right on the page, in its own card titled "Log
// an application". Saving keeps you here: a line under the button says what
// was saved and where it went, and the new item sits at the top of the list
// below, tinted for a few seconds and tagged "Just added", with "Show me" to
// jump to it. (Class feedback: people weren't sure what "Add application"
// would add, or where it went.) The list puts what's due first,
// soonest first, each with the check-in's "Due today" or "2 days late";
// the rest follow, newest first. Next to the newest item, a one-time tip
// explains the suggested follow-up date. No tour, no modal, no sample data.
//
// The first visit opens with one line on what Seguimiento does. Coming back
// with something saved, it opens with "Welcome back.", today's date and
// three numbers that lead to the check-in and the list, plus the last
// check-in. Nothing here nags: the only badges are on rows that are due,
// in words, and one gentle line once a week has passed.

// Roles a grad student applying in Chicago is likely to type.
const ROLE_CHIPS = ["Data Analyst", "Research Associate", "Policy Analyst", "Associate Consultant"];

// The list shows the newest few; "See all" has the rest.
const LIST_LIMIT = 5;

// How long the new row stays tinted, the same as on All applications.
const GLOW_MS = 3000;

export function QuickAddHome({ applications }: { applications: Application[] }) {
  const store = useData();
  const here = useFromHere();
  const formId = useId();
  const companyId = `${formId}-company`;
  const roleId = `${formId}-role`;
  const listId = `${formId}-list`;
  const formHeadingId = `${formId}-form-heading`;
  const rowId = (id: string) => `${formId}-row-${id}`;
  // Decided when the page opens: someone who just saved their first one on
  // this visit isn't "back" yet, and the form shouldn't jump down under
  // their cursor.
  const [returning] = useState(applications.length > 0);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState<{ company?: string; role?: string }>({});
  const [saveFailed, setSaveFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  // The company and role whose duplicate notice was put away.
  const [dismissedDuplicate, setDismissedDuplicate] = useState<string | null>(null);
  // The one just saved on this visit: named under the button, first on the
  // list, tagged "Just added". `glow` tints its row for a few seconds.
  const [justAdded, setJustAdded] = useState<Application | null>(null);
  const [glow, setGlow] = useState(0);

  useEffect(() => {
    if (!glow) return;
    const timer = setTimeout(() => setGlow(0), GLOW_MS);
    return () => clearTimeout(timer);
  }, [glow]);

  const focus = (id: string, options?: FocusOptions) =>
    requestAnimationFrame(() => document.getElementById(id)?.focus(options));

  const newest = [...applications].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const first = newest[0];
  // The tip is only true of a date Seguimiento suggested: Applied, a week
  // after the day you applied.
  // The same check as the Add page: a notice, and Add application still works.
  const pair = `${oneLine(company)}\n${oneLine(role)}`.toLowerCase();
  const duplicate =
    pair !== dismissedDuplicate
      ? findDuplicate(applications, { company, role })
      : undefined;

  const showHint =
    first !== undefined &&
    !store.settings.dismissedHints.includes(FOLLOW_UP_HINT) &&
    first.status === "applied" &&
    first.followUpOn === addDays(first.appliedOn, 7);

  function pickRole(chip: string) {
    const next = role === chip ? "" : chip;
    setRole(next);
    setSaveFailed(false);
    if (next) setErrors((e) => ({ ...e, role: undefined }));
    if (next && !company.trim()) focus(companyId);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    // A second press while saving would save it twice.
    if (saving) return;
    const today = getToday();
    // The same checks and words as the Add page. appliedOn is today and
    // followUpOn a week later, as emptyForm() fills them in.
    const values = { ...emptyForm(today), company, role };
    const found = validate(values, today);
    setErrors({ company: found.company, role: found.role });
    if (found.company || found.role) {
      focus(found.company ? companyId : roleId);
      return;
    }

    setSaving(true);
    const app = await store.add(toApplication(values, today));
    setSaving(false);
    if (!app) {
      setSaveFailed(true);
      return;
    }
    // Said right under the button, where the eye already is, instead of a
    // toast at the edge of the screen.
    setJustAdded(app);
    setGlow((g) => g + 1);
    setCompany("");
    setRole("");
    setSaveFailed(false);
    setDismissedDuplicate(null);
    // Ready for the next one, without scrolling: the page stays put, so the
    // new item stays in view below the form.
    focus(companyId, { preventScroll: true });
  }

  // "Show me": to the new row, tinted again so it's easy to spot.
  function showJustAdded() {
    if (!justAdded) return;
    document.getElementById(rowId(justAdded.id))?.focus();
    setGlow((g) => g + 1);
  }

  function dismissHint() {
    void store.dismissHint(FOLLOW_UP_HINT);
    // The button goes away with the tip; the list heading keeps your place.
    focus(listId);
  }

  const today = getToday();
  const groups = groupAll(applications, today);
  // What you just added first, so it's always in view; then due, soonest
  // first (groupAll's order); then the rest, newest first.
  const justAddedRow = justAdded ? applications.find((a) => a.id === justAdded.id) : undefined;
  const shown = [
    ...(justAddedRow ? [justAddedRow] : []),
    ...groups.due,
    ...newest.filter((a) => groupOf(a, today) !== "due"),
  ]
    .filter((a, i, all) => all.indexOf(a) === i)
    .slice(0, LIST_LIMIT);
  const added = addedSince(applications, startOfWeek(today));
  const goal = store.settings.weeklyGoal;
  const lastCheckIn = store.settings.lastCheckInOn;
  const weekSinceCheckIn = lastCheckIn !== undefined && daysBetween(lastCheckIn, today) >= 7;

  return (
    <div className="space-y-8">
      {returning ? (
        <div className="space-y-5">
          <PageHeader title="Welcome back." description={formatLongDay(today)} />
          <ul aria-label="This week at a glance" className="grid grid-cols-3 gap-3">
            <li>
              <StatLink
                href={`/check-in?from=${here}`}
                value={groups.due.length}
                label={groups.due.length === 1 ? "follow-up due" : "follow-ups due"}
              />
            </li>
            <li>
              <StatLink href={`/check-in?from=${here}`} value={groups.quiet.length} label="gone quiet" />
            </li>
            <li>
              <StatLink
                href={`/applications?from=${here}`}
                value={`${added} of ${goal}`}
                label="added this week"
              />
            </li>
          </ul>
          {lastCheckIn && (
            <div className="space-y-1">
              <p className="text-muted">Last check-in: {formatDay(lastCheckIn)}</p>
              {weekSinceCheckIn && (
                <p>
                  It&rsquo;s been a week.{" "}
                  <TextLink href={`/check-in?from=${here}`}>Start your check-in?</TextLink>
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <PageHeader
          title="Keep every application moving."
          description="Log what you applied to, and come back for a weekly check-in to see who to follow up with."
        />
      )}

      <section
        aria-labelledby={formHeadingId}
        className="space-y-5 rounded-card border border-line bg-surface p-5 shadow-raised sm:p-6"
      >
        <div>
          <h2 id={formHeadingId} className="font-serif text-heading">
            Log an application
          </h2>
          <p className="mt-1 text-muted">Type the company and role, then save it to your list.</p>
        </div>
        <form noValidate onSubmit={submit} className="space-y-6">
          <Field
            id={companyId}
            label="Company"
            error={errors.company}
            count={{ length: oneLine(company).length, max: LIMITS.company }}
          >
            <Input
              name="company"
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
                setSaveFailed(false);
                setErrors((prev) => ({ ...prev, company: undefined }));
              }}
              autoComplete="organization"
              autoCapitalize="words"
              aria-required="true"
            />
          </Field>

          <DuplicateNotice
            match={duplicate}
            dismissLabel="Add anyway"
            onDismiss={() => {
              setDismissedDuplicate(pair);
              // The notice goes; carry on from the next field.
              focus(roleId);
            }}
          />

          <div className="space-y-3">
            <Field
              id={roleId}
              label="Role"
              error={errors.role}
              count={{ length: oneLine(role).length, max: LIMITS.role }}
            >
              <Input
                name="role"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setSaveFailed(false);
                  setErrors((prev) => ({ ...prev, role: undefined }));
                }}
                autoComplete="off"
                aria-required="true"
              />
            </Field>
            <ChipGroup label="Common roles">
              {ROLE_CHIPS.map((chip) => (
                <Chip key={chip} pressed={role === chip} onClick={() => pickRole(chip)}>
                  {chip}
                </Chip>
              ))}
            </ChipGroup>
          </div>

          {/* Before the button, so it's read before an older application is
              saved with today's date. Always shown: quick add has no date. */}
          <p className="text-muted">
            Applied earlier, or want to add a contact?{" "}
            <TextLink href={`/add?from=${here}`}>Use the full form</TextLink>.
          </p>

          {saveFailed && (
            <p className="flex gap-2 rounded-lg border border-error bg-error-soft p-4 text-sm">
              <ErrorIcon />
              <span>
                <strong>Couldn&rsquo;t save.</strong> Check your connection and try again. What
                you typed is still here.
              </span>
            </p>
          )}

          <div className="space-y-3">
            <Button type="submit" className="w-full sm:w-auto">
              Save to my list
            </Button>
            {/* Always in the page, so screen readers announce each save. */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p role="status" className="flex gap-2">
                {justAdded && (
                  <>
                    <CheckIcon />
                    <span>
                      <strong>Saved.</strong> {justAdded.company} — {justAdded.role} is at the top of
                      Your list, below.
                      {justAdded.followUpOn && ` Follow up on ${formatDay(justAdded.followUpOn)}.`}
                    </span>
                  </>
                )}
              </p>
              {justAdded && (
                <Button variant="quiet" size="sm" onClick={showJustAdded}>
                  Show me<span className="sr-only">: {justAdded.company} in Your list</span>
                </Button>
              )}
            </div>
            <p className="text-sm text-muted">Saved to your account, on every device you sign in on.</p>
          </div>
        </form>
      </section>

      {first && (
        <section aria-labelledby={listId} className="space-y-3">
          <h2 id={listId} tabIndex={-1} className="font-serif text-heading">
            Your list
          </h2>
          <List>
            {shown.map((app) => (
              <ListRow
                key={app.id}
                rowId={rowId(app.id)}
                highlight={glow > 0 && app.id === justAdded?.id}
                company={app.company}
                role={app.role}
                status={app.status}
                followUpOn={app.followUpOn ?? undefined}
                href={`/applications/${app.id}?from=${here}`}
                hint={
                  app.id === justAdded?.id ? (
                    <Badge tone="new">Just added</Badge>
                  ) : groupOf(app, today) === "due" ? (
                    <Badge tone="due">{dueLabel(app, today)}</Badge>
                  ) : undefined
                }
                note={
                  showHint && app.id === first.id ? (
                    <span className="inline-flex flex-wrap items-center gap-x-2 rounded-badge bg-accent-soft py-0.5 pr-0.5 pl-2 text-sm text-ink">
                      We suggested a follow-up a week out. Change it anytime.
                      <Button variant="quiet" size="sm" onClick={dismissHint}>
                        Got it
                      </Button>
                    </span>
                  ) : undefined
                }
              />
            ))}
          </List>
          <p>
            <TextLink href="/applications">
              See all{applications.length > LIST_LIMIT ? ` ${applications.length}` : ""}
            </TextLink>
          </p>
        </section>
      )}

      {applications.length === 0 && (
        <p className="text-muted">
          Seguimiento suggests a follow-up a week after you apply, and you can always change it.
          After 2 weeks with no update, an application is marked gone quiet.
        </p>
      )}

      {/* Offered on the first visit and right after the first save, like
          the Add page does. */}
      {applications.length <= 1 && <CalendarReminder />}

      {applications.length === 0 && (
        <p className="text-muted">
          Have a Seguimiento backup file?{" "}
          <TextLink href="/move">Load a backup</TextLink>.
        </p>
      )}
    </div>
  );
}

// The tick beside "Saved.": a sign that isn't color alone.
function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-1 size-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 10.5 8.5 14.5 15.5 6" />
    </svg>
  );
}
