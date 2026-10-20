// WCAG contrast for every text/background pair the app draws, read from the
// tokens in app/globals.css, so a token change shows up here. The pairs were
// found by walking every page in Chrome (each visible piece of text, its
// color and the background behind it), including errors, hover and disabled.
// No packages.
//   npm run check:contrast             (a table; exits 1 if any pair fails)
//   npm run check:contrast -- --md     (the same table as Markdown, for the README)
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const root = css.match(/:root\s*{([\s\S]*?)\n}/)[1];
const raw = Object.fromEntries([...root.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
const token = (name) => {
  const v = raw[name];
  const ref = v?.match(/^var\(--([\w-]+)\)$/);
  if (ref) return token(ref[1]);
  if (!/^#[0-9a-f]{6}$/i.test(v ?? "")) throw new Error(`--${name} isn't a 6-digit hex color: ${v}`);
  return v.toLowerCase();
};

// Relative luminance and contrast ratio, as WCAG 2.2 defines them.
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [what, where, text or ring token, background token, minimum]
// Text is 4.5:1: almost all of it is 13 to 16px. Large text (24px, or
// 18.66px bold) and the focus ring are 3:1.
const pairs = [
  ["Body text", "pages, labels, headings", "ink", "bg", 4.5],
  ["Body text on a card", "cards, the header, the bottom bar, fields", "ink", "surface", 4.5],
  ["Body text on a tint", "Interviewing and new badges, pressed chips, the toast, hovered buttons, the current tab on a laptop", "ink", "accent-soft", 4.5],
  ["Body text on grey", "a nav link under the pointer on a laptop", "ink", "subtle", 4.5],
  ["Body text on the error tint", "the delete question", "ink", "error-soft", 4.5],
  ["Muted text", "descriptions, hints, the footer, the Closed badge, disabled buttons", "muted", "bg", 4.5],
  ["Muted text on a card", "roles, dates, field hints, nav labels on a phone", "muted", "surface", 4.5],
  ["Muted text on grey", "Quiet and date badges, the closed-application note", "muted", "subtle", 4.5],
  ["Muted text on a tint", "counts in a pressed chip", "muted", "accent-soft", 4.5],
  ["Links", "TextLink: ink text, underlined", "ink", "bg", 4.5],
  ["Links on a card", "TextLink inside a card", "ink", "surface", 4.5],
  ["Large headings", "the h1 (40 to 64px) and serif h2s (24px)", "ink", "bg", 3],
  ["Primary button label", "the one main action", "accent-ink", "accent", 4.5],
  ["Primary button label, under the pointer", "the one main action", "accent-ink", "accent-hover", 4.5],
  ["Badge: Applied, Followed up", "status", "ink", "surface", 4.5],
  ["Badge: Interviewing, new", "status, the row you just changed", "ink", "accent-soft", 4.5],
  ["Badge: Offer", "status", "surface", "ink", 4.5],
  ["Badge: Closed (on the page)", "status, dashed edge", "muted", "bg", 4.5],
  ["Badge: Closed (on a card)", "status, dashed edge", "muted", "surface", 4.5],
  ["Badge: Due, late", "follow-up dates", "late", "late-soft", 4.5],
  ["Badge: Quiet, dates", "gone quiet, plain dates", "muted", "subtle", 4.5],
  ["Error text", "field errors on the page", "error", "bg", 4.5],
  ["Error text on a card", "field errors inside a card (Move data, the check-in)", "error", "surface", 4.5],
  ["Danger button label", "Delete, at rest", "error", "bg", 4.5],
  ["Danger button label, under the pointer", "Delete", "error", "error-soft", 4.5],
  ["Placeholder text", "Link's https://", "muted", "surface", 4.5],
  ["Focus ring on the page", "2px ring, 2px from the control", "focus", "bg", 3],
  ["Focus ring on a card", "", "focus", "surface", 3],
  ["Focus ring on a tint", "inside the toast", "focus", "accent-soft", 3],
  ["Focus ring on the error tint", "inside the delete question", "focus", "error-soft", 3],
];

const rows = pairs.map(([what, where, fg, bg, min]) => {
  const r = ratio(token(fg), token(bg));
  // Rounded down, so 4.49 never shows as 4.5.
  return { what, where, fg, bg, min, r: Math.floor(r * 100) / 100, ok: r >= min };
});

if (process.argv.includes("--md")) {
  console.log("| Pair | Where | Text | Background | Ratio | Needs | Result |");
  console.log("| --- | --- | --- | --- | --- | --- | --- |");
  for (const x of rows)
    console.log(`| ${x.what} | ${x.where} | \`--${x.fg}\` ${token(x.fg)} | \`--${x.bg}\` ${token(x.bg)} | ${x.r.toFixed(2)}:1 | ${x.min}:1 | ${x.ok ? "✓ pass" : "✗ fail"} |`);
} else {
  for (const x of rows)
    console.log(`${x.ok ? "ok  " : "FAIL"} ${x.what.padEnd(42)} ${`--${x.fg}`.padEnd(14)} on ${`--${x.bg}`.padEnd(14)} ${x.r.toFixed(2).padStart(6)}:1  (needs ${x.min}:1)`);
}
const fails = rows.filter((x) => !x.ok).length;
if (!process.argv.includes("--md")) console.log(fails ? `\n${fails} pair(s) below the minimum.` : `\nAll ${rows.length} pairs pass.`);
process.exit(fails ? 1 : 0);
