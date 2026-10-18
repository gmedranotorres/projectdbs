"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import {
  CLOSED_STATUSES,
  FIELD_ORDER,
  OPEN_STATUSES,
  STATUS_LABELS,
  findDuplicate,
  isOpen,
  suggestFollowUp,
  toApplication,
  validate,
  type Application,
  type FieldName,
  type FormErrors,
  type FormValues,
  type Status,
} from "@/lib/applications";
import { formatDay, formatShortDay, type Day } from "@/lib/dates";
import { saveApplication } from "@/lib/store";
import { Button, ButtonLink, ErrorIcon, Field, describedBy, inputClass } from "./ui";

// The one form behind Add and Update. Errors appear when you save, next to
// the field, and what you typed stays. The follow-up date fills itself in
// from the status rule until you type your own; after that a new suggestion
// only replaces it if you press "Use".

type Props = {
  mode: "add" | "edit";
  initial: FormValues;
  // The saved version, when editing.
  before?: Application;
  applications: Application[];
  today: Day;
  submitLabel: string;
  autoFocus?: boolean;
  afterSubmit?: ReactNode;
  onSaved: (app: Application) => void;
};

// Focus after React has drawn the change, such as a newly opened section.
function focusSoon(id: string) {
  requestAnimationFrame(() => document.getElementById(id)?.focus());
}

export function ApplicationForm({
  mode,
  initial,
  before,
  applications,
  today,
  submitLabel,
  autoFocus,
  afterSubmit,
  onSaved,
}: Props) {
  const formId = useId();
  const fid = (field: FieldName) => `${formId}-${field}`;

  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<FormErrors>({});
  // A date already saved counts as the person's own.
  const [followUpIsMine, setFollowUpIsMine] = useState(mode === "edit");
  const [suggestionMatters, setSuggestionMatters] = useState(mode === "add");
  const [moreOpen, setMoreOpen] = useState(
    Boolean(initial.contact || initial.link || initial.notes),
  );
  const [duplicate, setDuplicate] = useState<Application | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);

  const suggestion = suggestFollowUp(values.status, {
    appliedOn: values.appliedOn,
    interviewOn: values.interviewOn || null,
    today,
  });

  function update(field: FieldName, value: string) {
    const next = { ...values, [field]: value } as FormValues;
    const cleared: FieldName[] = [field];

    if (field === "status" || field === "appliedOn" || field === "interviewOn") {
      setSuggestionMatters(true);
      const s = suggestFollowUp(next.status, {
        appliedOn: next.appliedOn,
        interviewOn: next.interviewOn || null,
        today,
      });
      // An empty date is filled in even if earlier dates were typed by hand.
      if ((!followUpIsMine || !next.followUpOn) && s.day) {
        next.followUpOn = s.day;
        cleared.push("followUpOn");
      }
    }
    if (field === "followUpOn") setFollowUpIsMine(true);
    if (field === "company" || field === "role") setDuplicate(null);

    setValues(next);
    setSaveFailed(false);
    setErrors((prev) => {
      const rest = { ...prev };
      for (const f of cleared) delete rest[f];
      return rest;
    });
  }

  function applySuggestion() {
    if (!suggestion.day) return;
    setValues({ ...values, followUpOn: suggestion.day });
    setFollowUpIsMine(false);
    setErrors((prev) => {
      const rest = { ...prev };
      delete rest.followUpOn;
      return rest;
    });
  }

  function submit(event?: FormEvent, allowDuplicate = false) {
    event?.preventDefault();
    const found = validate(values, today);
    const first = FIELD_ORDER.find((f) => found[f]);
    setErrors(found);
    if (first) {
      if (found.contact || found.link || found.notes) setMoreOpen(true);
      focusSoon(fid(first));
      return;
    }

    const same = findDuplicate(applications, values, before?.id);
    if (same && !allowDuplicate) {
      setDuplicate(same);
      focusSoon(`${formId}-duplicate`);
      return;
    }

    const app = toApplication(values, today, before);
    if (!saveApplication(app)) {
      setSaveFailed(true);
      focusSoon(`${formId}-save-error`);
      return;
    }
    onSaved(app);
  }

  const text = (field: FieldName, label: string, extra: { hint?: string; optional?: boolean; placeholder?: string } = {}) => (
    <Field id={fid(field)} label={label} hint={extra.hint} optional={extra.optional} error={errors[field]}>
      <input
        id={fid(field)}
        name={field}
        type="text"
        value={values[field]}
        onChange={(e) => update(field, e.target.value)}
        placeholder={extra.placeholder}
        className={inputClass}
        autoComplete="off"
        {...describedBy(fid(field), extra.hint, errors[field])}
      />
    </Field>
  );

  const showSuggestion =
    suggestionMatters &&
    followUpIsMine &&
    suggestion.day &&
    suggestion.day !== values.followUpOn;

  return (
    <form noValidate onSubmit={submit} className="space-y-6">
      <Field id={fid("company")} label="Company" error={errors.company}>
        <input
          id={fid("company")}
          name="company"
          type="text"
          value={values.company}
          onChange={(e) => update("company", e.target.value)}
          className={inputClass}
          autoComplete="organization"
          autoCapitalize="words"
          autoFocus={autoFocus}
          {...describedBy(fid("company"), false, errors.company)}
        />
      </Field>

      {text("role", "Role")}

      <Field id={fid("appliedOn")} label="Date applied" error={errors.appliedOn}>
        <input
          id={fid("appliedOn")}
          name="appliedOn"
          type="date"
          value={values.appliedOn}
          max={today}
          onChange={(e) => update("appliedOn", e.target.value)}
          className={inputClass}
          {...describedBy(fid("appliedOn"), false, errors.appliedOn)}
        />
      </Field>

      {mode === "edit" && (
        <fieldset>
          <legend className="font-medium">Status</legend>
          <div className="mt-2 space-y-2">
            {OPEN_STATUSES.map((s) => (
              <StatusOption key={s} name={`${formId}-status`} status={s} checked={values.status === s} onChange={(v) => update("status", v)} />
            ))}
            <p className="pt-2 text-sm font-medium text-muted">Closed</p>
            {CLOSED_STATUSES.map((s) => (
              <StatusOption key={s} name={`${formId}-status`} status={s} checked={values.status === s} onChange={(v) => update("status", v)} />
            ))}
          </div>
        </fieldset>
      )}

      {values.status === "interviewing" && (
        <Field
          id={fid("interviewOn")}
          label="Interview date"
          hint="Your follow-up is suggested for 3 days after it."
          error={errors.interviewOn}
        >
          <input
            id={fid("interviewOn")}
            name="interviewOn"
            type="date"
            value={values.interviewOn}
            min={values.appliedOn}
            onChange={(e) => update("interviewOn", e.target.value)}
            className={inputClass}
            {...describedBy(fid("interviewOn"), true, errors.interviewOn)}
          />
        </Field>
      )}

      {isOpen(values.status) ? (
        <Field
          id={fid("followUpOn")}
          label="Follow up on"
          hint={
            !followUpIsMine && suggestion.day
              ? `Suggested: ${suggestion.reason}. It shows up under This week in the week it's due.`
              : "It shows up under This week in the week it's due."
          }
          error={errors.followUpOn}
        >
          <input
            id={fid("followUpOn")}
            name="followUpOn"
            type="date"
            value={values.followUpOn}
            min={values.appliedOn}
            onChange={(e) => update("followUpOn", e.target.value)}
            className={inputClass}
            {...describedBy(fid("followUpOn"), true, errors.followUpOn)}
          />
          {showSuggestion && suggestion.day && (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg bg-accent-soft px-3 py-2 text-sm">
              <span>
                Suggested for {STATUS_LABELS[values.status]}: {formatDay(suggestion.day)},{" "}
                {suggestion.reason}.
              </span>
              <Button variant="secondary" className="px-3 text-sm" onClick={applySuggestion}>
                Use {formatShortDay(suggestion.day)}
              </Button>
            </div>
          )}
        </Field>
      ) : (
        <p className="rounded-lg bg-subtle px-3 py-2 text-sm text-muted">
          Closed applications don&rsquo;t get a follow-up date.
        </p>
      )}

      <details
        open={moreOpen}
        onToggle={(e) => setMoreOpen(e.currentTarget.open)}
        className="rounded-xl border border-line bg-surface"
      >
        <summary className="flex min-h-12 cursor-pointer items-center px-4 font-medium">
          More details <span className="ml-1 font-normal text-muted">(optional)</span>
        </summary>
        <div className="space-y-6 border-t border-line p-4">
          {text("contact", "Who to follow up with", {
            hint: "A name or email, e.g. Priya Shah. Monday will say who to contact.",
            optional: true,
          })}
          <Field id={fid("link")} label="Job posting link" optional error={errors.link}>
            <input
              id={fid("link")}
              name="link"
              type="url"
              inputMode="url"
              value={values.link}
              onChange={(e) => update("link", e.target.value)}
              placeholder="https://"
              className={inputClass}
              autoComplete="off"
              {...describedBy(fid("link"), false, errors.link)}
            />
          </Field>
          <Field id={fid("notes")} label="Notes" optional>
            <textarea
              id={fid("notes")}
              name="notes"
              rows={3}
              value={values.notes}
              onChange={(e) => update("notes", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </details>

      {duplicate && (
        <div
          id={`${formId}-duplicate`}
          tabIndex={-1}
          className="space-y-3 rounded-lg border border-late bg-late-soft p-4"
        >
          <p>
            <strong>
              You already logged {duplicate.role} at {duplicate.company}
            </strong>{" "}
            on {formatShortDay(duplicate.appliedOn)}. Save this one anyway, or open the one
            you have.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => submit(undefined, true)}>Save anyway</Button>
            <ButtonLink variant="secondary" href={`/applications/edit?id=${duplicate.id}`}>
              Open that one
            </ButtonLink>
          </div>
        </div>
      )}

      {saveFailed && (
        <p
          id={`${formId}-save-error`}
          tabIndex={-1}
          className="flex gap-2 rounded-lg border border-error bg-error-soft p-4 text-sm"
        >
          <ErrorIcon />
          <span>
            <strong>Couldn&rsquo;t save.</strong> This browser&rsquo;s storage may be full. What
            you typed is still here: try again, or download a backup on Move data first.
          </span>
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" className="w-full sm:w-auto">
          {submitLabel}
        </Button>
        {afterSubmit}
      </div>
    </form>
  );
}

function StatusOption({
  name,
  status,
  checked,
  onChange,
}: {
  name: string;
  status: Status;
  checked: boolean;
  onChange: (status: Status) => void;
}) {
  return (
    <label
      className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 ${
        checked ? "border-accent bg-accent-soft font-medium" : "border-line bg-surface"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={status}
        checked={checked}
        onChange={() => onChange(status)}
        className="size-5 accent-[var(--accent)]"
      />
      {STATUS_LABELS[status]}
    </label>
  );
}
