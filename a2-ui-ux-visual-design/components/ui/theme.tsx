import type { CSSProperties, ReactNode } from "react";
import "./ui.css";

// A theme is a style's set of tokens: its colors, type, spacing and shape,
// and how its controls look when focused, hovered and pressed. The
// components in this folder never name a color or a font; they read tokens,
// which <Theme> hands them as CSS variables (--ui-...). Give the same
// components another theme and they take on another style.

export type ColorRole = {
  label: string;
  // a shorter name for sentences such as "Deeper accent on surface"
  short?: string;
  hex: string;
  // where the color comes from on the mood board
  from: string;
  use: string;
};

export type TypeRole = {
  label: string;
  // the typeface's name, and the CSS font-family that loads it
  font: string;
  family: string;
  // the CSS size, and the same in plain words
  size: string;
  sizeLabel: string;
  weight: number;
  leading: number;
  tracking?: string;
  transform?: string;
  // a hard shadow behind the letters
  shadow?: string;
};

export type Shape = { name: string; value: string; use: string };

export type Theme = {
  name: string;
  // tells the browser how to draw its own parts, such as the list a select
  // opens and the scrollbar
  scheme: "light" | "dark";

  colors: Record<
    "background" | "surface" | "text" | "muted" | "border" | "accent",
    ColorRole
  >;
  // more colors from the mood board, for jobs the six roles cannot do
  support: ColorRole[];
  supportTitle: string;
  supportNote: string;

  // Which color does which job inside the components. Most point at one of
  // the roles above, so the design system page can name them.
  parts: {
    // the primary button: its label, its fill under the pointer and when
    // pressed, and its edge
    onAccent: ColorRole;
    accentHover: string;
    accentPressed: string;
    accentEdge: string;
    // the fill behind selected chips, badges and hovered rows, with the
    // text and the quieter text that sit on it
    tint: ColorRole;
    onTint: ColorRole;
    onTintMuted: ColorRole;
    // marks that must be seen (a checked box, the switch when on, the
    // selected tab) and the mark inside them
    strong: ColorRole;
    onStrong: ColorRole;
    // the outline of fields, boxes and switches, at rest and under the pointer
    controlLine: ColorRole;
    controlLineHover: ColorRole;
    // the edge of a chip or a card under the pointer
    lineHover: ColorRole;
    // the line between the rows of a list
    divider: string;
    // the keyboard focus ring
    focus: ColorRole;
    // the veil over the page behind an open panel
    backdrop: string;
  };

  type: Record<"display" | "heading" | "body" | "label", TypeRole>;
  // the words on buttons and tabs, and their size on chips
  controls: { font: string; size: string; weight: number; chipSize: string };

  // the spacing scale, in pixels
  space: number[];
  radii: Record<"sm" | "md" | "lg" | "full", Shape>;
  lines: Record<"thin" | "thick", Shape>;
  // the shadow of raised things (the primary button, cards, selected chips):
  // `value` at rest, then under the pointer and pressed
  shadow: Shape & { hover: string; pressed: string };
  // the keyboard focus ring's shape
  focus: { width: string; style: "solid" | "double"; offset: string };
  // how things move: a raised thing under the pointer and pressed, and a
  // flat thing pressed. Each is a CSS transform.
  press: { raisedHover: string; raisedPressed: string; flat: string };
};

// Every token as a CSS variable.
export function themeVars(theme: Theme): CSSProperties {
  const { colors, parts, type, controls, radii, lines, shadow, focus, press } =
    theme;
  const typeVars = Object.entries(type).flatMap(([role, style]) => [
    [`--ui-${role}-font`, style.family],
    [`--ui-${role}-size`, style.size],
    [`--ui-${role}-weight`, String(style.weight)],
    [`--ui-${role}-leading`, String(style.leading)],
    [`--ui-${role}-tracking`, style.tracking ?? "normal"],
    [`--ui-${role}-transform`, style.transform ?? "none"],
    [`--ui-${role}-shadow`, style.shadow ?? "none"],
  ]);
  return Object.fromEntries([
    ["--ui-scheme", theme.scheme],
    ["--ui-bg", colors.background.hex],
    ["--ui-surface", colors.surface.hex],
    ["--ui-text", colors.text.hex],
    ["--ui-muted", colors.muted.hex],
    ["--ui-border", colors.border.hex],
    ["--ui-accent", colors.accent.hex],
    ["--ui-on-accent", parts.onAccent.hex],
    ["--ui-accent-hover", parts.accentHover],
    ["--ui-accent-pressed", parts.accentPressed],
    ["--ui-accent-edge", parts.accentEdge],
    ["--ui-accent-tint", parts.tint.hex],
    ["--ui-on-tint", parts.onTint.hex],
    ["--ui-on-tint-muted", parts.onTintMuted.hex],
    ["--ui-accent-strong", parts.strong.hex],
    ["--ui-on-strong", parts.onStrong.hex],
    ["--ui-control-line", parts.controlLine.hex],
    ["--ui-control-line-hover", parts.controlLineHover.hex],
    ["--ui-line-hover", parts.lineHover.hex],
    ["--ui-divider", parts.divider],
    ["--ui-focus", parts.focus.hex],
    ["--ui-backdrop", parts.backdrop],
    ...typeVars,
    ["--ui-button-font", controls.font],
    ["--ui-button-size", controls.size],
    ["--ui-button-weight", String(controls.weight)],
    ["--ui-chip-size", controls.chipSize],
    ...theme.space.map((pixels, index) => [
      `--ui-space-${index + 1}`,
      `${pixels / 16}rem`,
    ]),
    ...Object.entries(radii).map(([size, radius]) => [
      `--ui-radius-${size}`,
      radius.value,
    ]),
    ["--ui-line", lines.thin.value],
    ["--ui-line-thick", lines.thick.value],
    ["--ui-shadow", shadow.value],
    ["--ui-shadow-hover", shadow.hover],
    ["--ui-shadow-pressed", shadow.pressed],
    ["--ui-focus-width", focus.width],
    ["--ui-focus-style", focus.style],
    ["--ui-focus-offset", focus.offset],
    ["--ui-lift-hover", press.raisedHover],
    ["--ui-lift-pressed", press.raisedPressed],
    ["--ui-press", press.flat],
  ]);
}

// Wrap a page (or any part of one) to give the components inside a style.
export function Theme({
  theme,
  as: Tag = "div",
  className = "",
  style,
  children,
}: {
  theme: Theme;
  as?: "div" | "main" | "section";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <Tag
      className={`ui-theme ${className}`}
      style={{ ...themeVars(theme), ...style }}
    >
      {children}
    </Tag>
  );
}
