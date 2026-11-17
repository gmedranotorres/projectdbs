"use client";

import { useMemo, useState } from "react";
import type { EmployerRow } from "@/lib/results";

type Props = {
  rows: EmployerRow[];
  stats: { employers: number; filings: number; boardsFound: number; employersHiring: number; jobs: number; jobsCheckedAt: string };
};

const PAGE = 30;
// Job links come from third-party job boards: only link to https pages.
const safeUrl = (u: string) => (/^https:\/\//i.test(u) ? u : undefined);
const SERVICE_NAMES: Record<string, string> = { greenhouse: "Greenhouse", lever: "Lever", ashby: "Ashby" };
// "Chicago, IL; New York, NY; Remote" -> "Chicago, IL + 2 more"
function shortLocation(loc: string) {
  const parts = loc.split(/;|\|/).map((p) => p.trim()).filter(Boolean);
  const first = parts.find((p) => /chicago/i.test(p)) ?? parts[0] ?? "";
  return parts.length > 1 ? `${first} + ${parts.length - 1} more` : first;
}
const fmtMonth = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" });
const fmtDay = (iso: string) =>
  iso ? new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

export default function Results({ rows, stats }: Props) {
  const [query, setQuery] = useState("");
  const [hiringOnly, setHiringOnly] = useState(stats.employersHiring > 0);
  const [shown, setShown] = useState(PAGE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (!hiringOnly || r.jobs.length > 0) &&
        (!q || r.name.toLowerCase().includes(q)),
    );
  }, [rows, query, hiringOnly]);

  return (
    <section aria-label="Employers" className="mt-8">
      <p className="text-lg">
        <strong>{stats.employers.toLocaleString()} employers</strong> filed {stats.filings.toLocaleString()} visa filings
        for data roles in Chicago between Oct 2024 and Sep 2025.{" "}
        <strong>{stats.employersHiring} of them</strong> have {stats.jobs} data jobs open in Chicago now.
      </p>
      <p className="mt-1 text-sm text-muted">
        Open jobs checked{" "}
        {new Date(stats.jobsCheckedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Chicago" })}{" "}
        on the {stats.boardsFound} employer job boards we could find. Most large employers aren’t covered yet.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <label className="flex-1 min-w-[14rem]">
          <span className="sr-only">Search employers</span>
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShown(PAGE); }}
            placeholder="Search an employer, e.g. Google"
            className="w-full rounded-lg border border-line bg-surface px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={hiringOnly}
            onChange={(e) => { setHiringOnly(e.target.checked); setShown(PAGE); }}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          Only employers hiring now
        </label>
      </div>

      <p className="mt-3 text-sm text-muted" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "employer" : "employers"}
      </p>

      <ol className="mt-2 space-y-4">
        {filtered.slice(0, shown).map((r) => (
          <EmployerCard key={r.key} row={r} />
        ))}
      </ol>

      {filtered.length === 0 && (
        <p className="mt-6 text-muted">
          No employers match.{" "}
          {hiringOnly && (
            <button className="underline" onClick={() => setHiringOnly(false)}>
              Include employers with no open jobs
            </button>
          )}
        </p>
      )}

      {shown < filtered.length && (
        <button
          onClick={() => setShown(shown + PAGE)}
          className="mt-6 w-full rounded-lg border border-line bg-surface py-3 font-medium"
        >
          Show more ({filtered.length - shown} left)
        </button>
      )}
    </section>
  );
}

function EmployerCard({ row }: { row: EmployerRow }) {
  const [allJobs, setAllJobs] = useState(false);
  const jobs = allJobs ? row.jobs : row.jobs.slice(0, 4);
  const [service, slug] = (row.board ?? ":").split(":");
  const guessed = row.jobs.some((j) => j.kind === "prefix");

  return (
    <li className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-display text-xl">{row.name}</h2>
        <p className="text-sm text-muted">
          <strong className="text-ink">{row.filings}</strong> {row.filings === 1 ? "filing" : "filings"} · latest{" "}
          {fmtMonth(row.latest)}
        </p>
      </div>
      <p className="mt-1 text-sm text-muted">Filed for: {row.topTitles.join(" · ")}</p>

      {row.jobs.length > 0 ? (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-accent">
            {row.jobs.length} open data {row.jobs.length === 1 ? "job" : "jobs"}
          </h3>
          <ul className="mt-2 divide-y divide-line">
            {jobs.map((j) => (
              <li key={j.id} className="flex flex-wrap items-baseline justify-between gap-x-3 py-2">
                <a href={safeUrl(j.url)} target="_blank" rel="noopener noreferrer" className="font-medium underline decoration-line underline-offset-4 hover:decoration-accent">
                  {j.title}
                </a>
                <span className="text-sm text-muted">
                  {[shortLocation(j.location), fmtDay(j.published)].filter(Boolean).join(" · ")}
                </span>
              </li>
            ))}
          </ul>
          {row.jobs.length > 4 && (
            <button onClick={() => setAllJobs(!allJobs)} className="mt-1 text-sm underline">
              {allJobs ? "Show fewer" : `Show all ${row.jobs.length} jobs`}
            </button>
          )}
          <p className="mt-2 text-xs text-muted">
            From {SERVICE_NAMES[service] ?? service} job board “{slug}”.
            {guessed && " Found from the first word of the employer’s name, so check it’s the same company."}
          </p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted">No open Chicago data jobs found on their job board, or we couldn’t find their job board yet.</p>
      )}

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-muted">See the filings behind this</summary>
        <table className="mt-2 w-full text-left">
          <thead className="text-muted">
            <tr>
              <th className="py-1 pr-2 font-normal">Job title on the filing</th>
              <th className="py-1 pr-2 font-normal">Wage level</th>
              <th className="py-1 font-normal">Decided</th>
            </tr>
          </thead>
          <tbody>
            {row.recent.map((f, i) => (
              <tr key={i} className="border-t border-line">
                <td className="py-1 pr-2">{f.jobTitle}</td>
                <td className="py-1 pr-2">{f.wageLevel || "—"}</td>
                <td className="py-1 whitespace-nowrap">{fmtDay(f.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {row.filings > row.recent.length && (
          <p className="mt-1 text-muted">Showing the {row.recent.length} newest of {row.filings}.</p>
        )}
      </details>
    </li>
  );
}
