"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  STATUS_LABELS,
  closeAs,
  daysQuiet,
  dueLabel,
  groupAll,
  markFollowedUp,
  plural,
  postpone,
  whoToContact,
  type Application,
} from "@/lib/applications";
import { daysBetween, formatDay, formatShortDay, startOfWeek, today as getToday } from "@/lib/dates";
import { saveApplication, useStore } from "@/lib/store";
import { ArrivalMessage } from "@/components/arrival-message";
import { FirstVisit } from "@/components/first-visit";
import { Button, ButtonLink, Card, Loading, Notice, Tag, TextLink } from "@/components/ui";

// The Monday check-in. Every follow-up can be handled right here, so the
// ritual doesn't mean opening each application.

type Message = { text: string; undo?: Application; tone?: "error" };

export function ThisWeek() {
  const store = useStore();
  const [message, setMessage] = useState<Message | null>(null);

  if (!store) return <Loading />;
  if (store.applications.length === 0) return <FirstVisit />;

  const today = getToday();
  const groups = groupAll(store.applications, today);
  const openCount = groups.due.length + groups.quiet.length + groups.upcoming.length;

  function act(before: Application, after: Application, text: string) {
    if (saveApplication(after)) {
      setMessage({ text, undo: before });
    } else {
      setMessage({ text: "Couldn't save that change. This browser's storage may be full.", tone: "error" });
    }
    requestAnimationFrame(() => document.getElementById("week-message")?.focus());
  }

  function undo(previous: Application) {
    saveApplication(previous);
    setMessage({ text: `Undone. ${previous.company} is back where it was.` });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">This week</h1>
        <p className="mt-1 text-muted">Week of {formatShortDay(startOfWeek(today))}</p>
      </div>

      {message ? (
        <Notice id="week-message" tone={message.tone}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p>{message.text}</p>
            {message.undo && (
              <Button variant="secondary" onClick={() => undo(message.undo!)}>
                Undo
              </Button>
            )}
          </div>
        </Notice>
      ) : (
        <ArrivalMessage apps={store.applications} />
      )}

      {groups.due.length > 0 && (
        <section aria-labelledby="due-heading" className="space-y-3">
          <h2 id="due-heading" className="text-xl font-semibold">
            Follow up this week <span className="font-normal text-muted">({groups.due.length})</span>
          </h2>
          <ul className="space-y-3">
            {groups.due.map((app) => (
              <li key={app.id}>
                <Card className="space-y-3">
                  <AppHeading app={app}>
                    <Tag tone={app.followUpOn && app.followUpOn < today ? "late" : "plain"}>
                      {dueLabel(app, today)}
                    </Tag>
                  </AppHeading>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => {
                        const next = markFollowedUp(app, today);
                        act(app, next, `Followed up with ${app.company}. Next follow-up ${formatDay(next.followUpOn!)}.`);
                      }}
                    >
                      I followed up<span className="sr-only"> with {app.company}</span>
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const next = postpone(app, today);
                        act(app, next, `${app.company} moved to ${formatDay(next.followUpOn!)}.`);
                      }}
                    >
                      Not yet<span className="sr-only"> for {app.company}</span>
                    </Button>
                    <DetailsLink app={app} />
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
              No news in 3 weeks or more. Follow up once more, or close it to clear your list.
            </p>
          </div>
          <ul className="space-y-3">
            {groups.quiet.map((app) => (
              <li key={app.id}>
                <Card className="space-y-3">
                  <AppHeading app={app}>
                    <Tag>No news for {plural(daysQuiet(app, today), "day")}</Tag>
                  </AppHeading>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => {
                        const next = markFollowedUp(app, today);
                        act(app, next, `Followed up with ${app.company}. Next follow-up ${formatDay(next.followUpOn!)}.`);
                      }}
                    >
                      Follow up once more<span className="sr-only"> with {app.company}</span>
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => act(app, closeAs(app, "no-response", today), `Closed ${app.company} as No response.`)}
                    >
                      Close it<span className="sr-only">: {app.company}</span>
                    </Button>
                    <DetailsLink app={app} />
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}

      {groups.due.length === 0 && groups.quiet.length === 0 && (
        <Card className="space-y-3">
          {openCount > 0 ? (
            <>
              <h2 className="text-xl font-semibold">All caught up</h2>
              <p>
                Nothing due this week. Next: {groups.upcoming[0].company} on{" "}
                {formatDay(groups.upcoming[0].followUpOn!)}
                {groups.upcoming[0].followUpOn &&
                  ` (in ${plural(daysBetween(today, groups.upcoming[0].followUpOn), "day")})`}
                .
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold">No open applications</h2>
              <p>Everything on your list is closed. Log a new one when you send it.</p>
            </>
          )}
          <ButtonLink href="/add">Log an application</ButtonLink>
        </Card>
      )}

      <p className="flex flex-wrap gap-x-6 gap-y-2 text-muted">
        <TextLink href="/applications">
          See all {plural(store.applications.length, "application")}
        </TextLink>
        {(groups.due.length > 0 || groups.quiet.length > 0) && (
          <TextLink href="/add">Log an application</TextLink>
        )}
      </p>
    </div>
  );
}

// "Email Priya at Morningstar" on top, then the role and status.
function AppHeading({ app, children }: { app: Application; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div>
        <h3 className="text-lg font-semibold">
          {app.contact ? `Follow up with ${whoToContact(app)}` : app.company}
        </h3>
        <p className="text-muted">
          {app.role} · {STATUS_LABELS[app.status]}
        </p>
      </div>
      {children}
    </div>
  );
}

function DetailsLink({ app }: { app: Application }) {
  return (
    <Link
      href={`/applications/edit?id=${app.id}&from=week`}
      className="inline-flex min-h-11 items-center px-2 font-medium text-accent underline underline-offset-4"
    >
      Details<span className="sr-only"> for {app.company}</span>
    </Link>
  );
}
