# Patrocinio: plan for v2

**v1:** https://projectdbs-patrociniov1.vercel.app · data jobs in Chicago · 615 employers with 1,529 certified visa filings (FY2025), and 118 open jobs at the 20 of them whose job boards we found.

## What I saw when people used v1

I gave four people the same task over video calls: *"Find two employers you'd apply to, and open one job post. Think out loud. I won't help."*

| Who | Time | Got stuck at | What they said | Would use it? |
|---|---|---|---|---|
| 1. Peruvian, finished a US master's, applied to US jobs while in the US | 6 min | Changing Field and City | "Veo todo muy desordenado, se debería poder filtrar por más opciones." *(It all looks messy; I should be able to filter by more options.)* | No |
| 2. Peruvian, applied to US jobs while working in the US for 6 months | 5 min | Search an employer | "Me gustaría … filtrar por junior, senior, etc." *(I'd like to filter by junior, senior, etc.)* | No |
| 3. Peruvian in Peru, no US master's, applying to US jobs | 8 min | Search an employer | "No conozco las compañías, por eso me es complicado elegir por compañía." *(I don't know the companies, so choosing by company is hard.)* | No |
| 4. Japanese, applying to US jobs now | 7 min | Field | "I would like to see the Fields, it just says Data Roles." | Yes, with more fields |

Person 3 is applying from abroad, which v1 doesn't serve, so I weigh their answers less. Person 4 is the only one searching in the US right now, which is the user this is for.

**What worked:** all four read the warning that a filing doesn't promise sponsorship, and three of four opened the filings behind an employer. People want to see the evidence.

**What didn't:**
- **The page is organized around employers, and people think in jobs.** They don't know most of the companies, so "search an employer" asks for something they don't have.
- **There's no way to narrow the list to their level.**
- **One field isn't enough.**
- **3 of 4 wouldn't use it.** That answers a question from my proposal: a list of sponsors alone isn't enough.

**Fixed the same day:** two of four got stuck on the Field and City dropdowns. They were locked, but they still looked clickable. They're now a plain sentence ("Showing data jobs in Chicago, IL · the only field and city for now"), along with a list of which roles count as data jobs.

## What I'll change first

1. **Lead with jobs, not employers.** The main list becomes open jobs. Each one has a badge like "This employer filed 16 visas for data roles in 2025," and the filings are one click away. *Why:* "No conozco las compañías." People choose jobs, and the filings should be the evidence on each one.
2. **Filter by level: entry, mid, senior.** Each filing has a prevailing wage level from I to IV, a seniority signal I already have, and job titles carry words like "Senior" or "Associate." *Why:* person 2 asked for it, and "desordenado" (messy) is what a long list with no filters feels like.
3. **Field and city that work, or are shown honestly.** Whatever the page offers must be something you can actually change. *Why:* two of four got stuck there.

## What I'll add

4. **More fields:** software engineering, finance and consulting first. The Chicago extract already has every occupation (10,385 filings), so a new field is a new rule in `lib/roles.ts` and a rebuild. *Why:* person 4 would use it with more fields, and person 1 asked for more options.
5. **More jobs, kept current by a background worker.** A scheduled job (Supabase Cron, as in Assignment 5) reruns job board discovery, stores jobs in Supabase, and shows when they were last checked. It also checks each board's company name, so wrong guesses are dropped: today, "The Leland Stanford Jr University" finds a board called `leland`. *Why:* only 20 of 615 employers show jobs. Large employers like Google show filings and no jobs, which reads as "not hiring."

## What waits

- **Sign-up and saved jobs.** No one asked for it yet, and it adds a step before the core task.
- **Other cities, wage amounts, and a link to save jobs in Seguimiento.**
- **People applying from abroad.** Visa filings can't answer whether a job is remote-friendly.

## Systems notes from building v1

- **The jobs source in my proposal, The Muse API, is gone.** It answered 403 to servers and "We couldn't find that page" in a browser. v1 switched to finding each employer's own job board on Greenhouse, Lever and Ashby: free public APIs that a server can reach.
- **The DOL files are messy.** Some cells are Excel formulas (`="15-2051.00"`), some city cells are numbers, and some employers file consulting titles under data codes. The pipeline cleans the first two. The third is why the level and field rules need care.
- **Name normalization is tested on real spellings** (`lib/normalize.test.ts`): "Ernst & Young U.S. LLP", "JPMorgan Chase & Co.", "Capital One, National Association".

## How I'll know v2 works

By December 1, I'll run the same task with at least three international students searching in the US now. Success: most finish in under 5 minutes without getting stuck, and at least two say they'd use it. The goal from my proposal still stands: 5 students sign up, and 3 apply to an employer they hadn't considered before.
