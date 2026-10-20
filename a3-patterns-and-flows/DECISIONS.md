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

## 2026-10-20 · Layout and feedback components

**What I asked.** Add the remaining shared components in the Calm style and show them on `/dev/components`:
- **Card**, and **ListRow** (company, role, status badge, follow-up date, an "Open" link).
- **Badge** for status (Applied, Interviewing, Offer, Closed), plus small tags "Due" and "Quiet".
- **PageHeader** (title, one-line description, back link).
- **EmptyState** (headline, one sentence, one primary action).
- **Toast:** one `aria-live="polite"` region; a message shows for 5 seconds with a close button; never more than one at a time; Escape dismisses it.

**What changed.**
- New files in `components/ui`:
  - `card.tsx`: Card, List and ListRow.
  - `badge.tsx`: Badge and `statusTone`.
  - `page-header.tsx`: PageHeader, moved here unchanged, and EmptyState.
  - `toast.tsx`: ToastProvider and `useToast`.
- **Card:** Calm's 16px corners (`rounded-card`), a thin edge and no shadow. It used to have 12px corners.
- **ListRow:** company, role, a status badge in the status's own words, "Follow up Tue, Oct 27" or "No follow-up", and **Open**, which tells screen readers which application it opens. List is the card that holds the rows.
- **Badge:** Calm's 6px corners and the 13px label text.
  - Status looks: Applied is outlined, Interviewing is tinted sage, Offer is filled with the text color, and Closed has a dashed edge with muted text.
  - Tags: Due is amber with a clock, Quiet is gray with a moon, Plain (for dates) and New ("Just changed").
  - Every pair is at least 5.24:1.
- **EmptyState:** a dashed card with a Newsreader headline, one muted sentence and a primary button.
- **Toast:** the region is always in the page as `role="status"` and `aria-live="polite"`, so new messages are announced reliably. The close button sits outside that region, so "Close message" isn't read out with every message. The toast sits above the phone's bottom bar.
- **Swapped into the pages:**
  - Tag became Badge on This week, All and the first-visit example (late becomes Due, plain stays Plain, No news becomes Quiet, Just changed becomes New). Tag is gone.
  - All with nothing saved now uses EmptyState ("Nothing logged yet"), and its header button is hidden then, so there's one primary action.
- `/dev/components` adds Card, ListRow (five fictional rows, one per look), every Badge, EmptyState and a Toast demo. Its own header, now with Back to This week, is the PageHeader example.
- Checked in Chrome:
  - Toast: a second message replaces the first; the message clears after 5 seconds; Escape and Close dismiss it; there's only ever one live region.
  - No sideways scroll at 390px.

**What I rejected or decided myself.**
- I chose drop-ins only. ListRow and Toast aren't on the pages yet:
  - ListRow says "Open" where flows.md and the All page say **Update**.
  - The This week confirmations carry **Undo**, which can't live in a message that disappears after 5 seconds. Both wait until flows.md decides.
- Claude kept a status badge's words as the status's own ("Followed up", "Rejected") and gave them the four looks I listed (Followed up looks like Applied; Rejected, Withdrawn and No response look like Closed), so no information is lost.
- Claude added two tag looks I didn't list, Plain and New, because the pages need them where Tag used to be.
- Claude made the toast wait while the pointer or focus is on it, so it doesn't vanish while someone is reaching for Close.
- Claude kept ToastProvider on `/dev/components` only for now. It goes in the root layout when a page first uses a toast.

## 2026-10-20 · localStorage data layer

**What I asked.** Build the data layer with no new packages:
- `lib/types.ts`: Application and Settings `{ weeklyGoal, lastCheckInOn?, dismissedHints }`.
- `lib/storage.ts`: one key, `seguimiento:v1`, holding `{ version: 1, applications, settings: { weeklyGoal: 3, dismissedHints: [] } }`, with safe JSON parsing (a corrupt value becomes an empty store, never a crash) and ids from `crypto.randomUUID()`.
- `lib/dates.ts`: `today()` as a local YYYY-MM-DD, `addDays`, `daysBetween`, `startOfWeek` (Monday), and "Oct 25" formatting, with no UTC conversions.
- `hooks/useApplications.ts`: applications, settings, add, update, remove, setSettings and a `hydrated` flag. It reads localStorage only in useEffect, and pages show a neutral skeleton until it has, never the empty state.
- A section on `/dev/components` that adds and removes a fictional Example Co, to check persistence by reloading.

**What changed.**
- **`lib/types.ts`:** Application, Settings, StoreData, the status lists and their types. The types moved here from `lib/applications.ts`, which re-exports them, so existing imports still work.
- **`lib/storage.ts`:** the key, defaults, `newId()` (`crypto.randomUUID()`), the record check, settings read field by field with defaults, `parseStore` (never throws), `loadStore` and `saveStore`.
- **What a load does now:**
  - Data saved before settings existed loads with the default settings.
  - A corrupt value becomes an empty store, and the original text is set aside under `seguimiento:v1:unreadable:<time>`.
  - Damaged records are dropped and the rest are kept. The "couldn't be read" banner still says so.
- **`lib/dates.ts`:** no UTC anywhere now. Day math runs at local noon, so a daylight-saving change can't shift a day. I checked it in Chicago and Auckland across both 2026 changes, over the new year, and for Sunday → Monday.
- **`hooks/useApplications.ts`:** replaces `lib/store.ts`. It returns `applications`, `settings`, `hydrated`, `saving`, `recovered`, `add`, `update`, `remove`, `setSettings`, `replaceAll` (Move data) and `dismissRecovered`.
  - It reads localStorage only in useEffect.
  - The server and the first browser render both get "not loaded yet", so the HTML matches, and every page shows `<Loading />` until then.
  - All components share one copy, so a save shows everywhere at once.
  - Each change returns false when the browser refuses to save, so the form keeps what was typed.
- Every page and the storage banner use the hook. The form calls `add` for a new application and `update` when editing.
- `/dev/components` has a "Saved data" section. **Add Example Co** and **Remove Example Co** confirm with a toast and show the entry as a ListRow. Remove only touches the entry this section added.
- Checked in Chrome:
  - Example Co survives a reload, and is gone after Remove and a reload.
  - A corrupt value shows the first-visit page and the banner, not a crash, with the original set aside.
  - Data in the old shape loads, and gets settings on its next save.
  - The form's save persists.
  - The server's HTML for `/` is the skeleton.
  - No console errors.

**What I rejected or decided myself.**
- I chose to keep the app's own model instead of the 4-status one in the request: 7 statuses (Applied, Followed up, Interviewing, Offer, Rejected, Withdrawn, No response), plus `contact`, `interviewOn` and `lastTouchedOn`. "I followed up", the interview rule, "Email X at Y" and Gone quiet depend on them, and saved records stay readable. Empty optional fields stay `null` or `""` rather than missing.
- Claude made the hook use `useSyncExternalStore` for the shared copy, with the read in useEffect. Calling setState inside the effect breaks React's lint rule (`react-hooks/set-state-in-effect`). Side effect: pages opened later in the same visit show their data at once, with no skeleton.
- Claude kept two existing protections the request didn't mention: the corrupt original is set aside rather than overwritten, and a private window that can't save gets a banner instead of silently losing changes.
- Claude kept a fallback id for when `crypto.randomUUID()` doesn't exist (plain http on a phone testing over the local network).
- Still open: `weeklyGoal` (default 3) is stored but shown nowhere except `/dev/components`. The onboarding decisions rejected streaks and quotas, so how a weekly goal appears should be decided before any page uses it.

## 2026-10-20 · First visit with quick add

**What I asked.** Build the first visit on `/`, the state when nothing is saved:
- The headline "Keep every application moving." and the line "Log what you applied to, and come back on Monday to see who to follow up with."
- A two-field quick add, Company and Role, both required, using the shared Field and the same errors as everywhere ("Enter the company name.", "Enter the role title.").
- Under Role, Chips for Data Analyst, Research Assistant, Policy Analyst and Associate Consultant. Tapping one fills Role and moves focus to Company if it's empty.
- The line "Saved on this device. No account."
- On submit: save with `appliedOn` today and `followUpOn` a week later, show the toast "Added {Company} — {Role}. Follow up on {date}.", and stay on `/` so the first item appears below the form.
- No tour, no modal, no sample data.

**What changed.**
- `components/first-visit.tsx` is the new first visit: the heading and line, the quick add (Field + Input, Chip, the primary Button), "Saved on this device. No account.", and "Applied earlier, or want to add a contact? Use the full form." It's followed by "Your list" (a List of ListRows), the follow-up rules line, the calendar reminder and the backup link.
  - The chips are one group, "Common roles". A chip is pressed when Role matches it, and tapping it again clears Role. Focus moves to Company only when Company is empty.
  - The quick add uses `validate()` and `toApplication()`, the same as the Add page, so today becomes the date applied and the follow-up comes from the 1-week rule.
  - With a field empty, the errors appear next to the fields, what you typed stays, and focus goes to the first error.
  - After a save, the toast confirms it ("Follow up on Tue, Oct 27"), the form empties, focus returns to Company, and the item appears under "Your list".
- `app/this-week.tsx` keeps showing the first visit after a quick add, so the new item appears under the form. Opening `/` again later shows This week.
- `validate()` now says "Enter the company name." and "Enter the role title." on the Add page too, so the words are the same everywhere. The old ones named Morningstar.
- ToastProvider moved to the root layout, one region for the whole site, and out of `/dev/components`.
- Updated flows.md (Flow 1, the error list, the diagram, and the example-data line under "Cut for simplicity") and the diagram in the README.
- Checked in Chrome at 390px and 1440px:
  - Both errors with focus on Company, then Role alone with focus on Role.
  - A chip with Company empty moves focus to Company; tapping it again clears Role; with Company filled, focus stays on the chip.
  - Saving stores today and a week later, shows the toast, and lists the row.
  - A reload shows This week.
  - The Add page shows the new errors.
  - No console errors and no sideways scroll.

**What I rejected or decided myself.**
- I chose to keep the calendar reminder and the follow-up rules line from the onboarding round, and to add the link to the full form, so someone partway through their search can log an earlier date or a contact.
- Removed: the example Monday (it was sample data, and named real companies) and the "Already applied somewhere?" line (a quick add always uses today as the date applied, so the line would mislead).
- Claude kept the "Load a backup" line, for someone who already uses Seguimiento on another device.
- Claude used ListRow under the form, so these rows say **Open**. The All page still says **Update** until that's decided.
- Claude didn't add a duplicate warning to the quick add; the full Add form still has one.
- Known: on a laptop, the toast sits at the bottom of the screen and can cover the date on the row just added for its 5 seconds. It says the same date, so the toast's position is unchanged for now.
- Still open: the README's "Onboarding research → What I took" still describes the example Monday and the "Already applied" line. That's my write-up to revise.

## 2026-10-20 · Role chip names

**What I asked.** Help me look into how these roles are actually titled, and update the role chips on the first visit to the correct names.

**What changed.**
- Claude checked Chicago postings and some guides to job titles:
  - "Data Analyst" is the standard title (NORC posts Data Analyst I and II).
  - "Policy Analyst" is exactly what the City of Chicago's budget office posted in 2026.
  - "Research Assistant" is mostly an academic title for people just out of a degree. Research organizations hiring at master's level more often say "Research Associate" (NORC's Research Associate I).
  - "Associate Consultant" is Bain's entry title for undergrad and master's hires; BCG says "Associate" and uses "Consultant" for post-MBA hires.
- The chips are now Data Analyst, **Research Associate**, Policy Analyst and Associate Consultant. flows.md says the same.

**What I rejected or decided myself.**
- I chose Research Associate over Research Analyst and Research Assistant, because it's what my postings say most.
- I kept Associate Consultant over Consultant and Associate.
- Titles aren't standardized, so the chips follow my own postings, not a rule. Claude left the fictional "Research Assistant" sample row on `/dev/components` as it is.

## 2026-10-20 · First item on the list

**What I asked.** Make the moment after the first add teach the pattern:
- Once at least one application exists, `/` shows "Your list" below the quick add: a ListRow per item, newest first.
- Beside the first item's follow-up date, a one-time hint: "We suggested a follow-up a week out. Change it anytime." It stays until the person dismisses it or edits a follow-up date, and the dismissal is recorded in `settings.dismissedHints`.
- "See all" links to `/applications` and "Add details" to `/add`, so the full form is discoverable but never required.

**What changed.**
- `components/first-visit.tsx` became `components/quick-add-home.tsx` (QuickAddHome). It now serves returning visitors too: the quick add, then "Your list", newest first by `createdAt`, as ListRows with Open, followed by **See all** and **Add details**.
- **The tip:** sits beside the newest item's follow-up date and reads "We suggested a follow-up a week out. Change it anytime.", with **Got it**.
  - **Got it** records `"follow-up-suggestion"` in `settings.dismissedHints` (new `FOLLOW_UP_HINT` in `lib/types.ts`, new `dismissHint()` in the hook) and moves focus to the "Your list" heading.
  - Typing a follow-up date of your own on Add or Update also records it.
  - The tip survives reloads until one of those happens.
- ListRow takes an optional `hint`, shown beside the follow-up date. `/dev/components` shows a row with the tip.
- `app/this-week.tsx`: `/` is QuickAddHome while nothing is due or quiet. The check-in takes over once a follow-up comes up, and stays while its message with **Undo** is showing, even after the last due item is handled. The page that comes back from Update (`?updated=`) still shows its confirmation.
- Updated flows.md (Flow 1, the diagram, All caught up, Everything closed) and the README diagram.
- Checked in Chrome at 390px and 1440px:
  - An empty `/` has no list.
  - After a first add, the list shows with the tip, See all and Add details.
  - The tip survives a reload.
  - After a second add, it's on top and the tip moves to it.
  - **Got it** hides the tip, moves focus to "Your list", records the id, and it stays hidden after a reload.
  - With the hint reset, typing a date on Update records the dismissal.
  - With a due item, `/` is This week; after "I followed up" on it, This week stays with Undo; the next visit is the quick add again.
  - No console errors and no sideways scroll.

**What I rejected or decided myself.**
- I chose "quick add until something's due" over keeping the check-in on `/` permanently, and over replacing the check-in with the quick add for good. Mondays stay a check-in.
- Claude put the tip beside the newest item (the top row), and only when its date is the one Seguimiento suggested (Applied, a week after the day you applied), so the tip's words are always true.
- Claude made only a typed date close the tip. A date changed by closing an application, by a status change, by **Use**, or by I followed up / Not yet doesn't count.
- Claude showed the newest five, with See all for the rest, so `/` stays short after many applications.
- Once the list exists, Claude replaced "Applied earlier…? Use the full form" with **Add details**, since both open `/add`. The follow-up rules line now shows only before the first save, because the tip does its job after that. The calendar reminder shows on the first visit and right after the first save, and the backup line only when nothing is saved.
- The "All caught up" card now only appears for a moment, right after the last due item is handled.

## 2026-10-20 · First-visit fixes

**What I asked.** Review the first visit as a demanding reviewer, against the brief: someone new must understand what the tool is for, do something useful right away, learn by doing, and never land on an empty dead end. Walk through `/` with nothing saved at 390px and 1440px, check the keyboard path from the skip link to the submit button, list every problem with a fix ordered by impact, wait for my choice, then apply it.

**What the review found.**
- Passed:
  - The skip link is the first Tab stop and leads to Company.
  - All 13 stops on the path had a visible 2px focus ring.
  - Every control has a name.
  - **Add application** is above the fold at both sizes.
  - No dead ends.
- Problems, by impact:
  1. On a phone, the toast covered the new item's tip and **Got it**.
  2. Company and Role weren't announced as required.
  3. "Applied earlier…? Use the full form" came after the button, so older applications got today's date.
  4. Four chip Tab stops sat between Role and the button.
  5. Too much small print after the form, with "no account" said twice.
  6. The page title was only "Seguimiento".
  7. The nav said "This week" on a page with no week.

**What changed (I picked all seven, and "Home" for #7).**
1. The toast sits at the top of the screen on phones and stays at the bottom on laptops. After a quick add, focus returns to Company without scrolling, so the new item stays in view.
2. Company and Role have `aria-required="true"`.
3. The full-form line sits above **Add application**.
4. New `ChipGroup` in `components/ui/chip.tsx` (toolbar pattern): one Tab stop; the arrow keys, Home and End move between chips. It's used for "Common roles" and on `/dev/components`.
5. The calendar text is now "Get a Monday reminder in your own calendar: a weekly check-in at 9:00, starting Mon, Oct 26." The page says "no account" once.
6. `/` is titled "Home · Seguimiento", set with `absolute`, because the layout's title template doesn't reach a page in the same folder.
7. The nav item is **Home**, with a house icon. Back links say "Back to Home", and Add and Move data say **Go to Home**. flows.md is updated.

- Checked in Chrome:
  - The Tab path is skip link, site name, 4 nav links, Company (required), Role (required), one chip, Use the full form, **Add application**: 11 stops, down from 13.
  - The arrow keys move between chips and wrap around; Home and End work; Enter on a chip fills Role and moves to Company.
  - After a first add at 390px, the tip and **Got it** are clear of the toast; at 1440px nothing overlaps.
  - No console errors.

**What I rejected or decided myself.**
- Claude said fix 4 would bring the path to 10 stops. Moving the full-form link above the button (fix 3) adds one stop back, so it's 11.
- Known trade-off: on a phone, the top toast can overlap the upper edge of Company for its 5 seconds, when Company is near the top of the screen. The form is about 600px tall, so the toast can't avoid both Company and the new item. × or Escape closes it.
- The calendar text also changed on the Add page, which uses the same CalendarReminder after a first save.
- Claude added `aria-required` only on the quick add. The full Add form doesn't have it yet.
- The check-in's own heading stays "This week", and so does the field hint "It shows up under This week…", which refers to that section.

## 2026-10-20 · Add form with inline validation

**What I asked.** Build the full form at `/add` with the shared Field components, one column, in this order: Company, Role, Applied on (default today), Follow up on (default today + 7), Link (optional), Notes (optional). No status field: new applications start as Applied.

Validate on submit, with the error next to its field:
- Company empty: "Enter the company name."
- Role empty: "Enter the role title."
- Applied on empty or invalid: "Enter the date you applied."; in the future: "Choose today or an earlier date."
- Follow up on before Applied on: "Choose a follow-up date on or after the application date."
- A link that doesn't start with http:// or https://: "Enter a full link starting with https://, or leave it blank."

Keep what the person typed, move focus to the first invalid field, and clear a field's error as soon as it's fixed. Don't save yet; log the valid object to the console.

**What changed.**
- `/add` (ApplicationForm in add mode) is one column in that order, with Who to follow up with last. Link, Notes and contact show directly; the "More details" fold stays on Update only. The labels are now "Applied on" and "Link", on Update too, since it's the same form.
- `validate()` in `lib/applications.ts` uses the five messages above. The link rule is now exactly "starts with http:// or https://". These messages apply on Update too.
- Errors recheck themselves: once a field shows an error, every change checks it again. It clears as soon as the field is fixed, and fixing Applied on also clears a Follow up on error. Fields without an error get none until the next save. Before, any keystroke cleared a field's error, even if it was still wrong.
- Company, Role, Applied on and Follow up on are marked `aria-required` (this was missing on the full form).
- On `/add`, a valid save logs `Valid application` and the object to the console.
- flows.md (Add, Errors when adding) is updated.
- Checked in Chrome at 390px:
  - The fields come in the right order, with no status, and the defaults are today and a week later.
  - Both empty: both errors, with focus on Company. Fixing Company clears only its error.
  - A future date, an empty date, a follow-up before the applied date and a bad link each show their message, with focus on the first and everything typed kept.
  - Moving Applied on earlier clears the Follow up on error; fixing the link clears its error.
  - A valid save logs the object and saves it.
  - No console errors.

**What I rejected or decided myself.**
- I chose to keep saving and log as well, instead of "don't save yet". `/add` is where Use the full form, Add details, the Add nav item and the All page's empty state lead, and it's the only way to log an earlier date. Logging only would lose what people enter.
- I chose to keep "Who to follow up with", optional and last, so This week can still say "Email Priya at Example Co".
- Claude kept the existing behavior around the form: Follow up on follows Applied on until you type your own, the "Use" suggestion, and the duplicate warning.
- An empty Follow up on keeps its existing message, "Pick a follow-up date, or use the suggestion below.", because the request didn't give one.

## 2026-10-20 · Save application and confirm

**What I asked.** Make `/add` save. On a valid submit: add the application, show the toast "Added {Company} — {Role}.", and go to `/applications` with the new item at the top, briefly highlighted. Add a secondary button, "Save and add another", that saves, clears the form, returns focus to Company and shows the same toast. Make sure the browser's Back button from `/applications` goes to where the person came from, not back into a filled form.

**What changed.**
- `app/add/add-application.tsx`:
  - **Save application** shows the toast and calls `router.replace("/applications?new=<id>")`. The list takes the form's place in the history, so Back skips the filled form.
  - **Save and add another** (secondary) shows the same toast and remounts the form, empty, with focus in Company.
  - The old "Saved" panel (follow-up date, Add another, Go to Home, See it in your list, first-save calendar reminder) is gone.
- `components/application-form.tsx`: an optional `addAnotherLabel` adds the second button, and `onSaved(app, another)` says which one was used. If a duplicate warning comes up, **Save anyway** keeps the choice. The temporary console log from the last round is removed, since `/add` saves for real now.
- `app/applications/application-list.tsx`: with `?new=`, the new application sits on top under "Just added" and doesn't repeat in its section. It's highlighted for 3 seconds, with no fade animation when reduced motion is on, and focus moves to its row. The "Added…" notice is skipped there, because the toast already said it. The closed count in the description still counts every application.
- Updated flows.md (Flow 1, Add, List, the diagram) and the README diagram.
- Checked in Chrome at 390px, starting from Home → Add in the nav:
  - Save and add another: the toast says "Added Example Co — Data Analyst.", the form is empty, focus is on Company, and the entry is saved.
  - Duplicate + Save and add another + Save anyway: it stays on `/add` and saves.
  - Save application: `/applications?new=…`, the right toast, "Just added" first with the row highlighted and focused, shown once, and the highlight gone after 3 seconds.
  - History grew by one entry, and Back goes to Home.
  - No console errors.

**What I rejected or decided myself.**
- Claude chose `router.replace` over clearing the form before leaving. That way, Back can't return to the form at all, whether filled or empty.
- What the old "Saved" panel did is gone from `/add`: the follow-up date in the confirmation, the "It's on This week now" note for an older application, and the calendar reminder after the very first save. The toast follows my wording exactly, and the new row shows its follow-up tag. The calendar reminder is still on Home.
- The list keeps its **Update** links; this round didn't touch Open vs Update.
- Note for testing: this Next.js version keeps visited pages mounted but hidden, so a page can contain hidden forms from other pages. Tests must pick visible elements.
