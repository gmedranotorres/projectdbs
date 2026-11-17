// Step 2 of the data pipeline: turn the Chicago extract into the employer list
// the site reads.
//
//   node scripts/build_employers.ts      (reads data/chicago_filings.csv,
//                                         writes data/employers.json)
//
// Groups filings by normalized employer name, so "Google LLC" and "GOOGLE LLC"
// land on one employer.

import { readFileSync, writeFileSync } from "node:fs";
import { cleanSocCode, normalizeName } from "../lib/normalize.ts";
import { COUNTED_STATUSES, isDataRole } from "../lib/roles.ts";

type Row = Record<string, string>;

// Small CSV parser (quoted fields, escaped quotes, newlines inside quotes).
function parseCsv(text: string): Row[] {
  const records: string[][] = [];
  let field = "", record: string[] = [], inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { record.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      record.push(field); records.push(record); field = ""; record = [];
    } else field += c;
  }
  if (field || record.length) { record.push(field); records.push(record); }
  const [header, ...rest] = records;
  return rest.filter((r) => r.length === header.length).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
}

export type Filing = { jobTitle: string; socTitle: string; date: string; wageLevel: string; positions: number };
export type Employer = {
  key: string;        // normalized name, used for matching
  name: string;       // the most common spelling in the filings
  filings: number;
  latest: string;     // most recent decision date (YYYY-MM-DD)
  topTitles: string[];
  recent: Filing[];   // newest first, capped
};

const rows = parseCsv(readFileSync("data/chicago_filings.csv", "utf8"));
const kept = rows.filter((r) => COUNTED_STATUSES.has(r.CASE_STATUS) && isDataRole(r.SOC_CODE, r.JOB_TITLE));

const groups = new Map<string, Row[]>();
for (const r of kept) {
  const key = normalizeName(r.EMPLOYER_NAME);
  if (!key) continue;
  groups.set(key, [...(groups.get(key) ?? []), r]);
}

const mostCommon = (values: string[]) => {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([v]) => v);
};

const employers: Employer[] = [...groups.entries()].map(([key, rs]) => {
  const sorted = [...rs].sort((a, b) => b.DECISION_DATE.localeCompare(a.DECISION_DATE));
  return {
    key,
    name: mostCommon(rs.map((r) => r.EMPLOYER_NAME.trim()))[0],
    filings: rs.length,
    latest: sorted[0].DECISION_DATE.slice(0, 10),
    topTitles: mostCommon(rs.map((r) => r.JOB_TITLE.trim())).slice(0, 3),
    recent: sorted.slice(0, 10).map((r) => ({
      jobTitle: r.JOB_TITLE.trim(),
      socTitle: r.SOC_TITLE.trim() || cleanSocCode(r.SOC_CODE),
      date: r.DECISION_DATE.slice(0, 10),
      wageLevel: r.PW_WAGE_LEVEL,
      positions: Number(r.TOTAL_WORKER_POSITIONS) || 1,
    })),
  };
}).sort((a, b) => b.filings - a.filings);

const out = {
  source: "US Department of Labor, LCA disclosure data, FY2025 Q1–Q4 (Oct 2024 – Sep 2025)",
  city: "Chicago, IL",
  field: "Data roles",
  builtAt: new Date().toISOString().slice(0, 10),
  filingsCounted: kept.length,
  employers,
};
writeFileSync("data/employers.json", JSON.stringify(out, null, 1));
console.log(`${rows.length} Chicago filings -> ${kept.length} certified data-role filings -> ${employers.length} employers`);
