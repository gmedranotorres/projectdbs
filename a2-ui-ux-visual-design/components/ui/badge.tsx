import type { ReactNode } from "react";
import "./ui.css";

// A small label on a card or row. "tint" is the usual one, "outline" is
// quieter and "strong" is for the one thing that must be noticed.
export function Badge({
  tone = "tint",
  children,
}: {
  tone?: "tint" | "outline" | "strong";
  children: ReactNode;
}) {
  return (
    <span className="ui-badge" data-tone={tone}>
      {children}
    </span>
  );
}
