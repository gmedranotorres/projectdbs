"use client";

import { useId, useState, type FormEvent } from "react";
import {
  LIMITS,
  emptyForm,
  findDuplicate,
  oneLine,
  toApplication,
  validate,
  type Application,
} from "@/lib/applications";
import { addDays, formatDay, today as getToday } from "@/lib/dates";
import { FOLLOW_UP_HINT } from "@/lib/types";
import { useApplications } from "@/hooks/useApplications";
import { CalendarReminder } from "./calendar-reminder";
import { DuplicateNotice } from "./duplicate-notice";
import {
  Button,
  Chip,
  ChipGroup,
  ErrorIcon,
  Field,
  Input,
  List,
  ListRow,
  PageHeader,
  TextLink,
  useToast,
} from "./ui";

// `/` while nothing is due or quiet: on the first visit, and in the early
// days before any follow-up comes up. One line on what Seguimiento does,
// and a quick add right on the page. Saving keeps you here, and what you
// added appears under the form, newest first. Next to the newest item, a
// one-time tip explains the suggested follow-up date. No tour, no modal, no
// sample data.

// Roles a grad student applying in Chicago is likely to type.
const ROLE_CHIPS = ["Data Analyst", "Research Associate", "Policy Analyst", "Associate Consultant"];

// The list shows the newest few; "See all" has the rest.
const LIST_LIMIT = 5;

export function QuickAddHome({ applications }: { applications: Application[] }) {
  const store = useApplications();
  const toast = useToast();
  const formId = useId();
  const companyId = `${formId}-company`;
  const roleId = `${formId}-role`;
  const listId = `${formId}-list`;

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState<{ company?: string; role?: string }>({});
  const [saveFailed, setSaveFailed] = useState(false);
  // The company and role whose duplicate notice was put away.
  const [dismissedDuplicate, setDismissedDuplicate] = useState<string | null>(null);

  const focus = (id: string, options?: FocusOptions) =>
    requestAnimationFrame(() => document.getElementById(id)?.focus(options));

  const newest = [...applications].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const shown = newest.slice(0, LIST_LIMIT);
  const first = shown[0];
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

  function submit(event: FormEvent) {
    event.preventDefault();
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

    const app = toApplication(values, today);
    if (!store.add(app)) {
      setSaveFailed(true);
      return;
    }
    toast(`Added ${app.company} — ${app.role}. Follow up on ${formatDay(app.followUpOn!)}.`);
    setCompany("");
    setRole("");
    setSaveFailed(false);
    setDismissedDuplicate(null);
    // Ready for the next one, without scrolling: the page stays put, so the
    // new item stays in view below the form.
    focus(companyId, { preventScroll: true });
  }

  function dismissHint() {
    store.dismissHint(FOLLOW_UP_HINT);
    // The button goes away with the tip; the list heading keeps your place.
    focus(listId);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Keep every application moving."
        description="Log what you applied to, and come back on Monday to see who to follow up with."
      />

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
            saved with today's date. */}
        {applications.length === 0 && (
          <p className="text-muted">
            Applied earlier, or want to add a contact?{" "}
            <TextLink href="/add">Use the full form</TextLink>.
          </p>
        )}

        {saveFailed && (
          <p className="flex gap-2 rounded-lg border border-error bg-error-soft p-4 text-sm">
            <ErrorIcon />
            <span>
              <strong>Couldn&rsquo;t save.</strong> This browser&rsquo;s storage may be full. What
              you typed is still here; try again.
            </span>
          </p>
        )}

        <div className="space-y-3">
          <Button type="submit" className="w-full sm:w-auto">
            Add application
          </Button>
          <p className="text-sm text-muted">Saved on this device. No account.</p>
        </div>
      </form>

      {first && (
        <section aria-labelledby={listId} className="space-y-3">
          <h2 id={listId} tabIndex={-1} className="font-serif text-heading">
            Your list
          </h2>
          <List>
            {shown.map((app) => (
              <ListRow
                key={app.id}
                company={app.company}
                role={app.role}
                status={app.status}
                followUpOn={app.followUpOn ?? undefined}
                href={`/applications/${app.id}`}
                hint={
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
          <p className="flex flex-wrap gap-x-6 gap-y-2">
            <TextLink href="/applications">
              See all{applications.length > LIST_LIMIT ? ` ${applications.length}` : ""}
            </TextLink>
            <TextLink href="/add">Add details</TextLink>
          </p>
        </section>
      )}

      {applications.length === 0 && (
        <p className="text-muted">
          Seguimiento suggests a follow-up a week after you apply, and you can always change it.
          After 3 weeks with no news, an application is marked gone quiet.
        </p>
      )}

      {/* Offered on the first visit and right after the first save, like
          the Add page does. */}
      {applications.length <= 1 && <CalendarReminder />}

      {applications.length === 0 && (
        <p className="text-muted">
          Already using Seguimiento on another device?{" "}
          <TextLink href="/move">Load a backup</TextLink>.
        </p>
      )}
    </div>
  );
}
