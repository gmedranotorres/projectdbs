// The rules behind the page's states, with times written out.
import assert from "node:assert/strict";
import { test } from "node:test";
import { classicBikes, formatAge, getFreshness, rowFromEvent } from "../lib/freshness.ts";

const NOW = Date.parse("2026-11-03T04:00:00Z");
const ago = (seconds: number) => new Date(NOW - seconds * 1000).toISOString();
const run = (ranSecondsAgo: number, ok = true, sourceSecondsAgo = ranSecondsAgo + 40) => ({
  ran_at: ago(ranSecondsAgo),
  ok,
  source_updated_at: ago(sourceSecondsAgo),
});
const state = (latestRun: ReturnType<typeof run> | null, lastGoodRun = latestRun, loaded = true) =>
  getFreshness({ loaded, latestRun, lastGoodRun, now: NOW });

test("loading until the first data arrives, even if a run is known", () => {
  assert.equal(state(run(5), run(5), false).state, "loading");
});

test("fresh when the worker ran recently and Divvy's data is recent", () => {
  const result = state(run(8));
  assert.equal(result.state, "fresh");
  assert.ok(result.state === "fresh" && result.checkedAgo === 8000);
});

test("still fresh at exactly 60 seconds; stale just after", () => {
  assert.equal(state(run(60)).state, "fresh");
  const late = state(run(61));
  assert.ok(late.state === "stale" && late.reason === "worker-late");
});

test("stale when the worker is fine but Divvy has stopped publishing", () => {
  const result = state(run(5, true, 301));
  assert.ok(result.state === "stale" && result.reason === "source-old");
  assert.equal(state(run(5, true, 299)).state, "fresh");
});

test("stale, not fresh, when there has never been a run", () => {
  const result = state(null);
  assert.ok(result.state === "stale" && result.reason === "no-runs");
});

test("down when the last run failed, keeping the age of the last good data", () => {
  const result = state(run(5, false), run(120));
  assert.ok(result.state === "down");
  assert.ok(result.state === "down" && result.dataAgo === 160_000);
});

test("down wins over stale: a failure is more specific than silence", () => {
  assert.equal(state(run(600, false), run(900)).state, "down");
});

test("back to fresh as soon as a run works again", () => {
  assert.equal(state(run(3), run(3)).state, "fresh");
});

test("ages read naturally", () => {
  assert.equal(formatAge(1000), "just now");
  assert.equal(formatAge(12_000), "12 seconds ago");
  assert.equal(formatAge(60_000), "1 minute ago");
  assert.equal(formatAge(200_000), "3 minutes ago");
  assert.equal(formatAge(3_700_000), "1 hour ago");
  assert.equal(formatAge(null), "an unknown time ago");
});

test("classic bikes are the bikes that aren't e-bikes", () => {
  assert.equal(classicBikes({ bikes: 5, ebikes: 3 }), 2);
  assert.equal(classicBikes({ bikes: 0, ebikes: 0 }), 0);
});

// A real event, captured when Realtime refused the page's subscription. It made
// the page say "down" while every run was succeeding.
test("a refused Realtime event isn't treated as a run", () => {
  const refused = { new: {}, errors: ["Error 401: Unauthorized"] };
  assert.equal(rowFromEvent<{ ran_at: string }>(refused, "ran_at"), null);
});

test("an event with no errors gives back its row", () => {
  const row = { ran_at: ago(1), ok: true };
  assert.deepEqual(rowFromEvent<typeof row>({ new: row, errors: null }, "ran_at"), row);
});

test("a failed run is still a row: ok: false must get through", () => {
  const row = { ran_at: ago(1), ok: false };
  const result = rowFromEvent<typeof row>({ new: row }, "ran_at");
  assert.equal(result?.ok, false);
});
