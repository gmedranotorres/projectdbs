// One name normalizer, shared by the filings pipeline (scripts/build_employers.ts)
// and the job matcher (lib/match.ts), so both sides compare names the same way.
//
// "Google LLC", "GOOGLE, L.L.C." and "Google" all become "GOOGLE".
// Cases found by hand in the FY2025 Chicago filings are in lib/normalize.test.ts.

// Legal-form words that say nothing about which company it is.
const SUFFIXES = new Set([
  "LLC", "INC", "INCORPORATED", "CORP", "CORPORATION", "CO", "COMPANY",
  "LTD", "LIMITED", "LP", "LLP", "PLLC", "PC", "PLC", "NA", "HOLDINGS",
  "USA", "US", "AMERICAS", "AND",
]);
// Multi-word endings, checked before single words.
const SUFFIX_PHRASES = [["NATIONAL", "ASSOCIATION"], ["UNITED", "STATES"]];

export function normalizeName(raw: string): string {
  let s = raw.toUpperCase();
  s = s.replace(/['’]/g, "");                  // McDonald's -> MCDONALDS
  s = s.replace(/\.COM\b/g, " ");              // Amazon.com -> AMAZON
  s = s.replace(/\bU\.S\.(A\.)?/g, " US ");    // Ernst & Young U.S. -> US (then stripped)
  s = s.replace(/\bL\.L\.C\.?|\bL\.L\.P\.?|\bL\.P\.?|\bN\.A\.?/g, (m) => m.replace(/\./g, ""));
  s = s.replace(/&/g, " AND ");
  s = s.replace(/\([^)]*\)/g, " ");            // "(USA)", "(Chicago)"
  s = s.replace(/[^A-Z0-9 ]+/g, " ");
  const words = s.split(/\s+/).filter(Boolean);
  if (words[0] === "THE" && words.length > 1) words.shift();
  // Strip legal-form words from the end only: "CO" in the middle can be part of a name.
  let changed = true;
  while (changed && words.length > 1) {
    changed = false;
    for (const phrase of SUFFIX_PHRASES) {
      const tail = words.slice(-phrase.length);
      if (words.length > phrase.length && tail.join(" ") === phrase.join(" ")) {
        words.splice(-phrase.length);
        changed = true;
      }
    }
    if (words.length > 1 && SUFFIXES.has(words[words.length - 1])) {
      words.pop();
      changed = true;
    }
  }
  return words.join(" ");
}

// The SOC code sometimes arrives as an Excel formula: ="15-2051.00"
export function cleanSocCode(raw: string): string {
  return raw.replace(/[="]/g, "").trim();
}
