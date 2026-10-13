import type { CSSProperties } from "react";
import {
  paletteVars,
  type PaletteColor,
} from "@/components/mood-board/palette";

// Arcade's six colors: a near-black navy, four neons and a screen white.
export const palette = {
  navy: { name: "navy", hex: "#0B0B27", role: "Screen" },
  magenta: { name: "magenta", hex: "#FF2BD6", role: "Player 1" },
  cyan: { name: "cyan", hex: "#22E5FF", role: "Player 2" },
  lime: { name: "lime", hex: "#B8FF3C", role: "Power-up" },
  yellow: { name: "yellow", hex: "#FFE83D", role: "Score" },
  white: { name: "white", hex: "#F5F2FF", role: "Text" },
} satisfies Record<string, PaletteColor>;

// The palette as CSS variables (--navy, --magenta, ...), plus a raised
// panel color mixed from it.
export const arcadeVars: CSSProperties = {
  ...paletteVars(palette),
  "--panel": "color-mix(in srgb, var(--navy) 88%, var(--white))",
} as CSSProperties;
