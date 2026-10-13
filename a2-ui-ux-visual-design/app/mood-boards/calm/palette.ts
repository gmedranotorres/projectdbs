import type { CSSProperties } from "react";
import {
  paletteVars,
  type PaletteColor,
} from "@/components/mood-board/palette";

// Calm's six colors. Sage is the only accent; sage mist is its tint.
export const palette = {
  oat: { name: "oat paper", hex: "#EBE2D0", role: "Page" },
  warmWhite: { name: "warm white", hex: "#FBF7EE", role: "Surface" },
  ink: { name: "brown ink", hex: "#3A2B21", role: "Text" },
  walnut: { name: "walnut", hex: "#6B5848", role: "Quiet text" },
  sage: { name: "sage", hex: "#8A9E80", role: "Accent" },
  sageMist: { name: "sage mist", hex: "#DDE4D4", role: "Accent tint" },
} satisfies Record<string, PaletteColor>;

// The palette as CSS variables (--oat, --warm-white, ...), plus the thin
// line color and a deeper sage for drawings, both mixed from the palette.
export const calmVars: CSSProperties = {
  ...paletteVars(palette),
  "--line": "color-mix(in srgb, var(--ink) 20%, transparent)",
  "--sage-deep": "color-mix(in srgb, var(--sage) 72%, var(--ink))",
} as CSSProperties;
