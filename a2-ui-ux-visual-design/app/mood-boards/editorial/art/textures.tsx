import { grain } from "@/components/mood-board/grain";
import { palette } from "../palette";
import { spots } from "../spots";
import { halftone } from "./halftone";

// Cheap paper up close: ink specks and a few long fibers.
export function NewsprintGrain() {
  return (
    <div
      className="h-full bg-(--newsprint)"
      style={{
        backgroundImage: [
          grain({ frequency: "0.9", color: palette.ink.hex, strength: 0.4 }),
          grain({
            frequency: "0.02 0.5",
            color: palette.gray.hex,
            strength: 0.3,
            seed: 6,
          }),
        ].join(", "),
      }}
    />
  );
}

// A printed fade from solid ink to bare paper, corner to corner.
const dots = halftone({
  width: 200,
  height: 200,
  pitch: 9,
  shade: (x, y) => 1.05 - (x + y) / 360,
});

export function HalftoneDots() {
  return (
    <svg
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full bg-(--paper)"
      aria-hidden="true"
    >
      <path d={dots} fill="var(--ink)" />
    </svg>
  );
}

// Three narrow columns of small type with a hairline between them. The
// words are filler, made from the guide's own list: the tile is about the
// rules and the rhythm.
const filler = `${spots.join(". ")}. Quiet, outlets, wifi, open late, coffee. `;

export function ColumnRules() {
  return (
    <div className="h-full overflow-hidden bg-(--paper) p-3" aria-hidden="true">
      <p className="columns-3 gap-4 text-justify text-[7px] leading-[1.55] hyphens-auto [column-rule:1px_solid_var(--ink)]">
        {filler.repeat(8)}
      </p>
    </div>
  );
}

// Engraver's shading: one set of hairlines everywhere, a second crossing
// it where the tone deepens, and a third in the darkest corner.
export function Crosshatch() {
  return (
    <svg
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full bg-(--paper) [&_*]:[vector-effect:non-scaling-stroke]"
      aria-hidden="true"
    >
      <defs>
        {[45, -45, 0].map((angle) => (
          <pattern
            key={angle}
            id={`editorial-hatch-${angle}`}
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform={`rotate(${angle})`}
          >
            <path d="M0 3H6" stroke="var(--ink)" fill="none" />
          </pattern>
        ))}
      </defs>
      <rect width="200" height="200" fill="url(#editorial-hatch-45)" />
      <path d="M70 0H200V200H0V150Z" fill="url(#editorial-hatch--45)" />
      <path d="M200 60V200H40Z" fill="url(#editorial-hatch-0)" />
    </svg>
  );
}
