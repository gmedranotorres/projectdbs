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
