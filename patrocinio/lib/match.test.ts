import { test } from "node:test";
import assert from "node:assert/strict";
import { buildIndex, matchCompany } from "./match.ts";
import { normalizeName } from "./normalize.ts";

const index = buildIndex([
  "Google LLC", "Deloitte Consulting LLP", "Deloitte & Touche LLP", "JPMorgan Chase & Co.",
  "American Airlines, Inc.", "American Express Company", "University of Chicago",
].map(normalizeName));

const keys = (company: string) => matchCompany(company, index).map((m) => `${m.kind}:${m.key}`);

test("exact match after normalizing", () => {
  assert.deepEqual(keys("Google"), ["exact:GOOGLE"]);
});

test("a short brand name finds every legal entity behind it", () => {
  assert.deepEqual(keys("Deloitte").sort(), ["prefix:DELOITTE AND TOUCHE", "prefix:DELOITTE CONSULTING"]);
});

test("a longer job-post name finds the shorter filing name", () => {
  assert.deepEqual(keys("JPMorgan Chase Bank"), ["prefix:JPMORGAN CHASE"]);
});

test("a generic first word does not match everything that starts with it", () => {
  assert.deepEqual(keys("American"), []);
  assert.deepEqual(keys("University"), []);
});

test("no match returns nothing", () => {
  assert.deepEqual(keys("Some Startup"), []);
});
