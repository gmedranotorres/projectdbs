import Link from "next/link";
import type { ComponentProps } from "react";

// Calm's button, from A2. "primary" is the one main action in view: a
// filled deep-sage button with light, semibold words, so it stands out from
// everything else on the page (after A3 feedback that CTAs were too quiet),
// "secondary" is everything else, "quiet" is a minor action with no edge,
// and "danger" is for deleting. Under the pointer a button takes the tint;
// pressed, it gets a dark edge and moves down 1px. Disabled, its edge is
// dashed, so color isn't the only sign.

export type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";
export type ButtonSize = "md" | "sm";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-control border transition-colors state-active:translate-y-px disabled:cursor-not-allowed disabled:border-dashed disabled:border-line disabled:bg-transparent disabled:text-muted";

// "sm" is 36px tall, but reaches 44px for a finger: the ::after stretches
// what you can tap 4px above and below.
const sizes: Record<ButtonSize, string> = {
  md: "min-h-11 px-6 text-control",
  sm: "min-h-9 px-3 text-sm font-medium after:absolute after:inset-x-0 after:-inset-y-1",
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-accent font-semibold text-accent-ink shadow-raised state-hover:bg-accent-hover state-active:border-ink state-active:bg-accent state-active:shadow-none",
  secondary:
    "border-line-strong bg-transparent text-ink state-hover:bg-accent-soft state-active:border-ink state-active:bg-accent-soft",
  quiet:
    "border-transparent bg-transparent text-ink state-hover:bg-accent-soft state-active:border-ink state-active:bg-accent-soft",
  danger:
    "border-error bg-transparent text-error state-hover:bg-error-soft state-active:bg-error-soft",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md") {
  return `${base} ${sizes[size]} ${variants[variant]}`;
}

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <button type={type} className={`${buttonClass(variant, size)} ${className}`} {...props} />
  );
}

// The same look, for an action that goes to another page.
export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <Link className={`${buttonClass(variant, size)} ${className}`} {...props} />;
}
