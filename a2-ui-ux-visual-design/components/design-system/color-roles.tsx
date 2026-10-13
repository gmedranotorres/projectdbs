import { Badge } from "@/components/ui/badge";
import { accentHover, type Theme } from "@/components/ui/theme";
import { contrast, darkenToContrast } from "@/lib/color";
import { Specimen } from "./section";

// WCAG AA asks 4.5:1 of text, and 3:1 of the marks and outlines a control
// needs in order to be seen.
const TEXT = 4.5;
const MARK = 3;

const ratio = (a: string, b: string) => `${contrast(a, b).toFixed(2)}:1`;

// Section 1. Every ratio on this page is worked out here, from the theme's
// hex values, with the WCAG formula (see lib/color.ts).
export function ColorRoles({ theme }: { theme: Theme }) {
  const { background, surface, text, muted, border, accent } = theme.colors;
  const { accentTint, accentStrong } = theme.support;
  const hover = accentHover(theme);

  // What each role's ratio against the background means.
  const meaning: Record<keyof Theme["colors"], string> = {
    background: "The background itself",
    surface: "A fill, not text",
    text: contrast(text.hex, background.hex) >= TEXT ? "Passes for text" : "Too faint for text",
    muted: contrast(muted.hex, background.hex) >= TEXT ? "Passes for text" : "Too faint for text",
    border: "A line, not text",
    accent: contrast(accent.hex, background.hex) >= TEXT ? "Passes for text" : "A fill, too faint for text",
  };

  const textPairs = [
    { name: "Text on background", use: "Headings and body text", fg: text.hex, bg: background.hex },
    { name: "Text on surface", use: "Text on cards, panels and fields", fg: text.hex, bg: surface.hex },
    { name: "Muted text on background", use: "Labels and hints", fg: muted.hex, bg: background.hex },
    { name: "Muted text on surface", use: "Labels on cards, placeholder text", fg: muted.hex, bg: surface.hex },
    { name: "Text on accent", use: "The primary button’s label", fg: text.hex, bg: accent.hex },
    { name: "Text on accent, hovered", use: "The primary button under the pointer", fg: text.hex, bg: hover },
    { name: "Text on accent tint", use: "Selected chips, badges, the “Saved” notice", fg: text.hex, bg: accentTint.hex },
    { name: "Surface on text", use: "The strong badge", fg: surface.hex, bg: text.hex },
    { name: "Accent on background", use: "Not used anywhere: the accent as a text or link color", fg: accent.hex, bg: background.hex },
  ];

  const marks = [
    { name: "Control outline on background", use: "Fields, checkboxes, radios and the switch use the muted text color", fg: muted.hex, bg: background.hex },
    { name: "Control outline on surface", use: "The same controls on a card or panel", fg: muted.hex, bg: surface.hex },
    { name: "Deeper accent on background", use: "The switch when on, a checked box, the selected tab", fg: accentStrong.hex, bg: background.hex },
    { name: "Deeper accent on surface", use: "The same marks on a card or panel", fg: accentStrong.hex, bg: surface.hex },
    { name: "Surface on deeper accent", use: "The check inside a box, the knob of the switch", fg: surface.hex, bg: accentStrong.hex },
    { name: "Focus ring on background", use: "The keyboard focus ring uses the text color", fg: text.hex, bg: background.hex },
  ];

  return (
    <div className="grid gap-12">
      <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-6">
        {(Object.keys(theme.colors) as (keyof Theme["colors"])[]).map((key) => {
          const role = theme.colors[key];
          return (
            <li key={key}>
              <div
                className="h-20 rounded-(--ui-radius-lg) border border-(--ui-border)"
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

      <Specimen
        title="Made from those six"
        note="Two more colors do jobs the six roles cannot. Both come from the mood board."
      >
        <ul role="list" className="grid gap-x-4 gap-y-6 sm:grid-cols-2">
          {[accentTint, accentStrong].map((color) => (
            <li key={color.label} className="flex gap-4">
              <div
                className="size-14 flex-none rounded-(--ui-radius-lg) border border-(--ui-border)"
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

      <Specimen
        title="Marks and outlines"
        note={`The parts of a control that must be seen need ${MARK}:1. The border role is ${ratio(border.hex, background.hex)} on the background: fine for card edges and dividers, too faint to be the only edge of a control, so controls are outlined in the muted text color instead.`}
      >
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
    <ul role="list" className="divide-y divide-(--ui-border) border-y border-(--ui-border)">
      {pairs.map((pair) => {
        const passes = contrast(pair.fg, pair.bg) >= needs;
        const fix = passes ? null : darkenToContrast(pair.fg, pair.bg, fixToward, needs);
        return (
          <li key={pair.name} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
            <span
              className="ui-heading grid size-11 flex-none place-items-center rounded-(--ui-radius-md) border border-(--ui-border)"
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
