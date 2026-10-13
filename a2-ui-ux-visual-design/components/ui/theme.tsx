import type { CSSProperties, ReactNode } from "react";
import { mix } from "@/lib/color";
import "./ui.css";

// A theme is a style's set of tokens: its colors, type, spacing and shape.
// The components in this folder never name a color or a font; they read
// tokens, which <Theme> hands them as CSS variables (--ui-...). Give the
// same components another theme and they take on another style.

export type ColorRole = {
  label: string;
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
};

export type Shape = { name: string; value: string; use: string };

export type Theme = {
  name: string;
  colors: Record<
    "background" | "surface" | "text" | "muted" | "border" | "accent",
    ColorRole
  >;
  // made from the six roles, for jobs they cannot do themselves
  support: Record<"accentTint" | "accentStrong", ColorRole>;
  type: Record<"display" | "heading" | "body" | "label", TypeRole>;
  // the spacing scale, in pixels
  space: number[];
  radii: Record<"sm" | "md" | "lg" | "full", Shape>;
  lines: Record<"thin" | "thick", Shape>;
  shadow: Shape;
};

// The accent a little lighter, for hover: lighter keeps the label readable.
export const accentHover = (theme: Theme) =>
  mix(theme.colors.accent.hex, theme.colors.surface.hex, 0.8);

// Every token as a CSS variable.
export function themeVars(theme: Theme): CSSProperties {
  const { colors, support, type, radii, lines } = theme;
  const typeVars = Object.entries(type).flatMap(([role, style]) => [
    [`--ui-${role}-font`, style.family],
    [`--ui-${role}-size`, style.size],
    [`--ui-${role}-weight`, String(style.weight)],
    [`--ui-${role}-leading`, String(style.leading)],
    [`--ui-${role}-tracking`, style.tracking ?? "normal"],
    [`--ui-${role}-transform`, style.transform ?? "none"],
  ]);
  return Object.fromEntries([
    ["--ui-bg", colors.background.hex],
    ["--ui-surface", colors.surface.hex],
    ["--ui-text", colors.text.hex],
    ["--ui-muted", colors.muted.hex],
    ["--ui-border", colors.border.hex],
    ["--ui-accent", colors.accent.hex],
    ["--ui-accent-tint", support.accentTint.hex],
    ["--ui-accent-strong", support.accentStrong.hex],
    ["--ui-accent-hover", accentHover(theme)],
    ...typeVars,
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
    ["--ui-shadow", theme.shadow.value],
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
