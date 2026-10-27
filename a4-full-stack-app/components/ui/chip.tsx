"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";

type ChipProps = Omit<ComponentProps<"button">, "aria-pressed" | "type"> & { pressed: boolean };

// Calm's filter chip, from A2, as a toggle button: for role suggestions and
// list filters. aria-pressed tells screen readers whether it's on, and a
// check appears when it is, so color isn't the only sign. Like the small
// button, it's 36px tall with a 44px tap area.
export function Chip({ pressed, className = "", children, ...props }: ChipProps) {
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

// A row of Chips that is one Tab stop: Tab enters on the chip used last,
// the arrow keys (and Home and End) move between them, and Tab leaves. It's
// the toolbar pattern, so screen readers say the arrow keys work.
export function ChipGroup({ label, children }: { label: string; children: ReactNode }) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const chips = Children.toArray(children).filter(isValidElement) as ReactElement<ChipProps>[];
  // Stays in range if chips are removed.
  const current = Math.min(active, chips.length - 1);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = chips.length - 1;
    const next =
      event.key === "ArrowRight" ? (current === last ? 0 : current + 1)
      : event.key === "ArrowLeft" ? (current === 0 ? last : current - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    ref.current?.querySelectorAll<HTMLButtonElement>(":scope > button")[next]?.focus();
  }

  return (
    <div ref={ref} role="toolbar" aria-label={label} onKeyDown={onKeyDown} className="flex flex-wrap gap-2">
      {chips.map((chip, i) =>
        cloneElement(chip, {
          tabIndex: i === current ? 0 : -1,
          onFocus: () => setActive(i),
        }),
      )}
    </div>
  );
}
