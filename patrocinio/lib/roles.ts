// What counts as a "data role" in v1. Every rule that decides which filings
// appear lives here, so it can be read and changed in one place.

import { cleanSocCode } from "./normalize.ts";

// Occupation (SOC) codes for data work.
export const DATA_SOC_CODES: Record<string, string> = {
  "15-2051": "Data Scientists / Business Intelligence Analysts",
  "15-2041": "Statisticians",
  "15-2031": "Operations Research Analysts",
  "15-1243": "Database Architects / Data Warehousing",
};

// Job titles that are data work even when filed under another code
// (for example a "Data Engineer" filed as a Software Developer).
const TITLE_WORDS = /\b(data|analytics|machine learning|business intelligence|statistic\w*)\b/i;

// Certified, or certified and later withdrawn: either way the employer meant to hire.
export const COUNTED_STATUSES = new Set(["Certified", "Certified - Withdrawn"]);

export function isDataRole(socCode: string, jobTitle: string): boolean {
  const soc = cleanSocCode(socCode).slice(0, 7);
  return soc in DATA_SOC_CODES || TITLE_WORDS.test(jobTitle);
}
