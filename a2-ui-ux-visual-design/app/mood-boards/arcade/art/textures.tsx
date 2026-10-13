// Textures of an old arcade screen, drawn with CSS gradients and SVG.

// A bright picture seen through the dark rows and color stripes of a CRT.
export function Scanlines() {
  return (
    <div
      className="h-full"
      style={{
        backgroundImage: [
          "radial-gradient(ellipse at center, transparent 45%, rgb(0 0 0 / 0.55) 100%)",
          "repeating-linear-gradient(0deg, rgb(0 0 0 / 0.6) 0 2px, transparent 2px 5px)",
          "repeating-linear-gradient(90deg, rgb(255 0 0 / 0.14) 0 1px, rgb(0 255 0 / 0.14) 1px 2px, rgb(0 0 255 / 0.14) 2px 3px)",
          "linear-gradient(135deg, var(--cyan), var(--magenta) 55%, var(--yellow))",
        ].join(", "),
      }}
    />
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

// Lines of a floor grid running to a vanishing point on the horizon:
// crosswise lines bunch up toward it, lengthwise lines fan out from it.
export function gridLines({
  horizon,
  width,
  height,
  rows = 9,
  fan = 12,
  near = 96,
}: {
  horizon: number;
  width: number;
  height: number;
  rows?: number;
  fan?: number;
  near?: number;
}) {
  const center = width / 2;
  const across = Array.from({ length: rows }, (_, row) => {
    const y = horizon + (height - horizon) * ((row + 1) / rows) ** 2;
    return `M0 ${y.toFixed(1)}H${width}`;
  });
  const along = Array.from({ length: fan * 2 + 1 }, (_, index) => {
    const lane = index - fan;
    return `M${center + lane * 14} ${horizon}L${center + lane * near} ${height}`;
  });
  return [...across, ...along].join("");
}

export function GridFloor() {
  const lines = gridLines({ horizon: 74, width: 420, height: 200 });
  return (
    <svg
      viewBox="0 0 420 200"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="arcade-floor-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.35" style={{ stopColor: "var(--navy)" }} />
          <stop offset="1" style={{ stopColor: "var(--magenta)" }} />
        </linearGradient>
        <filter id="arcade-floor-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <rect width="420" height="200" fill="var(--navy)" />
      <rect width="420" height="74" fill="url(#arcade-floor-sky)" opacity="0.7" />
      <g fill="none" stroke="var(--cyan)">
        <path d={lines} strokeWidth="4" opacity="0.7" filter="url(#arcade-floor-glow)" />
        <path d={lines} strokeWidth="1.5" />
        <path d="M0 74H420" strokeWidth="3" />
      </g>
    </svg>
  );
}

// Stars at fixed made-up positions, so the sky is the same on every visit:
// [column, row, color], on a grid of 5-unit pixels.
const stars: [number, number, string][] = [
  [3, 4, "w"], [11, 2, "c"], [19, 6, "w"], [27, 3, "y"], [35, 7, "w"],
  [6, 12, "y"], [15, 14, "w"], [23, 11, "m"], [31, 15, "w"], [37, 12, "c"],
  [2, 21, "c"], [9, 24, "w"], [18, 20, "w"], [26, 23, "l"], [33, 21, "w"],
  [5, 31, "w"], [13, 34, "m"], [21, 29, "w"], [29, 32, "c"], [36, 30, "y"],
  [8, 38, "c"], [17, 37, "w"], [25, 36, "w"], [34, 38, "w"],
];
const starColors: Record<string, string> = {
  w: "var(--white)",
  c: "var(--cyan)",
  y: "var(--yellow)",
  m: "var(--magenta)",
  l: "var(--lime)",
};

export function Starfield() {
  return (
    <svg
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full bg-(--navy)"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {stars.map(([column, row, color], index) => (
        <g key={index} fill={starColors[color]}>
          <rect x={column * 5} y={row * 5} width="5" height="5" />
          {/* every fourth star twinkles: a plus instead of a dot */}
          {index % 4 === 0 && (
            <path
              d={`M${column * 5 - 5} ${row * 5}h15v5h-15zM${column * 5} ${row * 5 - 5}h5v15h-5z`}
            />
          )}
        </g>
      ))}
    </svg>
  );
}
