"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  STATUS_LABELS,
  daysQuiet,
  dueLabel,
  groupAll,
  groupOf,
  plural,
  type Application,
  type Group,
} from "@/lib/applications";
import { formatDay, today as getToday, type Day } from "@/lib/dates";
import { useApplications } from "@/hooks/useApplications";
import { ArrivalMessage, useHighlightId } from "@/components/arrival-message";
import { Badge, ButtonLink, EmptyState, Loading, PageHeader } from "@/components/ui";

// Every application, sorted by follow-up date, in the order you'd act on
// them. Closed ones are folded away. Coming from Add (?new=), the new one
// sits on top under "Just added", highlighted for a few seconds, with
// focus on it.

const GLOW_MS = 3000;

const SECTIONS: { group: Group; title: string }[] = [
  { group: "due", title: "Due this week" },
  { group: "upcoming", title: "Upcoming" },
  { group: "quiet", title: "Gone quiet" },
];

export function ApplicationList() {
  const store = useApplications();
  const highlight = useHighlightId();
  const newId = useSearchParams().get("new");
  const [glow, setGlow] = useState(true);

  useEffect(() => {
    if (!newId || !store.hydrated) return;
    document.getElementById(`row-${newId}`)?.focus();
    const timer = setTimeout(() => setGlow(false), GLOW_MS);
    return () => clearTimeout(timer);
  }, [newId, store.hydrated]);

  if (!store.hydrated) return <Loading />;
  const today = getToday();
  const apps = store.applications;
  const added = newId ? apps.find((a) => a.id === newId) : undefined;
  const closedCount = groupAll(apps, today).closed.length;
  // The new one shows once, on top, not again in its section.
  const groups = groupAll(added ? apps.filter((a) => a.id !== added.id) : apps, today);

  return (
    <div className="space-y-8">
      <PageHeader
        title="All applications"
        description={
          apps.length === 0
            ? undefined
            : `${plural(apps.length, "application")}, ${closedCount} closed`
        }
        back={{ href: "/", label: "Home" }}
        action={apps.length > 0 && <ButtonLink href="/add">Log an application</ButtonLink>}
      />

      {/* After Add, the toast has already said what happened. */}
      {!added && <ArrivalMessage apps={apps} />}

      {added && (
        <section aria-labelledby="added-heading" className="space-y-3">
          <h2 id="added-heading" className="text-xl font-semibold">
            Just added
          </h2>
          <Rows
            apps={[added]}
            group={groupOf(added, today)}
            today={today}
            highlight={glow ? added.id : null}
            badge={false}
          />
        </section>
      )}

      {apps.length === 0 && (
        <EmptyState title="Nothing logged yet" action={{ href: "/add", label: "Log an application" }}>
          Log each application as you send it, and it shows up here sorted by follow-up date.
        </EmptyState>
      )}

      {SECTIONS.map(({ group, title }) =>
        groups[group].length > 0 ? (
          <section key={group} aria-labelledby={`${group}-heading`} className="space-y-3">
            <h2 id={`${group}-heading`} className="text-xl font-semibold">
              {title} <span className="font-normal text-muted">({groups[group].length})</span>
            </h2>
            <Rows apps={groups[group]} group={group} today={today} highlight={highlight} />
          </section>
        ) : null,
      )}

      {groups.closed.length > 0 && (
        <details
          // Open when the closed one is the one just changed.
          open={groups.closed.some((a) => a.id === highlight) || undefined}
          className="rounded-xl border border-line bg-surface"
        >
          <summary className="flex min-h-12 cursor-pointer items-center px-4 text-xl font-semibold">
            Closed <span className="ml-1.5 font-normal text-muted">({groups.closed.length})</span>
          </summary>
          <div className="border-t border-line p-3">
            <Rows apps={groups.closed} group="closed" today={today} highlight={highlight} />
          </div>
        </details>
      )}
    </div>
  );
}

function when(app: Application, group: Group, today: Day) {
  switch (group) {
    case "due":
      return (
        <Badge tone={app.followUpOn && app.followUpOn < today ? "due" : "neutral"}>
          {dueLabel(app, today)}
        </Badge>
      );
    case "upcoming":
      return <Badge>Follow up {formatDay(app.followUpOn!)}</Badge>;
    case "quiet":
      return <Badge tone="quiet">No news for {plural(daysQuiet(app, today), "day")}</Badge>;
    case "closed":
      return null;
  }
}

function Rows({
  apps,
  group,
  today,
  highlight,
  badge = true,
}: {
  apps: Application[];
  group: Group;
  today: Day;
  highlight: string | null;
  // The "Just changed" badge on the highlighted row.
  badge?: boolean;
}) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
      {apps.map((app) => {
        const isNew = app.id === highlight;
        return (
          <li
            key={app.id}
            id={`row-${app.id}`}
            tabIndex={-1}
            className={`flex items-start gap-4 px-4 py-3 transition-colors duration-700 motion-reduce:transition-none ${isNew ? "bg-accent-soft" : ""}`}
          >
            <div className="min-w-0 flex-1 space-y-1.5">
              <div>
                <p className="font-semibold">{app.company}</p>
                <p className="text-muted">
                  {app.role} · {STATUS_LABELS[app.status]}
                </p>
              </div>
              {((isNew && badge) || group !== "closed") && (
                <div className="flex flex-wrap gap-2">
                  {when(app, group, today)}
                  {isNew && badge && <Badge tone="new">Just changed</Badge>}
                </div>
              )}
            </div>
            <Link
              href={`/applications/edit?id=${app.id}&from=list`}
              className="inline-flex min-h-11 items-center font-medium text-ink underline decoration-accent-strong underline-offset-4 hover:decoration-ink hover:decoration-2"
            >
              Update<span className="sr-only"> {app.company}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
