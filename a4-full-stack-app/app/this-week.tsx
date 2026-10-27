"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import {
  STATUS_LABELS,
  addedSince,
  daysQuiet,
  dueLabel,
  groupAll,
  markApplied,
  markFollowedUp,
  plural,
  postpone,
  setFollowUp,
  whoToContact,
  type Application,
} from "@/lib/applications";
import { addDays, formatDay, formatShortDay, isDay, startOfWeek, today as getToday, type Day } from "@/lib/dates";
import { useData } from "@/hooks/useData";
import { useBackLink, useFromHere } from "@/hooks/useBackLink";
import { CalendarReminder, ReminderButton, checkInDayName } from "@/components/calendar-reminder";
import { YourData } from "@/components/your-data";
import { onEscape } from "@/lib/keys";
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  EmptyState,
  ErrorIcon,
  Field,
  Input,
  Loading,
  Notice,
  PageHeader,
  Progress,
  TextLink,
} from "@/components/ui";

// The weekly check-in, the reason to come back. In order: what's due (each
// one handled right here), what's gone quiet (give it a date), how this week
// is going against the goal, and "Done for this week". At /check-in, linked
// from Home's numbers and every page's footer.

type Message = { text: string; undo?: Application; tone?: "error" };

const GOAL_MAX = 20;

export function ThisWeek() {
  const store = useData();
  const [message, setMessage] = useState<Message | null>(null);
  // The quiet application whose date field is open.
  const [settingFor, setSettingFor] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState(false);
  const [doneFailed, setDoneFailed] = useState(false);
  const back = useBackLink();
  const here = useFromHere();

  if (!store.hydrated) return <Loading />;

  const today = getToday();
  const monday = startOfWeek(today);
  const groups = groupAll(store.applications, today);
  const nothingToDo = groups.due.length === 0 && groups.quiet.length === 0;

  const added = addedSince(store.applications, monday);
  const goal = store.settings.weeklyGoal;
  const lastCheckIn = store.settings.lastCheckInOn;
  const doneThisWeek = lastCheckIn !== undefined && lastCheckIn >= monday;
  const checkInDay = checkInDayName(store.settings);

  const focusSoon = (id: string) =>
    requestAnimationFrame(() => document.getElementById(id)?.focus());

  async function act(before: Application, after: Application, text: string) {
    if (await store.update(after)) {
      setMessage({ text, undo: before });
    } else {
      setMessage({ text: "Couldn't save that change. Check your connection and try again.", tone: "error" });
    }
    focusSoon("week-message");
  }

  // If the save fails, the change stays and Undo stays offered to try again.
  async function undo(previous: Application) {
    if (await store.update(previous)) {
      setMessage({ text: `Undone. ${previous.company} is back where it was.` });
    } else {
      setMessage({
        text: `Couldn't undo, so the change to ${previous.company} is still saved. Check your connection and try again.`,
        undo: previous,
        tone: "error",
      });
    }
    focusSoon("week-message");
  }

  async function done() {
    if (await store.setSettings({ lastCheckInOn: today })) {
      setDoneFailed(false);
      focusSoon("week-done");
    } else {
      setDoneFailed(true);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="This week"
        description={`Week of ${formatShortDay(monday)}: who to follow up with, and what's gone quiet.`}
        back={back}
      />

      {message && (
        <Notice id="week-message" tone={message.tone}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex gap-2">
              {message.tone === "error" && <ErrorIcon />}
              <span>{message.text}</span>
            </p>
            {message.undo && (
              <Button variant="secondary" onClick={() => undo(message.undo!)}>
                Undo
              </Button>
            )}
          </div>
        </Notice>
      )}

      {groups.due.length > 0 && (
        <section aria-labelledby="due-heading" className="space-y-3">
          <h2 id="due-heading" className="text-xl font-semibold">
            Follow-ups due <span className="font-normal text-muted">({groups.due.length})</span>
          </h2>
          <ul className="space-y-3">
            {groups.due.map((app) => (
              <li key={app.id}>
                <Card className="space-y-3">
                  <AppHeading app={app}>
                    <Badge tone={app.followUpOn! < today ? "due" : "neutral"}>{dueLabel(app, today)}</Badge>
                  </AppHeading>
                  <div className="flex flex-wrap gap-2">
                    {/* A saved job's next step is applying, not following up. */}
                    {app.status === "interested" ? (
                      <Button
                        onClick={() => {
                          const next = markApplied(app, today);
                          act(app, next, `Marked ${app.company} Applied. Next follow-up ${formatDay(next.followUpOn!)}.`);
                        }}
                      >
                        I applied<span className="sr-only">: {app.company}</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          const next = markFollowedUp(app, today);
                          act(app, next, `Followed up with ${app.company}. Next follow-up ${formatDay(next.followUpOn!)}.`);
                        }}
                      >
                        Followed up<span className="sr-only">: {app.company}</span>
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const next = postpone(app, today);
                        act(app, next, `Snoozed ${app.company} to ${formatDay(next.followUpOn!)}.`);
                      }}
                    >
                      Snooze a week<span className="sr-only">: {app.company}</span>
                    </Button>
                    <OpenLink app={app} from={here} />
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}

      {groups.quiet.length > 0 && (
        <section aria-labelledby="quiet-heading" className="space-y-3">
          <div>
            <h2 id="quiet-heading" className="text-xl font-semibold">
              Gone quiet <span className="font-normal text-muted">({groups.quiet.length})</span>
            </h2>
            <p className="mt-1 text-muted">
              Applied, with no update in 2 weeks or more. Pick a day to follow up.
            </p>
          </div>
          <ul className="space-y-3">
            {groups.quiet.map((app) => (
              <li key={app.id}>
                <Card className="space-y-3">
                  <AppHeading app={app}>
                    <Badge tone="quiet">No update for {plural(daysQuiet(app, today), "day")}</Badge>
                  </AppHeading>
                  {settingFor === app.id ? (
                    <SetFollowUpForm
                      app={app}
                      today={today}
                      onSave={(day) => {
                        setSettingFor(null);
                        act(app, setFollowUp(app, day, today), `${app.company}: follow up on ${formatDay(day)}.`);
                      }}
                      onCancel={() => {
                        setSettingFor(null);
                        focusSoon(`set-${app.id}`);
                      }}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <Button id={`set-${app.id}`} variant="secondary" onClick={() => setSettingFor(app.id)}>
                        Set a follow-up<span className="sr-only">: {app.company}</span>
                      </Button>
                      <OpenLink app={app} from={here} />
                    </div>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}

      {nothingToDo && (
        <EmptyState
          action={
            <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
              <ButtonLink variant="secondary" href={`/add?from=${here}`}>
                Add an application
              </ButtonLink>
              <ReminderButton label={`Come back ${checkInDay}: add it to my calendar`} variant="quiet" />
            </div>
          }
        >
          Nothing due. Add an application or come back {checkInDay}.
        </EmptyState>
      )}

      <section aria-labelledby="goal-heading" className="space-y-3">
        <h2 id="goal-heading" className="text-xl font-semibold">
          Applications this week
        </h2>
        <Card className="space-y-3">
          <p>
            Added since Monday, {formatShortDay(monday)}: {plural(added, "application")}
            {added >= goal ? ". Goal met." : "."}
          </p>
          <Progress label="Added this week, against your weekly goal" value={added} max={goal} />
          {editingGoal ? (
            <GoalForm
              goal={goal}
              onSave={async (next) => {
                if (await store.setSettings({ weeklyGoal: next, goalChosen: true })) {
                  setEditingGoal(false);
                  focusSoon("change-goal");
                  return true;
                }
                return false;
              }}
              onCancel={() => {
                setEditingGoal(false);
                focusSoon("change-goal");
              }}
            />
          ) : (
            <p className="flex flex-wrap items-center gap-x-3 text-muted">
              {/* Until you pick one, 3 is only a starting point. */}
              {store.settings.goalChosen
                ? `Weekly goal: ${plural(goal, "application")}`
                : `Suggested goal: ${goal} a week`}
              <Button id="change-goal" variant="quiet" size="sm" onClick={() => setEditingGoal(true)}>
                Change goal
              </Button>
            </p>
          )}
        </Card>
      </section>

      {doneThisWeek ? (
        <Notice id="week-done" role="status">
          <p>Done. See you next {checkInDay}.</p>
        </Notice>
      ) : (
        <div className="space-y-3">
          {doneFailed && (
            <Notice tone="error">
              <p className="flex gap-2">
                <ErrorIcon />
                <span>Couldn&rsquo;t save. Check your connection and try again.</span>
              </p>
            </Notice>
          )}
          <Button onClick={done} className="w-full sm:w-auto">
            Done for this week
          </Button>
        </div>
      )}

      <p className="text-muted">
        <TextLink href="/applications">See all {plural(store.applications.length, "application")}</TextLink>
      </p>

      <section aria-labelledby="reminder-heading" className="space-y-3">
        <h2 id="reminder-heading" className="text-xl font-semibold">
          Your check-in reminder
        </h2>
        <Card>
          <CalendarReminder />
        </Card>
      </section>

      <YourData />
    </div>
  );
}

// "Follow up with Sam at Example Co" on top, then the role and status.
function AppHeading({ app, children }: { app: Application; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-lg font-semibold wrap-anywhere">
          {app.contact ? `Follow up with ${whoToContact(app)}` : app.company}
        </h3>
        <p className="line-clamp-2 text-muted wrap-anywhere">
          {app.role} · {STATUS_LABELS[app.status]}
        </p>
      </div>
      {children}
    </div>
  );
}

function OpenLink({ app, from }: { app: Application; from: string }) {
  return (
    <TextLink href={`/applications/${app.id}?from=${from}`} className="inline-flex min-h-11 items-center px-2">
      Open<span className="sr-only">: {app.role} at {app.company}</span>
    </TextLink>
  );
}

// The date field that opens in place of "Set a follow-up". A week from
// today is filled in; the cursor goes to the field.
function SetFollowUpForm({
  app,
  today,
  onSave,
  onCancel,
}: {
  app: Application;
  today: Day;
  onSave: (day: Day) => void;
  onCancel: () => void;
}) {
  const id = useId();
  const [day, setDay] = useState(addDays(today, 7));
  const [error, setError] = useState<string>();

  function submit(event: FormEvent) {
    event.preventDefault();
    const problem = !isDay(day)
      ? "Pick a follow-up date."
      : day < today
        ? "Choose today or a later date."
        : undefined;
    setError(problem);
    if (problem) document.getElementById(id)?.focus();
    else onSave(day);
  }

  return (
    <form noValidate onSubmit={submit} onKeyDown={(e) => onEscape(e, onCancel)} className="space-y-3">
      <Field id={id} label={`Follow up with ${app.company} on`} error={error}>
        <Input
          type="date"
          name="followUpOn"
          value={day}
          min={today}
          autoFocus
          onChange={(e) => {
            setDay(e.target.value);
            if (error) setError(undefined);
          }}
        />
      </Field>
      <div className="flex flex-wrap gap-2">
        <Button type="submit">Save date</Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// The weekly goal, changed in place: a whole number from 1 to 20.
function GoalForm({
  goal,
  onSave,
  onCancel,
}: {
  goal: number;
  onSave: (goal: number) => Promise<boolean>;
  onCancel: () => void;
}) {
  const id = useId();
  const [value, setValue] = useState(String(goal));
  const [error, setError] = useState<string>();

  async function submit(event: FormEvent) {
    event.preventDefault();
    const n = Number(value.trim());
    if (!/^\d+$/.test(value.trim()) || n < 1 || n > GOAL_MAX) {
      setError(`Enter a whole number from 1 to ${GOAL_MAX}.`);
      document.getElementById(id)?.focus();
      return;
    }
    if (!(await onSave(n))) setError("Couldn't save. Check your connection and try again.");
  }

  return (
    <form noValidate onSubmit={submit} onKeyDown={(e) => onEscape(e, onCancel)} className="space-y-3">
      <Field id={id} label="Weekly goal" hint="Applications to log each week, Monday to Sunday." error={error}>
        <Input
          name="weeklyGoal"
          inputMode="numeric"
          value={value}
          autoFocus
          autoComplete="off"
          className="max-w-32"
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(undefined);
          }}
        />
      </Field>
      <div className="flex flex-wrap gap-2">
        <Button type="submit">Save goal</Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
