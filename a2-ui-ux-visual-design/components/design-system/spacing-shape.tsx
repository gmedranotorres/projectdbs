import type { Theme } from "@/components/ui/theme";
import { Specimen } from "./section";

// Section 3. Spacing, corners, line widths and shadow.
export function SpacingShape({ theme }: { theme: Theme }) {
  // A style whose corners are all the same shows one box, not four alike.
  const radii = Object.entries(theme.radii);
  const oneRadius = new Set(radii.map(([, radius]) => radius.value)).size === 1;
  const corners = oneRadius
    ? [
        {
          size: "md",
          name: "Every corner",
          value: radii[0][1].value,
          use: "Buttons, fields, cards, chips and switches. Only the radio is round.",
        },
      ]
    : radii.map(([size, radius]) => ({ size, ...radius }));

  return (
    <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
      <Specimen title="Spacing scale">
        <ul role="list" className="grid gap-2">
          {theme.space.map((pixels, index) => (
            <li key={pixels} className="flex items-center gap-4">
              <span className="w-12 tabular-nums">{pixels}px</span>
              <span className="ui-label ui-muted w-16 font-normal">space {index + 1}</span>
              <span
                className="h-4 rounded-(--ui-radius-sm) bg-(--ui-accent-strong)"
                style={{ width: `var(--ui-space-${index + 1})` }}
              />
            </li>
          ))}
        </ul>
      </Specimen>

      <Specimen title="Corner radii">
        <ul role="list" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {corners.map((corner) => (
            <li key={corner.size} className={oneRadius ? "col-span-2" : undefined}>
              <div
                className="h-16 bg-(--ui-surface)"
                style={{
                  border: "var(--ui-line) solid var(--ui-control-line)",
                  borderRadius: `var(--ui-radius-${corner.size})`,
                }}
              />
              <p className="mt-2 font-medium">
                {corner.name} <span className="ui-muted font-normal tabular-nums">{corner.value}</span>
              </p>
              <p className="ui-label ui-muted font-normal">{corner.use}</p>
            </li>
          ))}
        </ul>
      </Specimen>

      <Specimen title="Border widths">
        <ul role="list" className="grid gap-4">
          {Object.entries(theme.lines).map(([key, line]) => (
            <li key={key}>
              <div
                className="bg-(--ui-text)"
                style={{ height: key === "thin" ? "var(--ui-line)" : "var(--ui-line-thick)" }}
              />
              <p className="mt-2 font-medium">
                {line.name} <span className="ui-muted font-normal tabular-nums">{line.value}</span>
              </p>
              <p className="ui-label ui-muted font-normal">{line.use}</p>
            </li>
          ))}
        </ul>
      </Specimen>

      <Specimen title="Shadow">
        <div
          className="ui-frame rounded-(--ui-radius-lg) bg-(--ui-surface) p-6"
          style={{ boxShadow: "var(--ui-shadow)" }}
        >
          <p className="font-medium">{theme.shadow.use}</p>
          <p className="ui-label ui-muted mt-1 font-normal tabular-nums">
            box-shadow: {theme.shadow.value}
          </p>
        </div>
      </Specimen>
    </div>
  );
}
