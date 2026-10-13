// Textures of an old arcade screen, drawn with CSS gradients and SVG. The
// moving ones have a still frame for reduced motion (see motion.css).

import { FloorGrid } from "./floor";
import "./motion.css";

// A bright picture seen through the dark rows and color stripes of a CRT.
// The rows roll, a bright band sweeps down, and the picture flickers a
// little.
export function Scanlines() {
  return (
    <div className="relative h-full overflow-hidden bg-(--navy)">
      <div
        className="arcade-scan-flicker absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(135deg, var(--cyan), var(--magenta) 55%, var(--yellow))",
        }}
      />
      <div
        className="arcade-scan-sweep absolute inset-x-0 -top-1/4 h-1/4"
        style={{
          backgroundImage:
            "linear-gradient(transparent, rgb(255 255 255 / 0.25), transparent)",
        }}
      />
      <div
        className="arcade-scan-roll absolute inset-x-0 -top-[5px] bottom-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgb(0 0 0 / 0.6) 0 2px, transparent 2px 5px)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse at center, transparent 45%, rgb(0 0 0 / 0.55) 100%)",
            "repeating-linear-gradient(90deg, rgb(255 0 0 / 0.14) 0 1px, rgb(0 255 0 / 0.14) 1px 2px, rgb(0 0 255 / 0.14) 2px 3px)",
          ].join(", "),
        }}
      />
    </div>
  );
}

// The 4×4 Bayer matrix: the order in which pixels switch on as a tone gets
// stronger. It is what makes two colors look like a smooth fade.
const bayer = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];
const levels = [16, 14, 12, 10, 8, 6, 4, 2, 0];

export function Dither() {
  const pixel = 5;
  const band = 440 / levels.length;
  return (
    <svg
      viewBox="0 0 200 440"
      preserveAspectRatio="none"
      className="h-full w-full"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <defs>
        {levels.map((level) => (
          <pattern
            key={level}
            id={`arcade-dither-${level}`}
            width={pixel * 4}
            height={pixel * 4}
            patternUnits="userSpaceOnUse"
          >
            {bayer.flatMap((row, y) =>
              row.map(
                (order, x) =>
                  order < level && (
                    <rect
                      key={`${x} ${y}`}
                      x={x * pixel}
                      y={y * pixel}
                      width={pixel}
                      height={pixel}
                      fill="var(--magenta)"
                    />
                  ),
              ),
            )}
          </pattern>
        ))}
      </defs>
      <rect width="200" height="440" fill="var(--navy)" />
      {levels.map((level, index) => (
        <rect
          key={level}
          y={index * band}
          width="200"
          height={band + 0.5}
          fill={`url(#arcade-dither-${level})`}
        />
      ))}
    </svg>
  );
}

// A floor grid under a glowing horizon, scrolling toward you.
//
// `id` names the sky's gradient. The Arcade design system page shows this
// floor too and passes its own id: Next.js can keep both pages in the
// document at once, and two copies must not point at each other's parts.
export function GridFloor({ id = "arcade-floor-sky" }: { id?: string }) {
  return (
    <svg
      viewBox="0 0 420 200"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.35" style={{ stopColor: "var(--navy)" }} />
          <stop offset="1" style={{ stopColor: "var(--magenta)" }} />
        </linearGradient>
      </defs>
      <rect width="420" height="200" fill="var(--navy)" />
      <rect width="420" height="74" fill={`url(#${id})`} opacity="0.7" />
      <FloorGrid
        horizon={74}
        width={420}
        height={200}
        rows={9}
        fan={12}
        near={96}
        color="var(--cyan)"
      />
    </svg>
  );
}
