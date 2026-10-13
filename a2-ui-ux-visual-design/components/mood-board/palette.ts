import type { CSSProperties } from "react";

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

// WCAG relative luminance of a hex color, from 0 (black) to 1 (white).
export function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((start) => {
    const channel = parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

// Of two label colors, the one that reads better on `background`.
export function readableOn(background: string, first: string, second: string) {
  return contrast(background, first) >= contrast(background, second)
    ? first
    : second;
}
