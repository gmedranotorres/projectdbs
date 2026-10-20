# Seguimiento: user flows

```mermaid
flowchart TD
  subgraph first["First visit"]
    open(["Open Seguimiento"]) --> home["/"]
    home --> anything{"Anything saved?"}
    anything -- No --> empty["Quick add: Company + Role<br/>+ the follow-up rules"]
    empty -- "Add application" --> listed["Stays on /: message<br/>+ Your list, newest first<br/>+ one-time tip"]
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
    monday(["Monday"]) --> checkin["/ (check-in)"]
    checkin --> due{"Anything due<br/>or quiet?"}
    due -- Yes --> act["I followed up · Not yet"]
    act -- "Undo or next one" --> checkin
    checkin -. "21+ days, no news" .-> quiet["Gone quiet:<br/>follow up · close"]
  end

  empty -- "Use the full form<br/>(earlier date, contact)" --> add
  due -- No --> listed
  listed -- "See all" --> list
  listed -- "Add details" --> add
  ics -. "Reminder" .-> monday
  anything -- Yes --> checkin
  act -- Details --> edit
```

Seguimiento is a weekly ritual for one person: a second-year grad student applying to jobs in Chicago, usually in bursts between classes, on both a phone and a laptop. The main task in one sentence: I log an application, it goes on my list with a follow-up date, and when I come back on Monday it tells me who to follow up with.

Everything is saved in the browser's localStorage. There are no accounts, database or APIs. Every step is its own page, and the same navigation sits on all of them: **Home** (`/`), **Add** (`/add`), **All** (`/applications`) and **Move data** (`/move`). On a phone the navigation is a bar at the bottom, within reach of a thumb. On a laptop it sits in the header. Each application has its own page, `/applications/<id>`, reached from a list.

Forms are one column with a label on every field. Errors appear when you save. Each one sits next to its field, says what to do next, and keeps what you typed.

## The follow-up rules

The follow-up date is filled in for you where a rule makes sense, and you can always change it:

- **Applied:** one week after the day you applied.
- **Followed up** (shown as Applied in the Status field): two weeks after the day you press I followed up.
- **Interviewing:** choosing it fills in three days from today. The interview date is optional.
- **Offer:** keeps the date it had. Answering the offer is the next step, so it still comes up in This week, but it never goes quiet.
- **Closed** (Rejected, Withdrawn or No response): there's no follow-up date.

On Add, the date follows Applied on until you type your own. After that, a suggestion appears under the field with a "Use" button, and the date only changes if you press it. On an application's page, choosing Interviewing fills in its date, and choosing another status right after puts the earlier date back.

An open application goes quiet when there has been no news for 21 days. News means applying, following up or a change of status; an interview still to come also counts. Pressing "Not yet" isn't news, so an application you keep postponing still goes quiet on schedule.

## Flow 1: The first visit

You open Seguimiento for the first time, with nothing saved. For a moment, while the browser reads saved data, the page shows a neutral placeholder with no words in it. That way, someone who does have data never sees the empty screen flash first.

Then the page says what Seguimiento is for and lets you start right there. The heading is "Keep every application moving.", and one line under it says: log what you applied to, and come back on Monday to see who to follow up with. Below is a quick add with two fields, **Company** and **Role**. Both are marked required for screen readers. Under Role, chips offer roles you're likely to type: Data Analyst, Research Associate, Policy Analyst and Associate Consultant. Tapping one fills in Role and, if Company is still empty, moves you there; tapping it again clears Role. With a keyboard, the chips are one Tab stop and the arrow keys move between them. Before the button, a line links to the full Add form, for an application sent on an earlier day or one with a contact to follow up with, so it's read before an older application gets today's date. Under the button, a small line says "Saved on this device. No account." There's no tour, no pop-up and no sample data.

Pressing **Add application** with a field empty gives "Enter the company name." or "Enter the role title." next to the field, keeps what you typed, and moves you to the first one. A quick add saves today as the day you applied and a follow-up a week later. A short message says so ("Added Example Co — Data Analyst. Follow up on Tue, Oct 27."), announced politely to screen readers. On a phone it appears at the top of the screen, so it doesn't cover the new item below the form. You stay on the page: the form empties for the next one, and what you added appears below it under "Your list", newest first, each row with **Open**. The list shows the newest five; **See all** goes to the All page, and **Add details** opens the full Add form, so it's always within reach but never required.

Beside the newest item's follow-up date, a one-time tip says "We suggested a follow-up a week out. Change it anytime." It stays, visit after visit, until you press **Got it** or type a follow-up date of your own on Add or an application's page. Either one closes it for good on this device. The tip only appears beside a date Seguimiento suggested.

Before anything is saved, a line under the form states the rules: a follow-up a week after you apply, which you can always change, and after 3 weeks with no news, an application is marked gone quiet. Once the list appears, the tip does that job. The Monday calendar reminder is offered on the first visit and right after the first save.

`/` stays like this, the quick add and your newest applications, while nothing is due or gone quiet. When a follow-up comes up, `/` becomes the This week check-in below.

Seguimiento has no account, so it can't email anyone. Instead, the page offers **Add Monday check-in to my calendar**. It downloads `seguimiento-monday-check-in.ics`, a weekly event on Mondays at 9:00 starting next Monday, which the person adds to their own calendar. The page then says the file was downloaded and to open it. A last line, for someone who already uses Seguimiento on another device, links to loading a backup.

If the first save happens on the full Add page instead, a toast says "Added Example Co — Data Analyst." and the All page opens with the new application on top (see Flow 2). The Monday calendar reminder is on Home.

**Error: the browser won't save.** This happens in a private window, or when site data is blocked. A banner on every page says so: anything you add will be gone when you close the tab, so open Seguimiento in a regular window or allow this site to store data. The app still works for that tab, so you can see what it does.

## Flow 2: The main task (add, list, update)

**Add.** The Add page is one column, in this order: Company, Role, Applied on (today is filled in), Follow up on (a week later is filled in, and it follows Applied on until you type your own), then Link, Notes and Who to follow up with, all three optional. There's no status: a new application starts as Applied. Pressing **Save application** saves it, a toast says "Added Example Co — Data Analyst.", and the All page opens with the new application on top, highlighted for a few seconds and focused for keyboard and screen reader users. The list replaces the form in the browser's history, so **Back** goes to where you were before Add, not to a filled form. Because applications come in bursts, **Save and add another** saves, shows the same toast, and gives an empty form with the cursor in Company. After a duplicate warning, **Save anyway** does whatever the button you pressed would have done.

**Errors when adding.** Fields are checked when you save. Every problem is shown at once, next to its field, what you typed stays, and the cursor moves to the first one. From then on, a field with an error is checked again as you change it: the error goes as soon as it's fixed, and fixing Applied on can also clear Follow up on.

- An empty company: "Enter the company name."
- An empty role: "Enter the role title."
- Applied on empty or not a date: "Enter the date you applied."
- Applied on in the future: "Choose today or an earlier date."
- A follow-up date before Applied on: "Choose a follow-up date on or after the application date."
- A link that doesn't start with http:// or https://: "Enter a full link starting with https://, or leave it blank."

Logging the same company and role twice is a warning, not an error: "You already logged Data Analyst at Morningstar on Oct 3." It offers **Save anyway** or **Open that one**. If the browser refuses to save, usually because its storage is full, a message above the button says so. The form stays filled in so you can try again.

**List.** The All page shows every application as one list, sorted by follow-up date, soonest first, with those without a follow-up date last. Each row shows the company, role, status and follow-up date, and an **Open** link. Late ones also say "7 days late" with a clock icon, and gone-quiet ones "No news for 35 days", so nothing depends on color alone. At the top, a search field labelled "Search by company or role" narrows the list as you type, and filter chips (All, Applied, Interviewing, Offer, Closed) show how many each holds. Followed up counts as Applied; Rejected, Withdrawn and No response count as Closed. The chosen filter is in the address (`?status=offer`), so Back and a shared link keep it; pressing the chip that's on goes back to All. While filtering or searching, a line says "Showing 3 of 5."

**Never a blank page.** With nothing saved, the page says "Nothing logged yet" and offers **Log your first application**, which goes to Home. A filter with nothing in it says so in one sentence ("No offers yet.") with a link, **Show all applications**. A search with no results says "Nothing matches “zzz”." with **Clear search**, which puts the cursor back in the search field. After you add one, it sits on top, highlighted for a few seconds.

**One application.** Open on any list goes to the application's own page. At the top, what's saved: company, role, status, the day you applied and the next follow-up. Then the most common change, **I followed up today**, which moves the next follow-up two weeks out in one tap and says so in a toast. An application that's Interviewing or has an offer keeps its status. Below it, every field, with the same fields and rules as Add, plus **Status**: Applied, Interviewing, Offer or Closed. Choosing Closed asks **Why it closed** (Rejected, Withdrawn or No response) and hides the follow-up date. **Save changes** stays on the page and says "Saved" in a toast. **Delete application** asks first, on the page, not in a browser dialog: it says it can't be undone and that closing keeps the record instead. **Delete it** goes to the list with "Deleted Example Co — Data Analyst." in a toast, and **Keep it** puts you back on Delete application. The list replaces the page in the history, so Back can't open what was deleted.

**Errors on an application's page.** The same errors as Add, plus "Choose why it closed." when Closed has no reason, and "Pick a follow-up date." when a reopened application has none. An interview date, if given, can't be before the day you applied. If the address doesn't match anything saved here, perhaps because it was deleted or saved in another browser, the page says "This application isn't on this device." with a link to all applications.

## Flow 3: Coming back (the Monday check-in)

Once something is due or gone quiet, Home is the This week check-in. It works on any day, but it's built for Monday. It opens with "Week of Oct 19" and then shows only what needs a decision. Every decision can be made on that page without opening each application.

**Follow-ups due.** "Follow up this week" lists everything due by Sunday, late ones first. Each item names the person when you gave one ("Follow up with Priya at Morningstar"), shows the role and status, and says when it was due ("4 days late", "Due today", "Due Thu, Oct 22"). Each one has **I followed up** (the next date moves two weeks out), **Not yet** (asks again in a week) and **Details**.

**Applications gone quiet.** "Gone quiet" lists open applications with no news in three weeks or more, the quietest first, with how long it has been. Each one has **Follow up once more** or **Close it**, which closes it as No response.

After any of these actions, a message says what happened ("Followed up with Morningstar. Next follow-up Sun, Nov 1"), with an **Undo** in case of a wrong tap on a phone.

**All caught up.** When nothing is due or quiet, `/` goes back to the quick add and your newest applications (see Flow 1). Right after you handle the last due one, the check-in stays while its message and **Undo** are showing, and says what's next: "Nothing due this week. Next: Grubhub on Thu, Oct 29 (in 11 days)".

**Everything closed.** When every application is closed, nothing is due, so `/` shows the quick add and your newest applications.

**Other states.** The page shows a neutral placeholder while loading, and the first-visit page when nothing is saved. When the saved data is damaged and can't be read, a banner on every page explains it. The damaged copy is set aside under another key, the list continues with whatever could be read, and the banner points to loading a backup. If the browser refuses to save "I followed up", "Not yet", "Follow up once more" or "Close it", the message says the change couldn't be saved. If it refuses an Undo, the message says the change is still saved and keeps the Undo button so you can try again.

## Moving between devices

localStorage stays in one browser, so the phone and the laptop each have their own list. Move data connects them with a file. On one device, **Download backup** saves `seguimiento-2026-10-19.json`. On the other, you choose that file and press **Check the file**. Before anything changes, Seguimiento says what loading it would do: "This backup has 15 applications. Loading it adds 3 and updates 2. Nothing is deleted." **Combine** then merges the two lists. When both devices changed the same application, the more recent change wins. When it's done, the page says how many applications are on this device and offers See this week. If the two already match, the page says there's nothing to combine.

**Errors.** Pressing Check the file with no file chosen gives "Choose the .json file you downloaded from Seguimiento." A file that isn't a Seguimiento backup, or is damaged, gives "This file isn't a Seguimiento backup. Download a new one on your other device and try again." If saving the combined list fails, nothing changes and the page says so. A device with nothing saved says there's nothing to download yet, instead of offering an empty file.

## Cut for simplicity

- **Saving a half-finished form automatically:** the form is short, and errors already keep what you typed.
- **Tags:** status and the search by company or role are enough to find an application among a few dozen.
- **A separate contacts list:** one optional "who to follow up with" field per application is enough to say "Email Priya at Morningstar."
- **Weekly stats** ("you logged 4, followed up 2"): they're nice to see but don't help decide who to contact.
- **Syncing between open tabs:** it's one person in one tab at a time, and each page reads fresh data when opened.
- **Recovering damaged saved data:** the raw copy is kept under another key and the list carries on, which is enough for a rare problem.
- **Example data on the first visit:** the quick add puts your own first application on the page within seconds, so there's nothing to clear later.
- **Automatic sync and backup reminders:** there's no server to sync through, and a reminder would need one more thing to track.
- **Undoing a combine:** the summary before confirming and the "nothing is deleted" rule make it safe without one.
- **One-week and two-week buttons on the follow-up date:** the rule already fills in the date, and the "Use" suggestion covers changing it, with fewer buttons on a phone.
