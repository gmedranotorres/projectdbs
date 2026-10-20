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

## 2026-10-18 · Onboarding research

**What I asked.** Research how Huntr, Teal (its job tracker) and Simplify welcome someone new, using one researcher per tool in parallel. For each one, report the first screen, what it asks for, time to value, sample data or empty state, and what brings you back. Use only facts with a link, and write it up in `docs/onboarding-research.md` with a comparison table. Don't change the app.

**What changed.** New `docs/onboarding-research.md`, with a comparison table and one section per tool. Every fact links to its source. The app is unchanged.

**What I rejected or decided myself.**
- All three tools hide their first screen behind sign-up, so the research uses public sources only, and the file says so. Teal's site refused automated access, so its help pages were read as Wayback Machine snapshots, linked as such.
- When a source was out of date, contradicted itself, or came from a competitor, the file keeps the fact and flags it. When nothing was found, it says "not found" rather than guessing.
- Lessons for Seguimiento are left out because they aren't citable facts. They're for the README's "Onboarding research" section, when I ask for it.

## 2026-10-18 · Onboarding decisions

**What I asked.** Implement the three ideas Claude proposed from the onboarding research. Borrow all five "borrow" points and avoid all five "avoid" points. Write my decisions into README.md under "Onboarding research", and update flows.md and its diagram if the first visit changed.

**What changed.**
- **Calendar reminder.** A new `CalendarReminder` component, on the first visit and in the confirmation after the very first save. **Add Monday check-in to my calendar** downloads `seguimiento-monday-check-in.ics`: a weekly event on Mondays at 9:00, starting next Monday (or today, if it's Monday). 9:00 is in the person's own time zone, like the stored dates. After the download, a status line says to open the file.
- **"Already applied somewhere?"** A line under **Log your first application** says that past applications logged with the day you applied show up right away in This week.
- **The rules, under the example.** A follow-up a week after you apply, which you can change, and gone quiet after 3 weeks with no news.
- **Confirmation for an already-due application.** When the saved application is due this week or earlier, the confirmation now says "It's on This week now, ready to follow up." It used to say "It will be on your list that week", even for a date already past.
- flows.md (Flow 1 and the diagram), the README diagram, and the README's "Onboarding research" section are updated.

**What I rejected or decided myself.**
- The five "avoid" points were already true of Seguimiento: no sign-up, no questionnaire, no sample data, no streaks or quotas, no setup score or install prompt. So nothing in the app changed for them. They're recorded in the README as decisions.
- The calendar file is built by hand as plain text, with no package and no external service, following AGENTS.md.
- The reminder is offered after the first save only, not after every save, so it doesn't nag.
- I fixed the confirmation wording myself. Without the fix, the "Already applied" line would be contradicted by the very next screen.
- Still open: the example on the first visit names real companies (Morningstar, Grubhub), but AGENTS.md asks for openly fictional sample content. I didn't change them, because I haven't decided yet and flows.md uses the same names.

## 2026-10-20 · Calm design tokens from A2

**What I asked.** Bring the Calm design system from `../a2-ui-ux-visual-design` into this project: copy its CSS variables (color roles, type roles, spacing scale, radii, border widths, shadows) into `app/globals.css`, and wire them into Tailwind so classes like `bg-surface`, `text-ink`, `text-muted` and `border-line` use them. Copy only the font setup it already uses, with no imports across folders. Recompute the contrast of every text/background pair with the WCAG formula, list them, flag anything under 4.5:1, and ask before changing a color. Apply the tokens to the layout, the navigation and PageHeader.

**What changed.**
- `app/globals.css` now holds Calm's values, copied from `themes/calm.ts` and its palette: background `#EBE2D0`, surface `#FBF7EE`, text `#3A2B21`, muted `#6B5848`, border `#C8BDAD`, accent `#8A9E80`, tint `#DDE4D4` and deeper accent `#747E65`. It also holds the four type roles (display, heading, body, label), the spacing scale (4 to 48px), the radii (6, 12, 16 and 999px), the border widths (1 and 2px) and the shadow (none). In Tailwind they're `bg-*`, `text-*`, `border-*`, `font-serif`/`font-sans`, `text-display`/`text-heading`/`text-body`/`text-label`, `rounded-badge`/`rounded-control`/`rounded-card` and `shadow-raised`.
- Fonts: Newsreader and Inter replace Geist, set up as in A2's `fonts/calm.ts`.
- Layout: the body uses Calm's body role. The focus ring is a 2px ring in the text color, Calm's own. The skip link uses the control radius.
- Navigation: "Seguimiento" uses the heading role in Newsreader, the phone bar labels use the label role, and the desktop items use the control radius.
- PageHeader: the title uses the display role in Newsreader.

Contrast (WCAG 2 formula, pairs that appear in A3):

| Text on background | Ratio |
|---|---|
| Text on background / surface / tint | 10.55 / 12.69 / 10.42 |
| Text on accent (primary button) | 4.71 |
| Text on the button's hover color | 5.92 |
| Muted on background / surface / tint | 5.24 / 6.31 / 5.18 |
| Error on background / surface / error-soft | 5.11 / 6.14 / 5.60 |
| Late on late-soft | 6.85 |
| ~~Sage accent as text on background / surface / tint~~ | 2.24 / 2.70 / 2.21, fixed |
| ~~Text on deeper accent (old button hover)~~ | 3.18, fixed |

**What I rejected or decided myself.**
- I chose Calm's own link style for the failing sage text: the text color with a deeper-sage underline. That covers TextLink, Back, the links on This week and All, the current nav item, and the "New" tag. I rejected a new darker sage (`#636651`) because it isn't in Calm.
- I chose Calm's own hover for the primary button (sage lightened toward surface, `#A1B096`) instead of the deeper accent.
- I chose light only, like Calm in A2, and rejected keeping the old blue dark palette. `color-scheme` is now `light`.
- Claude kept A3's own colors that Calm has no role for (subtle, late, error), with their values unchanged.
- Claude gave the radii Tailwind names by use (`rounded-badge`, `rounded-control`, `rounded-card`), not `sm`/`md`/`lg`. Calm's sizes would have overwritten Tailwind's `rounded-lg` and `rounded-xl` and restyled every button and card. The existing components keep their radii until a round asks for them.
- Spacing and border widths aren't new Tailwind classes. Calm's steps are already Tailwind's 1, 2, 3, 4, 6, 8 and 12, and its widths are `border` and `border-2`.

## 2026-10-20 · Shared Button, Field and Chip components

**What I asked.** Build the shared form components in `components/ui`, adapted from the Calm components in A2 (copied, not linked):
- **Button:** primary, secondary and quiet variants; sizes md and sm; rest, hover, focus-visible, active and disabled styles; `type` defaults to "button".
- **Field:** a wrapper with a `<label htmlFor>`, an optional hint, the control and an error line. The control gets its id, aria-describedby and aria-invalid from the Field.
- **Controls:** Input (text, url, date), Select and Textarea.
- **Chip:** a toggle button with aria-pressed, for role suggestions and list filters.

Add a page at `/dev/components` that shows every component in every state, and keep it out of the navigation.

**What changed.**
- `components/ui.tsx` moved to `components/ui/index.tsx`, so `@/components/ui` imports keep working. Button and ButtonLink are in `button.tsx`; Field, Input, Select, Textarea and ErrorIcon are in `field.tsx`; Chip is in `chip.tsx`. The index re-exports all of them.
- Button: primary is sage with the text color, and lighter sage under the pointer. Secondary is an outline, quiet has no edge, and both take the sage tint under the pointer. Pressed, a button gets a dark edge and moves down 1px. Disabled, its edge is dashed and its text muted.
- Sizes: md is 44px tall with Calm's 15px control text (new token `text-control`). sm is 36px, with a 44px tap area.
- Field hands its id, aria-describedby and aria-invalid to the control inside through React context, so a control needs only its own props. The id is optional; without one, Field makes its own.
- Controls: a muted 1px outline that darkens under the pointer, 2px red with an error, and dashed when disabled. Select draws its own arrow.
- Chip: 36px tall, with a 44px tap area. When on, it has the sage tint, a deeper-sage edge and a check mark, so color isn't the only sign.
- Two new Tailwind variants, `state-hover` and `state-active`, fire on the real state or on a forced `data-state`, and never on a disabled control. `data-state="focus"` draws the focus ring. `/dev/components` uses them to show every state side by side.
- `/dev/components` shows each Button variant and size in every state. It also shows Input (text, url and date), Select and Textarea at rest, with a hint, optional, hover, focus, error and disabled. Chip appears off and on in every state, plus a working group to try. It isn't in the navigation, and it's marked `noindex, nofollow`.
- The pages now use the new components. The application form and Move data use `Input` and `Textarea` in place of `<input className={inputClass} {...describedBy(...)}>`, and the "Use" suggestion button is `size="sm"`. `inputClass` and `describedBy` are gone.

**What I rejected or decided myself.**
- I chose to swap the new components into every page now, so only one Button and one Field exist, as AGENTS.md asks. I rejected keeping old and new side by side.
- I kept the error line above the control, not below it, so a phone keyboard doesn't cover it.
- Claude kept a fourth Button variant, `danger`, because Delete on the edit page uses it.
- Claude let Input also take `type="file"`, for the backup file on Move data, so it isn't a one-off control.
- Claude adapted Calm's disabled look without its 70% opacity, so disabled labels stay readable (muted text is 5.24:1 or more).
- Claude made the secondary button transparent, as in Calm, where it used to be filled with the surface color.
- Field labels stay at 16px medium rather than Calm's 13px label role, for readability in forms.
