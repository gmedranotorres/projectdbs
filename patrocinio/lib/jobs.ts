// Open jobs found on the employers' own job boards (Greenhouse, Lever, Ashby)
// by scripts/fetch_jobs.ts, saved in data/jobs.json with the time they were
// checked. In v2 a scheduled worker reruns the same discovery.

import saved from "../data/jobs.json";
import type { BoardJob } from "../scripts/fetch_jobs.ts";

export type Job = BoardJob;

export const jobsData = saved as {
  savedAt: string;
  boards: { employer: string; board: string; total: number; kept: number }[];
  jobs: Job[];
};
