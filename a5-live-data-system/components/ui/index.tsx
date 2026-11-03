import Link from "next/link";
import type { ComponentProps } from "react";

// Small building blocks shared by every page, carried over from Assignment 4.
// Tap targets are at least 44px tall, and inputs use 16px text so phones don't
// zoom in on focus. Most have files of their own; import everything from here.

export * from "./badge";
export * from "./button";
export * from "./card";
export * from "./field";
export * from "./page-header";

export function TextLink({ className = "", ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={`font-medium text-ink underline decoration-accent-strong underline-offset-4 hover:decoration-ink hover:decoration-2 ${className}`}
      {...props}
    />
  );
}

// Placeholders while data loads: never zeros, because "0 bikes" would be a false
// statement about a real station.
export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div aria-busy="true" className="space-y-4">
      <p className="sr-only">{label}</p>
      <div className="h-32 animate-pulse rounded-card bg-subtle motion-reduce:animate-none" />
      <div className="h-32 animate-pulse rounded-card bg-subtle motion-reduce:animate-none" />
    </div>
  );
}
