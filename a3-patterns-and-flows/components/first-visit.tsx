"use client";

import { useId, useState, type FormEvent } from "react";
import { emptyForm, toApplication, validate, type Application } from "@/lib/applications";
import { formatDay, today as getToday } from "@/lib/dates";
import { useApplications } from "@/hooks/useApplications";
import { CalendarReminder } from "./calendar-reminder";
import { Button, Chip, ErrorIcon, Field, Input, List, ListRow, PageHeader, TextLink, useToast } from "./ui";

// What someone sees before they've saved anything: one line on what
// Seguimiento does, and a quick add right on the page. Saving keeps you
// here, and what you added appears under the form. No tour, no modal, no
// sample data.

// Roles a grad student applying in Chicago is likely to type.
const ROLE_CHIPS = ["Data Analyst", "Research Associate", "Policy Analyst", "Associate Consultant"];

export function FirstVisit({
  applications,
  onAdding,
}: {
  // What's been added so far on this page.
  applications: Application[];
  // Called just before the first save, so the page stays the first visit.
  onAdding: () => void;
}) {
  const store = useApplications();
  const toast = useToast();
  const formId = useId();
  const companyId = `${formId}-company`;
  const roleId = `${formId}-role`;

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState<{ company?: string; role?: string }>({});
  const [saveFailed, setSaveFailed] = useState(false);

  const focus = (id: string) => requestAnimationFrame(() => document.getElementById(id)?.focus());

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
    onAdding();
    if (!store.add(app)) {
      setSaveFailed(true);
      return;
    }
    toast(`Added ${app.company} — ${app.role}. Follow up on ${formatDay(app.followUpOn!)}.`);
    setCompany("");
    setRole("");
    setSaveFailed(false);
    focus(companyId);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Keep every application moving."
        description="Log what you applied to, and come back on Monday to see who to follow up with."
      />

      <form noValidate onSubmit={submit} className="space-y-6">
        <Field id={companyId} label="Company" error={errors.company}>
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
          />
        </Field>

        <div className="space-y-3">
          <Field id={roleId} label="Role" error={errors.role}>
            <Input
              name="role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setSaveFailed(false);
                setErrors((prev) => ({ ...prev, role: undefined }));
              }}
              autoComplete="off"
            />
          </Field>
          <div role="group" aria-label="Common roles" className="flex flex-wrap gap-2">
            {ROLE_CHIPS.map((chip) => (
              <Chip key={chip} pressed={role === chip} onClick={() => pickRole(chip)}>
                {chip}
              </Chip>
            ))}
          </div>
        </div>

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
          <p className="text-muted">
            Applied earlier, or want to add a contact?{" "}
            <TextLink href="/add">Use the full form</TextLink>.
          </p>
        </div>
      </form>

      {applications.length > 0 && (
        <section aria-labelledby={`${formId}-list`} className="space-y-3">
          <h2 id={`${formId}-list`} className="font-serif text-heading">
            Your list
          </h2>
          <List>
            {applications.map((app) => (
              <ListRow
                key={app.id}
                company={app.company}
                role={app.role}
                status={app.status}
                followUpOn={app.followUpOn ?? undefined}
                href={`/applications/edit?id=${app.id}&from=week`}
              />
            ))}
          </List>
        </section>
      )}

      <p className="text-muted">
        Seguimiento suggests a follow-up a week after you apply, and you can always change it.
        After 3 weeks with no news, an application is marked gone quiet.
      </p>

      <CalendarReminder />

      <p className="text-muted">
        Already using Seguimiento on another device?{" "}
        <TextLink href="/move">Load a backup</TextLink>.
      </p>
    </div>
  );
}
