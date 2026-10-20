"use client";

import { useState } from "react";
import { addDays, formatDay, startOfWeek, today as getToday, type Day } from "@/lib/dates";
import { Button } from "./ui";

// Seguimiento has no server, so it can't email anyone. Instead it hands over
// a calendar file with a weekly Monday check-in that the person adds to
// their own calendar.

const FILE_NAME = "seguimiento-monday-check-in.ics";

// This Monday if today is one, otherwise the next.
function nextMonday(today: Day): Day {
  const monday = startOfWeek(today);
  return monday === today ? today : addDays(monday, 7);
}

// 9:00 with no time zone is "9:00 wherever you are" in iCalendar, so the
// reminder follows the person's own clock, like the stored dates do.
function calendarFile(firstMonday: Day, url: string): string {
  const day = firstMonday.replaceAll("-", "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Seguimiento//Monday check-in//EN",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@seguimiento`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${day}T090000`,
    "DURATION:PT15M",
    "RRULE:FREQ=WEEKLY;BYDAY=MO",
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

export function CalendarReminder() {
  const [downloaded, setDownloaded] = useState(false);
  const firstMonday = nextMonday(getToday());

  function download() {
    const file = calendarFile(firstMonday, window.location.origin);
    const url = URL.createObjectURL(new Blob([file], { type: "text/calendar" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = FILE_NAME;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }

  return (
    <div className="space-y-3">
      <p>
        Get a Monday reminder in your own calendar: a weekly check-in at 9:00, starting{" "}
        {formatDay(firstMonday)}.
      </p>
      <Button variant="secondary" onClick={download}>
        Add Monday check-in to my calendar
      </Button>
      <p role="status" className="text-sm text-muted">
        {downloaded && `Downloaded ${FILE_NAME}. Open it to add the check-in to your calendar.`}
      </p>
    </div>
  );
}
