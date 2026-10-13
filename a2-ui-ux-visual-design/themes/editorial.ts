import { palette } from "@/app/mood-boards/editorial/palette";
import type { ColorRole, Theme } from "@/components/ui/theme";
import { mix } from "@/lib/color";

// Editorial, as tokens. The colors are the Editorial mood board's own
// palette (its palette.ts): newsprint and paper, black ink for text and for
// every hairline, warm gray for labels, and one deep maroon. Only the
// lighter divider and the darker hover of the maroon are mixed.
//
// What makes it Editorial beyond color: a display serif over a text serif,
// small uppercase labels with wide spacing, square corners, hairlines and no
// shadow, and a double-rule focus ring like the one under the masthead.

const display = "var(--playfair), ui-serif, Georgia, serif";
const serif = "var(--source-serif), ui-serif, Georgia, serif";
const sans = "var(--inter), ui-sans-serif, system-ui, sans-serif";

const colors: Theme["colors"] = {
  background: {
    label: "Background",
    hex: palette.newsprint.hex,
    from: palette.newsprint.name,
    use: "The page",
  },
  surface: {
    label: "Surface",
    hex: palette.paper.hex,
    from: palette.paper.name,
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
    hex: palette.gray.hex,
    from: palette.gray.name,
    use: "Labels and hints",
  },
  border: {
    label: "Border",
    hex: palette.ink.hex,
    from: `${palette.ink.name}, the same as the text`,
    use: "Hairlines: card edges and every control",
  },
  accent: {
    label: "Accent",
    hex: palette.maroon.hex,
    from: palette.maroon.name,
    use: "The primary button, and the marks that must be seen",
  },
};

const tint: ColorRole = {
  label: "Tint",
  hex: palette.fog.hex,
  from: palette.fog.name,
  use: "Selected chips, badges and hover",
};

export const editorial: Theme = {
  name: "Editorial",
  scheme: "light",
  colors,
  support: [tint],
  supportTitle: "One more color",
  supportNote: "The mood board’s pale gray does a job the six roles cannot.",
  parts: {
    onAccent: colors.surface,
    // darker under the pointer, and ink when pressed, like a printed
    // button being inked
    accentHover: mix(colors.accent.hex, colors.text.hex, 0.8),
    accentPressed: colors.text.hex,
    accentEdge: "transparent",
    tint,
    onTint: colors.text,
    // warm gray is too faint on the tint, so quiet text turns to ink there
    onTintMuted: colors.text,
    // the one accent also marks what is switched on
    strong: colors.accent,
    onStrong: colors.surface,
    controlLine: colors.border,
    controlLineHover: colors.accent,
    lineHover: colors.accent,
    divider: mix(colors.text.hex, colors.surface.hex, 0.25),
    focus: colors.accent,
    backdrop: `color-mix(in srgb, ${colors.text.hex} 40%, transparent)`,
  },
  type: {
    display: {
      label: "Display",
      font: "Playfair Display",
      family: display,
      size: "clamp(2.5rem, 1.6rem + 4vw, 4.5rem)",
      sizeLabel: "40 to 72px",
      weight: 900,
      leading: 0.98,
      tracking: "-0.02em",
    },
    heading: {
      label: "Heading",
      font: "Playfair Display",
      family: display,
      size: "1.5rem",
      sizeLabel: "24px",
      weight: 700,
      leading: 1.1,
    },
    body: {
      label: "Body",
      font: "Source Serif 4",
      family: serif,
      size: "1.0625rem",
      sizeLabel: "17px",
      weight: 400,
      leading: 1.55,
    },
    label: {
      label: "Label",
      font: "Inter",
      family: sans,
      size: "0.6875rem",
      sizeLabel: "11px",
      weight: 500,
      leading: 1.4,
      tracking: "0.12em",
      transform: "uppercase",
    },
  },
  controls: { font: sans, size: "0.75rem", weight: 600, chipSize: "0.6875rem" },
  space: [4, 8, 12, 16, 24, 32, 48],
  radii: {
    sm: { name: "Small", value: "0px", use: "Badges and checkboxes" },
    md: { name: "Medium", value: "0px", use: "Buttons and fields" },
    lg: { name: "Large", value: "0px", use: "Cards and panels" },
    full: { name: "Full", value: "0px", use: "Chips and switches" },
  },
  lines: {
    thin: { name: "Hairline", value: "1px", use: "Edges, dividers and outlines" },
    thick: { name: "Rule", value: "3px", use: "The selected tab and a link under the pointer" },
  },
  shadow: {
    name: "Shadow",
    value: "none",
    use: "No shadow, a hairline instead",
    hover: "none",
    // a pressed card or button gets a second hairline inside its edge
    pressed: `inset 0 0 0 1px ${colors.text.hex}`,
  },
  // two maroon rules with a gap between them, like the masthead's double rule
  focus: { width: "6px", style: "double", offset: "2px" },
  // nothing moves under the pointer; a press nudges the control down
  press: {
    raisedHover: "none",
    raisedPressed: "translateY(1px)",
    flat: "translateY(1px)",
  },
};
