// Joins the filings (data/employers.json) with open jobs (lib/jobs.ts).

import data from "../data/employers.json";
import type { Job } from "./jobs.ts";
import { buildIndex, matchCompany, type MatchKind } from "./match.ts";

export type Filing = { jobTitle: string; socTitle: string; date: string; wageLevel: string; positions: number };
export type Employer = {
  key: string; name: string; filings: number; latest: string; topTitles: string[]; recent: Filing[];
};
export type EmployerRow = Employer & { jobs: (Job & { kind: MatchKind })[]; jobCompanies: string[] };

export const dataset = data as {
  source: string; city: string; field: string; builtAt: string; filingsCounted: number; employers: Employer[];
};

export function joinJobs(jobs: Job[]) {
  const index = buildIndex(dataset.employers.map((e) => e.key));
  const byEmployer = new Map<string, (Job & { kind: MatchKind })[]>();
  const companies = new Map<string, { matched: boolean; jobs: number }>();
  for (const job of jobs) {
    const matches = matchCompany(job.company, index);
    const c = companies.get(job.company) ?? { matched: false, jobs: 0 };
    c.jobs++;
    c.matched ||= matches.length > 0;
    companies.set(job.company, c);
    for (const m of matches) byEmployer.set(m.key, [...(byEmployer.get(m.key) ?? []), { ...job, kind: m.kind }]);
  }
  const rows: EmployerRow[] = dataset.employers.map((e) => {
    const js = (byEmployer.get(e.key) ?? []).sort((a, b) => b.published.localeCompare(a.published));
    return { ...e, jobs: js, jobCompanies: [...new Set(js.map((j) => j.company))] };
  });
  // Hiring now first, then by number of filings.
  rows.sort((a, b) => Number(b.jobs.length > 0) - Number(a.jobs.length > 0) || b.filings - a.filings);
  const matchedCompanies = [...companies.values()].filter((c) => c.matched).length;
  return {
    rows,
    stats: {
      jobs: jobs.length,
      companies: companies.size,
      matchedCompanies,
      employersHiring: rows.filter((r) => r.jobs.length > 0).length,
    },
  };
}
