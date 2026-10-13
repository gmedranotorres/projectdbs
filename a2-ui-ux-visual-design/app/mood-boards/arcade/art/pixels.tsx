// Pixel art from text. Each character in `rows` is one pixel; `colors` says
// which color a character paints, and any other character stays empty.

export const neon = {
  w: "var(--white)",
  m: "var(--magenta)",
  c: "var(--cyan)",
  l: "var(--lime)",
  y: "var(--yellow)",
  n: "var(--navy)",
};

export function Pixels({
  rows,
  x = 0,
  y = 0,
  size,
  colors = neon,
}: {
  rows: string[];
  x?: number;
  y?: number;
  size: number;
  colors?: Record<string, string>;
}) {
  return (
    <g shapeRendering="crispEdges">
      {rows.flatMap((row, r) => {
        // One rectangle per run of the same character, not per pixel.
        const runs = [];
        for (let start = 0; start < row.length; ) {
          let end = start + 1;
          while (end < row.length && row[end] === row[start]) end++;
          if (colors[row[start]]) {
            runs.push(
              <rect
                key={`${r} ${start}`}
                x={x + start * size}
                y={y + r * size}
                width={(end - start) * size}
                height={size}
                fill={colors[row[start]]}
              />,
            );
          }
          start = end;
        }
        return runs;
      })}
    </g>
  );
}
