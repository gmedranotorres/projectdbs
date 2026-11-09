# Decisions: Assignment 6

## Round 1: data sources (Nov 8 to 9, 2026)

**What I asked.** Help with Assignment 6. I chose weather and Divvy as the two sources, and Next.js with Tailwind for the page. Then I gave Claude my three syllabi (Design, Build, Ship; Micro; Data Science Clinic) to build my deadlines from.

**What changed.**
- `scripts/weather.mjs` (Open-Meteo) and `scripts/divvy.mjs` (Divvy GBFS, by name or `--near` a point). Both are free, need no key, and only read.
- `data/courses.json`: classes, TA sessions, office hours, weekly cycles and deadlines from the syllabi, plus my sections and meeting times.

**What I rejected or decided myself.**
- **Added a course file to weather and Divvy.** Without a calendar, the plan has nothing to plan around, and the hook test ("move an event") has no event.
- **Celsius and km/h.** That's how I think about weather.
- **Clinic dates are marked `estimated`.** The clinic site gives week numbers only; Canvas has the real dates. One estimate lands on Thanksgiving Friday, so I'll check them.
- **Kept only what planning needs** from the syllabi: no teaching-team emails, links or grading tables, except the rules that change a plan (late penalties, extension days, the Micro AI policy).

**Mistakes to record.**
- Claude first put my home landmark a few blocks off. The station search and walking times were redone.
- Before the first commit, three files had my home area in them: this file, the validator's word list, and an example in the Divvy script. They were fixed before anything was committed. The word list now lives in the gitignored commute file.
- A shell loop returned no stations because zsh doesn't split words in `$p`. The script was fine.

## Round 2: interview and context (Nov 9, 2026)

**What I asked.** The interview from the brief, one question at a time: my courses, sections, commute, how I like to plan, what the harness should never do, and where my work stands.

**What changed.** `AGENTS.md` (about 30 lines, loads every session); `context/planning.md`, `context/commute.md`, `context/data-sources.md` (read when needed); `notes/state.md` and `notes/log.md` (the harness's memory).

**What I rejected or decided myself.**
- **Walk by default; bike only at 20°C or more, rain under 20%, wind under 20 km/h,** on the way there and back. In November that will almost never pass, and that's fine.
- **Move to mornings gradually:** 15 minutes earlier after 3 check-ins on target, from 8:45 to 7:30. A late check-in is noted neutrally and the rest of the day is replanned.
- **Ranking:** no-make-up items first, then deadlines in 72 hours, then the weekly clinic cycle, then long projects. Nothing after 21:00, so a 23:59 deadline means done by 21:00.
- **Never:** change data or write to Canvas, GitHub, Slack, email or a calendar; send anything; write Micro answers or prose (the Micro AI policy); spend an extension day.
- **My home location stays in `context/commute.md`, which is gitignored.**
- Corrected: the clinic mentor meeting is Thursday, not Wednesday.

## Round 3: check-in, page and hook (Nov 9, 2026)

**What I asked.** Build the morning check-in skill, the page, and the hook.

**What changed.**
- `.claude/skills/morning-check-in/SKILL.md`: read, a short read of the day, one or two questions, a proposed plan, and saving only after a yes.
- `context/plan-format.md` and `scripts/check-plan.mjs`, which the skill must pass before it says "saved." It rejects overlaps, anything after 21:00, work blocks without an outcome, and any mention of my home area.
- The page (`app/`): reads the newest file in `plans/`, checks every 2 seconds, and marks the current block. Tested with a sample plan: it showed a change within 2 seconds, with no reload. The sample plan was deleted.
- `.claude/hooks/protect-data.mjs` in `.claude/settings.json`: blocks Edit and Write on `data/`, shell commands that could change it, and calendar, email or Slack connector writes. Tested with 21 cases, blocked and allowed.

**What I rejected or decided myself.**
- **`agentRules: false` in next.config.ts.** `next dev` added a block of Next.js coding rules to AGENTS.md, which would load in every morning check-in.
- **The hook fails closed.** A crashed hook exits with 1, which Claude Code treats as "allow." If it can't read the tool call, it blocks.
- **Plain `>` isn't a write.** Matching it blocked harmless reads like `2>/dev/null` and `=>`, so only redirects into `data/` count.
- **The validator is a script, not a rule in the prompt.** Claude decides the plan. The script enforces the shape and the privacy rule.
