# AGENTS.md: Patterns & Flows (Design, Build, Ship · Assignment 3)

The project is Seguimiento: a job-application tracker built around follow-ups, with a weekly check-in. The user is Gabriela, a grad student applying to jobs in Chicago. The flows are in flows.md: a page per step, and shared navigation that shows where you are and how to get back.

## Project rules

- Stack: Next.js (App Router, TypeScript) and Tailwind. Data lives only in the browser's localStorage. No database, backend, accounts, external APIs, analytics or new packages. If you think a package is needed, ask first and expect "no".
- Forms: one column; a real `<label>` on every field; errors next to the field, saying what to do next ("Enter the company name.", never "Invalid"); keep what the person typed; move focus to the first error on submit.
- Components: the shared Button, Field (Input, Select, Textarea), Chip, Card, ListRow, Badge, PageHeader, EmptyState and Toast are used everywhere; no one-off styles. Tokens come from the Calm design system in ../a2-ui-ux-visual-design, copied into this project as CSS variables; never import across folders at runtime.
- Accessibility: everything works with the keyboard, focus is visible, text contrast is at least 4.5:1, and toasts are announced with aria-live.
- Dates are local calendar dates stored as YYYY-MM-DD; never derive "today" through UTC.
- No invented content. Sample data only in openly fictional form ("Example Co").
- Change only what I ask for; don't restyle things I didn't mention.
- After each round: run npm run build and fix errors; add an entry to DECISIONS.md (what I asked, what changed, what I rejected or decided myself); commit with a message starting "A3:" that says what I asked for; push.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
