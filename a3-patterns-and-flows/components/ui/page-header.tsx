import Link from "next/link";
import type { ReactNode } from "react";
import { ButtonLink } from "./button";

// The top of every page. "← Back" goes to the page's parent, not browser
// history, so it still works when the page was opened from a bookmark.
export function PageHeader({
  title,
  description,
  back,
  action,
}: {
  title: ReactNode;
  description?: ReactNode;
  back?: { href: string; label: string };
  action?: ReactNode;
}) {
  return (
    <div>
      {back && (
        <Link
          href={back.href}
          className="-my-2 inline-flex min-h-11 items-center text-sm font-medium text-ink underline decoration-accent-strong underline-offset-4 hover:decoration-ink hover:decoration-2"
        >
          <span aria-hidden="true">&larr;&nbsp;</span>Back
          <span className="sr-only"> to {back.label}</span>
        </Link>
      )}
      <div className={`flex flex-wrap items-end justify-between gap-4 ${back ? "mt-3" : ""}`}>
        <div>
          <h1 className="font-serif text-display text-balance">{title}</h1>
          {description && <div className="mt-2 text-muted">{description}</div>}
        </div>
        {action}
      </div>
    </div>
  );
}

// What a page shows when there's nothing in it yet: a headline, one
// sentence on what will appear, and the one action that fills it.
export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action: { href: string; label: string };
}) {
  return (
    <div className="rounded-card border border-dashed border-line-strong bg-surface p-5">
      <h2 className="font-serif text-heading">{title}</h2>
      <p className="mt-2 text-muted">{children}</p>
      <ButtonLink href={action.href} className="mt-4">
        {action.label}
      </ButtonLink>
    </div>
  );
}
