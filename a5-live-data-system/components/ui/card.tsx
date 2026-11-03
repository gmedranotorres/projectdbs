import type { ComponentProps } from "react";

// Calm's card: the surface color, a thin edge, large corners and a soft shadow.
// The tone replaces the edge and background together, since two classes setting
// the same property can't be relied on to override each other.
const tones = {
  default: "border-line bg-surface",
  highlight: "border-accent/40 bg-accent-soft",
  error: "border-error bg-error-soft",
  empty: "border-dashed border-line-strong bg-surface",
};

export function Card({
  tone = "default",
  className = "",
  ...props
}: ComponentProps<"div"> & { tone?: keyof typeof tones }) {
  return <div className={`rounded-card border p-4 shadow-raised ${tones[tone]} ${className}`} {...props} />;
}
