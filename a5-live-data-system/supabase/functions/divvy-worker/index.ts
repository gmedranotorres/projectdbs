// The worker's connection to the real world: Divvy, and the database.
// Supabase Cron calls this every 10 seconds. What it decides is in worker.ts.
import { createClient } from "npm:@supabase/supabase-js@2";
import { runWorker, type StationRow } from "./worker.ts";

const STATUS_URL = "https://gbfs.lyft.com/gbfs/1.1/chi/en/station_status.json";
const INFO_URL = "https://gbfs.lyft.com/gbfs/1.1/chi/en/station_information.json";
const TIMEOUT_MS = 15_000;

// Supabase gives the function this key on its own servers. It's never in the code.
const secretKey = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")!)["default"];
const db = createClient(Deno.env.get("SUPABASE_URL")!, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const COLUMNS =
  "station_id,name,lat,lon,capacity,bikes,ebikes,docks,is_installed,is_renting,is_returning,changed_at";

// PostgREST returns at most 1,000 rows per request, and there are over 2,000.
async function savedStations(): Promise<StationRow[]> {
  const rows: StationRow[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db
      .from("divvy_stations")
      .select(COLUMNS)
      .order("station_id")
      .range(from, from + 999);
    if (error) throw new Error(`Reading stations failed: ${error.message}`);
    rows.push(...(data as StationRow[]));
    if (data.length < 1000) return rows;
  }
}

async function upsertStations(rows: StationRow[]) {
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await db.from("divvy_stations").upsert(rows.slice(i, i + 500));
    if (error) throw new Error(`Saving stations failed: ${error.message}`);
  }
}

Deno.serve(async (req) => {
  // Anyone on the internet can reach this URL, so only Cron's private token
  // starts a run. The token is kept in Supabase Vault.
  const token = req.headers.get("x-worker-token") ?? "";
  const { data: allowed, error: tokenError } = await db.rpc("worker_token_is_valid", { candidate: token });
  if (tokenError) {
    console.error(`token check failed: ${tokenError.message}`);
    return new Response("Unavailable", { status: 503 });
  }
  if (allowed !== true) return new Response("Unauthorized", { status: 401 });

  const run = await runWorker({
    fetchStatus: (etag) =>
      fetch(STATUS_URL, {
        headers: etag ? { "If-None-Match": etag } : {},
        signal: AbortSignal.timeout(TIMEOUT_MS),
      }),
    fetchInfo: () => fetch(INFO_URL, { signal: AbortSignal.timeout(TIMEOUT_MS) }),
    lastGoodRun: async () => {
      const { data, error } = await db
        .from("worker_runs")
        .select("source_etag,source_updated_at")
        .eq("ok", true)
        .order("ran_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(`Reading the last run failed: ${error.message}`);
      return data;
    },
    savedStations,
    upsertStations,
    recordRun: async (record) => {
      const { error } = await db.from("worker_runs").insert(record);
      if (error) throw new Error(`Recording the run failed: ${error.message}`);
    },
    now: () => new Date(),
    log: (line) => console.log(line),
  });

  return Response.json(run, { status: run.ok ? 200 : 502 });
});
