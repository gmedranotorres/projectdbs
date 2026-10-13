import type { CSSProperties } from "react";
import "./motion.css";

// A glowing floor grid in perspective, for use inside an SVG. Lengthwise
// lines fan out from the horizon and stay put. Crosswise lines bunch up
// toward the horizon and travel toward the viewer; with reduced motion they
// rest on their rows (see motion.css).
export function FloorGrid({
  horizon,
  width,
  height,
  rows,
  fan,
  near,
  color,
}: {
  horizon: number;
  width: number;
  height: number;
  rows: number;
  fan: number;
  near: number;
  color: string;
}) {
  const center = width / 2;
  // Row 0 is the horizon, row `rows` the near edge. Squaring the fraction
  // is what packs the far rows together.
  const rowY = (row: number) =>
    (horizon + (height - horizon) * (row / rows) ** 2).toFixed(1);
  const along = Array.from({ length: fan * 2 + 1 }, (_, index) => {
    const lane = index - fan;
    return `M${center + lane * 14} ${horizon}L${center + lane * near} ${height}`;
  }).join("");
  // The glow is the same line three times: wide and faint, then narrower,
  // then sharp. It costs far less to animate than a blur filter.
  const glowing = (d: string) => (
    <>
      <path d={d} strokeWidth="7" opacity="0.16" />
      <path d={d} strokeWidth="3.5" opacity="0.35" />
      <path d={d} strokeWidth="1.5" />
    </>
  );
  return (
    <g fill="none" stroke={color}>
      {glowing(along)}
      {Array.from({ length: rows }, (_, row) => (
        <g
          key={row}
          className="arcade-floor-line"
          style={
            Object.fromEntries(
              [0, 1, 2, 3, 4].map((step) => [
                `--y${step}`,
                `${rowY(row + step / 4)}px`,
              ]),
            ) as CSSProperties
          }
        >
          {glowing(`M0 0H${width}`)}
        </g>
      ))}
      <path d={`M0 ${horizon}H${width}`} strokeWidth="3" />
    </g>
  );
}
