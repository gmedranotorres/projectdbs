# Seguimiento

A job-application tracker built around follow-ups, with a weekly check-in. Assignment 4: the same app, now with sign-in, a real database and job search.

## What it does

I log each application as I send it, and Seguimiento gives it a follow-up date. Every Monday the check-in (`/check-in`) lists the follow-ups that are due, the applications that have gone quiet, and how many I added this week against my goal. **Find jobs** (`/jobs`) searches entry- and mid-level data jobs in Chicago and saves one to the tracker as **Interested**. Each application also records whether the company sponsors visas: Sponsors, Doesn't sponsor or Unknown.

## Stack

- **Next.js 16** (App Router, TypeScript) and **Tailwind 4**, with the Calm design tokens as CSS variables
- **Clerk** for sign-in
- **Supabase** (Postgres) for data, with row-level security
- **The Muse** public API for job search
- **Playwright** with `@clerk/testing` for the one end-to-end test
- Deployed on **Vercel**

## Data model

Two tables. Both are created by the migrations in `supabase/migrations/`.

- **applications:** one row per application, with `company`, `role`, `job_url`, `status`, `sponsorship` (`sponsors`, `doesnt_sponsor` or `unknown`), `applied_on`, `interview_on`, `next_follow_up`, `contact` and `notes`. `source` is `manual` or `muse`; for a saved Muse job, `muse_job_id` is set and is unique per user. The statuses are interested, applied, followed-up, interviewing and offer (open), and rejected, withdrawn and no-response (closed). Check constraints keep the data consistent: for example, there's no follow-up date once an application is closed.
- **user_settings:** one row per user, with the weekly goal, check-in day, last check-in and dismissed hints.

Both tables have `user_id text not null default auth.jwt()->>'sub'`. The browser never sends `user_id`; the database fills it in from the Clerk token. Two conveniences stay in localStorage, since losing them loses nothing: the last filter on All applications and the unsent draft on Add. The full model is in [AGENTS.md](AGENTS.md).

## The Muse: where and why

The Muse is called only from the route handler `app/api/jobs/route.ts`, never from the browser.

- **Sign-in:** the route checks sign-in with `auth()` itself and returns 401 to anyone signed out.
- **Allowed values:** it only accepts the categories, levels and page numbers on its list, and the location is always Chicago, IL.
- **Caching:** results are cached for an hour per search (`'use cache'` with `cacheLife('hours')`), which keeps the app under The Muse's limit of 500 requests an hour without an API key.
- **Errors:** if The Muse fails, the page shows a calm "unavailable" state with a link to log an application by hand. In development, `/jobs?simulate=down` forces that state.

## Access: Clerk and row-level security

- **Clerk** is Supabase's third-party auth provider. The browser client (`lib/supabase/client.ts`) sends Clerk's session token as `accessToken`. The server client (`lib/supabase/server.ts`) uses `auth().getToken()`. In the token, `sub` is the Clerk user id and `role` is `authenticated`.
- **`proxy.ts`** lets signed-out visitors see only the welcome page, sign-in and sign-up. Server routes also check `auth()` themselves.
- **Row-level security** is on for both tables. Each table has four policies (select, insert, update, delete), all `to authenticated` and all `(select auth.jwt()->>'sub') = user_id`, so a person can read and change only their own rows.
- **Grants:** the `authenticated` role gets select, insert, update and delete, and nothing else. `anon` gets nothing.
- **Testing the protection:** to check that the test catches a leak, I replaced the select policy with `using (true)` (`break_rls`). The test failed: user A saw user B's application. Then I put the original policy back (`restore_rls`).

## Run it locally

```bash
npm install
npm run dev     # http://localhost:3000
```

Put these in `.env.local` (names only; the values come from the Clerk and Supabase dashboards):

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key (server only) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL, without `/rest/v1` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `E2E_USER_A_EMAIL`, `E2E_USER_B_EMAIL` | Two test users in the Clerk development instance (only needed for the test) |

Other checks: `npm run build`, `npm run lint`, `npm run check:dates`, `npm run check:contrast`.

## Run the test

```bash
npx playwright install chromium   # once
npx playwright test
```

`tests/isolation.spec.ts` signs in two users in separate browser contexts. Each one logs an application with a unique "Example Co" name, and the test checks that each list shows only that person's own application. Both applications are deleted at the end, even if a check fails. Playwright starts `npm run dev` itself, or reuses a dev server that's already running. It reads `.env.local` in `playwright.config.ts`.

## What I stopped the agent from doing

- **Reading `.env` files.** `.claude/settings.json` denies `Read(./.env)` and `Read(./.env.*)`, and AGENTS.md says never to open, print or search them. When the app couldn't load data, the agent found the cause in Supabase's logs instead (a `NEXT_PUBLIC_SUPABASE_URL` ending in `/rest/v1`), and I fixed the file myself.
- **Using the Supabase secret key.** The app only uses the publishable key with the signed-in person's Clerk token, so every query goes through row-level security. No code, test or doc uses the secret key, and keys are only ever read through `process.env`.
- **Sending `user_id` from the browser.** The database fills it in, so one person can't write rows as someone else.
- **Calling The Muse from the browser,** or adding packages beyond Clerk's, Supabase's and Playwright's.

Decisions round by round are in [DECISIONS.md](DECISIONS.md).
