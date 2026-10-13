# Decisions

One entry per round: what I asked, what changed, and what I rejected or decided myself.

## Round 1 · 2026-10-12 · Scaffold the app and the hub

**What I asked.** A Next.js app with Tailwind in `a2-ui-ux-visual-design` (create-next-app, App Router, TypeScript, npm, no other packages); AGENTS.md with my project rules and a one-line CLAUDE.md; the homepage as a neutral hub with three numbered sections; and placeholder pages so no link 404s.

**What changed.**
- New app from create-next-app (Next.js 16.4, React 19, Tailwind 4), with only the packages it installs by default.
- Hub at `/`: the header, then 1 Mood Boards, 2 Design Systems (Calm, Arcade, Editorial each) and 3 My Site (Open Hyde Park Study Spots). Checked at 390px and 1440px.
- Seven placeholder pages, each with its title and a "← Hub" link: `/mood-boards/{calm,arcade,editorial}`, `/design-systems/{calm,arcade,editorial}`, `/study-spots`.
- AGENTS.md, CLAUDE.md, and `Gabriela_Personal_Profile.md` added to `.gitignore`.

**What I decided myself.**
- The site is Hyde Park Study Spots: a guide that helps UChicago students decide where to study.
- The three styles are Calm, Arcade and Editorial.
- The hub is neutral, in none of the three styles: white background, black text, one sans-serif, generous spacing.
- Static only: no database, backend, accounts, external APIs, or stored data.

**What I rejected.** Nothing yet.

**Choices Claude made that I have not reviewed yet.**
- The hub's sans-serif is the system font of each device (San Francisco on a Mac, Segoe UI on Windows), so the app loads no web font. The Geist fonts that come with create-next-app were removed.
- Links are underlined; on hover they turn white on black, and on keyboard focus they get a black outline.
- The Next.js and Vercel logos that come with create-next-app (the favicon and the images in `public/`) were deleted, because my rules allow no real logos. The tab icon is now a plain black square with a white dot, drawn in SVG.
- Each placeholder is its own folder under `app/`, so each page can later get its own design.
- AGENTS.md keeps the short block Next.js writes about reading its bundled docs; `next dev` puts it back if it is removed.
