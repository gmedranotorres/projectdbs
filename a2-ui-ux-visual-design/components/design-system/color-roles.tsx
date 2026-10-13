import { Badge } from "@/components/ui/badge";
import type { ColorRole, Theme } from "@/components/ui/theme";
import { contrast, darkenToContrast } from "@/lib/color";
import { Specimen } from "./section";

// WCAG AA asks 4.5:1 of text, and 3:1 of the marks and outlines a control
// needs in order to be seen.
const TEXT = 4.5;
const MARK = 3;

const ratio = (a: string, b: string) => `${contrast(a, b).toFixed(2)}:1`;
// How a color is called in a sentence: "Deeper accent", "deeper accent".
const short = (color: ColorRole) => color.short ?? color.label;
const lower = (color: ColorRole) => short(color).toLowerCase();

// Section 1. Every ratio on this page is worked out here, from the theme's
// hex values, with the WCAG formula (see lib/color.ts). The pairs are the
// ones the components really use: they come from the theme's `parts`.
export function ColorRoles({ theme }: { theme: Theme }) {
  const { background, surface, text, muted, border, accent } = theme.colors;
  const parts = theme.parts;
  const passes = (color: ColorRole) =>
    contrast(color.hex, background.hex) >= TEXT;

  // What each role's ratio against the background means.
  const meaning: Record<keyof Theme["colors"], string> = {
    background: "The background itself",
    surface: "A fill, not text",
    text: passes(text) ? "Passes for text" : "Too faint for text",
    muted: passes(muted) ? "Passes for text" : "Too faint for text",
    border: "A line, not text",
    accent: passes(accent) ? "Passes for text" : "A fill, too faint for text",
  };

  const textPairs = [
    { name: `${short(text)} on ${lower(background)}`, use: "Headings and body text", fg: text.hex, bg: background.hex },
    { name: `${short(text)} on ${lower(surface)}`, use: "Text on cards, panels and fields", fg: text.hex, bg: surface.hex },
    { name: `${short(muted)} on ${lower(background)}`, use: "Labels and hints", fg: muted.hex, bg: background.hex },
    { name: `${short(muted)} on ${lower(surface)}`, use: "Labels on cards, placeholder text", fg: muted.hex, bg: surface.hex },
    { name: `${short(parts.onAccent)} on ${lower(accent)}`, use: "The primary button’s label", fg: parts.onAccent.hex, bg: accent.hex },
    { name: `${short(parts.onAccent)} on ${lower(accent)}, hovered`, use: "The primary button under the pointer", fg: parts.onAccent.hex, bg: parts.accentHover },
    { name: `${short(parts.onTint)} on ${lower(parts.tint)}`, use: "Selected chips, badges, the “Saved” notice", fg: parts.onTint.hex, bg: parts.tint.hex },
    { name: `${short(surface)} on ${lower(text)}`, use: "The strong badge", fg: surface.hex, bg: text.hex },
    { name: `${short(accent)} on ${lower(background)}`, use: "Not used anywhere: the accent as a text or link color", fg: accent.hex, bg: background.hex },
  ];

  const marks = [
    { name: "Control outline on background", use: `Fields, checkboxes, radios and the switch use the ${lower(parts.controlLine)} color`, fg: parts.controlLine.hex, bg: background.hex },
    { name: "Control outline on surface", use: "The same controls on a card or panel", fg: parts.controlLine.hex, bg: surface.hex },
    { name: `${short(parts.strong)} on ${lower(background)}`, use: "The switch when on, a checked box, the selected tab", fg: parts.strong.hex, bg: background.hex },
    { name: `${short(parts.strong)} on ${lower(surface)}`, use: "The same marks on a card or panel", fg: parts.strong.hex, bg: surface.hex },
    { name: `${short(parts.onStrong)} on ${lower(parts.strong)}`, use: "The check inside a box, the knob of the switch", fg: parts.onStrong.hex, bg: parts.strong.hex },
    { name: "Focus ring on background", use: `The keyboard focus ring uses the ${lower(parts.focus)} color`, fg: parts.focus.hex, bg: background.hex },
  ];

  // Whether the border role can be the edge of a control by itself.
  const borderRatio = ratio(border.hex, background.hex);
  const marksNote =
    contrast(border.hex, background.hex) >= MARK
      ? `The parts of a control that must be seen need ${MARK}:1. The border role is ${borderRatio} on the background, so it can be the edge of a control as well as of a card.`
      : `The parts of a control that must be seen need ${MARK}:1. The border role is ${borderRatio} on the background: fine for card edges and dividers, too faint to be the only edge of a control, so controls are outlined in the ${lower(parts.controlLine)} color instead.`;

  return (
    <div className="grid gap-12">
      <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-6">
        {(Object.keys(theme.colors) as (keyof Theme["colors"])[]).map((key) => {
          const role = theme.colors[key];
          return (
            <li key={key}>
              <div
                className="ui-frame h-20 rounded-(--ui-radius-lg)"
                style={{ backgroundColor: role.hex }}
              />
              <p className="ui-heading mt-3">{role.label}</p>
              <p className="ui-label ui-muted mt-1">{role.from}</p>
              <p className="mt-3 tabular-nums">{role.hex}</p>
              <p className="tabular-nums">
                {ratio(role.hex, background.hex)}
                <span className="ui-label ui-muted"> on background</span>
              </p>
              <p className="ui-label ui-muted mt-1">{meaning[key]}</p>
              <p className="ui-label ui-muted mt-3 font-normal">{role.use}</p>
            </li>
          );
        })}
      </ul>

      <Specimen title={theme.supportTitle} note={theme.supportNote}>
        <ul role="list" className="grid gap-x-4 gap-y-6 sm:grid-cols-2">
          {theme.support.map((color) => (
            <li key={color.label} className="flex gap-4">
              <div
                className="ui-frame size-14 flex-none rounded-(--ui-radius-lg)"
                style={{ backgroundColor: color.hex }}
              />
              <div>
                <p className="font-medium">
                  {color.label}{" "}
                  <span className="ui-muted font-normal tabular-nums">
                    {color.hex} · {ratio(color.hex, background.hex)} on background
                  </span>
                </p>
                <p className="ui-label ui-muted mt-1">{color.from}</p>
                <p className="ui-label ui-muted mt-1 font-normal">{color.use}</p>
              </div>
            </li>
          ))}
        </ul>
      </Specimen>

      <Specimen
        title="Text pairs"
        note={`Text needs ${TEXT}:1. A pair under that is flagged with a suggested fix; no color has been changed.`}
      >
        <PairList pairs={textPairs} needs={TEXT} fixToward={text.hex} sample="text" />
      </Specimen>

      <Specimen title="Marks and outlines" note={marksNote}>
        <PairList pairs={marks} needs={MARK} fixToward={text.hex} sample="mark" />
      </Specimen>
    </div>
  );
}

function PairList({
  pairs,
  needs,
  fixToward,
  sample,
}: {
  pairs: { name: string; use: string; fg: string; bg: string }[];
  needs: number;
  fixToward: string;
  // what the little preview shows: letters, or an outlined dot
  sample: "text" | "mark";
}) {
  return (
    <ul role="list" className="ui-ruled">
      {pairs.map((pair) => {
        const passes = contrast(pair.fg, pair.bg) >= needs;
        const fix = passes ? null : darkenToContrast(pair.fg, pair.bg, fixToward, needs);
        return (
          <li key={pair.name} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
            <span
              className="ui-frame ui-heading grid size-11 flex-none place-items-center rounded-(--ui-radius-md)"
              style={{ backgroundColor: pair.bg, color: pair.fg }}
              aria-hidden="true"
            >
              {sample === "text" ? (
                "Aa"
              ) : (
                <span className="grid size-5 place-items-center rounded-full border border-current">
                  <span className="size-2 rounded-full bg-current" />
                </span>
              )}
            </span>
            <div className="min-w-48 flex-1">
              <p className="font-medium">{pair.name}</p>
              <p className="ui-label ui-muted font-normal">{pair.use}</p>
              {fix && (
                <p className="mt-1 text-sm">
                  Suggested fix, not applied: a darker version,{" "}
                  <span className="font-medium tabular-nums">{fix}</span>,
                  would reach {ratio(fix, pair.bg)}.
                </p>
              )}
            </div>
            <p className="ml-auto flex items-center gap-4">
              <span className="tabular-nums">{ratio(pair.fg, pair.bg)}</span>
              <span className="flex w-28 justify-end">
                {passes ? (
                  <Badge>Passes {needs}:1</Badge>
                ) : (
                  <Badge tone="strong">Under {needs}:1</Badge>
                )}
              </span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}
