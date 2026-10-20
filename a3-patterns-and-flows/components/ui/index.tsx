import Link from "next/link";
import type { ComponentProps } from "react";

// Small building blocks shared by every page. Tap targets are at least 44px
// tall, and inputs use 16px text so phones don't zoom in on focus. Most
// components have files of their own; everything is imported from here.

export * from "./badge";
export * from "./button";
export * from "./card";
export * from "./chip";
export * from "./field";
export * from "./page-header";
export * from "./progress";
export * from "./stat-link";
export * from "./toast";

export function TextLink({ className = "", ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`font-medium text-ink underline decoration-accent-strong underline-offset-4 hover:decoration-ink hover:decoration-2 ${className}`}
      {...props}
    />
  );
}

// ---- Messages -------------------------------------------------------------

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
