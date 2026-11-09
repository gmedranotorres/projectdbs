// Checks a plan file against context/plan-format.md before the harness says "saved".
// Usage: node scripts/check-plan.mjs plans/2026-11-10.json
import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) { console.error("Give a plan file, e.g. plans/2026-11-10.json"); process.exit(1); }

const problems = [];
let plan;
try { plan = JSON.parse(readFileSync(file, "utf8")); }
catch (e) { console.error(`Not valid JSON: ${e.message}`); process.exit(1); }

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;
const KINDS = ["work", "class", "meal", "travel", "study", "buffer", "break"];
const COURSES = ["dbs", "micro", "clinic"];
const mins = (t) => +t.slice(0, 2) * 60 + +t.slice(3);

if (!/^\d{4}-\d{2}-\d{2}$/.test(plan.date ?? "")) problems.push("date must be YYYY-MM-DD");
if (!file.endsWith(`${plan.date}.json`)) problems.push(`file name should be plans/${plan.date}.json`);
if (!plan.saved_at || isNaN(Date.parse(plan.saved_at))) problems.push("saved_at must be an ISO time");
if (!Array.isArray(plan.blocks) || !plan.blocks.length) problems.push("blocks must be a non-empty list");

let prevEnd = -1;
for (const [i, b] of (plan.blocks ?? []).entries()) {
  const at = `block ${i + 1} (${b.title ?? "untitled"})`;
  if (!HHMM.test(b.start ?? "") || !HHMM.test(b.end ?? "")) { problems.push(`${at}: start and end must be HH:MM`); continue; }
  if (mins(b.end) <= mins(b.start)) problems.push(`${at}: ends before it starts`);
  if (mins(b.start) < prevEnd) problems.push(`${at}: overlaps the block before it`);
  if (mins(b.end) > 21 * 60) problems.push(`${at}: ends after 21:00`);
  if (!KINDS.includes(b.kind)) problems.push(`${at}: kind must be one of ${KINDS.join(", ")}`);
  if (b.course && !COURSES.includes(b.course)) problems.push(`${at}: course must be one of ${COURSES.join(", ")}`);
  if (!b.title) problems.push(`${at}: needs a title`);
  if ((b.kind === "work" || b.kind === "study") && !b.outcome) problems.push(`${at}: work and study blocks need an outcome`);
  prevEnd = Math.max(prevEnd, mins(b.end));
}

// Privacy: words that point to her home must never reach a plan. They're listed on the
// "Never mention:" line of context/commute.md, which is gitignored, so they stay out of the repo too.
let privateWords = [];
try {
  const line = readFileSync(new URL("../context/commute.md", import.meta.url), "utf8").match(/^Never mention:(.*)$/m);
  privateWords = (line?.[1] ?? "").split(",").map((w) => w.trim().toLowerCase()).filter(Boolean);
} catch { /* no commute file on this machine */ }
if (!privateWords.length) problems.push('context/commute.md has no "Never mention:" line, so the privacy check can\'t run');
const text = JSON.stringify(plan).toLowerCase();
for (const word of privateWords) {
  if (text.includes(word)) problems.push(`mentions a private word ("${word}"): her home and nearby stations stay out of plans`);
}

if (problems.length) { console.error(`${file}: ${problems.length} problem(s)\n- ${problems.join("\n- ")}`); process.exit(1); }
console.log(`${file}: OK (${plan.blocks.length} blocks)`);
