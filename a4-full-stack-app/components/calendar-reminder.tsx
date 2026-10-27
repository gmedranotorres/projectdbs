"use client";

import { useId, useState } from "react";
import { formatDay, nextWeekday, today as getToday, type Day } from "@/lib/dates";
import type { Settings } from "@/lib/types";
import { useApplications } from "@/hooks/useApplications";
import { Button, Field, Select } from "./ui";

// Seguimiento has no server, so it can't email anyone. Instead it hands over
// a calendar file with a weekly check-in that the person adds to their own
// calendar. The day is theirs to pick (Monday unless they choose another,
// after class feedback asking for that); it's saved with the settings, so
// every reminder button and its words use the same day.

export const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

// iCalendar's names for the days, in the same order.
const BYDAY = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const MONDAY = 1;

// The day the person picked, or Monday.
export function checkInDayOf(settings: Settings): number {
  return settings.checkInDay ?? MONDAY;
}

// "Monday", for sentences such as "Come back Monday".
export function checkInDayName(settings: Settings): string {
  return WEEKDAYS[checkInDayOf(settings)];
}

function fileName(weekday: number): string {
  return `seguimiento-${WEEKDAYS[weekday].toLowerCase()}-check-in.ics`;
}

// 9:00 with no time zone is "9:00 wherever you are" in iCalendar, so the
// reminder follows the person's own clock, like the stored dates do.
function calendarFile(first: Day, weekday: number, url: string): string {
  const day = first.replaceAll("-", "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Seguimiento//Weekly check-in//EN",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@seguimiento`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${day}T090000`,
    "DURATION:PT15M",
    `RRULE:FREQ=WEEKLY;BYDAY=${BYDAY[weekday]}`,
    "SUMMARY:Seguimiento check-in",
    "DESCRIPTION:See who to follow up with this week.",
    `URL:${url}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Seguimiento check-in",
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

// Pick the day, then add it: on Home's first visit and on the check-in.
export function CalendarReminder() {
  const store = useApplications();
  const selectId = useId();
  const weekday = checkInDayOf(store.settings);
  const first = nextWeekday(getToday(), weekday);

  return (
    <div className="space-y-4">
      <p>
        Get a weekly reminder in your own calendar: a check-in at 9:00 every{" "}
        {WEEKDAYS[weekday]}, starting {formatDay(first)}.
      </p>
      <div className="max-w-xs">
        <Field id={selectId} label="Check-in day">
          <Select
            name="checkInDay"
            value={weekday}
            onChange={(e) => store.setSettings({ checkInDay: Number(e.target.value) })}
          >
            {/* Monday first, as the weeks run. */}
            {[1, 2, 3, 4, 5, 6, 0].map((d) => (
              <option key={d} value={d}>
                {WEEKDAYS[d]}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <ReminderButton label={`Add ${WEEKDAYS[weekday]} check-in to my calendar`} />
    </div>
  );
}

// The button alone, with the line that confirms the download: also used on
// the check-in when nothing is due ("come back Monday"). It uses the saved
// day.
export function ReminderButton({ label, variant = "secondary" }: { label: string; variant?: "secondary" | "quiet" }) {
  const store = useApplications();
  const [downloaded, setDownloaded] = useState<string | null>(null);
  const weekday = checkInDayOf(store.settings);

  function download() {
    const name = fileName(weekday);
    const file = calendarFile(nextWeekday(getToday(), weekday), weekday, window.location.origin);
    const url = URL.createObjectURL(new Blob([file], { type: "text/calendar" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(name);
  }

  return (
    <div className="space-y-2">
      <Button variant={variant} onClick={download}>
        {label}
      </Button>
      <p role="status" className="text-sm text-muted">
        {downloaded && `Downloaded ${downloaded}. Open it to add the check-in to your calendar.`}
      </p>
    </div>
  );
}
