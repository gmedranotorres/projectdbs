# Decisions: Assignment 5

## Round 1: source and data flow (Nov 2, 2026)

**What I asked.** Help with Assignment 5. I chose Divvy as the source, a new app in this folder, and the Assignment 4 Supabase project.

**What changed.** Called five sources twice, 4 minutes apart, then sampled Divvy every 15 seconds for 10 minutes. Drew the data flow chart (docs/data-flow.svg) and wrote the walkthrough (docs/data-flow.md), before any code. Added a root .mcp.json so the Supabase tools load when Claude Code starts in the repository root.

**What I rejected or decided myself.**
- **Divvy over ESPN and MBTA.** ESPN goes quiet when no games are on. Nearly every MBTA train moves on every call, which is the opposite of "save only what changed".
- **New app, not Seguimiento.** Bike data has nothing to do with job applications, and the Assignment 4 site stays as graded.
- **Same Supabase project.** Clerk and the MCP server already work, and the deadline is tomorrow. The trade-off is accepted: the worker's secret key could technically reach Seguimiento's rows, and both apps share the free-tier limits.
- **Every 10 seconds, with ETags.** Divvy only publishes every 60 seconds, so most runs get a 304 and download nothing. The page finds out within seconds of a new file, without pulling 760 KB six times a minute.
- **`last_reported` isn't a change.** It changed at 1,147 stations in the test, against 131 real availability changes.

**A mistake to record.** While reading Assignment 4's setup, Claude opened a4-full-stack-app/.env.local with `sed` to list the variable names, before it had read the rule against that. The values were replaced in the output, so no key was printed. The deny rule in .claude/settings.json only covers the Read tool, not the shell, so AGENTS.md here now says "with any tool, including the shell".

## Round 2: the worker (Nov 2, 2026)

**What I asked.** Continue with Step 4: build the worker, deploy it, call it once and watch the rows change, with a test on a saved copy of the source's response.

**What changed.**
- Three tables (divvy_stations, worker_runs, followed_stations), with row-level security, and pg_cron and pg_net turned on.
- The `divvy-worker` Edge Function. `worker.ts` makes the decisions and has no network or Supabase code, so the test runs the real logic. `index.ts` connects it to Divvy and the database.
- `tests/worker.test.ts`: 12 tests on saved Divvy responses from Nov 2, with a pretend database.
- Three calls by hand: 2,079 rows on the first fill, 0 on a 304 (116 ms), then 58 of 2,079 on a new file.

**What I rejected or decided myself.**
- **A private token for the worker.** Secret keys aren't JWTs, so Supabase's built-in JWT check can't be used here, and the URL is public. Calls without the token get a 401 (tested with no token and a wrong one). The token is generated inside the database and kept in Vault, so it isn't in code, logs or this conversation.
- **Broke the worker three ways to check the tests.** Rewriting every station failed 3 tests, skipping a shape check failed 1, and never sending the ETag failed 1. The worker was restored and all 12 pass.
- **Station names aren't refreshed.** The information file is fetched only when an unknown station appears, so a renamed station keeps its old name.
- **Advisor warnings about `rls_auto_enable()` left alone,** as in Assignment 4: that function came with the project. The new tables and function added no warnings.

## Round 3: the schedule (Nov 2, 2026)

**What I asked.** Schedule the worker every 10 seconds. An earlier attempt was declined, so Claude asked, and I chose 10 seconds over 30.

**What changed.** Supabase Cron now calls the worker every 10 seconds. In the first minute and a half: 8 runs, all successful, with rows changed going 95, then 0 six times (304s), then 24 when Divvy's next file came out.

**What I rejected or decided myself.**
- **The cleanup job was split out.** The migration with both jobs was declined twice, once before and once after I approved it. The worker's job alone went through, which suggests the DELETE statements trigger Supabase's confirmation for destructive SQL. That's a likely cause, not a confirmed one. Claude didn't hide the DELETEs to get past the check. The SQL is in supabase/prune-worker-history.sql, to run in the SQL editor.

## Round 4: the live page (Nov 2, 2026)

**What I asked.** Continue with Step 5: the live page, with follows, freshness and each state.

**What changed.** A new Next.js app. One signed-in page: your stations, a status bar, and search to add more, with four real stations near campus as a starting point. Realtime pushes each run and each change to a followed station. Tests: 25 in Node (the worker and the freshness rules) and 3 in Playwright with the real database (isolation, updates without a refresh, reconnecting).

**What went wrong, and what it taught me.**
- **The page said "down" while every run was succeeding.** The Playwright test caught it. Logging the events showed `{"new":{},"errors":["Error 401: Unauthorized"]}`. The page subscribed before Clerk's token was ready, so Realtime treated it as anonymous, and anon has no read access. And my code read that empty row as a failed run. Fixed both: wait for the token, and never treat a refused event as data. A regression test uses the real event.
- **Nobody could follow a station.** Supabase's logs said `infinite recursion detected in policy`: my policy counted rows in the table it protected. The cap moved to a trigger. I had only checked the policy by reading it; it took a real signed-in user to find this.
- **Realtime dropped once, with the Mac awake, and I don't know why.** At 22:01 both channels closed and never came back, leaving the page on its 30-second backup check. A later 400-second run had no drops, so I couldn't reproduce it. The page now rejoins whenever a channel closes, whatever the cause, and a test cuts the connection and checks that Realtime comes back. A socket close at 22:05 came from closing the laptop lid, 5 seconds before it went to sleep.
- **Screenshots found what the tests didn't.** The highlight on a changed card never showed (two classes fighting over the background), and the status bar scrolled away, so someone could read old numbers without seeing the warning.

**How each state was tested, on the real system with a browser open.**
- **Down:** inserted one failed run, labeled as a test. The page showed "Not updating" within a second and recovered 4 seconds later at the next real run. That row stays in worker_runs until the 7-day cleanup removes it.
- **Stale:** paused the Cron job. The page showed "Out of date" at 60 seconds with no event to trigger it, and returned to Live when the job resumed.
- **Fresh:** a real change at Wells St & Hubbard St arrived with no refresh.
- **Security:** tried, as a signed-in person, to read and delete another person's follows, follow as them, edit stations, fake a run, TRUNCATE, check worker tokens, and pass the cap. All were refused.

**What I rejected or decided myself.**
- **Classic bikes and e-bikes are shown separately.** Divvy's bike count includes e-bikes, so three plain numbers would have counted some bikes twice.
- **In development only, /?simulate=stale (or down, or loading) shows a state,** so each can be looked at without stopping the worker.
- **The 60-second and 5-minute limits** come from the measurements: 6 missed runs, and several missed Divvy files.
- **Known limit:** ages compare the database's time with the device's clock, so a device with a clock over a minute off could show stale when it isn't.
