"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fromMuseJob, plural } from "@/lib/applications";
import { dayOf, formatDay, today as getToday } from "@/lib/dates";
import {
  JOB_CATEGORIES,
  JOB_LEVELS,
  isJobCategory,
  isJobLevel,
  type Job,
  type JobCategory,
  type JobLevel,
  type JobsPage,
} from "@/lib/jobs";
import { useData } from "@/hooks/useData";
import { useBackLink, useFromHere } from "@/hooks/useBackLink";
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  Chip,
  ChipGroup,
  EmptyState,
  ErrorIcon,
  Loading,
  PageHeader,
  TextLink,
  useToast,
} from "@/components/ui";

// Data jobs in Chicago from The Muse, through app/api/jobs (never straight
// from the browser). Two chip filters, category and level, live in the
// address (?category=&level=) like the filter on All applications. Each job
// can be saved to the tracker as Interested; one already saved says
// "Saved", with a link to it. Three calm states besides the list: the
// skeleton while loading, nothing found (with other filters to try), and
// The Muse unavailable (with a way to log an application by hand). In
// development, ?simulate=down shows the last one.

type Results =
  | { state: "loading" }
  | { state: "down" }
  | { state: "ready"; jobs: Job[]; page: number; pageCount: number; total: number };

async function fetchJobs(
  category: JobCategory,
  level: JobLevel,
  page: number,
  simulate: boolean,
  signal?: AbortSignal,
): Promise<JobsPage | null> {
  const query = new URLSearchParams({ category, level, page: String(page) });
  if (simulate) query.set("simulate", "down");
  const response = await fetch(`/api/jobs?${query}`, { signal });
  return response.ok ? ((await response.json()) as JobsPage) : null;
}

function focusSoon(id: string) {
  requestAnimationFrame(() => document.getElementById(id)?.focus());
}

export function FindJobs() {
  const store = useData();
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const back = useBackLink();
  const here = useFromHere();

  const asked = { category: params.get("category"), level: params.get("level") };
  const category: JobCategory = isJobCategory(asked.category) ? asked.category : JOB_CATEGORIES[0];
  const level: JobLevel = isJobLevel(asked.level) ? asked.level : JOB_LEVELS[0];
  const simulate = process.env.NODE_ENV === "development" && params.get("simulate") === "down";

  // "Try again" asks again with the same filters.
  const [attempt, setAttempt] = useState(0);
  const search = `${category}|${level}|${simulate}|${attempt}`;
  // The results of the last search, with the search they belong to, so
  // changing a filter shows the skeleton instead of the old results.
  const [found, setFound] = useState<{ search: string; results: Results } | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreFailed, setMoreFailed] = useState(false);
  // The Muse ids being saved, and the one whose save failed.
  const [saving, setSaving] = useState<number[]>([]);
  const [saveFailed, setSaveFailed] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchJobs(category, level, 0, simulate, controller.signal)
      .then((page) => setFound({ search, results: page ? { state: "ready", ...page } : { state: "down" } }))
      .catch(() => {
        // A newer search replaced this one; that one will answer.
        if (!controller.signal.aborted) setFound({ search, results: { state: "down" } });
      });
    return () => controller.abort();
  }, [search, category, level, simulate]);

  const results: Results = found?.search === search ? found.results : { state: "loading" };
  // Which jobs are already in the tracker, by The Muse's id.
  const savedIds = new Map(
    store.applications.filter((a) => a.museJobId !== null).map((a) => [a.museJobId!, a.id]),
  );

  function choose(next: { category?: JobCategory; level?: JobLevel }) {
    const query = new URLSearchParams(params.toString());
    query.set("category", next.category ?? category);
    query.set("level", next.level ?? level);
    setMoreFailed(false);
    setSaveFailed(null);
    // replace: a filter is a view of this page, not a new page in the history.
    router.replace(`/jobs?${query}`, { scroll: false });
  }

  async function showMore() {
    if (results.state !== "ready" || loadingMore) return;
    setLoadingMore(true);
    setMoreFailed(false);
    const next = await fetchJobs(category, level, results.page + 1, simulate).catch(() => null);
    setLoadingMore(false);
    if (!next) {
      setMoreFailed(true);
      return;
    }
    setFound({ search, results: { ...results, ...next, jobs: [...results.jobs, ...next.jobs] } });
    // On to the first new job, so keyboard and screen reader users carry on there.
    if (next.jobs[0]) focusSoon(`job-${next.jobs[0].id}`);
  }

  async function save(job: Job) {
    if (saving.includes(job.id)) return;
    setSaving((s) => [...s, job.id]);
    setSaveFailed(null);
    const app = await store.add(fromMuseJob(job, getToday()));
    setSaving((s) => s.filter((id) => id !== job.id));
    if (!app) {
      setSaveFailed(job.id);
      return;
    }
    toast(`Saved ${app.role} at ${app.company} as Interested. Follow up on ${formatDay(app.followUpOn!)}.`);
    // The button is gone; "Open" takes its place.
    focusSoon(`open-${job.id}`);
  }

  const otherLevel = JOB_LEVELS.find((l) => l !== level)!;
  const otherCategory = JOB_CATEGORIES.find((c) => c !== category)!;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Find jobs"
        description="Data jobs in Chicago from The Muse. Save the ones you like to your tracker."
        back={back}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <p aria-hidden="true" className="font-medium">
            Category
          </p>
          <ChipGroup label="Category">
            {JOB_CATEGORIES.map((c) => (
              <Chip key={c} pressed={category === c} onClick={() => choose({ category: c })}>
                {c}
              </Chip>
            ))}
          </ChipGroup>
        </div>
        <div className="space-y-2">
          <p aria-hidden="true" className="font-medium">
            Level
          </p>
          <ChipGroup label="Level">
            {JOB_LEVELS.map((l) => (
              <Chip key={l} pressed={level === l} onClick={() => choose({ level: l })}>
                {l}
              </Chip>
            ))}
          </ChipGroup>
        </div>
        <p className="text-sm text-muted">Location: Chicago, IL</p>
      </div>

      {/* Always in the page, so screen readers hear each new count. */}
      <p role="status" className="text-sm text-muted empty:hidden">
        {results.state === "ready" &&
          results.total > 0 &&
          `${plural(results.total, "job")} in ${category}, ${level}.`}
      </p>

      {results.state === "loading" || !store.hydrated ? (
        <Loading label="Loading jobs…" />
      ) : results.state === "down" ? (
        <EmptyState
          title="The Muse isn't answering"
          action={
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={`/add?from=${here}`}>Log an application</ButtonLink>
              <Button variant="secondary" onClick={() => setAttempt((a) => a + 1)}>
                Try again
              </Button>
            </div>
          }
        >
          Job search is unavailable right now. Try again in a few minutes, or log an application
          you found somewhere else.
        </EmptyState>
      ) : results.jobs.length === 0 ? (
        <EmptyState
          title="No jobs found"
          action={
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => choose({ level: otherLevel })}>
                Try {otherLevel}
              </Button>
              <Button variant="secondary" onClick={() => choose({ category: otherCategory })}>
                Try {otherCategory}
              </Button>
            </div>
          }
        >
          The Muse has no {level} jobs in {category} in Chicago right now. Try a different level or
          category.
        </EmptyState>
      ) : (
        <>
          <ul className="space-y-3">
            {results.jobs.map((job) => {
              const savedId = savedIds.get(job.id);
              const name = `${job.title} at ${job.company}`;
              return (
                <li key={job.id} id={`job-${job.id}`} tabIndex={-1} className="outline-none">
                  <Card className="space-y-3">
                    <div className="min-w-0">
                      <h2 className="line-clamp-2 text-lg font-semibold wrap-anywhere">{job.title}</h2>
                      <p className="line-clamp-2 text-muted wrap-anywhere">{job.company}</p>
                    </div>
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted">
                      {job.levels.map((l) => (
                        <Badge key={l}>{l}</Badge>
                      ))}
                      <span>Posted {formatDay(dayOf(job.publishedAt))}</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      {savedId ? (
                        <>
                          <Badge tone="new">Saved</Badge>
                          <TextLink
                            id={`open-${job.id}`}
                            href={`/applications/${savedId}?from=${here}`}
                            className="inline-flex min-h-11 items-center"
                          >
                            Open<span className="sr-only">: {name} in your tracker</span>
                          </TextLink>
                        </>
                      ) : (
                        <Button variant="secondary" onClick={() => save(job)}>
                          Save to tracker<span className="sr-only">: {name}</span>
                        </Button>
                      )}
                      <TextLink
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center"
                      >
                        View posting
                        <span className="sr-only">: {name}, on The Muse (opens in a new tab)</span>
                      </TextLink>
                    </div>
                    {saveFailed === job.id && (
                      <p className="flex gap-2 text-sm font-medium text-error">
                        <ErrorIcon />
                        <span>Couldn&rsquo;t save. Check your connection and try again.</span>
                      </p>
                    )}
                  </Card>
                </li>
              );
            })}
          </ul>

          {results.page + 1 < results.pageCount && (
            <div className="space-y-3">
              <Button variant="secondary" onClick={showMore} className="w-full sm:w-auto">
                Show more jobs
              </Button>
              {moreFailed && (
                <p className="flex gap-2 text-sm font-medium text-error">
                  <ErrorIcon />
                  <span>Couldn&rsquo;t load more jobs. Check your connection and try again.</span>
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
