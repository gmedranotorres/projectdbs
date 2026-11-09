---
name: morning-check-in
description: Gabriela's morning check-in. Reads her courses, the weather, Divvy and the harness's notes, asks one or two questions, proposes a plan for the day, and saves it to the page once she agrees. Use when she says good morning, asks to plan her day or what to work on first, asks what's due, or says she just woke up. Also use when she wants to change today's plan ("move the clinic block," "I'm running late").
---

# Morning check-in

Plan the day *with* her. Don't save anything until she says yes.

## 1. Read (quietly, before saying anything)

- `notes/state.md` (open work, wake target), the top entry of `notes/log.md`, and the newest file in `plans/` (yesterday's plan, for anything she didn't get to)
- `data/courses.json`: today's fixed events, and deadlines in the next 7 days
- `context/planning.md`: how to rank and build the day
- `node scripts/weather.mjs`
- `context/commute.md`, only to decide walk or bike and to get leave-by times. Run `node scripts/divvy.mjs` only if the weather passes the bike rule.

Get today's date and the time with `date`. Don't assume them.

## 2. Open with a short read of the day (5 lines at most)

- What's fixed today and the first time she has to leave
- The nearest deadline that matters, with how long until it
- Walk or bike, in one phrase ("Walk: 6 to 14°C, no rain")
- What's carried over from yesterday, if anything

## 3. Ask one or two questions

Always ask what time she woke up, unless she already said it. Then ask at most one more question, and only if the answer changes the plan (see `context/planning.md`). Wait for her answers.

## 4. Propose the plan

A short list in chat, one line per block: `09:30 to 12:00  Clinic: pdfplumber function returns text per page`. Include travel with leave-by times, lunch, and the 21:00 stop. Say in one line why the first block is first. Then ask: "Save this?"

If she changes something, show the new list and ask again.

## 5. When she agrees, save

1. Write `plans/YYYY-MM-DD.json` in the shape described in `context/plan-format.md`.
2. Run `node scripts/check-plan.mjs plans/YYYY-MM-DD.json`. Fix any problems and run it again until it says OK.
3. Update `notes/state.md`: what moved forward, new facts she told you, and the wake-shift count (move the target only by the rule in `context/planning.md`).
4. Add an entry to the top of `notes/log.md`:

   ```
   ## YYYY-MM-DD
   - Woke HH:MM (target HH:MM). Checked in HH:MM.
   - Plan: one line.
   - She said: anything new (a decision, a blocker, how she's feeling about a deadline).
   ```

5. Reply with: "Plan saved. Your page is updated." and the first thing to do.

## Changing the plan later in the day

Same steps, starting from now: don't rewrite blocks that are already over. Save over today's file, check it, and add a line under today's log entry ("11:20: moved the clinic block to 14:00, the TA session ran long").

## Never

- Change anything in `data/`, or write to any calendar, Canvas, GitHub, Slack or email. If she asks to move a class or an event, explain that she'd change it herself, and replan around it.
- Write Micro answers or prose.
- Put her home or the stations near it in a plan, a note or a reply.
