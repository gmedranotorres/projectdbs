// Joins the filings (data/employers.json) with the open jobs found on each
// employer's job board (data/jobs.json).

import data from "../data/employers.json";
import { jobsData, type Job } from "./jobs.ts";

export type Filing = { jobTitle: string; socTitle: string; date: string; wageLevel: string; positions: number };
export type Employer = {
  key: string; name: string; filings: number; latest: string; topTitles: string[]; recent: Filing[];
};
export type EmployerRow = Employer & { jobs: Job[]; board: string | null };

export const dataset = data as {
  source: string; city: string; field: string; builtAt: string; filingsCounted: number; employers: Employer[];
};

export function buildRows() {
  const byEmployer = new Map<string, Job[]>();
  for (const job of jobsData.jobs) byEmployer.set(job.employerKey, [...(byEmployer.get(job.employerKey) ?? []), job]);

  const rows: EmployerRow[] = dataset.employers.map((e) => {
    const jobs = (byEmployer.get(e.key) ?? []).sort((a, b) => b.published.localeCompare(a.published));
    return { ...e, jobs, board: jobs[0]?.board ?? null };
  });
  // Hiring now first, then by number of filings.
  rows.sort((a, b) => Number(b.jobs.length > 0) - Number(a.jobs.length > 0) || b.filings - a.filings);

  return {
    rows,
    stats: {
      employers: dataset.employers.length,
      filings: dataset.filingsCounted,
      boardsFound: jobsData.boards.length,
      employersHiring: rows.filter((r) => r.jobs.length > 0).length,
      jobs: jobsData.jobs.length,
      jobsCheckedAt: jobsData.savedAt,
    },
  };
}
