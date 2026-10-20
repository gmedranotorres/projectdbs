import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { STATUS_LABELS, type Status } from "@/lib/applications";
import { formatDay, type Day } from "@/lib/dates";
import { Badge, statusTone } from "./badge";

// Calm's card, from A2: the surface color, a thin edge, large corners and
// no shadow.
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
      className={`divide-y divide-line overflow-hidden rounded-card border border-line bg-surface ${className}`}
      {...props}
    />
  );
}

// One application in a list: company, role, status, follow-up date, and an
// "Open" link that names the application for screen readers. `hint` sits
// beside the follow-up date.
export function ListRow({
  company,
  role,
  status,
  followUpOn,
  href,
  hint,
}: {
  company: string;
  role: string;
  status: Status;
  followUpOn?: Day;
  href: string;
  hint?: ReactNode;
}) {
  return (
    <li className="flex items-start gap-4 px-4 py-3">
      <div className="min-w-0 flex-1 space-y-1.5">
        <div>
          <p className="font-medium">{company}</p>
          <p className="text-muted">{role}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <Badge tone={statusTone(status)}>{STATUS_LABELS[status]}</Badge>
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
    </li>
  );
}
