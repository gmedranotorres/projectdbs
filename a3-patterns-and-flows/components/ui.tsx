import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

// Small building blocks shared by every page. Tap targets are at least 44px
// tall, and inputs use 16px text so phones don't zoom in on focus.

type Variant = "primary" | "secondary" | "danger";

const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-base font-medium transition-colors";
const buttonVariants: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-accent-strong",
  secondary: "border border-line-strong bg-surface text-ink hover:bg-subtle",
  danger: "border border-error bg-surface text-error hover:bg-error-soft",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={`${buttonBase} ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  );
}

// The same look, for an action that goes to another page.
export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link
      className={`${buttonBase} ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  );
}

export function TextLink({ className = "", ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`font-medium text-accent underline underline-offset-4 hover:decoration-2 ${className}`}
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
          className="-my-2 inline-flex min-h-11 items-center text-sm font-medium text-accent underline underline-offset-4 hover:decoration-2"
        >
          <span aria-hidden="true">&larr;&nbsp;</span>Back
          <span className="sr-only"> to {back.label}</span>
        </Link>
      )}
      <div className={`flex flex-wrap items-end justify-between gap-4 ${back ? "mt-3" : ""}`}>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-balance">{title}</h1>
          {description && <div className="mt-2 text-muted">{description}</div>}
        </div>
        {action}
      </div>
    </div>
  );
}

// ---- Fields -------------------------------------------------------------

export function ErrorIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0" fill="currentColor">
      <path d="M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm-.9 4.25h1.8v5.5H9.1v-5.5Zm.9 9a1.15 1.15 0 1 1 0-2.3 1.15 1.15 0 0 1 0 2.3Z" />
    </svg>
  );
}

// Label, then hint, then error, then the control: the error sits right above
// what needs fixing, where a phone keyboard won't cover it.
export function Field({
  id,
  label,
  optional,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-medium">
        {label}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {hint && (
        <div id={`${id}-hint`} className="mt-1 text-sm text-muted">
          {hint}
        </div>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex gap-1.5 text-sm font-medium text-error">
          <ErrorIcon />
          <span>
            <span className="sr-only">Error: </span>
            {error}
          </span>
        </p>
      )}
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

// The aria attributes a control needs to point at its hint and error.
export function describedBy(id: string, hint: unknown, error: unknown) {
  const ids = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean);
  return {
    "aria-describedby": ids.length ? ids.join(" ") : undefined,
    "aria-invalid": error ? true : undefined,
  } as const;
}

export const inputClass =
  "block w-full rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-base text-ink placeholder:text-muted aria-[invalid=true]:border-2 aria-[invalid=true]:border-error";

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
    new: "bg-accent-soft text-accent",
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
