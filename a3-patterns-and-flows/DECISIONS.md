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

## 2026-10-20 · Applications list with filters

**What I asked.** Build `/applications`: every application as a ListRow, sorted by follow-up date, soonest first, with those without one last. Filter chips at the top (All, Applied, Interviewing, Offer, Closed) with counts, using the Chip component and aria-pressed. A search field with a real label that filters by company or role as you type. Each filter has its own EmptyState: All with nothing saved points to `/`; a status with no items says so in one sentence ("No offers yet.") with a link back to All. Never a blank page.

**What changed.**
- `app/applications/application-list.tsx` is rewritten:
  - One list, sorted by follow-up date, with no date last, then by company.
  - A ChipGroup of five Chips with counts and aria-pressed. The filter is in the address (`?status=`) and changes with `router.replace`, so it doesn't pile up history. Pressing the chip that's on goes back to All.
  - A Field "Search by company or role" with `Input type="search"`, filtering as you type. A `role=status` line says "Showing X of Y." while filtering or searching.
  - Empty states:
    - Nothing saved: "Nothing logged yet" and **Log your first application** → `/`.
    - A status with nothing: "Nothing in Applied right now.", "No interviews yet.", "No offers yet." or "Nothing closed yet.", with **Show all applications**.
    - A search with no results: "Nothing matches “…”." (or "Nothing in Closed matches “…”.") with **Clear search**, which refocuses the search.
  - From Add (`?new=`), the new one is still on top, highlighted and focused. After an update, its row is highlighted in place.
- `components/ui/page-header.tsx`: EmptyState takes any action (a button, a link or a text link) and an optional title, so a one-sentence state has no heading.
- `components/ui/field.tsx`: Input accepts `type="search"`.
- `components/ui/card.tsx`: ListRow takes `highlight` and `rowId`, so the list can mark and focus a row.
- `app/dev/components/component-gallery.tsx`: shows both EmptyState forms.
- Updated flows.md (List, Never a blank page, Cut for simplicity, the diagram) and the README diagram.
- Checked in Chrome at 390px and 1440px with fictional data (Example Co, Sample Institute, Demo City Office, Placeholder Labs, Fictional Inc):
  - The order was Sep 22, Oct 13, Oct 25, Nov 3, then no date.
  - The counts were All 5, Applied 3, Interviewing 1, Offer 0 and Closed 1, with aria-pressed following the chosen chip.
  - Offer → "No offers yet." → Show all applications → All with 5 rows.
  - "analyst" → 3 rows, with the counts following the search. "zzz" → Clear search, with focus back in the search.
  - Nothing saved → the link goes to `/`, with no search or chips.
  - `?new=` → on top, highlighted and focused.
  - No horizontal scroll at 1440px and no console errors.

**What I rejected or decided myself.**
- The Due / Upcoming / Gone quiet / Closed sections are gone; the request asked for one list sorted by follow-up date. Late and gone-quiet items keep their words ("7 days late", "No news for 35 days") as a badge beside the date.
- Rows link with **Open**, the same word as the ListRow on Home, settling the Open vs Update question from the last round.
- Five chips for seven statuses: Followed up counts as Applied, and Rejected, Withdrawn and No response as Closed. That matches the four badge looks.
- Counts follow the search, so a chip never promises items the search then hides.
- The filter lives in the address, so Back and a shared link keep it. The search doesn't, so it resets when you leave the page.
- A search with no matches gets its own empty state with Clear search; the request didn't name one, but without it the page would be blank.
- "Search, filters and tags" came off the Cut list in flows.md; only tags stay cut.

## 2026-10-20 · Application detail and status updates

**What I asked.** Build `/applications/[id]`. If the id doesn't exist, show an EmptyState "This application isn't on this device." with a link to `/applications`. Otherwise show the details and let me edit every field, with the same Field components and rules as `/add`, plus Status (Applied, Interviewing, Offer, Closed). A status change suggests a next follow-up only where it makes sense: Interviewing suggests today + 3; Closed clears the follow-up. Save with a "Saved" toast. Put Delete behind an inline confirmation (no browser confirm dialog), then return to `/applications` with the toast "Deleted {Company} — {Role}."

**What I decided when Claude asked** (the request conflicted with earlier choices):
- **Status:** four choices plus a closed reason. The Status Select has Applied, Interviewing, Offer and Closed. Closed adds a "Why it closed" Select (Rejected, Withdrawn, No response). Followed up stays in the data and shows as Applied, so This week and saved data keep working.
- **Interviewing:** today + 3, with the interview date kept as an optional field, so an interview still ahead keeps the application from going quiet.
- **Offer:** it keeps its follow-up date and becomes an open status, so answering an offer comes up in This week.

**What changed.**
- `app/applications/[id]/` is the new page, replacing `app/applications/edit/`:
  - The header shows the company, role, status badge, applied date and next follow-up.
  - "I followed up today" stays, and now gives a toast and stays on the page.
  - The form shows every field in Add's order plus Status. Save changes shows the toast "Saved" and stays.
  - Delete asks inline (Delete it / Keep it). Keep it returns focus to Delete application. Delete it shows the toast and `router.replace("/applications")`.
  - An unknown id shows the EmptyState with "See all applications".
- `components/application-form.tsx`:
  - Status is a Select. "Why it closed" appears for Closed, and its error is "Choose why it closed."
  - Choosing Interviewing fills in today + 3, and choosing another status right after restores the earlier date. Applied and Offer keep the date. Closed hides it, and saving clears it.
  - "More details" is gone, so every field shows, as on Add. The custom radio list for status is gone too.
  - An empty follow-up date with no suggestion on screen says "Pick a follow-up date."
- `lib/`:
  - Offer moved from closed to open. Offers don't go quiet, and an offer saved earlier without a date isn't due.
  - "I followed up" keeps Interviewing and Offer.
  - The Interviewing suggestion is today + 3, and the interview date is optional.
  - The form's status can be "closed" until a reason is chosen.
- Links from the list, Home, This week, the duplicate warning and the gallery now go to `/applications/<id>`.
- `components/arrival-message.tsx` is removed. The edit page was the last thing that sent `?updated=` and `?deleted=`, and toasts say it now.
- `components/site-nav.tsx`: only the "current page" marker sits in Suspense. `usePathname` can't be known while prerendering a page with an id, and this keeps the nav itself in the static shell, as the Next docs recommend.
- Updated flows.md (the follow-up rules, One application, Errors on an application's page, the diagram) and the README diagram.
- Checked in Chrome at 390px and 1440px with fictional data:
  - Unknown id → the EmptyState and a link to `/applications`, with All marked in the nav.
  - Interviewing → Oct 23 (today + 3), "Suggested: 3 days from today.", and the optional interview date. Back to Applied → Oct 13 again.
  - Save → the toast "Saved", the header updates, and focus stays on Save changes.
  - Closed with no reason → "Choose why it closed." with focus on it. Rejected → the follow-up is cleared.
  - Followed up → Offer keeps Nov 3. Back to Applied stays Followed up.
  - An empty company or follow-up shows its error with focus on it, and what was typed is kept.
  - Delete: the inline question, `window.confirm` never called, Keep it → focus on Delete application. Delete it → `/applications`, the toast "Deleted Example Co — Data Analyst.", and history didn't grow.
  - This week: an offer due this week is listed; an older offer with no date isn't.
  - No console errors.

**What I rejected or decided myself.**
- Claude chose to remove `/applications/edit` instead of keeping a redirect; only the app linked to it.
- Claude chose to auto-fill today + 3 for Interviewing instead of offering a "Use" button, to match Closed clearing the date on its own. The hint says it's a suggestion.
- Saving stays on the page, as the toast implies, instead of returning to the list. "Cancel" still goes to the list.
- The follow-up date stays required for Offer, the same rule as the other open statuses. An older offer without a date asks for one only when it's next saved.

## 2026-10-20 · Duplicate notice and input limits

**What I asked.** Handle the edges, with no new packages:
- **Duplicate:** on `/add` and the quick add, if a saved application has the same company and role (ignoring case and extra spaces), show a notice beside Company: "You already have {Company} — {Role}." with "Open it" and "Add anyway". It's a notice, not an error: nothing is blocked.
- **Length:** company and role up to 80 characters and notes up to 1,000, with a counter that appears only near the limit. Rows truncate gracefully.
- **Whitespace:** trim fields before validating and saving.
- **Dates:** test the day before and after a month boundary and the November DST change with `lib/dates.ts`, and show the cases.

**What changed.**
- `components/duplicate-notice.tsx` (new) holds the shared notice, in a polite live region. It's used by the Add form and the quick add, right under Company. It shows as soon as the company and role match. Saving still works without touching it. **Open it** → `/applications/<id>`. **Add anyway** hides it for that pair and moves focus to Role.
- `components/application-form.tsx`: the old warning shown when you saved (with "Save anyway" and "Open that one") is gone, along with the save-blocking step. On an application's page, the same notice appears only when the company or role is changed to match another application, with **Keep both**.
- `lib/applications.ts`:
  - `LIMITS` (80 / 80 / 1,000).
  - `oneLine()` trims and collapses runs of spaces.
  - `clean()` is run by both `validate()` and `toApplication()`, so checks and saved data use the same text. Notes keep their line breaks.
  - New errors: "Shorten the company name to 80 characters or fewer.", "Shorten the role title to 80 characters or fewer." and "Shorten the notes to 1,000 characters or fewer."
  - `findDuplicate` ignores case and extra spaces.
- `components/ui/field.tsx`: Field takes `count`.
  - The counter appears from 80% of the limit: 64 for company and role, 800 for notes. It reads "16 characters left", then "1 character too many" in red.
  - It's part of the field's description and in a polite live region.
  - Typing past the limit isn't blocked, so pasted text is never cut off silently; saving shows the error.
- Truncation:
  - ListRow's company and role, and This week's headings, end with "…" after two lines and break long unbroken words.
  - PageHeader's title wraps long words.
  - `body` has `overflow-wrap: break-word`, so a long unbroken string can't widen the page.
- `scripts/check-dates.mjs` and `npm run check:dates` run the date cases below. Node 26 runs `lib/dates.ts` directly, so no package is needed.
- `/dev/components` shows the counter near and over the limit.
- Updated flows.md (Add, Errors when adding, Limits, Duplicates).
- Checked in Chrome at 390px:
  - "  example   co " + "DATA  analyst " shows the notice for Example Co — Data Analyst, between Company and Role, with no field marked invalid. Add anyway → it's gone, focus is on Role, and it doesn't come back for the same pair. Save without dismissing → saved.
  - Quick add: Company + the Data Analyst chip shows the notice. Add anyway, then Add application, saves; the notice returns for the next entry. Fields with only spaces show both "Enter…" errors.
  - Counter: hidden at 63, "16 characters left" at 64, "0 characters left" at 80, red "1 character too many" at 81. 78 characters plus trailing spaces count as 78. Notes: hidden at 799, shown at 800, red at 1,001.
  - Over all three limits: three errors with focus on Company, and what was typed is kept. Exactly 80 / 80 / 1,000 with spaces around them saves as 80 / 80 / 1,000.
  - Long names: two lines then "…", and no horizontal scroll on the list or on the application's page.
  - Application's page: no notice on opening, even for a pair saved anyway. Changing the company to match another shows the notice; Keep both → focus on Role, and Save works.
  - No console errors.

**Date cases** (`TZ=America/Chicago`, where daylight saving ends Sun, Nov 1, 2026 at 2am; all 25 also pass in Pacific/Auckland, Asia/Kolkata and Asia/Tokyo):

| Case | Result |
| --- | --- |
| addDays("2026-10-31", 1) | 2026-11-01 |
| addDays("2026-11-01", -1) | 2026-10-31 |
| addDays("2026-10-30", 7), follow-up a week out | 2026-11-06 |
| daysBetween("2026-10-31", "2026-11-01") | 1 |
| formatDay("2026-10-31") / ("2026-11-01") | Sat, Oct 31 / Sun, Nov 1 |
| today() at Oct 31, 11:30 pm / Nov 1, 12:30 am | 2026-10-31 / 2026-11-01 |
| addDays("2026-11-30", 1) / ("2026-12-01", -1) | 2026-12-01 / 2026-11-30 |
| addDays("2026-12-31", 1) / ("2027-01-01", -1) | 2027-01-01 / 2026-12-31 |
| isDay("2026-11-31") | false |
| addDays("2026-10-31", 2), across the DST change | 2026-11-02 |
| addDays("2026-11-02", -2) | 2026-10-31 |
| addDays("2026-10-25", 14), followed up | 2026-11-08 |
| daysBetween("2026-10-31", "2026-11-02") / reversed | 2 / -2 |
| daysBetween("2026-10-12", "2026-11-02"), gone quiet | 21 |
| startOfWeek("2026-11-01"), a Sunday | 2026-10-26 |
| endOfWeek("2026-10-26") | 2026-11-01 |
| startOfWeek("2026-11-02"), the Monday after | 2026-11-02 |
| today() at Nov 1, 1:30 am (an hour that happens twice) | 2026-11-01 |
| today() at Nov 1, 11:59 pm / Nov 2, 12:01 am | 2026-11-01 / 2026-11-02 |

No change to `lib/dates.ts` was needed: day math runs at local noon, and `today()` reads the local date.

**What I rejected or decided myself.**
- **Add anyway:** Claude chose to make it put the notice away instead of saving right away. On `/add` the rest of the form may still be empty, and since nothing is blocked, the save button already does the adding.
- **Live notice:** it appears as you type, instead of when you save, so saving is never interrupted.
- **Application's page:** the notice and **Keep both** apply there too. That replaces the old warning shown when you saved (with "Save anyway"), so the same form never blocks in one place and only informs in another.
- **Spaces:** besides trimming, runs of spaces inside company, role and contact become one, which matches how duplicates are compared. Notes are only trimmed, so line breaks stay.
- **Counter:** it counts the text as it will be saved, so it agrees with the error. It shows from 80% of the limit, and the field doesn't use `maxlength`.

## 2026-10-20 · Navigation and page headers

**What I asked.** Make it obvious where you are and how to get back:
- On every page, the current nav link has `aria-current="page"` and a visible marker.
- PageHeader shows the title and a one-line description.
- The back link goes to the page the person came from when we know it (detail → list), otherwise to `/`.
- Add a footer line "Saved on this device" with a link to `/check-in`.
- On narrow screens, the nav is four labeled items with text, not a hamburger menu.
- Check focus order top to bottom on every page.

**What changed.**
- **Back.** `hooks/useBackLink.ts` (new): pages opened from somewhere get `?from=<that page>`, and Back returns there if it's a known parent (Home, This week, All applications, Log an application). Otherwise it goes to Home. `useFromHere()` builds the value and leaves out `?new=`, so coming back doesn't pin and highlight again. Paths starting with `//` are refused, so Back can't leave the site.
  - Links that now carry `from`: list rows (with the filter), This week's Details and Log an application, Home's list rows, Use the full form and Add details, the list's Log an application, and the duplicate notice's Open it.
  - On an application's page, Cancel goes to the same place as Back.
- **PageHeader.** `description` is required and is one line of text. Back's words are now visible: "← Back to All applications" instead of "← Back", with the destination only for screen readers.
- **Descriptions.**
  - Add: "Company and role are all you need; the dates are filled in for you."
  - All: "2 applications, soonest follow-up first."
  - An application: its role. The status, applied date and follow-up moved just under the header.
  - Not found: "Check the address, or find it in your list."
  - This week: "Week of Oct 19: who to follow up with, and what's gone quiet."
  - Move data: shortened to "Copy your applications between your phone and your laptop with a backup file.", with the rest as a paragraph below.
- `app/check-in/page.tsx` (new): the This week check-in, always. Home still switches between the quick add and the check-in as before. With nothing saved, `/check-in` shows "Nothing logged yet" pointing to Home.
- `app/not-found.tsx` (new): unknown addresses get the same header ("Page not found"), Back to Home, and the footer.
- **Footer** in the layout: "Saved on this device · Weekly check-in" → `/check-in`.
- **Nav.** `components/site-nav.tsx` is split into SiteHeader (name, plus the nav on a laptop) and BottomNav (phone), rendered after the footer. That way Tab goes header → page → footer → bottom bar, as it looks. Only one of the two navs shows at a time; the other is `display: none`. Home is marked on `/check-in`.
- **ListRow.** A new `note` slot under the row. Home's one-time tip moved there from `hint`, so Tab reaches Open (top right) before Got it.
- Updated flows.md (Where you are and how to get back, the check-in, the diagram) and the README diagram.
- Checked in Chrome at 390px and 1440px on Home (quick add, with the tip, and the check-in), `/check-in`, `/add`, `/applications`, an application's page, an unknown id, `/move`, `/dev/components` and a 404:
  - **Headers:** every page has an h1 and a one-line description.
  - **Nav marker:** exactly one nav shows. The current item has `aria-current="page"` and is bold and underlined at 390px, or bold on a tint at 1440px. None is marked on the gallery or the 404, which aren't in the nav.
  - **Footer:** present on every page, linking to `/check-in`.
  - **Tab order:** Tab was pressed through every page, comparing each stop's position. All pages go top to bottom, and left to right within a row. The first run caught Got it → Open going upward, fixed with `note`.
  - **Back:**
    - A list row with `?status=applied` → "Back to All applications" → `/applications?status=applied`.
    - The check-in's Details from Home → Home; from `/check-in` → "Back to This week".
    - Home's rows and Add details → Home. The list's Log an application → the list.
    - Add from the nav, a typed address, `?from=//example.com` and `?from=/move` → Home.
  - No console errors.

**What I rejected or decided myself.**
- **/check-in:** it didn't exist, so Claude built it as the check-in that's always there, rather than pointing the footer at `/`. Home keeps the behavior I chose earlier: the quick add until something is due.
- **"Where you came from":** it's carried in the link (`?from=`), not guessed from browser history. It survives a reload, and the browser's Back button can't confuse it.
- **Two navs:** Claude chose two navs, one per screen size, over keeping one nav in the header. With one, a phone would Tab to the bottom bar before the page.
- **Visible Back label:** Back names its destination on screen, because "how to get back" should be visible too.
- **Known exception:** a toast's Close button comes after the bottom bar in Tab order, even though the toast shows at the top on phones. It lasts 5 seconds, Escape closes it, and focus is never moved into it.

## 2026-10-20 · Weekly check-in

**What I asked.** Build `/check-in`, the reason to come back, with these sections in order:
1. **"Follow-ups due":** Applied or Interviewing, with followUpOn on or before today, soonest first. Each row has "Followed up" (followUpOn = today + 7, updatedAt = today), "Snooze a week" (followUpOn + 7) and "Open".
2. **"Gone quiet":** Applied, no update in 14 days or more, no follow-up date. "Set a follow-up" opens a date field inline.
3. **"This week":** the number added since Monday against the weekly goal (default 3, editable inline, saved in settings), as a simple progress bar with the numbers beside it.
4. **"Done for this week":** a primary button that saves lastCheckInOn = today and shows "Done. See you next Monday."

If nothing is due and nothing is quiet: "Nothing due. Add an application or come back Monday." with both links.

**What I decided when Claude asked** (the request conflicted with existing rules):
- **Followed up:** today + 7. Applied becomes Followed up (Interviewing and Offer keep theirs), and it counts as news. "I followed up today" on an application's page changes to + 7 too.
- **Due list:** every open application counts: Applied, Followed up, Interviewing and Offer.
- **Gone quiet:** Applied or Followed up, no update for 14+ days, and not already due. Every open application has a follow-up date, so "no follow-up date" would almost never match. The 21-day rule becomes 14 everywhere.
- **Snooze a week:** today + 7. A week after the old date could still be in the past for a late one, and the button would seem to do nothing.

**What changed.**
- `app/this-week.tsx` is rewritten. Used by `/check-in` and by Home while something is due or quiet, it has:
  - **Follow-ups due:** Followed up / Snooze a week / Open, with Undo.
  - **Gone quiet:** "No update for N days", and Set a follow-up with an inline date field. A week from today is filled in, focus goes to the field, and the errors are "Pick a follow-up date." and "Choose today or a later date."
  - **Nothing to do:** the plain message.
  - **This week:** "Added since Monday, Oct 19: 2 applications." plus Progress, "Goal met." when reached, and an inline Change goal (1–20, "Enter a whole number from 1 to 20.").
  - **Done for this week:** it stays "Done. See you next Monday." for the rest of the week.
  - The old "All caught up / Next: …", "No open applications", "Follow up once more" and "Close it" are gone.
- `lib/applications.ts`:
  - `QUIET_AFTER_DAYS` = 14.
  - `markFollowedUp` uses today + 7, and the Followed up suggestion is + 7.
  - `postpone` (Snooze) and the new `setFollowUp` set the date and count as an update (`lastTouchedOn`), so a snoozed or newly dated application doesn't land in Gone quiet.
  - `groupOf`: due = open with a date ≤ today; quiet = Applied/Followed up, not due, 14+ days without an update; everything else open is upcoming.
- `lib/dates.ts`: `dayOf(time)` turns a saved moment such as createdAt into this device's calendar day, never the UTC one, for "added since Monday".
- `components/ui/progress.tsx` (new, shared): a bar with `role="progressbar"` and `aria-valuetext="2 of 3"`, with the numbers beside it. It stays full past the goal, and the fill is 3.65:1 against the track.
- `components/calendar-reminder.tsx`: `MondayReminderButton` split out, so "come back Monday" can download the Monday calendar file.
- Wording elsewhere follows the new rules:
  - The list's quiet badge reads "No update for N days".
  - Home's rule line says "After 2 weeks with no update".
  - The application page says "a week from today".
  - The gallery shows Progress and the new badge text.
- Updated flows.md (the follow-up rules, Flow 3, the diagram) and the README (diagram, rule line).
- Checked in Chrome at 390px and 1440px, in Chicago time, with fictional data:
  - **Order:** the sections come in the requested order. Due is Example Co (7 days late), Demo City Office (an offer, 2 days late, "Follow up with Alex Example at…"), then Sample Institute (Due today). Gone quiet is Placeholder Labs (No update for 20 days). An Interviewing application quiet since Sep 1 isn't listed.
  - **Followed up:** status Followed up, Oct 27, touched and updated today; it leaves the list, focus moves to the message, and Undo restores everything.
  - **Snooze:** an application with 14 days and no update → Oct 27, and it doesn't move to Gone quiet.
  - **Set a follow-up:** an empty date and yesterday show the two errors. Cancel puts focus back on the button. Oct 22 is saved and the application leaves Gone quiet.
  - **Added since Monday:** 2. It counts one created Monday 10:30 pm Chicago time (03:30 UTC Tuesday) and leaves out one created Sunday 11 pm Chicago time (04:00 UTC Monday).
  - **Goal:** "0" and "2.5" show the error; " 2 " is saved, the bar reads 2 of 2 at 100% with "Goal met.", and focus returns to Change goal.
  - **Done for this week:** saves `lastCheckInOn` and shows the message with focus on it; after a reload, the message is still there instead of the button.
  - **Nothing to do:** after handling the rest, the plain message shows, with Add an application → `/add?from=/check-in` and the calendar download. Home becomes the quick add again, and the check-in again once something is due.
  - **Tab order:** top to bottom at both widths.
  - No console errors.

**What I rejected or decided myself.**
- **"Both links":** Claude made them **Add an application** and **Come back Monday: add it to my calendar**, the existing Monday reminder file. There's no email, so the calendar is how "come back Monday" happens.
- **Snooze and Set a follow-up count as an update.** Otherwise Snooze would send a stale application straight from Follow-ups due into Gone quiet. A snoozed one still comes back as due a week later, so nothing is forgotten. The badge says "No update" rather than "No news" for that reason.
- **No Close it:** Gone quiet lost **Close it** and **Follow up once more**, since the request names only Set a follow-up. Open is kept on each row, and closing is on the application's page.
- **Done stays shown:** "Done for this week" shows its message for the rest of the week instead of offering the button again.
- **Home unchanged:** Home still switches to the check-in while something is due or quiet, as chosen earlier.

## 2026-10-20 · Welcome back home

**What I asked.** Design the returning state of `/`. When anything is saved:
- **Header:** replace the first-visit headline with "Welcome back." and today's date.
- **Numbers:** three numbers as links: follow-ups due (→ `/check-in`), gone quiet (→ `/check-in`), and added this week against the goal (→ `/applications`).
- **Below:** the quick add stays, then "Your list" with the five most recent and "See all".
- **Last check-in:** if lastCheckInOn is set, show "Last check-in: {date}". When it's 7 or more days ago, add one gentle line, "It's been a week. Start your check-in?", with a link.
- No modals, no nagging badges.

**What changed.**
- `components/quick-add-home.tsx`: with something saved when the page opens, it shows:
  - The header "Welcome back." with today's date ("Tuesday, October 20").
  - A list of three StatLinks: "3 follow-ups due" and "1 gone quiet" → `/check-in?from=/`, and "2 of 3 added this week" → `/applications?from=/`.
  - "Last check-in: Tue, Oct 13", and from 7 days on, "It's been a week. Start your check-in?" (the question is the link).
  - The quick add, Your list (five newest) and See all stay as they were.
- `components/ui/stat-link.tsx` (new, shared): a tile that's one link. It shows the number in the headline face and an underlined label, with neutral colors and no badge. There's a space between the number and the label, so screen readers say "3 follow-ups due". It's shown in `/dev/components`.
- `app/home-page.tsx` (new): Home is always the quick add page. `app/this-week.tsx` is now only `/check-in`: the `page` prop and the fallback to the quick add are gone, and Back always shows.
- `lib/`: `formatLongDay` ("Tuesday, October 20") and `addedSince(apps, monday)`, which Home and the check-in share.
- Updated flows.md (Coming back in Flow 1, Flow 3's opening, the nav note, the diagram) and the README diagram.
- Checked in Chrome at 390px and 1440px:
  - **First visit:** the first-visit headline and no numbers. After the first quick add on that same visit, the headline stays and focus stays on Company. On the next visit: "Welcome back." with "Tuesday, October 20" and 0 / 0 / "1 of 3".
  - **Returning, with fictional data:** the order is Welcome back › numbers › quick add › Your list. The numbers read 3 follow-ups due / 1 gone quiet / 2 of 3 added this week, with the right links.
  - **Last check-in:** none saved shows no line. Oct 19 and Oct 14 (6 days) show only "Last check-in"; Oct 13 (7 days) adds the line, linking to `/check-in?from=/`.
  - **Calm:** no dialog, and no late or error colors in the numbers.
  - **Links and quick add:** "3 follow-ups due" opens `/check-in` with "← Back to Home". A quick add while returning gives the toast, puts the new one at the top of Your list, and changes the number to 3 of 3.
  - **Tab order:** top to bottom at both widths, with no horizontal scroll at 390px.
  - No console errors.

**What I rejected or decided myself.**
- **Home stays the quick add.** Home used to turn into the check-in whenever something was due or quiet (my earlier choice). These numbers link to `/check-in`, so Home now always stays the quick add, and the check-in lives only at `/check-in`.
- **"Returning" is decided when the page opens.** Saving your very first application doesn't switch the headline mid-visit, which would also push the form down under the cursor. The welcome shows from the next visit.
- **The "added this week" number** shows "2 of 3" as the figure, with "added this week" as the label.
- **The week counts from the check-in day:** "It's been a week" appears at 7 days or more since the last check-in, by calendar days, not since the last Monday.

## 2026-10-20 · Remember filters and drafts

**What I asked.** Finish what the app remembers between visits:
- applications;
- settings (weekly goal, lastCheckInOn, dismissed hints);
- the last filter chosen on `/applications`;
- the draft of `/add` if the person leaves the page by mistake: restore it on return with a small "Restored your draft" line, and clear it on save.

Then write a table in README.md under "What it remembers": what is stored, under which key, and why.

**What changed.**
- **Already in place:** applications and settings were already saved under `seguimiento:v1`, and the check-in and Home already use them.
- `lib/remember.ts` (new) holds the two conveniences, each under its own key, read and written with `try`/`catch` so a blocked or full storage just means "not remembered":
  - **`seguimiento:list-filter`:** the last status chip chosen. Choosing All removes it.
  - **`seguimiento:add-draft`:** only what was typed: text fields, plus dates that differ from the defaults. A follow-up that's just Applied on + 7 isn't kept. Fields with only spaces count as no draft, and a damaged draft is dropped.
- `app/applications/application-list.tsx`:
  - **Which filter shows:** the address wins, then the remembered chip. Right after Add (`?new=`) it shows All, so the new one is in view.
  - **Choosing a chip** remembers it.
  - **"Show all applications"** in a filter's empty state also forgets the filter, so it doesn't lead back to the same empty view.
- `app/add/add-application.tsx` and `components/application-form.tsx`:
  - The form reports each change, and Add saves the draft from it.
  - On opening, a draft starts the form with "Restored your draft" and **Start over**.
  - Save application and Save and add another clear it.
  - A restored follow-up date that's the person's own isn't overwritten when Applied on changes.
- **Kept pages:** Next keeps a visited page and shows it again with its state. Following Next's "Preserving UI state" guide, a `useLayoutEffect` cleanup runs as the page is hidden:
  - With a draft left behind, the line shows on return too, the same as after a reload.
  - After Save application, the form resets, so coming back never shows what was just saved.
- README: the "What it remembers" table (applications; the weekly goal, last check-in and dismissed hints in `settings`; the filter; the draft; the damaged-copy key). It also covers why applications and settings share one key, what a backup holds, and what isn't remembered.
- flows.md: Add and List describe the draft and the remembered filter. "Saving a half-finished form automatically" is off the Cut list.
- Checked in Chrome at 390px:
  - **Filter:** choosing Interviewing → Home → nav All shows Interviewing ("Showing 2 of 7."), and so does a reload. `?status=closed` in the address shows Closed without changing what's remembered. `?new=` shows All. An empty Offer → Show all applications → All, and the key is removed. Pressing a chip twice → All, and the key is removed.
  - **Draft:** "Example Co", Applied on Oct 12 and notes were saved without the follow-up date.
    - Nav away and back, and a reload, both show the line with everything restored. After changing Applied on, the follow-up still follows it; a typed Oct 30 survives a restore plus a date change.
    - Start over → empty, no line, key removed, focus on Company.
    - Save application, and Save and add another, remove the key. Nav Add after saving shows an empty form.
    - Typing then erasing, or changing only a date, saves no draft. A draft from another day gets today's dates. A damaged draft is dropped.
  - No console errors.

**What I rejected or decided myself.**
- Claude added **Start over** next to "Restored your draft", so a restored draft is never something you have to clear field by field.
- Only choosing a chip is remembered. A filter that arrives in the address (a link, Back) shows but doesn't replace your choice.
- The search text isn't remembered; the request named the filter only.
- The filter and the draft stay out of `seguimiento:v1` and out of backups. They belong to this device and this moment, not to your list.
