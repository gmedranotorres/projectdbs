// How someone knows the data is current. Pure functions, so the rules can be
// tested without a browser or a database.

export const STATES = ["loading", "fresh", "stale", "down"] as const;
export type FreshnessState = (typeof STATES)[number];

// The worker runs every 10 seconds, so 60 seconds is about 6 missed runs.
export const RUN_LATE_AFTER_MS = 60_000;
// Divvy publishes every 60 seconds, and a copy can already be about 95 seconds
// old, so 5 minutes means several files have been missed.
export const SOURCE_OLD_AFTER_MS = 5 * 60_000;

type Run = { ran_at: string; ok: boolean; source_updated_at: string | null };

export type Freshness =
  | { state: "loading" }
  | { state: "fresh"; checkedAgo: number; dataAgo: number | null }
  | { state: "stale"; reason: "no-runs" | "worker-late" | "source-old"; checkedAgo: number | null; dataAgo: number | null }
  | { state: "down"; failedAt: string; dataAgo: number | null };

export function getFreshness(input: {
  loaded: boolean;
  latestRun: Run | null;
  lastGoodRun: Run | null;
  now: number;
}): Freshness {
  const { loaded, latestRun, lastGoodRun, now } = input;
  if (!loaded) return { state: "loading" };

  const sourceTime = lastGoodRun?.source_updated_at ?? null;
  const dataAgo = sourceTime ? now - Date.parse(sourceTime) : null;

  if (!latestRun) return { state: "stale", reason: "no-runs", checkedAgo: null, dataAgo };

  // A failure is the clearest thing we know, so it wins over everything else.
  if (!latestRun.ok) return { state: "down", failedAt: latestRun.ran_at, dataAgo };

  // When the worker stops, nothing arrives and there's no error to show. Only
  // this comparison with the clock can notice the silence.
  const checkedAgo = now - Date.parse(latestRun.ran_at);
  if (checkedAgo > RUN_LATE_AFTER_MS) return { state: "stale", reason: "worker-late", checkedAgo, dataAgo };

  // The worker is fine, but Divvy has stopped publishing.
  if (dataAgo !== null && dataAgo > SOURCE_OLD_AFTER_MS) {
    return { state: "stale", reason: "source-old", checkedAgo, dataAgo };
  }

  return { state: "fresh", checkedAgo, dataAgo };
}

// A Realtime event isn't always a row. When Realtime refuses a subscription, the
// event arrives with an error and an empty row. An empty row has no `ok`, which
// would read as a failed run, so the page would say "down" when nothing is wrong.
export function rowFromEvent<Row>(
  event: { new: unknown; errors?: unknown },
  requiredField: keyof Row,
): Row | null {
  const row = event.new as Row | null;
  const hasErrors = Array.isArray(event.errors) ? event.errors.length > 0 : Boolean(event.errors);
  if (hasErrors || !row || row[requiredField] === undefined) return null;
  return row;
}

// "just now", "12 seconds ago", "1 minute ago", "3 hours ago"
export function formatAge(ms: number | null): string {
  if (ms === null) return "an unknown time ago";
  const seconds = Math.max(0, Math.round(ms / 1000));
  if (seconds < 3) return "just now";
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
}

// Bikes are shown as classic and electric. Divvy's bike count includes e-bikes.
export function classicBikes(station: { bikes: number; ebikes: number }): number {
  return Math.max(0, station.bikes - station.ebikes);
}
