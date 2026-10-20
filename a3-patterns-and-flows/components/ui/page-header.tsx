import Link from "next/link";
import type { ReactNode } from "react";

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
