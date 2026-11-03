import type { ComponentProps } from "react";

// Calm's card: the surface color, a thin edge, large corners and a soft shadow.
export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`rounded-card border border-line bg-surface p-4 shadow-raised ${className}`} {...props} />;
}
