import type { Theme } from "@/components/ui/theme";
import { Specimen } from "./section";

// Section 3. Spacing, corners, line widths and shadow.
export function SpacingShape({ theme }: { theme: Theme }) {
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
          {Object.entries(theme.radii).map(([size, radius]) => (
            <li key={size}>
              <div
                className="h-16 border border-(--ui-muted) bg-(--ui-surface)"
                style={{ borderRadius: `var(--ui-radius-${size})` }}
              />
              <p className="mt-2 font-medium">
                {radius.name} <span className="ui-muted font-normal tabular-nums">{radius.value}</span>
              </p>
              <p className="ui-label ui-muted font-normal">{radius.use}</p>
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
          className="rounded-(--ui-radius-lg) border border-(--ui-border) bg-(--ui-surface) p-6"
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
