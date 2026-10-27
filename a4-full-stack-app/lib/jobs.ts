// Find jobs: what the page can ask app/api/jobs/route.ts for, and what it
// gets back. The category and level names are The Muse's own, exactly as it
// returns them. Location is always Chicago.

export const JOB_CATEGORIES = ["Data and Analytics", "Data Science"] as const;
export const JOB_LEVELS = ["Entry Level", "Mid Level"] as const;
export const JOB_LOCATION = "Chicago, IL";

export type JobCategory = (typeof JOB_CATEGORIES)[number];
export type JobLevel = (typeof JOB_LEVELS)[number];

export function isJobCategory(value: unknown): value is JobCategory {
  return (JOB_CATEGORIES as readonly unknown[]).includes(value);
}

export function isJobLevel(value: unknown): value is JobLevel {
  return (JOB_LEVELS as readonly unknown[]).includes(value);
}

export type Job = {
  // The Muse's id, saved as muse_job_id.
  id: number;
  title: string;
  company: string;
  levels: string[];
  // When The Muse published it, an exact time ("2026-10-01T20:22:59Z").
  publishedAt: string;
  // The posting on The Muse.
  url: string;
};

export type JobsPage = {
  jobs: Job[];
  // Pages count from 0, 20 jobs each.
  page: number;
  pageCount: number;
  total: number;
};
