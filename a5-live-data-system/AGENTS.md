# AGENTS.md: Live Data System (Design, Build, Ship · Assignment 5)

Estaciones (working name): signed-in people follow the Divvy bike stations they use and watch bikes and docks change without refreshing. The user is Gabriela, a grad student in Chicago; her classmates are the audience. The plan is in docs/data-flow.md: read it before changing how data moves.

## Project rules

- Stack: Next.js (App Router, TypeScript) and Tailwind, Clerk for sign-in, Supabase for the database, Realtime and the worker (an Edge Function run by Supabase Cron), deployed on Vercel. New packages are limited to Clerk's, Supabase's and Playwright's; ask first if you think another is needed.
- Supabase project: the same one as Assignment 4, reached through the MCP server in .mcp.json. Don't touch the applications or user_settings tables: Seguimiento uses them.
- The Edge Function runs on Deno, so `supabase` stays in the exclude list in tsconfig.json.
- Components and tokens: Calm, copied from ../a4-full-stack-app, never imported across folders at runtime. No one-off styles.
- Accessibility: everything works with the keyboard, focus is visible, text contrast is at least 4.5:1. Live changes are announced politely with aria-live, and motion respects prefers-reduced-motion. A state is never shown by color alone.
- No invented content. Station data comes only from Divvy.
- Change only what I ask for.
- After each round: run npm run build and fix errors; add an entry to DECISIONS.md (what I asked, what changed, what I rejected or decided myself); commit with a message starting "A5:"; push.

## Data model

Three new tables. Migrations are in supabase/migrations/.

- **divvy_stations**: one row per station. Only the worker writes. Any signed-in person reads. In Realtime.
- **worker_runs**: one row per run: when it ran, whether it worked, how many rows changed, the source's timestamp and ETag, and any error. Only the worker writes. Any signed-in person reads. In Realtime. Old rows are pruned by the job in supabase/prune-worker-history.sql, once it has been run in the SQL editor.
- **followed_stations**: user_id text default auth.jwt()->>'sub', station_id, created_at. Row-level security: a person reads and changes only rows where user_id = auth.jwt()->>'sub'. The browser never sends user_id.

Clerk is Supabase's third-party auth provider, as in Assignment 4. Every new table revokes TRUNCATE, REFERENCES and TRIGGER from authenticated, because the project's default privileges grant them and TRUNCATE ignores row-level security. anon gets nothing.

## Live page rules

- Subscribe to Realtime only after setAuth() has Clerk's token. Without it, the page joins as anon and every event arrives refused.
- A Realtime event isn't always a row: read it through rowFromEvent, never payload.new directly. A refused event has an empty row, which would read as a failed run.
- The status bar stays in view. Numbers are never shown as zero while loading.

## Data and keys

- Never read .env files (.env, .env.local or any other): don't open, print, search or copy them, with any tool, including the shell. Ask me if you need to know what's set.
- Keys only through environment variables; never written into code, tests, docs or commits.
- The Supabase secret key is used only by the Edge Function, which gets it from Supabase on its own servers. The Next.js app never uses it: only the publishable key and the person's Clerk token.
- The worker only acts on a request carrying the private token Cron sends, kept in Supabase Vault.

## Worker rules

- Save only what changed: compare bikes, e-bikes, docks and the three is_* flags. Never count last_reported as a change.
- Send the last ETag, so a 304 costs no download.
- Check the shape of the response before saving anything. A bad response is a failed run, and saves nothing.
- Every run records a row in worker_runs, including failed runs and runs that changed nothing.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
