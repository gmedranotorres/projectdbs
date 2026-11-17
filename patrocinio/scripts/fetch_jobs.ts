// Finds open Chicago data jobs at the employers that filed for visas, by
// discovering each employer's public job board.
//
//   node scripts/fetch_jobs.ts        (reads data/employers.json, writes data/jobs.json)
//
// Many companies host their careers page on Greenhouse, Lever or Ashby, and all
// three publish open jobs through a free public API with no key. For each
// employer we guess board names from its normalized name, ask each service,
// and keep jobs whose location includes Chicago and whose title is data work.
//
// Why not The Muse (the plan in the proposal): on Nov 17, 2026 its public API
// returned 403 to servers and "We couldn't find that page" in a browser.

import { readFileSync, writeFileSync } from "node:fs";
import { canPrefixMatch } from "../lib/match.ts";

type Employer = { key: string; name: string; filings: number };
export type BoardJob = {
  id: string;
  employerKey: string;
  title: string;
  location: string;
  url: string;
  published: string; // YYYY-MM-DD, may be empty
  board: string;     // e.g. "greenhouse:chime"
  kind: "exact" | "prefix";
};

const DATA_TITLE = /\b(data|analytics?|analyst|scientist|machine learning|ML|AI|business intelligence|BI|statistic\w*|quantitative|insights)\b/i;
const CHICAGO = /chicago/i;

// Board names to try. Full-name slugs are "exact"; a first-word slug is a
// "prefix" guess and is only tried for distinctive first words.
export function slugsFor(key: string): { slug: string; kind: "exact" | "prefix" }[] {
  const words = key.toLowerCase().split(" ");
  const out: { slug: string; kind: "exact" | "prefix" }[] = [
    { slug: words.join(""), kind: "exact" as const },
    { slug: words.join("-"), kind: "exact" as const },
  ];
  if (words.length > 1 && words[0].length >= 5 && canPrefixMatch(words[0].toUpperCase())) {
    out.push({ slug: words[0], kind: "prefix" as const });
  }
  return out.filter((s, i, a) => a.findIndex((t) => t.slug === s.slug) === i);
}

async function getJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

type Raw = { id: string; title: string; location: string; url: string; published: string };

const boards: Record<string, (slug: string) => Promise<Raw[] | null>> = {
  async greenhouse(slug) {
    const d = (await getJson(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`)) as
      | { jobs: { id: number; title: string; location?: { name: string }; absolute_url: string; first_published?: string; updated_at?: string }[] }
      | null;
    return d?.jobs?.map((j) => ({
      id: String(j.id), title: j.title, location: j.location?.name ?? "", url: j.absolute_url,
      published: (j.first_published ?? j.updated_at ?? "").slice(0, 10),
    })) ?? null;
  },
  async lever(slug) {
    const d = (await getJson(`https://api.lever.co/v0/postings/${slug}?mode=json`)) as
      | { id: string; text: string; categories?: { location?: string; allLocations?: string[] }; hostedUrl: string; createdAt?: number }[]
      | null;
    return Array.isArray(d) ? d.map((j) => ({
      id: j.id, title: j.text,
      location: [j.categories?.location, ...(j.categories?.allLocations ?? [])].filter(Boolean).join("; "),
      url: j.hostedUrl, published: j.createdAt ? new Date(j.createdAt).toISOString().slice(0, 10) : "",
    })) : null;
  },
  async ashby(slug) {
    const d = (await getJson(`https://api.ashbyhq.com/posting-api/job-board/${slug}`)) as
      | { jobs: { id: string; title: string; location?: string; secondaryLocations?: { location: string }[]; jobUrl: string; publishedAt?: string; isListed?: boolean }[] }
      | null;
    return d?.jobs?.filter((j) => j.isListed !== false).map((j) => ({
      id: j.id, title: j.title,
      location: [j.location, ...(j.secondaryLocations ?? []).map((s) => s.location)].filter(Boolean).join("; "),
      url: j.jobUrl, published: (j.publishedAt ?? "").slice(0, 10),
    })) ?? null;
  },
};

// Runs tasks with at most `limit` in flight, to stay polite to the APIs.
async function pool<T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> {
  const results: T[] = [];
  let next = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (next < tasks.length) { const i = next++; results[i] = await tasks[i](); }
  }));
  return results;
}

async function main() {
  const { employers } = JSON.parse(readFileSync("data/employers.json", "utf8")) as { employers: Employer[] };
  const started = Date.now();
  const found: { employer: string; board: string; total: number; kept: number }[] = [];
  const jobs: BoardJob[] = [];

  await pool(employers.map((e) => async () => {
    for (const { slug, kind } of slugsFor(e.key)) {
      for (const [service, get] of Object.entries(boards)) {
        const raw = await get(slug);
        if (!raw || raw.length === 0) continue;
        const kept = raw.filter((j) => CHICAGO.test(j.location) && DATA_TITLE.test(j.title));
        found.push({ employer: e.name, board: `${service}:${slug}`, total: raw.length, kept: kept.length });
        jobs.push(...kept.map((j) => ({ ...j, id: `${service}:${j.id}`, employerKey: e.key, board: `${service}:${slug}`, kind })));
        return; // first board found wins
      }
    }
  }), 12);

  const seen = new Set<string>();
  const unique = jobs.filter((j) => !seen.has(j.id) && seen.add(j.id));
  writeFileSync("data/jobs.json", JSON.stringify({ savedAt: new Date().toISOString(), boards: found, jobs: unique }, null, 1));
  console.log(`${employers.length} employers checked in ${Math.round((Date.now() - started) / 1000)}s`);
  console.log(`${found.length} job boards found, ${found.filter((f) => f.kept > 0).length} with Chicago data jobs, ${unique.length} jobs kept`);
  for (const f of found.sort((a, b) => b.kept - a.kept)) console.log(`  ${String(f.kept).padStart(3)} / ${String(f.total).padStart(4)}  ${f.board.padEnd(36)} ${f.employer}`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
