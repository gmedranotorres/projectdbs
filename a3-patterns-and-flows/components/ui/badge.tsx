import type { ReactNode } from "react";
import type { Status } from "@/lib/applications";

// Calm's badge, from A2: small corners and the label type role. Four looks
// for status (Applied, Interviewing, Offer, Closed), and small tags for
// when: "Due" (with a clock), "Quiet" (with a moon), a plain one for dates,
// and "new" for the row you just changed. Every badge carries words, and
// the strongest ones an icon or a dashed edge, so color is never the only
// sign. Without children, a badge says its own name.

export type BadgeTone =
  | "applied"
  | "interviewing"
  | "offer"
  | "closed"
  | "due"
  | "quiet"
  | "neutral"
  | "new";

const tones: Record<BadgeTone, string> = {
  applied: "border-line-strong bg-surface text-ink",
  interviewing: "border-accent-soft bg-accent-soft text-ink",
  offer: "border-ink bg-ink text-surface",
  closed: "border-dashed border-line-strong bg-transparent text-muted",
  due: "border-late-soft bg-late-soft text-late",
  quiet: "border-line bg-subtle text-muted",
  neutral: "border-line bg-subtle text-muted",
  new: "border-accent-strong bg-accent-soft text-ink",
};

const names: Partial<Record<BadgeTone, string>> = {
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  closed: "Closed",
  due: "Due",
  quiet: "Quiet",
};

// The look for each of an application's statuses. The words stay the
// status's own ("Followed up", "Rejected"), so nothing is lost.
export function statusTone(status: Status): BadgeTone {
  switch (status) {
    case "applied":
    case "followed-up":
      return "applied";
    case "interviewing":
      return "interviewing";
    case "offer":
      return "offer";
    default:
      return "closed";
  }
}

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children?: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-badge border px-2 py-0.5 text-label whitespace-nowrap ${tones[tone]}`}
    >
      {tone === "due" && (
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="10" cy="10" r="7.5" />
          <path d="M10 6v4.5l3 1.5" strokeLinecap="round" />
        </svg>
      )}
      {tone === "quiet" && (
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
          <path d="M15.5 12.5A6.5 6.5 0 0 1 7.5 4.5a6.5 6.5 0 1 0 8 8Z" />
        </svg>
      )}
      {children ?? names[tone]}
    </span>
  );
}
