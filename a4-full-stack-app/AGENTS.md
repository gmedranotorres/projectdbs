# AGENTS.md: Patterns & Flows (Design, Build, Ship · Assignment 3)

The project is Seguimiento: a job-application tracker built around follow-ups, with a weekly check-in. The user is Gabriela, a grad student applying to jobs in Chicago. The flows are in flows.md: a page per step, and shared navigation that shows where you are and how to get back.

## Project rules

- Stack: Next.js (App Router, TypeScript) and Tailwind, with Clerk for sign-in, Supabase for data, The Muse for job search, one Playwright test, deployed on Vercel. No other backend, external APIs or analytics. New packages are limited to Clerk's, Supabase's and Playwright's; if you think another is needed, ask first and expect "no".
- Forms: one column; a real `<label>` on every field; errors next to the field, saying what to do next ("Enter the company name.", never "Invalid"); keep what the person typed; move focus to the first error on submit.
- Components: the shared Button, Field (Input, Select, Textarea), Chip, Card, ListRow, Badge, PageHeader, EmptyState and Toast are used everywhere; no one-off styles. Tokens come from the Calm design system in ../a2-ui-ux-visual-design, copied into this project as CSS variables; never import across folders at runtime.
- Accessibility: everything works with the keyboard, focus is visible, text contrast is at least 4.5:1, and toasts are announced with aria-live.
- Dates are local calendar dates stored as YYYY-MM-DD; never derive "today" through UTC.
- No invented content. Sample data only in openly fictional form ("Example Co").
- Change only what I ask for; don't restyle things I didn't mention.
- After each round: run npm run build and fix errors; add an entry to DECISIONS.md (what I asked, what changed, what I rejected or decided myself); commit with a message starting "A3:" that says what I asked for; push.

## Data model

Data lives in Supabase, one set of rows per signed-in Clerk user. Clerk is Supabase's third-party auth provider, so `auth.jwt()->>'sub'` is the Clerk user id.

**applications**, one row per application:

- id uuid primary key default gen_random_uuid()
- user_id text not null default auth.jwt()->>'sub'
- company text not null
- role text not null default ''
- job_url text not null default ''
- source text not null default 'manual': 'manual' or 'muse'
- muse_job_id bigint: set only when source is 'muse'; unique per user
- status text not null: applied, followed-up, interviewing, offer (open); rejected, withdrawn, no-response (closed)
- sponsorship text not null default 'unknown': 'sponsors', 'doesnt_sponsor' or 'unknown'
- applied_on date not null
- interview_on date: only while interviewing
- next_follow_up date: empty once the application is closed
- contact text not null default ''
- notes text not null default ''
- last_touched_on date not null
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

**user_settings**, one row per user:

- user_id text primary key default auth.jwt()->>'sub'
- weekly_goal integer not null default 3, above 0
- goal_chosen boolean not null default false
- last_check_in_on date
- check_in_day smallint not null default 1: 0 is Sunday, 6 Saturday
- dismissed_hints text[] not null default '{}'
- updated_at timestamptz not null default now()

Two per-device conveniences stay in localStorage, since losing them loses nothing: the last filter chip on All applications and the unsent draft on Add.

## Data and keys

- Never read .env files (.env, .env.local or any other): don't open, print or search them. Ask me if you need to know what's set.
- Keys only through process.env; never written into code, tests, docs or commits.
- Every table has user_id and row-level security, with policies so a person can read and change only rows where user_id = auth.jwt()->>'sub'.
- The Muse is called from a server route, never from the browser.
- Every server route and server action checks sign-in with auth() itself, not only the proxy.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
