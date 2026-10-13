import type { ComponentProps } from "react";
import "./ui.css";

// A button. "primary" is the one main action in view; "secondary" is
// everything else. `pressed` makes it a button that stays on, such as
// "Saved", and tells screen readers so.
export function Button({
  variant = "primary",
  pressed,
  className = "",
  ...props
}: ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      className={`ui-button ${className}`}
      data-variant={variant}
      aria-pressed={pressed}
      {...props}
    />
  );
}

// The same button, as a link: for an action that goes somewhere, such as
// "Get directions".
export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"a"> & { variant?: "primary" | "secondary" }) {
  return (
    <a className={`ui-button ${className}`} data-variant={variant} {...props} />
  );
}

// A square button that shows only an icon. `label` is what it is called,
// for screen readers and as a tooltip.
export function IconButton({
  label,
  className = "",
  ...props
}: ComponentProps<"button"> & { label: string }) {
  return (
    <button
      type="button"
      className={`ui-icon-button ${className}`}
      aria-label={label}
      title={label}
      {...props}
    />
  );
}
