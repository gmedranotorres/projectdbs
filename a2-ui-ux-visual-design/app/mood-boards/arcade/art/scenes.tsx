// Scenes drawn in SVG as original pixel art: sprites typed out as text (see
// pixels.tsx) and screens set in Press Start 2P.

import { neon, Pixels } from "./pixels";
import { gridLines } from "./textures";

const fill = "h-full w-full";
const slice = "xMidYMid slice";
const dark = "fill-[color-mix(in_srgb,var(--navy)_55%,black)]";

// The campus skyline for the title screen, in 10-unit pixels:
// [column, width, height]. Towers of 9 or more get corner pinnacles.
const skyline: [number, number, number][] = [
  [0, 6, 5], [6, 4, 7], [10, 7, 4], [17, 3, 9], [20, 8, 5], [28, 5, 7],
  [33, 4, 4], [37, 6, 9], [43, 5, 6], [48, 8, 4], [56, 4, 8], [60, 6, 5],
  [66, 3, 9], [69, 6, 4], [75, 5, 7],
];

const titleStars: [number, number, string][] = [
  [4, 3, "w"], [12, 7, "c"], [21, 2, "w"], [29, 9, "y"], [36, 4, "w"],
  [44, 11, "w"], [52, 3, "m"], [58, 8, "w"], [67, 5, "c"], [74, 10, "w"],
  [8, 14, "w"], [17, 17, "y"], [26, 15, "w"], [47, 18, "c"], [63, 15, "w"],
  [71, 19, "l"], [33, 20, "w"], [2, 20, "c"], [78, 2, "y"], [55, 13, "w"],
];

// The title screen. The skyline, stars and floor are one wide drawing that
// crops from the center; the words sit on top and scale with the tile.
export function PressStart() {
  const floor = gridLines({ horizon: 320, width: 800, height: 420, rows: 6, fan: 20, near: 130 });
  return (
    <div className="relative h-full bg-(--navy)">
      <svg
        viewBox="0 0 800 420"
        preserveAspectRatio={slice}
        className={`absolute inset-0 ${fill}`}
        aria-hidden="true"
      >
        <defs>
          <filter id="arcade-title-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <g shapeRendering="crispEdges">
          {[0.06, 0.1, 0.16, 0.24, 0.34, 0.46].map((opacity, band) => (
            <rect
              key={band}
              y={200 + band * 20}
              width="800"
              height="20"
              fill="var(--magenta)"
              opacity={opacity}
            />
          ))}
          {titleStars.map(([column, row, color], index) => (
            <rect
              key={index}
              x={column * 10}
              y={row * 10}
              width="5"
              height="5"
              fill={neon[color as keyof typeof neon]}
            />
          ))}
          {skyline.map(([column, width, height]) => (
            <g key={column}>
              <rect
                x={column * 10}
                y={320 - height * 10}
                width={width * 10}
                height={height * 10}
                className={dark}
              />
              <rect
                x={column * 10}
                y={320 - height * 10}
                width={width * 10}
                height="3"
                fill="var(--cyan)"
              />
              {height >= 9 &&
                [column, column + width - 1].map((pinnacle) => (
                  <g key={pinnacle}>
                    <rect
                      x={pinnacle * 10}
                      y={300 - height * 10}
                      width="10"
                      height="20"
                      className={dark}
                    />
                    <rect
                      x={pinnacle * 10}
                      y={300 - height * 10}
                      width="10"
                      height="3"
                      fill="var(--cyan)"
                    />
                  </g>
                ))}
              {/* lit windows: a fixed scatter that looks random */}
              {Array.from({ length: (width - 1) * (height - 1) }, (_, index) => {
                const windowColumn = index % (width - 1);
                const windowRow = Math.floor(index / (width - 1));
                return (
                  (column * 7 + windowColumn * 5 + windowRow * 3) % 4 === 0 && (
                    <rect
                      key={index}
                      x={column * 10 + 8 + windowColumn * 10}
                      y={320 - height * 10 + 12 + windowRow * 10}
                      width="4"
                      height="5"
                      fill="var(--yellow)"
                    />
                  )
                );
              })}
            </g>
          ))}
          <rect y="320" width="800" height="100" className={dark} />
        </g>
        <g fill="none" stroke="var(--magenta)">
          <path d={floor} strokeWidth="5" opacity="0.7" filter="url(#arcade-title-glow)" />
          <path d={floor} strokeWidth="1.5" />
          <path d="M0 320H800" strokeWidth="3" />
        </g>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center px-[3cqi] pt-[9cqb] pb-[5cqb] text-center font-(family-name:--press-start) uppercase">
        <p className="text-[7cqi] leading-[1.4] text-(--yellow) [text-shadow:0.08em_0.08em_0_var(--magenta)]">
          Press start
        </p>
        <p className="text-[7cqi] leading-[1.4] text-(--cyan) [text-shadow:0.08em_0.08em_0_var(--magenta)]">
          to study
        </p>
        <p className="mt-auto bg-(--navy) px-2 py-1.5 text-[clamp(0.5rem,1.8cqi,0.875rem)] leading-none">
          Insert coffee to continue
        </p>
      </div>
    </div>
  );
}

const scores = [
  ["1ST", "ACE", "42H"],
  ["2ND", "MAX", "38H"],
  ["3RD", "ANA", "35H"],
  ["4TH", "LEO", "31H"],
  ["5TH", "SAM", "27H"],
  ["6TH", "KAI", "24H"],
  ["7TH", "IVY", "20H"],
  ["8TH", "YOU", "12H"],
];

const trophy = [
  "yyyyyyyyy",
  "y.yyyyy.y",
  "y.yyyyy.y",
  ".yyyyyyy.",
  "..yyyyy..",
  "...yyy...",
  "....y....",
  "...yyy...",
  "..yyyyy..",
];

export function HighScores() {
  return (
    <svg
      viewBox="0 0 200 440"
      className={`${fill} bg-(--navy) font-(family-name:--press-start)`}
      role="img"
      aria-label="High scores in study hours: Ace 42 hours, Max 38, Ana 35, and you in 8th place with 12."
    >
      <Pixels rows={trophy} x={73} y={22} size={6} />
      <text x="100" y="112" fontSize="14" textAnchor="middle" fill="var(--yellow)">
        HIGH SCORES
      </text>
      <text x="100" y="132" fontSize="9" textAnchor="middle" fill="var(--cyan)">
        STUDY HOURS
      </text>
      {scores.map(([rank, name, hours], row) => (
        <g
          key={rank}
          fontSize="11"
          fill={
            row === 0 ? "var(--yellow)" : name === "YOU" ? "var(--lime)" : "var(--white)"
          }
        >
          <text x="18" y={172 + row * 32}>{rank}</text>
          <text x="100" y={172 + row * 32} textAnchor="middle">{name}</text>
          <text x="182" y={172 + row * 32} textAnchor="end">{hours}</text>
        </g>
      ))}
      <text x="100" y="424" fontSize="8" textAnchor="middle" fill="var(--magenta)">
        FALL QUARTER
      </text>
    </svg>
  );
}

// A blocky library in pixels, lit from inside.
const library = [
  "......wwwwww..",
  "......wyywyw..",
  "..wwwwwwwwww..",
  "..wywywwyyww..",
  "..wwwwwwwwwwww",
  "wwwwyywywwywyw",
  "wywwwwwwwwwwww",
  "wwwwywyywwywyw",
  "wywywwwwwwwwww",
  "wwwwwywywyywyw",
  "wwwwwwwwwwwwww",
  "wwwwwwnnwwwwww",
  "wwwwwwnnwwwwww",
  "cccccccccccccc",
];

export function LevelThree() {
  return (
    <svg
      viewBox="0 0 420 200"
      className={`${fill} bg-(--navy) font-(family-name:--press-start)`}
      role="img"
      aria-label="Level 3: The Reg. Boss: finals week."
    >
      <Pixels rows={library} x={316} y={62} size={6} />
      <text x="24" y="58" fontSize="16" fill="var(--yellow)">
        LEVEL 3
      </text>
      <text x="27" y="121" fontSize="38" fill="var(--magenta)">
        THE REG
      </text>
      <text x="24" y="118" fontSize="38" fill="var(--white)">
        THE REG
      </text>
      <text x="24" y="162" fontSize="10" fill="var(--cyan)">
        BOSS: FINALS WEEK
      </text>
    </svg>
  );
}

const cup = [
  "...c.....c......",
  "..c.....c.......",
  "...c.....c......",
  "..c.....c.......",
  "................",
  "wwwwwwwwwwww....",
  "wmmmmmmmmmmwww..",
  "wmmmmmmmmmmw.ww.",
  "wwwwwwwwwwww..w.",
  "wwwwwwwwwwcw..w.",
  "wwwwwwwwwwcwww..",
  "wwwwwwwwwwcw....",
  ".wwwwwwwwcw.....",
  "..wwwwwwww......",
  "yyyyyyyyyyyyyy..",
];

const heart = [".mm.mm.", "mmmmmmm", "mmmmmmm", ".mmmmm.", "..mmm..", "...m..."];
const emptyHeart = [".ww.ww.", "w..w..w", "w.....w", ".w...w.", "..w.w..", "...w..."];

// Coffee restores health: two hearts full, the third about to fill.
export function CoffeeCup() {
  return (
    <svg
      viewBox="0 0 200 200"
      preserveAspectRatio={slice}
      className={`${fill} bg-(--navy) font-(family-name:--press-start)`}
      role="img"
      aria-label="A pixel coffee cup. Health: two of three hearts, plus one."
    >
      <text x="20" y="38" fontSize="10" fill="var(--white)">
        HP
      </text>
      <Pixels rows={heart} x={50} y={18} size={4} />
      <Pixels rows={heart} x={84} y={18} size={4} />
      <Pixels rows={emptyHeart} x={118} y={18} size={4} />
      <text x="182" y="38" fontSize="10" textAnchor="end" fill="var(--lime)">
        +1
      </text>
      <Pixels rows={cup} x={38} y={60} size={8} />
    </svg>
  );
}

const plug = [
  "..ww....ww..",
  "..ww....ww..",
  "..ww....ww..",
  "yyyyyyyyyyyy",
  "yyyyyyynnyyy",
  "yyyyyynnyyyy",
  "yyyyynnnnnyy",
  "yyyyyyynnyyy",
  "yyyyyynnyyyy",
  ".yyyyynyyyy.",
  "..yyyyyyyy..",
  "....llll....",
  "....llll....",
  ".....lll....",
];

const sparkle = [".c.", "ccc", ".c."];

// Outlets are power-ups: a charged plug with sparkles around it.
export function PlugPowerUp() {
  return (
    <svg
      viewBox="0 0 200 200"
      preserveAspectRatio={slice}
      className={`${fill} bg-(--navy) font-(family-name:--press-start)`}
      role="img"
      aria-label="A pixel plug with a lightning bolt: power up."
    >
      <Pixels rows={plug} x={52} y={24} size={8} />
      <Pixels rows={sparkle} x={18} y={34} size={6} />
      <Pixels rows={sparkle} x={164} y={56} size={6} />
      <Pixels rows={sparkle} x={22} y={104} size={4} />
      <Pixels rows={sparkle} x={168} y={118} size={4} />
      <text x="100" y="180" fontSize="12" textAnchor="middle" fill="var(--yellow)">
        POWER UP
      </text>
    </svg>
  );
}

export function XpBar() {
  return (
    <svg
      viewBox="0 0 420 200"
      className={`${fill} bg-(--navy) font-(family-name:--press-start)`}
      role="img"
      aria-label="Study experience bar: 2,340 of 3,000 points, level 3."
    >
      <text x="24" y="50" fontSize="14" fill="var(--yellow)">
        STUDY XP
      </text>
      <text x="396" y="50" fontSize="14" textAnchor="end" fill="var(--white)">
        LVL 3
      </text>
      <rect x="24" y="70" width="372" height="46" fill="none" stroke="var(--white)" strokeWidth="4" />
      <g shapeRendering="crispEdges">
        {Array.from({ length: 20 }, (_, segment) => (
          <rect
            key={segment}
            x={32 + segment * 17.9}
            y="78"
            width="15"
            height="30"
            fill={segment < 15 ? "var(--lime)" : "var(--panel)"}
          />
        ))}
      </g>
      <text x="24" y="150" fontSize="11" fill="var(--cyan)">
        2340/3000
      </text>
      <text x="396" y="150" fontSize="11" textAnchor="end" fill="var(--lime)">
        +120 XP
      </text>
      <text x="24" y="178" fontSize="9" fill="var(--white)">
        660 XP TO LEVEL 4
      </text>
    </svg>
  );
}

// The sky over the lake, on a grid of 8-unit pixels: 25 across, 55 down.
const moonRadius = 5.5;
const moonRows = Array.from({ length: 11 }, (_, index) => {
  const dy = index - 5;
  const half = Math.round(Math.sqrt(moonRadius ** 2 - dy ** 2));
  return { row: 7 + index, start: 13 - half, width: half * 2 };
});
const lakeStars: [number, number, string][] = [
  [3, 3, "w"], [20, 4, "c"], [6, 10, "w"], [22, 13, "w"], [2, 18, "y"],
  [9, 22, "w"], [19, 21, "m"], [4, 27, "c"], [15, 26, "w"], [23, 28, "w"],
];
const shore: [number, number, number][] = [
  [0, 3, 3], [3, 2, 5], [5, 4, 2], [9, 2, 4], [11, 3, 2], [14, 2, 3],
  [16, 4, 2], [20, 2, 5], [22, 3, 3],
];
const ripples = [9, 7, 8, 6, 7, 5, 5, 3, 4, 2];

export function MoonOverLake() {
  return (
    <svg
      viewBox="0 0 200 440"
      preserveAspectRatio={slice}
      className={`${fill} bg-(--navy)`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {lakeStars.map(([column, row, color], index) => (
        <rect
          key={index}
          x={column * 8}
          y={row * 8}
          width="4"
          height="4"
          fill={neon[color as keyof typeof neon]}
        />
      ))}
      {moonRows.map((line) => (
        <rect
          key={line.row}
          x={line.start * 8}
          y={line.row * 8}
          width={line.width * 8}
          height="8"
          fill="var(--yellow)"
        />
      ))}
      <path
        d="M80 80h16v8h8v8h-16v-8h-8zM112 112h16v8h-16zM88 120h8v8h-8z"
        className="fill-[color-mix(in_srgb,var(--yellow)_70%,var(--magenta))]"
      />
      <rect y="272" width="200" height="168" className={dark} />
      {shore.map(([column, width, height]) => (
        <rect
          key={column}
          x={column * 8}
          y={272 - height * 8}
          width={width * 8}
          height={height * 8}
          className={dark}
        />
      ))}
      <path
        d="M32 244h4v4h-4zM168 244h4v4h-4zM176 256h4v4h-4zM80 252h4v4h-4zM8 260h4v4h-4z"
        fill="var(--yellow)"
      />
      <rect y="272" width="200" height="4" fill="var(--cyan)" />
      {ripples.map((width, index) => (
        <rect
          key={index}
          x={(13 - width / 2 + (index % 2 ? 0.5 : -0.5)) * 8}
          y={(36 + index * 2) * 8}
          width={width * 8}
          height="8"
          fill="var(--yellow)"
          opacity={1 - index * 0.07}
        />
      ))}
      <path
        d="M16 304h24v4h-24zM152 320h32v4h-32zM8 352h16v4h-16zM160 368h24v4h-24zM24 400h32v4h-32zM144 416h24v4h-24z"
        fill="var(--cyan)"
        opacity="0.7"
      />
    </svg>
  );
}

const wifi = [
  "...ccccccccc...",
  ".cc.........cc.",
  "c.............c",
  "....lllllll....",
  "..ll.......ll..",
  "...............",
  "......yyy......",
  "....yy...yy....",
  "...............",
  ".......m.......",
  "......mmm......",
  ".......m.......",
];

export function WifiSignal() {
  return (
    <svg
      viewBox="0 0 200 200"
      preserveAspectRatio={slice}
      className={`${fill} bg-(--navy) font-(family-name:--press-start)`}
      role="img"
      aria-label="A pixel wifi signal at full strength."
    >
      <Pixels rows={wifi} x={32} y={28} size={9} />
      <text x="100" y="180" fontSize="12" textAnchor="middle" fill="var(--cyan)">
        WIFI MAX
      </text>
    </svg>
  );
}
