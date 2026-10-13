// Scenes from the pages of a city magazine. The typographic ones (masthead,
// pull quote, drop cap, numbered pick, byline) are set in live text with
// small SVG ornaments; the pictures (arch, map, key) are drawn in SVG.

import { spots } from "../spots";
import { halftone } from "./halftone";

const label =
  "font-(family-name:--inter) text-[10px] leading-4 font-medium tracking-[0.12em] uppercase";
const display = "font-(family-name:--playfair)";
// Lines stay hairlines however large the tile is.
const hairlines = "[&_*]:[vector-effect:non-scaling-stroke]";

// A small printer's ornament: a pointed arch between two short rules.
function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 16" className={`${hairlines} ${className}`} aria-hidden="true">
      <path
        d="M0 8H22M42 8H64M26 15V9A6 6 0 0 1 32 2A6 6 0 0 1 38 9V15M32 2V15"
        fill="none"
        stroke="currentColor"
      />
    </svg>
  );
}

export function Masthead() {
  return (
    <div className="flex h-full flex-col justify-between bg-(--paper) px-4 py-3 text-center">
      <p className={`${label} flex items-center justify-between border-b-4 border-double border-(--ink) pb-1.5`}>
        <span>Hyde Park, Chicago</span>
        <Ornament className="hidden h-3 w-12 @md:block" />
        <span>Autumn quarter</span>
      </p>
      <p className={`${display} text-[min(12cqi,44cqb)] leading-none font-black tracking-[-0.02em]`}>
        The Study Guide
      </p>
      <p className={`${label} flex justify-between border-t border-(--ink) pt-1.5 text-(--gray)`}>
        <span>Vol. 1 · No. 3</span>
        <span className="hidden @2xl:inline">Where to sit, sip and cram</span>
        <span className="text-(--maroon)">Free</span>
      </p>
    </div>
  );
}

export function PullQuote() {
  return (
    <div className="flex h-full items-center gap-3 bg-(--paper) p-4">
      <span
        className={`${display} h-[0.45em] self-start text-[clamp(4rem,24cqi,6.5rem)] leading-[0.85] text-(--maroon)`}
        aria-hidden="true"
      >
        “
      </span>
      <blockquote
        className={`${display} text-[clamp(1.125rem,5.6cqi,1.5rem)] leading-[1.15] text-balance italic`}
      >
        A relaxing and comfortable spot is a good way to focus on your work
      </blockquote>
    </div>
  );
}

export function DropCap() {
  return (
    <div className="flex h-full items-center bg-(--paper) p-4">
      <p className="text-[clamp(0.8125rem,3.5cqi,0.9375rem)] leading-[1.5]">
        <span
          className={`${display} float-left mt-[0.06em] mr-1.5 text-[4.4em] leading-[0.72] font-black text-(--maroon)`}
        >
          T
        </span>
        his guide covers eight places to study in Hyde Park:{" "}
        {spots.slice(0, -1).join(", ")} and {spots.at(-1)}.
      </p>
    </div>
  );
}

export function NumberedPick() {
  return (
    <div className="flex h-full flex-col bg-(--paper) p-3">
      <p className={`${display} text-[15cqi] leading-none italic`}>No.</p>
      <p className={`${display} text-[92cqi] leading-[0.82] font-black text-(--maroon) lining-nums`}>
        3
      </p>
      <div className="mt-auto border-t border-(--ink) pt-2">
        <p className={`${label} text-(--gray)`}>Our pick for deep focus</p>
        <p className={`${display} mt-1 text-[clamp(1.125rem,11cqi,1.375rem)] leading-[1.1] font-bold`}>
          Mansueto Grand Reading Room
        </p>
      </div>
    </div>
  );
}

// A pointed arch: two arcs of radius 220 that spring from (90, 215) and
// (310, 215) and meet at the top. The dots are densest in the vault and
// thin out toward the light at the foot of the doorway.
const insideArch = (x: number, y: number) =>
  y >= 215
    ? x >= 90 && x <= 310
    : Math.hypot(x - 310, y - 215) <= 220 && Math.hypot(x - 90, y - 215) <= 220;

const archDots = halftone({
  width: 400,
  height: 420,
  pitch: 9,
  inside: insideArch,
  shade: (x, y) => {
    const down = Math.min(1, Math.max(0, (y - 60) / 340));
    const centered = 1 - Math.min(1, Math.abs(x - 200) / 110) ** 2;
    return 0.95 - 0.85 * down ** 0.8 * (0.35 + 0.65 * centered);
  },
});

export function HalftoneArch() {
  return (
    <svg
      viewBox="0 0 400 420"
      preserveAspectRatio="xMidYMid slice"
      className={`h-full w-full bg-(--fog) ${hairlines}`}
      aria-hidden="true"
    >
      <path d="M90 420V215A220 220 0 0 1 200 24.5A220 220 0 0 1 310 215V420Z" fill="var(--paper)" />
      <path d={archDots} fill="var(--ink)" />
      {/* tracery: two lancets, a mullion and a maroon rose */}
      <g fill="none" stroke="var(--paper)" strokeWidth="4">
        <path d="M90 250A110 110 0 0 1 145 154.7A110 110 0 0 1 200 250A110 110 0 0 1 255 154.7A110 110 0 0 1 310 250M200 150V420" />
      </g>
      <circle cx="200" cy="108" r="30" fill="var(--maroon)" stroke="var(--paper)" strokeWidth="4" />
      <g fill="none" stroke="var(--ink)">
        <path d="M90 420V215A220 220 0 0 1 200 24.5A220 220 0 0 1 310 215V420" />
        <path d="M78 420V215A244 244 0 0 1 200 3.7A244 244 0 0 1 322 215V420" />
        <path d="M50 404H350" />
      </g>
    </svg>
  );
}

// The map runs one mile west to east, from Cottage Grove (800 East in
// Chicago's street numbering) to Stony Island (1600 East). A street
// number becomes a position with `east`, so avenues and spots sit where
// their addresses put them. North to south is squeezed to fit the strip.
const east = (number: number) => 170 + (number - 800) * 0.7125;

const avenues = [
  { name: "Cottage Grove", x: east(800), labelY: 190 },
  { name: "Ellis", x: east(1000), labelY: 200 },
  { name: "University", x: east(1144), labelY: 190 },
  { name: "Woodlawn", x: east(1200), labelY: 200 },
  { name: "Dorchester", x: east(1400), labelY: 200 },
  // its name sits beside the line, clear of Jackson Park's tint
  { name: "Stony Island", x: east(1600), labelY: 190, beside: true },
];
const streets = [
  { name: "57th", y: 40 },
  { name: "59th", y: 90 },
  { name: "60th", y: 132 },
  { name: "61st", y: 168 },
];

// Each spot by its street address. `side` is where its name goes.
const places = [
  // 1100 E 57th St, at Ellis
  { name: "Mansueto", x: east(1028), y: 22, side: "left" },
  // 1100 E 57th St
  { name: "Regenstein", x: east(1084), y: 22, side: "right" },
  // 5730 S Ellis Ave, west side
  { name: "Crerar", x: east(984), y: 51, side: "left" },
  // 1116 E 59th St
  { name: "Harper", x: east(1116), y: 76, side: "left" },
  // 5751 S Woodlawn Ave, east side
  { name: "Plein Air", x: east(1212), y: 54, side: "right" },
  // 1212 E 59th St
  { name: "Ida Noyes", x: east(1212), y: 80, side: "right" },
  // 1307 E 60th St
  { name: "Keller", x: east(1307), y: 142, side: "right" },
  // 6100 S Blackstone Ave
  { name: "Build", x: east(1436), y: 178, side: "left" },
];

// The Midway Plaisance and the streets around it, as a line map with the
// guide's eight spots. It is drawn wide: a narrow tile keeps the middle,
// which holds every spot.
//
// `id` names the hatch pattern. The Editorial design system page shows this
// map too and passes its own id: Next.js can keep both pages in the
// document at once, and two copies must not point at each other's parts.
export function MidwayMap({ id = "editorial-map-hatch" }: { id?: string }) {
  return (
    <svg
      viewBox="0 0 880 210"
      preserveAspectRatio="xMidYMid slice"
      className={`h-full w-full bg-(--paper) font-(family-name:--inter) ${hairlines}`}
      role="img"
      aria-label={`A line map of the Midway Plaisance between 59th and 60th Streets, from Washington Park to Jackson Park, marking the guide's eight spots: ${spots.join(", ")}.`}
    >
      <defs>
        <pattern
          id={id}
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <path d="M0 2.5H5" stroke="var(--gray)" fill="none" />
        </pattern>
      </defs>

      {/* the Midway, between 59th and 60th */}
      <rect x="170" y="90" width="570" height="42" fill="var(--fog)" />
      <rect x="170" y="90" width="570" height="42" fill={`url(#${id})`} opacity="0.5" />
      {/* Washington Park to the west, Jackson Park and the lake to the east */}
      <rect x="20" width="150" height="132" fill="var(--fog)" />
      <rect x="740" width="96" height="210" fill="var(--fog)" />
      <g fill="none" stroke="var(--gray)">
        <path d="M848 20q8 12 0 24t0 24 0 24 0 24 0 24 0 24 0 24M864 20q8 12 0 24t0 24 0 24 0 24 0 24 0 24 0 24" />
      </g>
      {/* the library block north of 57th and the main quadrangles south of it */}
      <g fill="var(--paper)" stroke="var(--ink)">
        <path d="M319 8H409V34H319ZM319 46H409V84H319Z" />
      </g>

      <g fill="none" stroke="var(--ink)">
        {streets.map((street) => (
          <path key={street.name} d={`M0 ${street.y}H836`} />
        ))}
        {avenues.map((avenue) => (
          <path key={avenue.name} d={`M${avenue.x} 0V210`} />
        ))}
      </g>

      <g fontSize="8" fontWeight="500" letterSpacing="0.9" fill="var(--gray)">
        {/* avenue names sit on their lines, on two rows so that close
            neighbors don't collide; the paper-colored outline breaks the
            line behind each name */}
        {avenues.map((avenue) => (
          <text
            key={avenue.name}
            x={avenue.beside ? avenue.x - 6 : avenue.x}
            y={avenue.labelY}
            textAnchor={avenue.beside ? "end" : "middle"}
            stroke="var(--paper)"
            strokeWidth="5"
            paintOrder="stroke"
          >
            {avenue.name.toUpperCase()}
          </text>
        ))}
        {streets.map((street) => (
          <text key={street.name} x="226" y={street.y - 4}>
            {street.name.toUpperCase()}
          </text>
        ))}
      </g>
      {/* names on the gray tint are set in ink, to stay readable */}
      <g fontSize="8" fontWeight="500" letterSpacing="0.9" fill="var(--ink)">
        <text x="52" y="72">WASHINGTON</text>
        <text x="76" y="84">PARK</text>
        <text x="762" y="108">JACKSON</text>
        <text x="772" y="120">PARK</text>
      </g>
      <text
        x="455"
        y="115"
        textAnchor="middle"
        fontSize="10"
        fontWeight="600"
        letterSpacing="5"
        fill="var(--ink)"
        stroke="var(--fog)"
        strokeWidth="4"
        paintOrder="stroke"
      >
        MIDWAY PLAISANCE
      </text>

      {/* the eight spots */}
      {places.map((place) => (
        <g key={place.name}>
          <circle
            cx={place.x}
            cy={place.y}
            r="5"
            fill="var(--maroon)"
            stroke="var(--paper)"
            strokeWidth="1.5"
          />
          <text
            x={place.x + (place.side === "left" ? -9 : 9)}
            y={place.y + 3.5}
            textAnchor={place.side === "left" ? "end" : "start"}
            fontSize="10"
            fontWeight="600"
            fill="var(--ink)"
            stroke="var(--paper)"
            strokeWidth="4"
            paintOrder="stroke"
          >
            {place.name}
          </text>
        </g>
      ))}

      {/* north arrow */}
      <g transform="translate(640 22)" stroke="var(--ink)" fill="none">
        <path d="M0 14V-8M-5 -2L0 -9L5 -2" />
      </g>
      <text x="648" y="27" fontSize="8" fontWeight="600" fill="var(--ink)">
        N
      </text>
    </svg>
  );
}

export function Byline() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 bg-(--paper) p-3">
      <svg viewBox="0 0 48 48" className="size-11" aria-hidden="true">
        <defs>
          <pattern id="editorial-byline-dots" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <circle cx="1.5" cy="1.5" r="1" fill="var(--ink)" />
          </pattern>
          <clipPath id="editorial-byline-frame">
            <circle cx="24" cy="24" r="23" />
          </clipPath>
        </defs>
        <circle cx="24" cy="24" r="23" fill="var(--fog)" />
        <g clipPath="url(#editorial-byline-frame)" fill="url(#editorial-byline-dots)">
          <circle cx="24" cy="19" r="9" />
          <path d="M6 50C6 36 14 31 24 31S42 36 42 50Z" />
        </g>
        <circle cx="24" cy="24" r="23" fill="none" stroke="var(--ink)" />
      </svg>
      <p className={`${label} text-(--gray)`}>Words and picks</p>
      <p className={`${display} text-lg leading-[1.1] italic`}>
        By the Study Guide desk
      </p>
      <p className={`${label} border-t border-(--ink) pt-1.5 text-(--gray)`}>
        Drawn in code
      </p>
    </div>
  );
}

// The guide's key: one line icon for each thing students care about.
const key = [
  { name: "Quiet", icon: "M3 8V12H6L10 15V5L6 8ZM13 7L17 13M17 7L13 13" },
  { name: "Outlets", icon: "M7 3V7M13 3V7M5 7H15V10A5 5 0 0 1 5 10ZM10 15V18" },
  { name: "Wifi", icon: "M3 8A10 10 0 0 1 17 8M6 11A6 6 0 0 1 14 11M10 15V15.5" },
  { name: "Open late", icon: "M15 12A6.5 6.5 0 1 1 8 4A5 5 0 0 0 15 12Z" },
  { name: "Coffee", icon: "M4 8H14V12A4 4 0 0 1 10 16H8A4 4 0 0 1 4 12ZM14 9H16A2 2 0 0 1 16 13H14M7 3V5M11 3V5" },
];

export function RatingsKey() {
  return (
    <div className="flex h-full flex-col justify-center bg-(--paper) p-3">
      <p className={`${label} border-b border-(--ink) pb-1 text-(--maroon)`}>
        The key
      </p>
      <ul role="list" className="divide-y divide-(--ink)/25">
        {key.map((item) => (
          <li key={item.name} className={`${label} flex items-center gap-2 py-1`}>
            <svg viewBox="0 0 20 20" className="size-4 shrink-0" aria-hidden="true">
              <path
                d={item.icon}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
