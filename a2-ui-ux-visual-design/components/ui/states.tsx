import type { ReactNode } from "react";
import { AlertIcon, CheckIcon, EmptyIcon } from "./icons";
import "./ui.css";

// What the visitor sees when there is nothing to show (empty) or something
// went wrong (error): an icon, one plain sentence, and a way forward. The
// error is announced to screen readers at once.
export function StateMessage({
  kind,
  title,
  children,
}: {
  kind: "empty" | "error";
  title: string;
  // the way forward, usually one button
  children?: ReactNode;
}) {
  return (
    <div
      className="ui-state"
      data-kind={kind}
      role={kind === "error" ? "alert" : undefined}
    >
      <span className="ui-state-icon">
        {kind === "error" ? <AlertIcon /> : <EmptyIcon />}
      </span>
      <p className="ui-state-title">{title}</p>
      {children}
    </div>
  );
}

// A short confirmation, such as "Saved". Screen readers read it out
// without taking the visitor away from what they were doing.
export function Notice({ children }: { children: ReactNode }) {
  return (
    <p className="ui-notice" role="status">
      <CheckIcon />
      {children}
    </p>
  );
}

// Placeholder rows shown while content loads. The label says what is
// loading; the rows pulse gently unless the visitor asked for less motion.
export function Loading({
  label,
  rows = 3,
}: {
  label: string;
  rows?: number;
}) {
  return (
    <div className="ui-loading" role="status">
      <p className="ui-label ui-muted">{label}</p>
      {Array.from({ length: rows }, (_, row) => (
        <span key={row} className="ui-skeleton" aria-hidden="true" />
      ))}
    </div>
  );
}
