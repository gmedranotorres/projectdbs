import { palette } from "@/app/mood-boards/arcade/palette";
import type { ColorRole, Theme } from "@/components/ui/theme";
import { mix } from "@/lib/color";

// Arcade, as tokens. The colors are the Arcade mood board's own palette (its
// palette.ts): navy for the screen, white for text and thick edges, cyan for
// quiet text, yellow for the one main action, lime for whatever is switched
// on, and magenta for the hard shadows. Only the raised panel and the dim
// divider are mixed.
//
// What makes it Arcade beyond color: pixel type in capitals, square corners,
// 3px edges, a hard offset shadow that buttons sink into when pressed, and a
// thick cyan focus ring set well away from the control.

const pixel = "var(--press-start), ui-monospace, monospace";
const mono = "var(--space-mono), ui-monospace, monospace";

const colors: Theme["colors"] = {
  background: {
    label: "Background",
    hex: palette.navy.hex,
    from: palette.navy.name,
    use: "The screen",
  },
  surface: {
    label: "Surface",
    hex: mix(palette.white.hex, palette.navy.hex, 0.12),
    from: `${palette.navy.name} with 12% ${palette.white.name}`,
    use: "Cards, panels and fields",
  },
  text: {
    label: "Text",
    hex: palette.white.hex,
    from: palette.white.name,
    use: "Headings and body text",
  },
  muted: {
    label: "Muted text",
    hex: palette.cyan.hex,
    from: palette.cyan.name,
    use: "Labels and hints, and the focus ring",
  },
  border: {
    label: "Border",
    hex: palette.white.hex,
    from: `${palette.white.name}, the same as the text`,
    use: "Thick edges: cards and every control",
  },
  accent: {
    label: "Accent",
    hex: palette.yellow.hex,
    from: palette.yellow.name,
    use: "The primary button",
  },
};

const highlight: ColorRole = {
  label: "Highlight",
  hex: palette.lime.hex,
  from: palette.lime.name,
  use: "Whatever is switched on or under the pointer: selected chips, checks, the switch, the selected tab, badges",
};

const shadow: ColorRole = {
  label: "Shadow",
  hex: palette.magenta.hex,
  from: palette.magenta.name,
  use: "The hard shadow under the primary button, cards and selected chips, and behind the display type",
};

export const arcade: Theme = {
  name: "Arcade",
  scheme: "dark",
  colors,
  support: [highlight, shadow],
  supportTitle: "The other two neons",
  supportNote:
    "The mood board’s lime and magenta do jobs the six roles cannot.",
  parts: {
    // dark text on the bright fills
    onAccent: colors.background,
    accentHover: mix(palette.white.hex, colors.accent.hex, 0.4),
    accentPressed: colors.accent.hex,
    accentEdge: colors.border.hex,
    tint: highlight,
    onTint: colors.background,
    onTintMuted: colors.background,
    strong: highlight,
    onStrong: colors.background,
    controlLine: colors.border,
    controlLineHover: highlight,
    lineHover: highlight,
    divider: mix(palette.white.hex, palette.navy.hex, 0.3),
    focus: colors.muted,
    backdrop: "rgb(0 0 0 / 0.65)",
  },
  type: {
    display: {
      label: "Display",
      font: "Press Start 2P",
      family: pixel,
      size: "clamp(1.5rem, 0.9rem + 2.6vw, 2.5rem)",
      sizeLabel: "24 to 40px",
      weight: 400,
      leading: 1.3,
      transform: "uppercase",
      shadow: `0.06em 0.06em 0 ${palette.magenta.hex}, 0.12em 0.12em 0 ${palette.cyan.hex}`,
    },
    heading: {
      label: "Heading",
      font: "Press Start 2P",
      family: pixel,
      size: "1rem",
      sizeLabel: "16px",
      weight: 400,
      leading: 1.4,
      transform: "uppercase",
    },
    body: {
      label: "Body",
      font: "Space Mono",
      family: mono,
      size: "0.9375rem",
      sizeLabel: "15px",
      weight: 400,
      leading: 1.6,
    },
    label: {
      label: "Label",
      font: "Space Mono",
      family: mono,
      size: "0.75rem",
      sizeLabel: "12px",
      weight: 700,
      leading: 1.3,
      tracking: "0.02em",
      transform: "uppercase",
    },
  },
  // buttons and tabs are set in the pixel font, small
  controls: { font: pixel, size: "0.625rem", weight: 400, chipSize: "0.75rem" },
  space: [4, 8, 12, 16, 24, 32, 48],
  radii: {
    sm: { name: "Small", value: "0px", use: "Badges and checkboxes" },
    md: { name: "Medium", value: "0px", use: "Buttons and fields" },
    lg: { name: "Large", value: "0px", use: "Cards and panels" },
    full: { name: "Full", value: "0px", use: "Chips and switches" },
  },
  lines: {
    thin: { name: "Thick", value: "3px", use: "Edges, dividers and outlines" },
    thick: { name: "Thicker", value: "5px", use: "The selected tab and a link under the pointer" },
  },
  shadow: {
    name: "Shadow",
    value: `4px 4px 0 ${palette.magenta.hex}`,
    use: "A hard offset shadow, with no blur",
    hover: `2px 2px 0 ${palette.magenta.hex}`,
    pressed: "none",
  },
  // a thick ring in cyan, set away from the control like a selection cursor
  focus: { width: "3px", style: "solid", offset: "4px" },
  // raised things sink into their shadow: halfway under the pointer, all
  // the way when pressed
  press: {
    raisedHover: "translate(2px, 2px)",
    raisedPressed: "translate(4px, 4px)",
    flat: "translate(2px, 2px)",
  },
};
