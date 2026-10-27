import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { SPONSORSHIP_TAGS, STATUS_LABELS, type Sponsorship, type Status } from "@/lib/applications";
import { formatDay, type Day } from "@/lib/dates";
import { Badge, statusTone } from "./badge";

// Calm's card, from A2: the surface color, a thin edge and large corners,
// plus (since the A3 feedback) a soft shadow that lifts it off the page.
export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`rounded-card border border-line bg-surface p-4 shadow-raised ${className}`}
      {...props}
    />
  );
}

// A card of rows with a thin line between them. Put ListRows inside.
export function List({ className = "", ...props }: ComponentProps<"ul">) {
  return (
    <ul
      className={`divide-y divide-line overflow-hidden rounded-card border border-line bg-surface shadow-raised ${className}`}
      {...props}
    />
  );
}

// One application in a list: company, role, status, follow-up date, and an
// "Open" link that names the application for screen readers. `sponsorship`,
// when given, is a small tag beside the status. `hint` sits
// beside the follow-up date, for words such as "5 days late". `note` goes
// under the whole row, for anything with a button, so Tab reaches Open (top
// right) before it. `highlight` tints the row (it fades out when turned
// off), and `rowId` lets a page move focus to it.
export function ListRow({
  company,
  role,
  status,
  sponsorship,
  followUpOn,
  href,
  hint,
  note,
  highlight = false,
  rowId,
}: {
  company: string;
  role: string;
  status: Status;
  sponsorship?: Sponsorship;
  followUpOn?: Day;
  href: string;
  hint?: ReactNode;
  note?: ReactNode;
  highlight?: boolean;
  rowId?: string;
}) {
  return (
    <li
      id={rowId}
      tabIndex={rowId ? -1 : undefined}
      className={`px-4 py-3 transition-colors duration-700 motion-reduce:transition-none ${highlight ? "bg-accent-soft" : ""}`}
    >
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div>
            {/* Long names end with "…" after two lines; nothing pushes the row wider. */}
            <p className="line-clamp-2 font-medium wrap-anywhere">{company}</p>
            <p className="line-clamp-2 text-muted wrap-anywhere">{role}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <Badge tone={statusTone(status)}>{STATUS_LABELS[status]}</Badge>
            {sponsorship && <Badge>{SPONSORSHIP_TAGS[sponsorship]}</Badge>}
            <span className="text-sm text-muted">
              {followUpOn ? `Follow up ${formatDay(followUpOn)}` : "No follow-up"}
            </span>
            {hint}
          </div>
        </div>
        <Link
          href={href}
          className="inline-flex min-h-11 items-center font-medium text-ink underline decoration-accent-strong underline-offset-4 hover:decoration-ink hover:decoration-2"
        >
          Open<span className="sr-only">: {role} at {company}</span>
        </Link>
      </div>
      {note && <div className="mt-1.5">{note}</div>}
    </li>
  );
}
