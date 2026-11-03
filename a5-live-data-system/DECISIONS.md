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
