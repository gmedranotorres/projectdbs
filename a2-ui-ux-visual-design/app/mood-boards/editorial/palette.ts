import type { CSSProperties } from "react";
import {
  paletteVars,
  type PaletteColor,
} from "@/components/mood-board/palette";

// Editorial's six colors: paper, ink, two grays, and one deep maroon.
export const palette = {
  newsprint: { name: "newsprint", hex: "#F2EEE3", role: "Page" },
  ink: { name: "black ink", hex: "#151311", role: "Text" },
  maroon: { name: "deep maroon", hex: "#7A1C24", role: "Accent" },
  gray: { name: "warm gray", hex: "#6E675E", role: "Labels" },
  fog: { name: "pale gray", hex: "#DAD4C6", role: "Tint" },
  paper: { name: "paper white", hex: "#FCFAF5", role: "Surface" },
} satisfies Record<string, PaletteColor>;

// The palette as CSS variables (--newsprint, --ink, --maroon, ...).
export const editorialVars: CSSProperties = paletteVars(palette);
