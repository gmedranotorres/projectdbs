# Plan file format

One file per day: `plans/YYYY-MM-DD.json`. Saving again the same day replaces that day's file. The page shows the newest date and reloads within a few seconds of a save. Write valid JSON. Times are "HH:MM", 24-hour, Chicago time.

```json
{
  "date": "2026-11-10",
  "saved_at": "2026-11-10T09:12:00-06:00",
  "check_in": { "at": "09:05", "woke_at": "08:50", "wake_target": "08:45" },
  "headline": "A6 is due at 5:30. Finish the hook by noon, record the demo after lunch.",
  "weather": { "summary": "Clear, then overcast. 6 to 14°C, no rain.", "commute": "walk", "why": "Below 20°C" },
  "blocks": [
    { "start": "09:30", "end": "12:00", "kind": "work", "course": "dbs", "title": "A6: hook and test", "outcome": "Moving an event is blocked, and the block shows in the demo" },
    { "start": "12:45", "end": "14:00", "kind": "meal", "title": "Lunch" },
    { "start": "17:14", "end": "17:30", "kind": "travel", "title": "Walk to Crerar" },
    { "start": "17:30", "end": "19:30", "kind": "class", "course": "dbs", "title": "Design, Build, Ship", "place": "Crerar 298" }
  ],
  "deadlines": [
    { "what": "A6: Life Harness", "course": "dbs", "due": "2026-11-10T17:30" },
    { "what": "Clinic video, first draft", "course": "clinic", "due": "2026-11-25", "estimated": true }
  ],
  "carried_over": ["Ask the clinic team: sort PDFs by vendor or by test type?"],
  "notes": ["Ariel's office hours 9:00 to 10:30 if the hook fights you."]
}
```

## Fields

- `kind`: `work`, `class` (also TA sessions and the mentor meeting), `meal`, `travel`, `study` (Micro review), `buffer`, `break`.
- `course`: `dbs`, `micro`, `clinic`, or leave it out for life things.
- `outcome`: work and study blocks only. One sentence she can check off.
- `place`: buildings only. Never her home or a Divvy station near home.
- `weather.commute`: `walk` or `bike`. On a bike day, `why` gives the counts ("5 bikes at pickup, 11 docks at Crerar at 08:40"), with no station names.
- `deadlines`: everything due in the next 7 days, plus any `estimated` clinic date in the next 21 days. Keep `estimated: true` where `data/courses.json` has it.
- `carried_over`: what was left from yesterday's plan, in her words when possible.
- Blocks are in time order, never overlap, and nothing ends after 21:00.
