// The worker's decisions, with no Supabase or network code in them, so the test
// can run the real thing against a saved copy of Divvy's response.

export type StationRow = {
  station_id: string;
  name: string;
  lat: number;
  lon: number;
  capacity: number | null;
  bikes: number;
  ebikes: number;
  docks: number;
  is_installed: boolean;
  is_renting: boolean;
  is_returning: boolean;
  changed_at: string;
};

// What a station looks like in Divvy's status file, once checked.
export type StationStatus = Pick<
  StationRow,
  "station_id" | "bikes" | "ebikes" | "docks" | "is_installed" | "is_renting" | "is_returning"
>;

export type StationInfo = Pick<StationRow, "station_id" | "name" | "lat" | "lon" | "capacity">;

export type RunRecord = {
  ok: boolean;
  source_changed: boolean;
  rows_changed: number;
  stations_seen: number | null;
  source_updated_at: string | null;
  source_etag: string | null;
  duration_ms: number;
  error: string | null;
};

export type LastGoodRun = { source_etag: string | null; source_updated_at: string | null };

// Everything the worker needs from the outside world.
export type Deps = {
  fetchStatus: (etag: string | null) => Promise<Response>;
  fetchInfo: () => Promise<Response>;
  lastGoodRun: () => Promise<LastGoodRun | null>;
  savedStations: () => Promise<StationRow[]>;
  upsertStations: (rows: StationRow[]) => Promise<void>;
  recordRun: (run: RunRecord) => Promise<void>;
  now: () => Date;
  log: (line: string) => void;
};

const isCount = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 0;
const isFlag = (v: unknown): v is 0 | 1 => v === 0 || v === 1;

// Refuses anything that isn't the shape we planned for. One bad station fails
// the whole file: if Divvy renames a field, we'd rather show "down" than save
// wrong numbers.
export function parseStatus(json: unknown): { updatedAt: string; stations: StationStatus[] } {
  const body = json as { last_updated?: unknown; data?: { stations?: unknown } } | null;
  const lastUpdated = body?.last_updated;
  const stations = body?.data?.stations;

  if (typeof lastUpdated !== "number" || !Number.isFinite(lastUpdated) || lastUpdated <= 0) {
    throw new Error("Source shape changed: last_updated is missing or isn't a number");
  }
  if (!Array.isArray(stations) || stations.length === 0) {
    throw new Error("Source shape changed: data.stations is missing or empty");
  }

  return {
    updatedAt: new Date(lastUpdated * 1000).toISOString(),
    stations: stations.map((s) => {
      if (
        typeof s?.station_id !== "string" ||
        !isCount(s.num_bikes_available) ||
        !isCount(s.num_ebikes_available) ||
        !isCount(s.num_docks_available) ||
        !isFlag(s.is_installed) ||
        !isFlag(s.is_renting) ||
        !isFlag(s.is_returning)
      ) {
        throw new Error(`Source shape changed: station ${String(s?.station_id)} has a missing or invalid field`);
      }
      return {
        station_id: s.station_id,
        bikes: s.num_bikes_available,
        ebikes: s.num_ebikes_available,
        docks: s.num_docks_available,
        is_installed: s.is_installed === 1,
        is_renting: s.is_renting === 1,
        is_returning: s.is_returning === 1,
      };
    }),
  };
}

export function parseInfo(json: unknown): Map<string, StationInfo> {
  const stations = (json as { data?: { stations?: unknown } } | null)?.data?.stations;
  if (!Array.isArray(stations)) throw new Error("Source shape changed: station information has no data.stations");

  const byId = new Map<string, StationInfo>();
  for (const s of stations) {
    if (
      typeof s?.station_id === "string" &&
      typeof s.name === "string" &&
      typeof s.lat === "number" &&
      typeof s.lon === "number"
    ) {
      byId.set(s.station_id, {
        station_id: s.station_id,
        name: s.name,
        lat: s.lat,
        lon: s.lon,
        capacity: isCount(s.capacity) ? s.capacity : null,
      });
    }
  }
  return byId;
}

// The fields a person can see. last_reported is deliberately not here: it moves
// about 9 times as often, and nothing on the page would change.
const WATCHED = ["bikes", "ebikes", "docks", "is_installed", "is_renting", "is_returning"] as const;

export function hasChanged(saved: StationRow, next: StationStatus): boolean {
  return WATCHED.some((field) => saved[field] !== next[field]);
}

export async function runWorker(deps: Deps): Promise<RunRecord> {
  const started = deps.now().getTime();
  const elapsed = () => deps.now().getTime() - started;

  let last: LastGoodRun | null = null;
  try {
    last = await deps.lastGoodRun();
    deps.log(`start: asking Divvy with ETag ${last?.source_etag ?? "none"}`);

    const response = await deps.fetchStatus(last?.source_etag ?? null);

    // Divvy has nothing new, and sent no file. The usual case: 5 runs out of 6.
    if (response.status === 304) {
      deps.log("source: 304, nothing new since the last file");
      return await finish(deps, {
        ok: true,
        source_changed: false,
        rows_changed: 0,
        stations_seen: null,
        source_updated_at: last?.source_updated_at ?? null,
        source_etag: last?.source_etag ?? null,
        duration_ms: elapsed(),
        error: null,
      });
    }
    if (!response.ok) throw new Error(`Divvy returned HTTP ${response.status}`);

    const etag = response.headers.get("etag");
    const { updatedAt, stations } = parseStatus(await response.json());
    deps.log(`source: 200, ${stations.length} stations, published ${updatedAt}`);

    // The feed comes through a CDN, so one call can get an older copy than the
    // last. Saving it would move the numbers backwards.
    if (last?.source_updated_at && Date.parse(updatedAt) < Date.parse(last.source_updated_at)) {
      deps.log(`source: older copy than ${last.source_updated_at}, ignoring it`);
      return await finish(deps, {
        ok: true,
        source_changed: false,
        rows_changed: 0,
        stations_seen: stations.length,
        source_updated_at: last.source_updated_at,
        source_etag: last.source_etag,
        duration_ms: elapsed(),
        error: null,
      });
    }

    const saved = new Map((await deps.savedStations()).map((row) => [row.station_id, row]));
    const changedAt = deps.now().toISOString();

    // Names and locations aren't in the status file. That other file is big and
    // rarely changes, so it's fetched only when there's a station we don't know.
    const unknown = stations.filter((s) => !saved.has(s.station_id));
    let info = new Map<string, StationInfo>();
    if (unknown.length > 0) {
      deps.log(`info: ${unknown.length} new stations, fetching names and locations`);
      const infoResponse = await deps.fetchInfo();
      if (!infoResponse.ok) throw new Error(`Divvy station information returned HTTP ${infoResponse.status}`);
      info = parseInfo(await infoResponse.json());
    }

    const rows: StationRow[] = [];
    let skipped = 0;
    for (const station of stations) {
      const existing = saved.get(station.station_id);
      if (existing) {
        if (hasChanged(existing, station)) rows.push({ ...existing, ...station, changed_at: changedAt });
      } else {
        const details = info.get(station.station_id);
        if (details) rows.push({ ...details, ...station, changed_at: changedAt });
        else skipped += 1;
      }
    }
    if (skipped > 0) deps.log(`info: skipped ${skipped} stations with no name yet`);

    if (rows.length > 0) await deps.upsertStations(rows);
    deps.log(`save: ${rows.length} of ${stations.length} stations changed`);

    return await finish(deps, {
      ok: true,
      source_changed: true,
      rows_changed: rows.length,
      stations_seen: stations.length,
      source_updated_at: updatedAt,
      source_etag: etag,
      duration_ms: elapsed(),
      error: null,
    });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    deps.log(`failed: ${message}`);
    // No ETag on a failed run: the next run has to get the whole file again.
    return await finish(deps, {
      ok: false,
      source_changed: false,
      rows_changed: 0,
      stations_seen: null,
      source_updated_at: last?.source_updated_at ?? null,
      source_etag: null,
      duration_ms: elapsed(),
      error: message.slice(0, 500),
    });
  }
}

async function finish(deps: Deps, run: RunRecord): Promise<RunRecord> {
  await deps.recordRun(run);
  deps.log(`done: ok=${run.ok} rows_changed=${run.rows_changed} in ${run.duration_ms} ms`);
  return run;
}
