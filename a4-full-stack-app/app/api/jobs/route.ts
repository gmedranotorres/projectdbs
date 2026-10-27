import { auth } from "@clerk/nextjs/server";
import { cacheLife } from "next/cache";
import type { NextRequest } from "next/server";
import {
  JOB_LOCATION,
  isJobCategory,
  isJobLevel,
  type Job,
  type JobCategory,
  type JobLevel,
  type JobsPage,
} from "@/lib/jobs";

// GET /api/jobs?category=…&level=…&page=0: jobs in Chicago from The Muse,
// for Find jobs. The browser never calls The Muse itself. Signed-in only.
// Each search is cached for an hour, so the whole app stays well under The
// Muse's 500 requests an hour without a key.
//
// 200 with a JobsPage; 401 signed out; 400 for a filter Find jobs doesn't
// offer; 503 when The Muse doesn't answer. In development, ?simulate=down
// answers 503, to see the page's unavailable state.

const MUSE_JOBS = "https://www.themuse.com/api/public/jobs";

// The Muse has at most a few dozen pages for these filters.
const MAX_PAGE = 50;

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Sign in to find jobs." }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  if (process.env.NODE_ENV === "development" && params.get("simulate") === "down") {
    return Response.json({ error: "The Muse is unavailable (simulated)." }, { status: 503 });
  }

  const category = params.get("category");
  const level = params.get("level");
  const page = Number(params.get("page") ?? "0");
  if (!isJobCategory(category) || !isJobLevel(level) || !Number.isInteger(page) || page < 0 || page > MAX_PAGE) {
    return Response.json({ error: "Choose a category and level that Find jobs offers." }, { status: 400 });
  }

  try {
    return Response.json(await searchMuse(category, level, page));
  } catch {
    return Response.json({ error: "The Muse is unavailable." }, { status: 503 });
  }
}

// Cached by its arguments for an hour (cacheLife "hours": revalidated after
// an hour, at most a day old). A failure throws, so it isn't cached.
async function searchMuse(category: JobCategory, level: JobLevel, page: number): Promise<JobsPage> {
  "use cache";
  cacheLife("hours");

  const url = new URL(MUSE_JOBS);
  url.searchParams.set("page", String(page));
  url.searchParams.set("category", category);
  url.searchParams.set("level", level);
  url.searchParams.set("location", JOB_LOCATION);

  const response = await fetch(url, {
    // The Muse's CDN refuses requests with no user agent.
    headers: { Accept: "application/json", "User-Agent": "Seguimiento (job application tracker)" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`The Muse answered ${response.status}.`);
  const body = (await response.json()) as MuseResponse;

  return {
    jobs: body.results.map(
      (r): Job => ({
        id: r.id,
        title: r.name,
        company: r.company.name,
        levels: r.levels.map((l) => l.name),
        publishedAt: r.publication_date,
        url: r.refs.landing_page,
      }),
    ),
    page: body.page,
    pageCount: body.page_count,
    total: body.total,
  };
}

// Only the parts of The Muse's answer that Find jobs uses.
type MuseResponse = {
  page: number;
  page_count: number;
  total: number;
  results: {
    id: number;
    name: string;
    publication_date: string;
    company: { name: string };
    levels: { name: string }[];
    refs: { landing_page: string };
  }[];
};
