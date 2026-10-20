"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import {
  CLOSED_STATUSES,
  FIELD_ORDER,
  LIMITS,
  STAGES,
  STAGE_LABELS,
  STATUS_LABELS,
  findDuplicate,
  isOpen,
  oneLine,
  stageOf,
  suggestFollowUp,
  toApplication,
  validate,
  type Application,
  type FieldName,
  type FormErrors,
  type FormValues,
  type Stage,
} from "@/lib/applications";
import { addDays, formatDay, formatShortDay, isDay, type Day } from "@/lib/dates";
import { useApplications } from "@/hooks/useApplications";
import { FOLLOW_UP_HINT } from "@/lib/types";
import { DuplicateNotice } from "./duplicate-notice";
import { Button, ErrorIcon, Field, Input, Select, Textarea } from "./ui";

// The one form behind Add and an application's page. Errors appear when you
// save, next to the field, and what you typed stays. On Add, the follow-up
// date follows Applied on until you type your own; after that a new
// suggestion only replaces it if you press "Use". On an application's page,
// a status change suggests a date only where it makes sense: Interviewing
// fills in today + 3, Closed clears it, Applied and Offer keep it.

type Props = {
  mode: "add" | "edit";
  initial: FormValues;
  // The saved version, when editing.
  before?: Application;
  applications: Application[];
  today: Day;
  submitLabel: string;
  // A second, secondary save button that keeps you on the form, such as
  // "Save and add another".
  addAnotherLabel?: string;
  autoFocus?: boolean;
  afterSubmit?: ReactNode;
  // `another` is true when the second button was used.
  onSaved: (app: Application, another: boolean) => void;
  // Every change, as typed: Add keeps a draft with it.
  onChange?: (values: FormValues) => void;
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
  addAnotherLabel,
  autoFocus,
  afterSubmit,
  onSaved,
  onChange,
}: Props) {
  const formId = useId();
  const fid = (field: FieldName) => `${formId}-${field}`;
  const saved = useApplications();

  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<FormErrors>({});
  // A date already saved counts as the person's own, and so does one in a
  // restored draft that isn't simply Applied on + 7.
  const [followUpIsMine, setFollowUpIsMine] = useState(
    mode === "edit" ||
      (isDay(initial.appliedOn) && initial.followUpOn !== addDays(initial.appliedOn, 7)),
  );
  // Whether the person typed a follow-up date here, for closing the tip.
  const [typedFollowUp, setTypedFollowUp] = useState(false);
  const [suggestionMatters, setSuggestionMatters] = useState(mode === "add");
  // The date before Interviewing filled one in, so choosing another status
  // right after puts it back.
  const [dateBeforeSuggestion, setDateBeforeSuggestion] = useState<string | null>(null);
  // The company and role whose duplicate notice was put away.
  const [dismissedDuplicate, setDismissedDuplicate] = useState<string | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);

  const suggestion = suggestFollowUp(values.status, { appliedOn: values.appliedOn, today });

  useEffect(() => {
    onChange?.(values);
  }, [values, onChange]);

  function update(field: FieldName, value: string) {
    const next = { ...values, [field]: value } as FormValues;

    // Only Applied's suggestion depends on Applied on.
    if (field === "appliedOn" && next.status === "applied") {
      setSuggestionMatters(true);
      const s = suggestFollowUp(next.status, { appliedOn: next.appliedOn, today });
      // An empty date is filled in even if earlier dates were typed by hand.
      if ((!followUpIsMine || !next.followUpOn) && s.day) {
        next.followUpOn = s.day;
      }
    }
    if (field === "followUpOn") {
      setFollowUpIsMine(true);
      setTypedFollowUp(true);
      setDateBeforeSuggestion(null);
    }

    setValues(next);
    setSaveFailed(false);
    recheck(next);
  }

  // Once a field shows an error, it's checked again on every change: the
  // error goes as soon as the field is fixed (fixing Applied on can also fix
  // Follow up on), and stays, updated, until then. Fields without an error
  // get none until the next save.
  function recheck(next: FormValues) {
    const found = validate(next, today);
    setErrors((prev) => {
      const still: FormErrors = {};
      for (const f of Object.keys(prev) as FieldName[]) if (found[f]) still[f] = found[f];
      return still;
    });
  }

  // The Status field. Followed up stays Followed up under Applied, and a
  // closed application keeps its reason under Closed.
  function chooseStage(stage: Stage) {
    const was = before?.status;
    const status: FormValues["status"] =
      stage === "applied" ? (was === "followed-up" ? was : "applied")
      : stage === "closed" ? (was && !isOpen(was) ? was : "closed")
      : stage;
    const next = { ...values, status };
    if (stage === "interviewing") {
      if (followUpIsMine) setDateBeforeSuggestion(values.followUpOn);
      next.followUpOn = addDays(today, 3);
      setFollowUpIsMine(false);
    } else if (dateBeforeSuggestion !== null) {
      next.followUpOn = dateBeforeSuggestion;
      setDateBeforeSuggestion(null);
      setFollowUpIsMine(true);
    }
    setValues(next);
    setSaveFailed(false);
    recheck(next);
  }

  function applySuggestion() {
    if (!suggestion.day) return;
    const next = { ...values, followUpOn: suggestion.day };
    setValues(next);
    setFollowUpIsMine(false);
    recheck(next);
  }

  function submit(event?: FormEvent, another = false) {
    event?.preventDefault();
    const found = validate(values, today);
    const first = FIELD_ORDER.find((f) => found[f]);
    setErrors(found);
    if (first) {
      focusSoon(fid(first));
      return;
    }

    const app = toApplication(values, today, before);
    if (!(before ? saved.update(app) : saved.add(app))) {
      setSaveFailed(true);
      focusSoon(`${formId}-save-error`);
      return;
    }
    // Someone who sets their own follow-up date has learned what the tip on
    // the list says, so it closes for good.
    if (typedFollowUp && app.followUpOn && app.followUpOn !== before?.followUpOn) {
      saved.dismissHint(FOLLOW_UP_HINT);
    }
    // Once saved, the date is the one on record, not a suggestion to undo.
    if (before) {
      setFollowUpIsMine(true);
      setDateBeforeSuggestion(null);
    }
    onSaved(app, another);
  }

  const text = (field: FieldName, label: string, extra: { hint?: string; optional?: boolean; placeholder?: string; max?: number } = {}) => (
    <Field
      id={fid(field)}
      label={label}
      hint={extra.hint}
      optional={extra.optional}
      error={errors[field]}
      count={extra.max ? { length: oneLine(values[field]).length, max: extra.max } : undefined}
    >
      <Input
        name={field}
        type="text"
        value={values[field]}
        onChange={(e) => update(field, e.target.value)}
        placeholder={extra.placeholder}
        autoComplete="off"
        aria-required={extra.optional ? undefined : "true"}
      />
    </Field>
  );

  const showSuggestion =
    suggestionMatters &&
    followUpIsMine &&
    suggestion.day &&
    suggestion.day !== values.followUpOn;

  // Without a suggestion on screen, an empty date just needs one.
  const followUpError =
    errors.followUpOn && !values.followUpOn && !showSuggestion
      ? "Pick a follow-up date."
      : errors.followUpOn;
  const stage = stageOf(values.status);

  // A saved application with the same company and role. When editing, only
  // once the company or role changes, so a pair saved anyway isn't flagged
  // every time it's opened.
  const pair = `${oneLine(values.company)}\n${oneLine(values.role)}`.toLowerCase();
  const pairChanged =
    !before || pair !== `${oneLine(before.company)}\n${oneLine(before.role)}`.toLowerCase();
  const duplicate =
    pairChanged && pair !== dismissedDuplicate
      ? findDuplicate(applications, values, before?.id)
      : undefined;

  return (
    <form noValidate onSubmit={submit} className="space-y-6">
      <Field
        id={fid("company")}
        label="Company"
        error={errors.company}
        count={{ length: oneLine(values.company).length, max: LIMITS.company }}
      >
        <Input
          name="company"
          type="text"
          value={values.company}
          onChange={(e) => update("company", e.target.value)}
          autoComplete="organization"
          autoCapitalize="words"
          autoFocus={autoFocus}
          aria-required="true"
        />
      </Field>

      <DuplicateNotice
        match={duplicate}
        dismissLabel={mode === "add" ? "Add anyway" : "Keep both"}
        onDismiss={() => {
          setDismissedDuplicate(pair);
          // The notice goes; carry on from the next field.
          focusSoon(fid("role"));
        }}
      />

      {text("role", "Role", { max: LIMITS.role })}

      <Field id={fid("appliedOn")} label="Applied on" error={errors.appliedOn}>
        <Input
          name="appliedOn"
          type="date"
          value={values.appliedOn}
          max={today}
          onChange={(e) => update("appliedOn", e.target.value)}
          aria-required="true"
        />
      </Field>

      {mode === "edit" && (
        <Field id={`${formId}-stage`} label="Status">
          <Select
            name="stage"
            value={stage}
            onChange={(e) => chooseStage(e.target.value as Stage)}
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {STAGE_LABELS[s]}
              </option>
            ))}
          </Select>
        </Field>
      )}

      {/* The error for a missing reason is the status's, so it lands here. */}
      {stage === "closed" && (
        <Field id={fid("status")} label="Why it closed" error={errors.status}>
          <Select
            name="status"
            value={values.status === "closed" ? "" : values.status}
            onChange={(e) => update("status", e.target.value || "closed")}
            aria-required="true"
          >
            <option value="">Choose one</option>
            {CLOSED_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </Select>
        </Field>
      )}

      {values.status === "interviewing" && (
        <Field
          id={fid("interviewOn")}
          label="Interview date"
          optional
          hint="While it's ahead, the application isn't marked gone quiet."
          error={errors.interviewOn}
        >
          <Input
            name="interviewOn"
            type="date"
            value={values.interviewOn}
            min={values.appliedOn}
            onChange={(e) => update("interviewOn", e.target.value)}
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
          error={followUpError}
        >
          <Input
            name="followUpOn"
            type="date"
            value={values.followUpOn}
            min={values.appliedOn}
            onChange={(e) => update("followUpOn", e.target.value)}
            aria-required="true"
          />
          {showSuggestion && suggestion.day && (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg bg-accent-soft px-3 py-2 text-sm">
              <span>
                Suggested for {STATUS_LABELS[values.status]}: {formatDay(suggestion.day)},{" "}
                {suggestion.reason}.
              </span>
              <Button variant="secondary" size="sm" onClick={applySuggestion}>
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

      <Field id={fid("link")} label="Link" optional error={errors.link}>
        <Input
          name="link"
          type="url"
          inputMode="url"
          value={values.link}
          onChange={(e) => update("link", e.target.value)}
          placeholder="https://"
          autoComplete="off"
        />
      </Field>

      <Field
        id={fid("notes")}
        label="Notes"
        optional
        error={errors.notes}
        count={{ length: values.notes.trim().length, max: LIMITS.notes }}
      >
        <Textarea name="notes" value={values.notes} onChange={(e) => update("notes", e.target.value)} />
      </Field>

      {text("contact", "Who to follow up with", {
        hint: "A name or email, e.g. Priya Shah. Monday will say who to contact.",
        optional: true,
      })}

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
        {addAnotherLabel && (
          <Button variant="secondary" className="w-full sm:w-auto" onClick={() => submit(undefined, true)}>
            {addAnotherLabel}
          </Button>
        )}
        {afterSubmit}
      </div>
    </form>
  );
}
