import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanSocCode, normalizeName } from "./normalize.ts";

// Real spellings from the FY2025 Chicago filings.
const cases: [string, string][] = [
  ["Google LLC", "GOOGLE"],
  ["GOOGLE, L.L.C.", "GOOGLE"],
  ["Ernst & Young U.S. LLP", "ERNST AND YOUNG"],
  ["JPMorgan Chase & Co.", "JPMORGAN CHASE"],
  ["McDonald's Corporation", "MCDONALDS"],
  ["Capital One, National Association", "CAPITAL ONE"],
  ["Amazon.com Services LLC", "AMAZON SERVICES"],
  ["MCKINSEY & COMPANY, INC. UNITED STATES", "MCKINSEY"],
  ["The University of Chicago", "UNIVERSITY OF CHICAGO"],
  ["BMO Bank N.A.", "BMO BANK"],
  ["Bank of America, N.A.", "BANK OF AMERICA"],
  ["Deloitte Consulting LLP", "DELOITTE CONSULTING"],
];

for (const [raw, expected] of cases) {
  test(`normalizeName(${JSON.stringify(raw)})`, () => assert.equal(normalizeName(raw), expected));
}

test("cleanSocCode strips the Excel formula wrapper", () => {
  assert.equal(cleanSocCode('="15-2051.00"'), "15-2051.00");
  assert.equal(cleanSocCode("15-2051.01"), "15-2051.01");
});
