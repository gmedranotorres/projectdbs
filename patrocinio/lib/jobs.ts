// Open jobs from The Muse public API (free, no key needed for this volume).
// https://www.themuse.com/developers/api/v2
//
// Fetched on the server and cached by the page (see `revalidate` in app/page.tsx),
// so a visit never waits on dozens of API calls.

export type Job = {
  id: number;
  title: string;
  company: string;
  url: string;
  published: string; // YYYY-MM-DD
  level: string;
};

export type JobsResult =
  | { ok: true; jobs: Job[]; fetchedAt: string; pagesRead: number }
  | { ok: false; error: string; fetchedAt: string };

type MuseJob = {
  id: number;
  name: string;
  company: { name: string };
  refs: { landing_page: string };
  publication_date: string;
  levels: { name: string }[];
  locations: { name: string }[];
};

const BASE = "https://www.themuse.com/api/public/jobs";
const CATEGORIES = ["Data and Analytics", "Data Science"];
const LOCATION = "Chicago, IL";
const MAX_PAGES = 40; // 20 jobs a page; stays far under the 500 requests/hour limit

function pageUrl(page: number) {
  const params = new URLSearchParams({ location: LOCATION, page: String(page) });
  for (const c of CATEGORIES) params.append("category", c);
  return `${BASE}?${params}`;
}

async function getPage(page: number): Promise<{ pageCount: number; results: MuseJob[] }> {
  const res = await fetch(pageUrl(page), {
    headers: { Accept: "application/json" },
    next: { revalidate: 21600 },
  });
  if (!res.ok) throw new Error(`The Muse answered ${res.status} for page ${page}`);
  const body = await res.json();
  return { pageCount: body.page_count ?? 0, results: body.results ?? [] };
}

export async function fetchChicagoDataJobs(): Promise<JobsResult> {
  const fetchedAt = new Date().toISOString();
  try {
    const first = await getPage(0);
    const pages = Math.min(first.pageCount, MAX_PAGES);
    const rest = await Promise.all(Array.from({ length: Math.max(pages - 1, 0) }, (_, i) => getPage(i + 1)));
    const all = [first, ...rest].flatMap((p) => p.results);
    const seen = new Set<number>();
    const jobs: Job[] = [];
    for (const j of all) {
      if (seen.has(j.id)) continue;
      seen.add(j.id);
      jobs.push({
        id: j.id,
        title: j.name,
        company: j.company?.name ?? "",
        url: j.refs?.landing_page ?? "",
        published: (j.publication_date ?? "").slice(0, 10),
        level: j.levels?.[0]?.name ?? "",
      });
    }
    return { ok: true, jobs, fetchedAt, pagesRead: pages };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e), fetchedAt };
  }
}
