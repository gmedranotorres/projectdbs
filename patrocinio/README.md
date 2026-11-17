# Patrocinio (v1)

International students searching for US jobs can't tell which ones are open to them. Patrocinio shows which Chicago employers have filed for visas for data roles, and which of those employers are hiring now.

**Core task:** choose a field and a city (v1: data roles in Chicago), see the employers that filed for visas with the filings behind each one, and open their current job posts.

Live site: https://projectdbs-patrociniov1.vercel.app

Plan for v2, from testing v1 with four people: [V2_PLAN.md](V2_PLAN.md)

## How the data moves

```
DOL visa filings (4 × .xlsx, 420 MB, FY2025)
   │  scripts/extract_filings.py      keeps Chicago, IL rows (10,385 of 2.4M)
   ▼
data/chicago_filings.csv  (not in git)
   │  scripts/build_employers.ts      certified + data roles, grouped by normalized name
   ▼
data/employers.json  (1,529 filings → 615 employers, in git)
   │  scripts/fetch_jobs.ts           guesses each employer's job board on
   │                                  Greenhouse, Lever and Ashby (public APIs, no key),
   │                                  keeps jobs in Chicago with a data title
   ▼
data/jobs.json  (79 boards found → 20 employers hiring, 118 jobs, Nov 17 2026)
   ▼
lib/results.ts  joins jobs to employers  →  app/page.tsx
```

## Rules that decide what you see

- **Filings counted:** `Certified` and `Certified - Withdrawn`. Denied and withdrawn filings are left out. See `lib/roles.ts`.
- **Data roles:** SOC codes 15-2051 (Data Scientists, BI Analysts), 15-2041 (Statisticians), 15-2031 (Operations Research Analysts), 15-1243 (Database Architects, Data Warehousing). Also any job title with "data", "analytics", "machine learning", "business intelligence" or "statistic".
- **City:** the filing's main worksite is Chicago, IL. Suburbs are not included yet.
- **Employer names** (`lib/normalize.ts`): upper-cased, with punctuation and legal endings (LLC, Inc., N.A., U.S., & Co.…) removed, so "Google LLC" and "GOOGLE, L.L.C." group together.
- **Finding job boards** (`scripts/fetch_jobs.ts`): for "CHIME FINANCIAL" it tries `chimefinancial`, `chime-financial`, and then the first word, `chime`, on each service. A first-word guess is only tried for distinctive words (not "American", "University"…), and the page labels it so people can check it's the same company.
- **Jobs shown:** location includes Chicago, and the title is data work (data, analytics, analyst, scientist, ML, BI…).
- `lib/match.ts` matches a job post's company name to filing employers (exact or prefix). It isn't used by the v1 page; it's ready for an aggregator jobs source in v2.

## Known data problems found along the way

- Some cells arrive as Excel formulas (`="15-2051.00"`, `="Lead Business Intelligence Engineer"`), so the same occupation appeared twice until cleaned.
- Some city cells are numbers, not text.
- Some employers file consulting titles under data codes (Deloitte's top titles are "Consultant" and "Manager"), so the code rule lets in some roles that aren't data jobs.
- **The Muse API, the jobs source in the proposal, is gone.** On Nov 17, 2026 it answered 403 to servers and "We couldn't find that page" in a browser. v1 switched to employers' own job boards.
- **Board guessing finds wrong companies, too.** The first word of "The Leland Stanford, Jr University" found an Ashby board called `leland`, and Charles Schwab found `charles`. None of these had Chicago data jobs, so none reach the page, but a check of the board's company name is needed before this scales.
- **Coverage:** 79 boards for 615 employers. Large employers (Google, JPMorgan, Deloitte) use their own careers sites, so they show filings but no jobs.

## Run it

```bash
npm install
npm test          # name normalizer and matcher tests
npm run dev       # http://localhost:3000
```

Rebuild the data (download the FY2025 LCA disclosure files from dol.gov → Foreign Labor Certification → Performance Data → Disclosure Data):

```bash
python3 scripts/extract_filings.py path/to/LCA_Disclosure_Data_FY2025_Q*.xlsx > data/chicago_filings.csv
node scripts/build_employers.ts
```

Refresh the jobs (about 2 minutes, ~5,000 small requests at 12 at a time):

```bash
node scripts/fetch_jobs.ts
```

## Security

- No API keys: the Greenhouse, Lever and Ashby job-board APIs are public, and the site calls nothing at runtime.
- `.env*` is git-ignored, and `.claude/settings.json` denies agents access to `.env` files.
- No database or user accounts in v1, so there is no row-level security to set up yet. It arrives with Supabase in v2.

A filing doesn't promise sponsorship, and this is not legal advice.
