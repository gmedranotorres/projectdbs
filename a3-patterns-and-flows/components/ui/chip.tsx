import type { ComponentProps } from "react";

// Calm's filter chip, from A2, as a toggle button: for role suggestions and
// list filters. aria-pressed tells screen readers whether it's on, and a
// check appears when it is, so color isn't the only sign. Like the small
// button, it's 36px tall with a 44px tap area.
export function Chip({
  pressed,
  className = "",
  children,
  ...props
}: Omit<ComponentProps<"button">, "aria-pressed" | "type"> & { pressed: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={`relative inline-flex min-h-9 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium whitespace-nowrap text-ink transition-colors after:absolute after:inset-x-0 after:-inset-y-1 aria-pressed:border-accent-strong aria-pressed:bg-accent-soft state-hover:border-muted state-active:translate-y-px state-active:border-ink state-active:bg-accent-soft disabled:cursor-not-allowed disabled:border-dashed disabled:bg-transparent disabled:text-muted ${className}`}
      {...props}
    >
      {pressed && (
        <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 6.5 5 9.5 10 3" />
        </svg>
      )}
      {children}
    </button>
  );
}
