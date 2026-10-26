"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { daysQuiet, dueLabel, groupOf, plural, type Application } from "@/lib/applications";
import { today as getToday, type Day } from "@/lib/dates";
import { useApplications } from "@/hooks/useApplications";
import { useBackLink, useFromHere } from "@/hooks/useBackLink";
import { readListFilter, rememberListFilter } from "@/lib/remember";
import {
  Badge,
  Button,
  ButtonLink,
  Chip,
  ChipGroup,
  EmptyState,
  Field,
  Input,
  List,
  ListRow,
  Loading,
  PageHeader,
  TextLink,
  statusTone,
} from "@/components/ui";

// Every application as a ListRow, soonest follow-up first and those without
// one last. Filter chips (with counts) narrow it by status, and the search
// narrows it by company or role as you type. Every empty result says why
// and offers a way back, so the page is never blank. The filter lives in
// the address (?status=), so a link can open it and Back keeps it. The last
// chip chosen is also remembered (lib/remember.ts): opening All without a
// filter in the address shows that one again.
//
// Coming from Add (?new=), the new one sits on top, tagged "Just added" and
// highlighted for a few seconds, with focus on it.

type Filter = "all" | "applied" | "interviewing" | "offer" | "closed";

// The same four looks as the status badges: Followed up counts as Applied;
// Rejected, Withdrawn and No response as Closed.
const FILTERS: { id: Filter; label: string; empty: string }[] = [
  { id: "all", label: "All", empty: "" },
  { id: "applied", label: "Applied", empty: "Nothing in Applied right now." },
  { id: "interviewing", label: "Interviewing", empty: "No interviews yet." },
  { id: "offer", label: "Offer", empty: "No offers yet." },
  { id: "closed", label: "Closed", empty: "Nothing closed yet." },
];

const GLOW_MS = 3000;

function inFilter(app: Application, filter: Filter) {
  return filter === "all" || statusTone(app.status) === filter;
}

// Soonest follow-up first; no follow-up date last; then by company.
function byFollowUp(a: Application, b: Application) {
  if (a.followUpOn !== b.followUpOn) {
    if (!a.followUpOn) return 1;
    if (!b.followUpOn) return -1;
    return a.followUpOn.localeCompare(b.followUpOn);
  }
  return a.company.localeCompare(b.company);
}

// Words beside the date when it needs attention, so late and gone quiet
// never depend on color: "5 days late", "No update for 15 days".
function attention(app: Application, today: Day) {
  if (groupOf(app, today) === "quiet") {
    return <Badge tone="quiet">No update for {plural(daysQuiet(app, today), "day")}</Badge>;
  }
  if (app.followUpOn && app.followUpOn < today) {
    return <Badge tone="due">{dueLabel(app, today)}</Badge>;
  }
  return undefined;
}

export function ApplicationList() {
  const store = useApplications();
  const router = useRouter();
  const params = useSearchParams();
  const searchId = useId();
  const newId = params.get("new");
  const back = useBackLink();
  const here = useFromHere();
  const [query, setQuery] = useState("");
  const [glow, setGlow] = useState(true);
  // Read once, in the browser; the server only draws the loading state.
  const [remembered, setRemembered] = useState<Filter | null>(() =>
    typeof window === "undefined" ? null : readListFilter(FILTERS.map((f) => f.id)),
  );

  useEffect(() => {
    if (!newId || !store.hydrated) return;
    document.getElementById(`row-${newId}`)?.focus();
    const timer = setTimeout(() => setGlow(false), GLOW_MS);
    return () => clearTimeout(timer);
  }, [newId, store.hydrated]);

  if (!store.hydrated) return <Loading />;
  const today = getToday();
  const apps = store.applications;

  const asked = params.get("status");
  // The address wins; then the remembered chip, except right after Add,
  // where the new one must be in view.
  const filter: Filter = FILTERS.some((f) => f.id === asked)
    ? (asked as Filter)
    : newId
      ? "all"
      : (remembered ?? "all");
  const current = FILTERS.find((f) => f.id === filter)!;

  const q = query.trim().toLowerCase();
  const found = q
    ? apps.filter((a) => a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q))
    : apps;
  const shown = found.filter((a) => inFilter(a, filter)).sort(byFollowUp);
  const added = shown.find((a) => a.id === newId);
  const ordered = added ? [added, ...shown.filter((a) => a !== added)] : shown;

  function choose(next: Filter) {
    rememberListFilter(next);
    setRemembered(next === "all" ? null : next);
    // replace: a filter is a view of this page, not a new page in the history.
    router.replace(next === "all" ? "/applications" : `/applications?status=${next}`, { scroll: false });
  }

  function clearSearch() {
    setQuery("");
    document.getElementById(searchId)?.focus();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="All applications"
        description={
          apps.length > 0
            ? `${plural(apps.length, "application")}, soonest follow-up first.`
            : "Everything you log, soonest follow-up first."
        }
        back={back}
        action={apps.length > 0 && <ButtonLink href={`/add?from=${here}`}>Log an application</ButtonLink>}
      />

      {apps.length === 0 ? (
        <EmptyState
          title="Nothing logged yet"
          action={<ButtonLink href="/">Log your first application</ButtonLink>}
        >
          Log each application as you send it, and it shows up here sorted by follow-up date.
        </EmptyState>
      ) : (
        <>
          <div className="space-y-4">
            <Field id={searchId} label="Search by company or role">
              <Input
                type="search"
                name="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
            </Field>
            <ChipGroup label="Filter by status">
              {FILTERS.map((f) => (
                <Chip
                  key={f.id}
                  pressed={filter === f.id}
                  // Pressing the chip that's on goes back to All.
                  onClick={() => choose(filter === f.id ? "all" : f.id)}
                >
                  {f.label}{" "}
                  <span className="font-normal text-muted">
                    ({found.filter((a) => inFilter(a, f.id)).length})
                  </span>
                </Chip>
              ))}
            </ChipGroup>
            <p role="status" className="text-sm text-muted">
              {(q || filter !== "all") && `Showing ${shown.length} of ${apps.length}.`}
            </p>
          </div>

          {ordered.length > 0 ? (
            <List>
              {ordered.map((app) => (
                <ListRow
                  key={app.id}
                  rowId={`row-${app.id}`}
                  company={app.company}
                  role={app.role}
                  status={app.status}
                  followUpOn={app.followUpOn ?? undefined}
                  href={`/applications/${app.id}?from=${here}`}
                  hint={
                    app.id === newId ? (
                      <>
                        <Badge tone="new">Just added</Badge>
                        {attention(app, today)}
                      </>
                    ) : (
                      attention(app, today)
                    )
                  }
                  highlight={glow && app.id === newId}
                />
              ))}
            </List>
          ) : !apps.some((a) => inFilter(a, filter)) ? (
            // Nothing with this status at all.
            <EmptyState
              action={
                <TextLink
                  href="/applications"
                  onClick={() => {
                    // The link shows All; remember that, too.
                    rememberListFilter("all");
                    setRemembered(null);
                  }}
                >
                  Show all applications
                </TextLink>
              }
            >
              {current.empty}
            </EmptyState>
          ) : (
            // Some, but the search leaves none.
            <EmptyState
              action={
                <Button variant="secondary" onClick={clearSearch}>
                  Clear search
                </Button>
              }
            >
              {filter === "all"
                ? `Nothing matches “${query.trim()}”.`
                : `Nothing in ${current.label} matches “${query.trim()}”.`}
            </EmptyState>
          )}
        </>
      )}
    </div>
  );
}
