# Seguimiento

A weekly check-in for a job search: it tells you who to follow up with.

## Who it's for

A second-year grad student applying to jobs in Chicago. They apply in bursts between classes, on a phone and a laptop, and lose track of who to follow up with. It's a weekly ritual, not a CRM.

## The main task

Log an application → it's on my list with a follow-up date → on Monday, Seguimiento tells me who to follow up with.

## The flows

The steps, states and errors behind this diagram are in [flows.md](flows.md).

```mermaid
flowchart TD
  subgraph first["First visit"]
    open(["Open Seguimiento"]) --> home["/"]
    home --> anything{"Anything saved?"}
    anything -- No --> empty["Quick add: Company + Role<br/>+ the follow-up rules"]
    empty -- "Add application" --> listed["Stays on /: message<br/>+ Your list, due first<br/>+ one-time tip"]
    listed -- "Add another" --> empty
    empty -. "Add Monday check-in" .-> ics(["Calendar file:<br/>Mondays at 9:00"])
  end

  subgraph main["Main task"]
    add["/add"] --> valid{"Valid?"}
    valid -- "No: errors by field,<br/>typing kept" --> add
    valid -- Yes --> saved["Toast: Added Company — Role"]
    saved -- "Save and add another:<br/>empty form" --> add
    saved -- "Save application:<br/>new one on top" --> list["/applications"]
    list -- Open --> edit["/applications/[id]"]
    edit -- "Save or I followed up:<br/>toast, stay" --> edit
    edit -- "Delete, confirmed inline:<br/>toast" --> list
  end

  subgraph back["Coming back"]
    monday(["Monday"]) --> welcome["/ : Welcome back + date<br/>due · quiet · added vs goal<br/>last check-in"]
    welcome -- "a number, or<br/>Start your check-in?" --> checkin["/check-in"]
    checkin --> due{"Anything due<br/>or quiet?"}
    due -- Yes --> act["Followed up · Snooze a week"]
    act -- "Undo or next one" --> checkin
    checkin -. "14+ days, no update" .-> quiet["Gone quiet:<br/>set a follow-up"]
    checkin --> goal["Added since Monday<br/>vs weekly goal"]
    goal --> doneweek["Done for this week"]
  end

  empty -- "Use the full form<br/>(earlier date, contact)" --> add
  due -- No --> nothing["Nothing due. Add an application<br/>or come back Monday."]
  listed -- "See all" --> list
  listed -- "Use the full form" --> add
  ics -. "Reminder" .-> monday
  anything -- Yes --> welcome
  welcome -- "quick add" --> listed
  act -- Details --> edit
  anypage(["Any page"]) -- "Footer: Weekly check-in" --> checkin
  edit -- "← Back to where<br/>you came from" --> list
```

## Onboarding research

**What I looked at.** How three job-search tools welcome someone new: [Huntr](https://huntr.co/product/job-tracker), [Teal's Job Tracker](https://www.tealhq.com/tools/job-tracker) and [Simplify](https://simplify.jobs/). All three hide their first screen behind sign-up, so I used public sources only: help centers, product pages, store listings and reviews. The full findings, with a link for every fact, are in [docs/onboarding-research.md](docs/onboarding-research.md). The sources I relied on most:

- Teal opens with "a few sample jobs already populated in your Job Tracker" ([help center](https://web.archive.org/web/20250916015333/https://help.tealhq.com/en/articles/9508859-getting-started-job-tracker)), and its guidance is to follow up after applying and archive "if no response after 3 weeks" ([guidance](https://web.archive.org/web/20250916013120/https://help.tealhq.com/en/articles/9530119-job-tracker-guidance)). It emails "an automated reminder on the day of" ([blog](https://web.archive.org/web/20250517122840/https://www.tealhq.com/post/job-search-tracking-spreadsheet)), and tracks a weekly goal, Monday to Sunday, from a target date it asks for at sign-up ([help center](https://web.archive.org/web/20250814115130/https://help.tealhq.com/en/articles/9509646-job-application-widget)).
- Huntr's AI tools "become accessible once a job is saved" ([help center](https://help.huntr.co/en/articles/10393367-your-huntr-dashboard)), and it sends Weekly and Daily Digest emails ([account settings](https://help.huntr.co/en/articles/10503230-account-faq-and-account-settings)). An App Store reviewer was "really confused about how to use this without filling up my board with a bunch of test company names" ([App Store](https://apps.apple.com/app/id1372389812)).
- Simplify asks for target roles, location, salary and experience, plus a matching quiz ([sign-up](https://help.simplify.jobs/articles/0738509-signing-up-for-simplify), [quiz](https://help.simplify.jobs/en/articles/7272801-setting-your-job-match-preferences)). It then opens on a "Profile Strength" score ([profile strength](https://help.simplify.jobs/articles/7361554-building-your-profile-strength)), prompts you to install its extension ([Copilot](https://help.simplify.jobs/articles/1749022-installing-and-setting-up-copilot)), and counts a streak for viewing 5 matches a day ([dashboard](https://help.simplify.jobs/articles/6390631-navigating-your-dashboard)).

**What I took.**

- **Something useful before any effort**, as with Teal's sample jobs. The first visit shows a labeled example Monday, not data.
- **The first save unlocks something**, as with Huntr's AI tools. The first save gives a follow-up date, and the confirmation leads with it.
- **Teal's follow-up rhythm, stated out loud.** Under the example, one line says Seguimiento suggests a follow-up a week after you apply, and that after 2 weeks with no update an application is marked gone quiet. Saying the rule explains why dates appear on their own.
- **A Monday-to-Sunday week**, like Teal's weekly goal, but without the target. This week opens with "Week of Oct 19".
- **A reminder to come back**, like Teal's reminder emails and Huntr's digests. Seguimiento has no server and can't email, so the first visit, and the confirmation after the first save, offer **Add Monday check-in to my calendar**. It downloads a calendar file with a weekly event on Mondays at 9:00 that you add to your own calendar.
- **Value right away, from your own data.** Instead of Teal's sample jobs, a line under the main button says: log applications you've already sent, with the day you applied, and anything from a week ago or more shows up right away in This week.

**What I rejected and why.**

- **Signing up before seeing anything** (all three tools). Seguimiento has no accounts. Everything stays in this browser, and you can start right away.
- **Questionnaires up front** (Simplify's salary, experience and matching quiz; Teal's target date). Nothing is asked before "Log your first application". A grad student logging between classes shouldn't have to set anything up first.
- **Sample data in the real list** (Teal). Huntr's App Store review shows what goes wrong: you can't tell how to try the app without filling it with fake companies. The example is a picture, so there's nothing to clear later.
- **Streaks and quotas** (Simplify's daily streak; Teal's goal of up to 12 applications a week). For a once-a-week ritual, they add pressure without helping you decide who to contact.
- **Setup scores and install prompts** (Simplify's "Profile Strength"; the Teal and Simplify extension prompts). They make the first screen about setting up the tool, not about your job search.

## First visit

_To fill in._

## Coming back

_To fill in._

## What it remembers

Everything stays in this browser's `localStorage`. There's no account and no server, so nothing leaves the device unless you export it ("Export my data" on the check-in, or "Download backup" on Move data: the same file). Each key starts with `seguimiento:`.

| What | Key | Why |
| --- | --- | --- |
| Applications: company, role, status, dates, link, notes, who to follow up with | `seguimiento:v1` → `applications` | It's the whole point: your list, kept from one visit to the next. `v1` leaves room to change the shape later without misreading old data. |
| Weekly goal (3 to start) | `seguimiento:v1` → `settings.weeklyGoal` | The check-in's "This week" bar and Home's "2 of 3" measure against it; you set it once with Change goal. |
| Last check-in | `seguimiento:v1` → `settings.lastCheckInOn` | "Done for this week" saves the day (as `2026-10-19`, your own calendar day), so the check-in stays done until Monday and Home can say "Last check-in" and, after a week, "It's been a week. Start your check-in?" |
| Dismissed hints | `seguimiento:v1` → `settings.dismissedHints` | Once you press Got it (or type your own follow-up date), the tip about the suggested date stays closed on every page and visit. |
| Last filter on All applications | `seguimiento:list-filter` | Coming back to All shows the status chip you chose last, such as Interviewing. Choosing All forgets it. The address still wins, so a link like `?status=offer` opens that filter. |
| Draft of the Add form | `seguimiento:add-draft` | If you leave Add by mistake (a tap on the nav, a closed tab), what you typed comes back with "Restored your draft". Only what you typed is kept: dates left at their defaults are worked out again on the day you return. Saving clears it, and so does Start over. |
| A damaged copy, if one is ever found | `seguimiento:v1:unreadable:<time>` | If saved data can't be read, the original text is set aside under this key instead of being lost, and the app carries on with whatever could be read. |

The applications and settings live under one key, so they're written together and can't get out of step. The filter and the draft each have their own key: they're conveniences, so a broken one is simply forgotten without touching your list. An export (`seguimiento-YYYY-MM-DD.json`) holds the applications and the settings. **Import** on the check-in replaces both with the file's, after asking; **Combine** on Move data merges the applications only. The filter and the draft are never exported: they stay on each device.

It doesn't remember the search text on All, which messages were shown, or where you scrolled. Each visit starts from your list as it is.

## Accessibility

### Keyboard audit (Oct 20, 2026)

**How.** Every page was driven with real key presses (Tab, Shift+Tab, Enter, Space, Escape, arrow keys) in Chrome, with a script over the DevTools protocol and no packages, at 390px and at 1440px. The pages: Home on a first visit and when returning, Add, All applications, an application, an unknown application, the check-in, Move data, the component gallery and a 404. For every Tab stop it recorded where the element sits on screen, and whether the focus ring was actually drawn (a 2px outline) and on screen.

| Check | Result |
| --- | --- |
| The skip link is the first Tab stop and works | ✓ on every page. It appears when focused, Enter moves focus to the page, and the next Tab is the first control: Company on a first visit, the first number when returning. |
| Focus is visible on every control | ✓ after a fix: date fields lost their ring on the calendar button (see below). Everything else shows the 2px ink outline. |
| Tab order follows the visual order | ✓ on every page at both widths, top to bottom and left to right within a row: header, page, footer, then the phone's bottom bar. |
| Enter submits forms | ✓ quick add, Add (and its errors, with focus on the first), an application's Save changes, the weekly goal, Set a follow-up, and Check the file on Import and Move data. In the search field on All, Enter does nothing unexpected. |
| Escape dismisses the toast and inline confirmations | ✓ after fixes. The toast, the delete question, Import's "Replace everything?", Move data's Combine, and the inline Change goal and Set a follow-up forms all close with Escape, with focus back on the button that opened them. |
| Chips are reachable and toggle with Space and Enter | ✓ the role chips on Home and the filter chips on All are one Tab stop each. Arrow keys, Home and End move between chips; Space and Enter press and unpress. |
| Nothing traps focus | ✓ Tab goes through every page and back to the skip link, and Shift+Tab from the first stop reaches the last. The checks were run at 390px and 1440px. |

**What I found and changed.**
- **Date fields hid their focus ring on the calendar button.** In Chrome a date field is four Tab stops (month, day, year, calendar). On the last one the field isn't `:focus`, so no outline was drawn. Date fields now show the ring whenever focus is anywhere inside them (`input[type="date"]:focus-within` in `globals.css`).
- **Escape didn't close the inline confirmations.** It only closed the toast. Now Escape works like Cancel / Keep it on the delete question, the Import confirmation and the Move data confirmation, and on the two inline forms on the check-in. Focus goes back to the button that opened each one (`lib/keys.ts`).
- **Escape on a confirmation also closed the toast.** Next runs React from the document itself, so stopping the event in React didn't stop the toast's own document listener. The inline handlers now mark Escape as handled, and the toast leaves its message up for those. A second Escape closes it.
- **Move data's confirmation had no way back** except choosing another file. It now has **Cancel**, as well as Escape.
- **Focus could be lost when a toast closed.** With focus on the toast's Close button, closing it (Close, Escape or the 5-second timer) left focus nowhere. It now returns to wherever it was before.
- **The skip link relied on browser behavior.** `<main>` now takes focus (`tabIndex={-1}`, with no ring since it isn't a control), so "Skip to content" moves focus into the page in every browser, not just Chrome.

**Known limits.**
- **Date fields** are several Tab stops each. That's the browser's own control, kept so phones get their native date picker.
- **The toast's Close button** comes after the bottom bar in Tab order, even though on a phone the toast shows at the top. The toast is announced through `aria-live` when it appears, focus is never moved into it, and Escape closes it from anywhere.
- **Picking a role chip while Company is empty** moves the cursor to Company, on purpose, so the quick add can be done in one pass.

### Labels and announcements audit (Oct 20, 2026)

**How.** Chrome's accessibility tree, read over the DevTools protocol (`Accessibility.getPartialAXTree` / `getFullAXTree`), is what a screen reader is given, so the checks used it as well as the HTML. Pages were checked at 390px and 1440px, and the checks were run with the errors and confirmations actually showing:
- Home: first visit, the empty quick add, and returning.
- Add: blank, and with errors for empty fields, a bad link and notes over the limit.
- All applications: blank, and with a search that matches nothing.
- An application: blank, with an empty Company and Closed without a reason, and with the delete question open.
- An unknown application.
- The check-in: blank, and with errors in the goal, Set a follow-up and Import.
- Move data, with no file chosen.
- The component gallery and a 404.

| Check | Result |
| --- | --- |
| Every input, select, textarea and file input has a `<label htmlFor>` | ✓ every visible control on every page, 24 of them in the gallery alone. In the tree each one's name comes from its label, never from a placeholder. Link's `https://` placeholder is only a hint. |
| Errors are tied to their field, and the field is marked invalid | ✓ all 16 errors triggered (company, role, link, notes, why it closed, goal, follow-up date, import file, backup file, and the gallery's examples). In the tree each field reads `invalid: true` and its description ends with "Error: …" plus the message. No error message is left unattached, and no field points at an id that doesn't exist. |
| The toast region is `aria-live="polite"` | ✓ in the tree it's a `status` region (`live: polite`, `atomic: true`). It's in the page from the start, so the first toast is read too ("Added Example Co — Data Analyst. Follow up on Tue, Oct 27."). Its Close button is named "Close message". |
| The current nav link has `aria-current` | ✓ exactly one link in the visible nav has `aria-current="page"`: Home on Home and the check-in, Add, All on the list and on an application, and Move data. The gallery and the 404 mark none. The tree confirms it's that link; the DevTools protocol doesn't report `aria-current` itself, so that attribute was checked in the HTML. |
| Icons have text or `aria-hidden` | ✓ every `svg` is `aria-hidden` and sits next to text. No image appears in the tree. No button or link is unnamed, and none reads out a stray symbol like an arrow. |
| Headings run h1 → h2 in order | ✓ every page has one h1 first and never skips a level. On the check-in, each application is an h3 inside its h2 section ("Follow-ups due" › "Example Co"). |

**What I found and changed.** Every check in the table passed: labels, error wiring and the toast come from the shared Field and Toast, so every form has them. Reading the code behind each live region turned up one the tree snapshot couldn't show:
- **Move data's "Downloaded …" line was added to the page only after the download.** Many screen readers stay silent when a live region appears with its message already in it. The line is now always in the page, empty until there's something to say, like the other status lines. It looks the same: the 12px gap only appears once there's text (`app/move/move-data.tsx`).

**Other live regions**, all polite and in the page before they speak:
- the duplicate notice;
- the character counter near a limit;
- the list's "Showing 3 of 5." line;
- the calendar, Export and Move data download lines.

"Done. See you next Monday." and the import result are announced a different way: focus moves to them. The one assertive region is Next's own route announcer, which reads the new page's title after each navigation.

**Known limits.**
- The gallery's EmptyState example shows its h2 ("Nothing logged yet") next to the section's own h2. That's how the component sits on a real page, under the h1. It's a level-order demo, not a skipped level.
- While a page is still loading, it shows "Loading…" without a heading for a moment.

### Contrast check (Oct 20, 2026)

**How.**
- **Finding the pairs.** Chrome rendered every page at 390px and 1440px: Home on a first visit and returning, Add, All, applications in each status, the check-in, Move data, the component gallery and a 404. It also rendered the states that bring in other colors: field errors on the page and inside cards, the delete question, the toast, and the gallery's forced hover and disabled states. A script walked every visible piece of text and recorded its color, the background actually behind it and its size, plus each field's placeholder color. Every color it found was a Calm token; nothing is drawn in a one-off color.
- **Computing the ratios.** `npm run check:contrast` (`scripts/check-contrast.mjs`) reads the tokens from `app/globals.css` and computes the WCAG ratio for each pair, rounded down. It exits with an error if any pair falls short, so a token change gets checked again. `npm run check:contrast -- --md` prints the table below.

**The bar.** Text is 4.5:1. Nearly all of it is 13 to 16px, and the few large headings are ink, which passes either way. Large text and the focus ring are 3:1.

| Pair | Where | Text | Background | Ratio | Needs | Result |
| --- | --- | --- | --- | --- | --- | --- |
| Body text | pages, labels, headings | `--ink` #3a2b21 | `--bg` #ebe2d0 | 10.54:1 | 4.5:1 | ✓ pass |
| Body text on a card | cards, the header, the bottom bar, fields | `--ink` #3a2b21 | `--surface` #fbf7ee | 12.69:1 | 4.5:1 | ✓ pass |
| Body text on a tint | Interviewing and new badges, pressed chips, the toast, hovered buttons, the current tab on a laptop | `--ink` #3a2b21 | `--accent-soft` #dde4d4 | 10.41:1 | 4.5:1 | ✓ pass |
| Body text on grey | a nav link under the pointer on a laptop | `--ink` #3a2b21 | `--subtle` #efede7 | 11.59:1 | 4.5:1 | ✓ pass |
| Body text on the error tint | the delete question | `--ink` #3a2b21 | `--error-soft` #fbe9e6 | 11.56:1 | 4.5:1 | ✓ pass |
| Muted text | descriptions, hints, the footer, the Closed badge, disabled buttons | `--muted` #6b5848 | `--bg` #ebe2d0 | 5.24:1 | 4.5:1 | ✓ pass |
| Muted text on a card | roles, dates, field hints, nav labels on a phone | `--muted` #6b5848 | `--surface` #fbf7ee | 6.30:1 | 4.5:1 | ✓ pass |
| Muted text on grey | Quiet and date badges, the closed-application note | `--muted` #6b5848 | `--subtle` #efede7 | 5.75:1 | 4.5:1 | ✓ pass |
| Muted text on a tint | counts in a pressed chip | `--muted` #6b5848 | `--accent-soft` #dde4d4 | 5.17:1 | 4.5:1 | ✓ pass |
| Links | TextLink: ink text, underlined | `--ink` #3a2b21 | `--bg` #ebe2d0 | 10.54:1 | 4.5:1 | ✓ pass |
| Links on a card | TextLink inside a card | `--ink` #3a2b21 | `--surface` #fbf7ee | 12.69:1 | 4.5:1 | ✓ pass |
| Large headings | the h1 (40 to 64px) and serif h2s (24px) | `--ink` #3a2b21 | `--bg` #ebe2d0 | 10.54:1 | 3:1 | ✓ pass |
| Primary button label | the one main action | `--accent-ink` #3a2b21 | `--accent` #8a9e80 | 4.70:1 | 4.5:1 | ✓ pass |
| Primary button label, under the pointer | the one main action | `--accent-ink` #3a2b21 | `--accent-hover` #a1b096 | 5.92:1 | 4.5:1 | ✓ pass |
| Badge: Applied, Followed up | status | `--ink` #3a2b21 | `--surface` #fbf7ee | 12.69:1 | 4.5:1 | ✓ pass |
| Badge: Interviewing, new | status, the row you just changed | `--ink` #3a2b21 | `--accent-soft` #dde4d4 | 10.41:1 | 4.5:1 | ✓ pass |
| Badge: Offer | status | `--surface` #fbf7ee | `--ink` #3a2b21 | 12.69:1 | 4.5:1 | ✓ pass |
| Badge: Closed (on the page) | status, dashed edge | `--muted` #6b5848 | `--bg` #ebe2d0 | 5.24:1 | 4.5:1 | ✓ pass |
| Badge: Closed (on a card) | status, dashed edge | `--muted` #6b5848 | `--surface` #fbf7ee | 6.30:1 | 4.5:1 | ✓ pass |
| Badge: Due, late | follow-up dates | `--late` #7a4300 | `--late-soft` #fbecd2 | 6.85:1 | 4.5:1 | ✓ pass |
| Badge: Quiet, dates | gone quiet, plain dates | `--muted` #6b5848 | `--subtle` #efede7 | 5.75:1 | 4.5:1 | ✓ pass |
| Error text | field errors on the page | `--error` #b02a1f | `--bg` #ebe2d0 | 5.10:1 | 4.5:1 | ✓ pass |
| Error text on a card | field errors inside a card (Move data, the check-in) | `--error` #b02a1f | `--surface` #fbf7ee | 6.14:1 | 4.5:1 | ✓ pass |
| Danger button label | Delete, at rest | `--error` #b02a1f | `--bg` #ebe2d0 | 5.10:1 | 4.5:1 | ✓ pass |
| Danger button label, under the pointer | Delete | `--error` #b02a1f | `--error-soft` #fbe9e6 | 5.59:1 | 4.5:1 | ✓ pass |
| Placeholder text | Link's https:// | `--muted` #6b5848 | `--surface` #fbf7ee | 6.30:1 | 4.5:1 | ✓ pass |
| Focus ring on the page | 2px ring, 2px from the control | `--focus` #3a2b21 | `--bg` #ebe2d0 | 10.54:1 | 3:1 | ✓ pass |
| Focus ring on a card |  | `--focus` #3a2b21 | `--surface` #fbf7ee | 12.69:1 | 3:1 | ✓ pass |
| Focus ring on a tint | inside the toast | `--focus` #3a2b21 | `--accent-soft` #dde4d4 | 10.41:1 | 3:1 | ✓ pass |
| Focus ring on the error tint | inside the delete question | `--focus` #3a2b21 | `--error-soft` #fbe9e6 | 11.56:1 | 3:1 | ✓ pass |

**Result.** All 30 pairs pass, so no token changed. The closest is the primary button's label, ink on sage, at 4.70:1. That leaves little room: a darker `--accent` or a lighter `--accent-ink` could drop it under 4.5:1, so run the check again after changing either.

Not text, so not in the table:
- The link underline (`--accent-strong`) is a second cue; the link text itself is ink.
- The progress bar's fill is 3.65:1 against its track (3:1 is the minimum for shapes), with the numbers beside it.
- Disabled controls, which WCAG exempts, use the muted pair anyway (5.24:1).

### Also in place

- Errors sit next to the field, say what to do next and keep what was typed. Focus goes to the first one.
- Toasts never hold actions. Undo and confirmations are Notices on the page instead.
- The current page is marked on screen as well, with an underline on a phone and a filled tab on a laptop. Late and quiet items say so in words, never by color alone.
- Tap targets are at least 44px, and inputs use 16px text so phones don't zoom in.

## First-run check

Run on the live site on Oct 20, 2026, as a brand-new user on a phone. The goal: "Log the three jobs you applied to this week and set when to follow up." Then a return visit a week later, through the check-in. The full report is in [docs/first-run-check.md](docs/first-run-check.md), with every step and a screenshot for each.

- **Biggest problem:** "I followed up today" is the main button on an application's page even when nothing is due. One tap can also pull a chosen follow-up date earlier.
- **Worked well:** the empty-Role error, follow-up dates that set themselves and say so, and the weekly check-in.
- Nine problems are ranked by impact with a proposed fix for each. None are fixed yet.

## Running locally

_To fill in._
