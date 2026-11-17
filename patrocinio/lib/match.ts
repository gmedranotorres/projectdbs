// Matches a company name from a job post ("Deloitte") to employers in the
// visa filings ("Deloitte Consulting LLP", "Deloitte & Touche LLP").
//
// Two kinds of match, and the page says which one it used:
//   exact  — the normalized names are the same:        GOOGLE == GOOGLE
//   prefix — one name is the other plus more words:    DELOITTE -> DELOITTE CONSULTING
// Prefix matches are where false matches come from, so they need a name that
// is long enough and not a common first word.

import { normalizeName } from "./normalize.ts";

export type MatchKind = "exact" | "prefix";

// First words that many unrelated companies share.
const TOO_GENERIC = new Set([
  "AMERICAN", "FIRST", "NATIONAL", "GLOBAL", "UNITED", "CHICAGO", "ILLINOIS",
  "UNIVERSITY", "UNIVERSITY OF", "NORTHERN", "GENERAL", "INTERNATIONAL", "DATA",
  "HEALTH", "CAPITAL", "BANK", "SYSTEMS", "SOLUTIONS", "TECHNOLOGIES", "GROUP",
]);

export function canPrefixMatch(key: string): boolean {
  return key.length >= 4 && !TOO_GENERIC.has(key);
}

export type Index = { byKey: Map<string, string>; keys: string[] };

export function buildIndex(employerKeys: string[]): Index {
  return { byKey: new Map(employerKeys.map((k) => [k, k])), keys: employerKeys };
}

// Returns every filing employer this job-post company matches.
export function matchCompany(companyName: string, index: Index): { key: string; kind: MatchKind }[] {
  const name = normalizeName(companyName);
  if (!name) return [];
  if (index.byKey.has(name)) return [{ key: name, kind: "exact" }];
  const out: { key: string; kind: MatchKind }[] = [];
  for (const key of index.keys) {
    // "DELOITTE" (job post) -> "DELOITTE CONSULTING" (filing)
    if (canPrefixMatch(name) && key.startsWith(name + " ")) out.push({ key, kind: "prefix" });
    // "JPMORGAN CHASE BANK" (job post) -> "JPMORGAN CHASE" (filing)
    else if (canPrefixMatch(key) && name.startsWith(key + " ")) out.push({ key, kind: "prefix" });
  }
  return out;
}
