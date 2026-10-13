import { grain } from "@/components/mood-board/grain";
import { palette } from "../palette";

export function PaperGrain() {
  return (
    <div
      className="h-full bg-(--oat)"
      style={{
        backgroundImage: grain({
          frequency: "0.75",
          color: palette.ink.hex,
          strength: 0.42,
        }),
      }}
    />
  );
}

// Two sets of stretched fibers, one across and one down, over a fine weave.
export function LinenTexture() {
  const weave =
    "color-mix(in srgb, var(--walnut) 13%, transparent) 0 1px, transparent 1px 3px";
  return (
    <div
      className="h-full bg-(--warm-white)"
      style={{
        backgroundImage: [
          grain({
            frequency: "0.015 0.8",
            color: palette.walnut.hex,
            strength: 0.26,
            seed: 3,
          }),
          grain({
            frequency: "0.8 0.015",
            color: palette.walnut.hex,
            strength: 0.26,
            seed: 8,
          }),
          `repeating-linear-gradient(0deg, ${weave})`,
          `repeating-linear-gradient(90deg, ${weave})`,
        ].join(", "),
      }}
    />
  );
}

// Light through a paned window, falling slanted on a wall.
export function WindowLight() {
  return (
    <svg
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full bg-(--oat)"
      aria-hidden="true"
    >
      <filter id="calm-window-blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3.5" />
      </filter>
      <g
        filter="url(#calm-window-blur)"
        fill="var(--warm-white)"
        transform="translate(18 -6) skewX(-16) rotate(8)"
      >
        {[0, 1, 2].map((row) =>
          [0, 1].map((column) => (
            <rect
              key={`${row} ${column}`}
              x={52 + column * 62}
              y={14 + row * 62}
              width="54"
              height="54"
            />
          )),
        )}
      </g>
    </svg>
  );
}

// Long soft bands for the growth rings, with finer fibers over them.
export function OakGrain() {
  return (
    <div
      className="h-full bg-[color-mix(in_srgb,var(--walnut)_34%,var(--oat))]"
      style={{
        backgroundImage: [
          grain({
            frequency: "0.005 0.09",
            color: palette.walnut.hex,
            strength: 0.55,
            octaves: 2,
            seed: 5,
          }),
          grain({
            frequency: "0.01 0.7",
            color: palette.ink.hex,
            strength: 0.16,
            octaves: 2,
            seed: 11,
          }),
        ].join(", "),
      }}
    />
  );
}
