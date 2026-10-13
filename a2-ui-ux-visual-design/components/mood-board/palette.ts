import type { CSSProperties } from "react";
import { contrast } from "@/lib/color";

export type PaletteColor = { name: string; hex: string; role: string };

// A board's palette as CSS variables: { warmWhite } becomes --warm-white.
// The page sets these once, so a hex changed in palette.ts changes the
// swatch and everything drawn with that color.
export function paletteVars(
  palette: Record<string, PaletteColor>,
): CSSProperties {
  return Object.fromEntries(
    Object.entries(palette).map(([key, color]) => [
      `--${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
      color.hex,
    ]),
  );
}

// Of two label colors, the one that reads better on `background`.
export function readableOn(background: string, first: string, second: string) {
  return contrast(background, first) >= contrast(background, second)
    ? first
    : second;
}
