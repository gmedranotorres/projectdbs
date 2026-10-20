import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

// Small building blocks shared by every page. Tap targets are at least 44px
// tall, and inputs use 16px text so phones don't zoom in on focus. Button,
// Field and Chip have files of their own; everything is imported from here.

export * from "./button";
export * from "./chip";
export * from "./field";

export function TextLink({ className = "", ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`font-medium text-ink underline decoration-accent-strong underline-offset-4 hover:decoration-ink hover:decoration-2 ${className}`}
      {...props}
    />
  );
}

// ---- Page header ----------------------------------------------------------

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

// ---- Messages and tags ----------------------------------------------------

// A confirmation or problem shown at the top of a page. It takes focus when
// it appears, so screen readers read it and keyboard users start from it.
export function Notice({
  tone = "info",
  children,
  ...props
}: ComponentProps<"div"> & { tone?: "info" | "error" }) {
  return (
    <div
      tabIndex={-1}
      className={`rounded-lg border px-4 py-3 ${
        tone === "error"
          ? "border-error bg-error-soft text-ink"
          : "border-accent/40 bg-accent-soft text-ink"
      }`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Tag({
  tone = "plain",
  children,
}: {
  tone?: "plain" | "late" | "new";
  children: ReactNode;
}) {
  const tones = {
    plain: "border border-line bg-subtle text-muted",
    late: "bg-late-soft text-late",
    new: "bg-accent-soft text-ink",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium ${tones[tone]}`}>
      {tone === "late" && (
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="10" cy="10" r="7.5" />
          <path d="M10 6v4.5l3 1.5" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </span>
  );
}

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div className={`rounded-xl border border-line bg-surface p-4 ${className}`} {...props} />
  );
}

// Shown while the browser reads saved data. It has no visible words so a
// quick load doesn't flash text.
export function Loading() {
  return (
    <div aria-busy="true" className="space-y-4">
      <p className="sr-only">Loading your applications…</p>
      <div className="h-8 w-48 animate-pulse rounded-md bg-subtle" />
      <div className="h-28 animate-pulse rounded-xl bg-subtle" />
      <div className="h-28 animate-pulse rounded-xl bg-subtle" />
    </div>
  );
}
