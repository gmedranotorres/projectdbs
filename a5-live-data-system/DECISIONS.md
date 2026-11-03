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
