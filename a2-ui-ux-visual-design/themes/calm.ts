import { palette } from "@/app/mood-boards/calm/palette";
import type { Theme } from "@/components/ui/theme";
import { mix } from "@/lib/color";

// Calm, as tokens. The colors are the Calm mood board's own palette (its
// palette.ts), so a hex changed there changes the board, this design system
// and the site together. Two colors are mixed from the palette, the same
// way the board mixes them: the thin line and the deeper sage.

const serif = "var(--newsreader), ui-serif, Georgia, serif";
const sans = "var(--inter), ui-sans-serif, system-ui, sans-serif";

export const calm: Theme = {
  name: "Calm",
  colors: {
    background: {
      label: "Background",
      hex: palette.oat.hex,
      from: palette.oat.name,
      use: "The page",
    },
    surface: {
      label: "Surface",
      hex: palette.warmWhite.hex,
      from: palette.warmWhite.name,
      use: "Cards, panels and fields",
    },
    text: {
      label: "Text",
      hex: palette.ink.hex,
      from: palette.ink.name,
      use: "Headings and body text",
    },
    muted: {
      label: "Muted text",
      hex: palette.walnut.hex,
      from: palette.walnut.name,
      use: "Labels and hints, and the outline of controls",
    },
    border: {
      label: "Border",
      hex: mix(palette.ink.hex, palette.oat.hex, 0.2),
      from: `${palette.ink.name} at 20% on ${palette.oat.name}`,
      use: "Card edges and dividers",
    },
    accent: {
      label: "Accent",
      hex: palette.sage.hex,
      from: palette.sage.name,
      use: "The primary button",
    },
  },
  support: {
    accentTint: {
      label: "Accent tint",
      hex: palette.sageMist.hex,
      from: palette.sageMist.name,
      use: "Selected chips, badges and hover",
    },
    accentStrong: {
      label: "Accent, deeper",
      hex: mix(palette.sage.hex, palette.ink.hex, 0.72),
      from: `${palette.sage.name} with 28% ${palette.ink.name}`,
      use: "Marks that must be seen: checks, the switch, the selected tab",
    },
  },
  type: {
    display: {
      label: "Display",
      font: "Newsreader",
      family: serif,
      size: "clamp(2.5rem, 1.75rem + 3.5vw, 4rem)",
      sizeLabel: "40 to 64px",
      weight: 300,
      leading: 1.02,
      tracking: "-0.02em",
    },
    heading: {
      label: "Heading",
      font: "Newsreader",
      family: serif,
      size: "1.5rem",
      sizeLabel: "24px",
      weight: 400,
      leading: 1.15,
      tracking: "-0.005em",
    },
    body: {
      label: "Body",
      font: "Inter",
      family: sans,
      size: "1rem",
      sizeLabel: "16px",
      weight: 400,
      leading: 1.6,
    },
    label: {
      label: "Label",
      font: "Inter",
      family: sans,
      size: "0.8125rem",
      sizeLabel: "13px",
      weight: 500,
      leading: 1.25,
    },
  },
  space: [4, 8, 12, 16, 24, 32, 48],
  radii: {
    sm: { name: "Small", value: "6px", use: "Badges and checkboxes" },
    md: { name: "Medium", value: "12px", use: "Buttons and fields" },
    lg: { name: "Large", value: "16px", use: "Cards and panels" },
    full: { name: "Full", value: "999px", use: "Chips and switches" },
  },
  lines: {
    thin: { name: "Thin", value: "1px", use: "Edges, dividers and outlines" },
    thick: { name: "Thick", value: "2px", use: "The selected tab and the focus ring" },
  },
  shadow: {
    name: "Shadow",
    value: "none",
    use: "No shadow, a thin line instead",
  },
};
