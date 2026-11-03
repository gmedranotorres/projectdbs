// Runs the real worker logic on saved copies of Divvy's responses (Nov 2, 2026,
// 244 seconds apart), with a pretend database, and checks what it saves.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, test } from "node:test";
import {
  runWorker,
  type Deps,
  type LastGoodRun,
  type RunRecord,
  type StationRow,
} from "../supabase/functions/divvy-worker/worker.ts";

const fixture = (name: string) =>
  JSON.parse(readFileSync(new URL(`./fixtures/${name}.json`, import.meta.url), "utf8"));

const before = fixture("station_status_before");
const after = fixture("station_status_after");
const information = fixture("station_information");
const expected: { changed: string[]; reportedOnly: string[]; identical: string[] } = fixture("expected");

const json = (body: unknown, etag = '"etag-1"') =>
  new Response(JSON.stringify(body), { status: 200, headers: { etag } });

// A pretend database and Divvy, which remember what the worker did to them.
function setup(options: {
  status: Response | (() => Response);
  info?: Response;
  saved?: StationRow[];
  last?: LastGoodRun | null;
  failUpsert?: boolean;
}) {
  const upserted: StationRow[][] = [];
  const runs: RunRecord[] = [];
  const asked: (string | null)[] = [];
  let infoCalls = 0;

  const deps: Deps = {
    fetchStatus: async (etag) => {
      asked.push(etag);
      return typeof options.status === "function" ? options.status() : options.status;
    },
    fetchInfo: async () => {
      infoCalls += 1;
      return options.info ?? json(information);
    },
    lastGoodRun: async () => options.last ?? null,
    savedStations: async () => options.saved ?? [],
    upsertStations: async (rows) => {
      if (options.failUpsert) throw new Error("Saving stations failed: database is unavailable");
      upserted.push(rows);
    },
    recordRun: async (run) => void runs.push(run),
    now: () => new Date("2026-11-03T02:30:00Z"),
    log: () => {},
  };
  return { deps, upserted, runs, asked, infoCalls: () => infoCalls };
}

// What the database holds after a successful first run on the "before" file.
async function savedAfterFirstRun() {
  const first = setup({ status: json(before) });
  await runWorker(first.deps);
  return first.upserted.flat();
}

describe("a normal run", () => {
  test("the first run saves every station, with its name from the information file", async () => {
    const { deps, upserted, runs, infoCalls } = setup({ status: json(before) });
    await runWorker(deps);

    const rows = upserted.flat();
    assert.equal(rows.length, before.data.stations.length);
    assert.equal(infoCalls(), 1);
    assert.ok(rows.some((r) => r.name === "Woodlawn Ave & Lake Park Ave"));
    assert.equal(runs[0].ok, true);
    assert.equal(runs[0].rows_changed, before.data.stations.length);
  });

  test("the next file saves only the stations whose availability changed", async () => {
    const saved = await savedAfterFirstRun();
    const { deps, upserted, runs, infoCalls } = setup({ status: json(after, '"etag-2"'), saved });
    await runWorker(deps);

    const rows = upserted.flat();
    assert.deepEqual(rows.map((r) => r.station_id).sort(), [...expected.changed].sort());
    assert.equal(infoCalls(), 0, "known stations don't need the big information file");

    // One real change, checked by hand against the two saved files.
    const woodlawn = rows.find((r) => r.name === "Woodlawn Ave & Lake Park Ave")!;
    assert.equal(woodlawn.bikes, 4);
    assert.equal(woodlawn.ebikes, 4);

    assert.equal(runs[0].rows_changed, expected.changed.length);
    assert.equal(runs[0].source_etag, '"etag-2"');
    assert.equal(runs[0].source_updated_at, new Date(after.last_updated * 1000).toISOString());
  });

  test("a station where only last_reported moved isn't saved", async () => {
    const saved = await savedAfterFirstRun();
    for (const id of expected.reportedOnly) {
      const a = before.data.stations.find((s: { station_id: string }) => s.station_id === id);
      const b = after.data.stations.find((s: { station_id: string }) => s.station_id === id);
      assert.notEqual(a.last_reported, b.last_reported, "the saved files should show last_reported moving");
    }
    const { deps, upserted } = setup({ status: json(after), saved });
    await runWorker(deps);

    const ids = upserted.flat().map((r) => r.station_id);
    for (const id of [...expected.reportedOnly, ...expected.identical]) assert.ok(!ids.includes(id));
  });

  test("the same file twice saves nothing, but still records the run", async () => {
    const saved = await savedAfterFirstRun();
    const { deps, upserted, runs } = setup({ status: json(before), saved });
    await runWorker(deps);

    assert.equal(upserted.length, 0);
    assert.equal(runs.length, 1);
    assert.equal(runs[0].ok, true);
    assert.equal(runs[0].rows_changed, 0);
  });
});

describe("when Divvy has nothing new", () => {
  test("it sends the last ETag, and a 304 saves nothing and keeps the freshness", async () => {
    const last = { source_etag: '"etag-1"', source_updated_at: "2026-11-03T02:29:00.000Z" };
    const { deps, upserted, runs, asked } = setup({ status: new Response(null, { status: 304 }), last });
    await runWorker(deps);

    assert.deepEqual(asked, ['"etag-1"']);
    assert.equal(upserted.length, 0);
    assert.equal(runs[0].ok, true);
    assert.equal(runs[0].source_changed, false);
    assert.equal(runs[0].source_etag, '"etag-1"');
    assert.equal(runs[0].source_updated_at, last.source_updated_at);
  });

  test("an older copy from the CDN doesn't move the numbers backwards", async () => {
    const saved = await savedAfterFirstRun();
    const newer = new Date((after.last_updated + 600) * 1000).toISOString();
    const { deps, upserted, runs } = setup({
      status: json(after),
      saved,
      last: { source_etag: '"etag-9"', source_updated_at: newer },
    });
    await runWorker(deps);

    assert.equal(upserted.length, 0);
    assert.equal(runs[0].ok, true);
    assert.equal(runs[0].source_updated_at, newer);
  });
});

describe("when something goes wrong, it saves nothing and records a failed run", () => {
  const renamed = () => {
    const copy = structuredClone(after);
    delete copy.data.stations[3].num_bikes_available;
    copy.data.stations[3].bikes_available = 5;
    return copy;
  };

  const failures: [string, () => Response, RegExp][] = [
    ["a field is renamed on one station", () => json(renamed()), /Source shape changed: station/],
    ["the station list is missing", () => json({ last_updated: after.last_updated }), /data\.stations/],
    ["the timestamp is missing", () => json({ data: after.data }), /last_updated/],
    ["Divvy returns a server error", () => new Response("oops", { status: 500 }), /HTTP 500/],
    ["the response isn't JSON", () => new Response("<html>", { status: 200 }), /JSON/],
  ];

  for (const [name, status, message] of failures) {
    test(name, async () => {
      const saved = await savedAfterFirstRun();
      const { deps, upserted, runs } = setup({ status, saved });
      await runWorker(deps);

      assert.equal(upserted.length, 0);
      assert.equal(runs[0].ok, false);
      assert.match(runs[0].error!, message);
    });
  }

  test("a failed save records no ETag, so the next run gets the whole file again", async () => {
    const saved = await savedAfterFirstRun();
    const { deps, runs } = setup({ status: json(after, '"etag-2"'), saved, failUpsert: true });
    await runWorker(deps);

    assert.equal(runs[0].ok, false);
    assert.equal(runs[0].source_etag, null);
    assert.match(runs[0].error!, /database is unavailable/);
  });
});
