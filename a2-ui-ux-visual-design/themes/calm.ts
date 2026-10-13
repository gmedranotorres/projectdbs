import { palette } from "@/app/mood-boards/calm/palette";
import type { ColorRole, Theme } from "@/components/ui/theme";
import { mix } from "@/lib/color";

// Calm, as tokens. The colors are the Calm mood board's own palette (its
// palette.ts), so a hex changed there changes the board, this design system
// and the site together. Two colors are mixed from the palette, the same
// way the board mixes them: the thin line and the deeper sage.

const serif = "var(--newsreader), ui-serif, Georgia, serif";
const sans = "var(--inter), ui-sans-serif, system-ui, sans-serif";

const colors: Theme["colors"] = {
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
};

const accentTint: ColorRole = {
  label: "Accent tint",
  hex: palette.sageMist.hex,
  from: palette.sageMist.name,
  use: "Selected chips, badges and hover",
};

const accentStrong: ColorRole = {
  label: "Accent, deeper",
  short: "Deeper accent",
  hex: mix(palette.sage.hex, palette.ink.hex, 0.72),
  from: `${palette.sage.name} with 28% ${palette.ink.name}`,
  use: "Marks that must be seen: checks, the switch, the selected tab",
};

export const calm: Theme = {
  name: "Calm",
  scheme: "light",
  colors,
  support: [accentTint, accentStrong],
  supportTitle: "Made from those six",
  supportNote:
    "Two more colors do jobs the six roles cannot. Both come from the mood board.",
  parts: {
    onAccent: colors.text,
    // a little lighter under the pointer: lighter keeps the label readable
    accentHover: mix(colors.accent.hex, colors.surface.hex, 0.8),
    accentPressed: colors.accent.hex,
    accentEdge: "transparent",
    tint: accentTint,
    onTint: colors.text,
    onTintMuted: colors.muted,
    strong: accentStrong,
    onStrong: colors.surface,
    // the border role is too faint to be the only edge of a control
    controlLine: colors.muted,
    controlLineHover: colors.text,
    lineHover: colors.muted,
    divider: colors.border.hex,
    focus: colors.text,
    backdrop: `color-mix(in srgb, ${colors.text.hex} 35%, transparent)`,
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
  controls: { font: sans, size: "0.9375rem", weight: 500, chipSize: "0.875rem" },
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
    hover: "none",
    pressed: "none",
  },
  // a thin ring in the text color, close to the control
  focus: { width: "2px", style: "solid", offset: "2px" },
  // nothing moves under the pointer; a press nudges the control down
  press: {
    raisedHover: "none",
    raisedPressed: "translateY(1px)",
    flat: "translateY(1px)",
  },
};
