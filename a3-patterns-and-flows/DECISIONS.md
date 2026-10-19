# Decisions

One entry per round: what I asked, what changed, and what I rejected or decided myself.

## 2026-10-18 · Shared PageHeader and "← Back"

**What I asked.** The original prompt asked for a skeleton: placeholder pages at `/`, `/add`, `/applications`, `/applications/[id]` and `/check-in`, with nav links to Start, Applications and Check-in, plus an "Add" button. The app was already built from flows.md with different routes, so Claude asked first. I chose to keep the working app and add only what was missing: a shared PageHeader with a "← Back" link on every page except `/`. Back goes to the page's parent, not to browser history.

**What changed.**
- New `PageHeader` in `components/ui.tsx`: title, optional description, optional "← Back" and optional action button. Every page and the first-visit screen now use it instead of their own `<h1>` markup.
- Back goes to the parent page: Add, All and Move data go back to This week. Update and "Application not found" go back to All applications.
- The link shows "← Back", and screen readers hear where it goes ("Back to This week"). Its tap target is 44px tall.
- Checked at 390px and 1440px: no sideways scrolling, `aria-current="page"` on the right nav item, and the skip link is the first Tab stop.

**What I rejected or decided myself.**
- Rejected the skeleton. Replacing working pages with placeholders would have thrown away the three flows, and flows.md would no longer match the code.
- Kept the routes and nav from flows.md: This week, Add, All and Move data. Kept `/applications/edit?id=…`. Didn't add `/check-in` (the check-in is `/`).
- Back from Update always goes to All applications, even when you opened it from This week. Saving still returns to the page you came from, as flows.md says.
- The nav already had the name linking home, `aria-current`, a visible current style and the skip link, so it wasn't changed.

## 2026-10-18 · Where the skeleton is

**What I asked.** What it would take to create the skeleton in flows.md, and then to record the answer here.

**What changed.** Only this note. The skeleton flows.md describes, a page per step with the same navigation on every page, already exists. It was never committed on its own: the history goes from the empty Next.js app (`e76172c`) straight to all three flows working (`d42fcfb`). The skeleton and the flows were built in one round.

| Step in flows.md | Route | Notes |
|---|---|---|
| This week (check-in) and first visit | `/` | The first-visit screen shows when nothing is saved |
| Add an application | `/add` | The "Saved" confirmation appears on this page |
| All applications | `/applications` | |
| Update one application | `/applications/edit?id=…` | Includes "Application not found" |
| Move data | `/move` | |

Shared on every page:
- **Navigation:** This week, Add, All and Move data. It's a bottom bar on phones and sits in the header on laptops, with `aria-current="page"` on the current page.
- **Skip link:** the first Tab stop.
- **PageHeader:** on every page, with "← Back" to the parent page everywhere except `/`.

**What I rejected or decided myself.**
- Rejected rebuilding a skeleton on a separate branch for screenshots. It would be a stage made up after the fact, and the table above already maps the pages.
- Left for a later round: AGENTS.md also lists Chip, ListRow, Badge, EmptyState, Toast, and separate Select and Textarea components, which don't exist yet. For now Tag and Notice cover some of those jobs. They're shared components, not part of the skeleton.
