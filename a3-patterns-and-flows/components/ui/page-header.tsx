import Link from "next/link";
import type { ReactNode } from "react";

// The top of every page: where you are (the title and one line on what the
// page is for) and how to get back. "← Back to …" names where it goes: the
// page you came from when that's known, otherwise Home (see useBackLink).
// It's a link, not browser history, so it works from a bookmark too.
export function PageHeader({
  title,
  description,
  back,
  action,
}: {
  title: ReactNode;
  description: string;
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
          <span aria-hidden="true">&larr;&nbsp;</span>Back to {back.label}
        </Link>
      )}
      <div className={`flex flex-wrap items-end justify-between gap-4 ${back ? "mt-3" : ""}`}>
        <div className="min-w-0">
          <h1 className="font-serif text-display text-balance wrap-anywhere">{title}</h1>
          <p className="mt-2 text-muted">{description}</p>
        </div>
        {action}
      </div>
    </div>
  );
}

// What a page or a filtered list shows when there's nothing in it: an
// optional headline, one sentence, and the one way forward (a ButtonLink,
// a TextLink or a Button), so it's never a dead end.
export function EmptyState({
  title,
  children,
  action,
}: {
  title?: string;
  children: ReactNode;
  action: ReactNode;
}) {
  return (
    <div className="rounded-card border border-dashed border-line-strong bg-surface p-5">
      {title && <h2 className="mb-2 font-serif text-heading">{title}</h2>}
      <p className={title ? "text-muted" : undefined}>{children}</p>
      <div className="mt-4">{action}</div>
    </div>
  );
}
