import type { ComponentProps, CSSProperties } from "react";

// Every bike on the site, drawn in code. No image files: a bike is a few lines
// and circles, so it stays sharp at any size and takes its color from the text
// color around it (currentColor). All of them are decoration or repeat a number
// shown in words beside them, so they're hidden from screen readers.

export type BikeType = "classic" | "electric";

// The drawing, in a 64 by 38 box, so it can sit inside other drawings.
function BikeShape({ type }: { type: BikeType }) {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <Wheel cx={13} />
      <Wheel cx={51} />
      {/* Frame: rear hub, pedals, seat, handlebars, front hub */}
      <path d="M13 27H29L24 12H44L29 27M13 27 24 12M44 12 51 27M24 12 23 7M19 7H28M44 12 43 6H50" />
      {type === "electric" && (
        <>
          {/* A filled frame with a bolt: e-bikes differ by shape, not just color. */}
          <path d="M26 13.5H41L29.5 25Z" fill="currentColor" strokeWidth="1.5" />
          <path d="M33.5 14 29.8 19.6H32.6L31 24 35.6 17.8H32.8L34.6 14Z" fill="var(--surface)" stroke="none" />
        </>
      )}
    </g>
  );
}

function Wheel({ cx }: { cx: number }) {
  return (
    <g className="bike-wheel">
      <circle cx={cx} cy={27} r={10} />
      <path d={`M${cx - 10} 27H${cx + 10}M${cx} 17V37`} strokeWidth="1" />
    </g>
  );
}

export function Bike({ type = "classic", className = "", ...props }: ComponentProps<"svg"> & { type?: BikeType }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 38" className={className} {...props}>
      <BikeShape type={type} />
    </svg>
  );
}

// An empty dock: a post waiting for a bike, in the same box as a bike, so a
// row of them lines up.
export function Dock({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 38" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 36H50" strokeDasharray="3 5" />
        <path d="M32 36V21" />
        <path d="M26 21V15a6 6 0 0 1 12 0V21Z" />
      </g>
    </svg>
  );
}

// The site's mark: a wheel, which turns while the data is live.
export function SpinningWheel({ spinning, className = "" }: { spinning: boolean; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${spinning ? "is-moving" : ""} ${className}`}>
      <g className="bike-wheel" fill="none" stroke="currentColor" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" strokeWidth="2.4" />
        <path d="M2 12H22M12 2V22M5 5 19 19M19 5 5 19" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

const MAX_SLOTS = 40;

// One drawing per real bike and open dock, so the rack shows what the numbers
// say. E-bikes come first, then classic bikes, then open docks. A few stations
// have over 100 places, so the row stops at 40 and says how many more there are.
export function DockRack({
  ebikes,
  classic,
  docks,
  arrivedEbikes = 0,
  arrivedClassic = 0,
  dimmed = false,
}: {
  ebikes: number;
  classic: number;
  docks: number;
  arrivedEbikes?: number;
  arrivedClassic?: number;
  dimmed?: boolean;
}) {
  const places: ("electric" | "classic" | "dock")[] = [
    ...Array<"electric">(ebikes).fill("electric"),
    ...Array<"classic">(classic).fill("classic"),
    ...Array<"dock">(docks).fill("dock"),
  ];
  const shown = places.slice(0, MAX_SLOTS);
  const more = places.length - shown.length;
  const size = "h-[22px] w-9";

  return (
    <div aria-hidden="true" data-testid="rack" className={`flex flex-wrap items-end gap-x-1 gap-y-2 ${dimmed ? "opacity-50 grayscale" : ""}`}>
      {shown.map((place, index) => {
        if (place === "dock") return <Dock key={index} className={`${size} text-dock`} />;
        // The newest arrivals are the last of their kind, so those roll in.
        const arrived =
          place === "electric" ? index >= ebikes - arrivedEbikes : index >= ebikes + classic - arrivedClassic;
        return (
          <Bike
            key={index}
            type={place}
            className={`${size} ${place === "electric" ? "text-ebike" : "text-classic"} ${arrived ? "roll-in" : ""}`}
          />
        );
      })}
      {more > 0 && <span className="pl-1 text-label text-muted">+{more} more</span>}
    </div>
  );
}

const FAR_TOWERS = [
  [20, 70, 130], [100, 56, 96], [170, 80, 150], [262, 50, 110], [330, 74, 170], [420, 60, 120],
  [770, 70, 140], [850, 60, 100], [920, 86, 160], [1016, 60, 118], [1086, 90, 140],
];

const NEAR_TOWERS = [
  [60, 90, 96], [214, 76, 120], [300, 60, 86], [812, 84, 112], [960, 70, 90], [1040, 96, 128],
];

const PARKED: (BikeType | "dock")[] = ["classic", "electric", "classic", "dock", "electric", "dock"];

// A Chicago street, drawn in code. Riders move only while the data is live, so
// the picture stops when the page says the numbers are out of date.
export function StreetScene({ moving = true, className = "" }: { moving?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 320"
      preserveAspectRatio="xMidYMax slice"
      data-moving={moving}
      className={`street-scene block w-full ${moving ? "is-moving" : ""} ${className}`}
    >
      <defs>
        <linearGradient id="street-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fd4f2" />
          <stop offset="1" stopColor="#e9f6fd" />
        </linearGradient>
        <pattern id="street-windows" width="14" height="18" patternUnits="userSpaceOnUse">
          <rect x="3" y="4" width="7" height="9" fill="#a8cbe2" />
        </pattern>
      </defs>

      <rect width="1200" height="320" fill="url(#street-sky)" />
      <circle cx="890" cy="64" r="34" fill="#ffd65a" />

      {/* Clouds */}
      <g fill="#ffffff" opacity="0.85">
        <path d="M150 62a16 16 0 0 1 30-8 20 20 0 0 1 36 6 14 14 0 0 1 4 27h-66a13 13 0 0 1-4-25Z" />
        <path d="M760 44a13 13 0 0 1 25-6 16 16 0 0 1 29 5 11 11 0 0 1 3 21h-54a10 10 0 0 1-3-20Z" />
      </g>

      {/* The skyline: far towers, then two tall ones in the middle, then near towers */}
      <g fill="#a9cbe2">
        {FAR_TOWERS.map(([x, width, height]) => (
          <rect key={x} x={x} y={244 - height} width={width} height={height} />
        ))}
      </g>
      <g fill="#6f95b3">
        {/* A stepped tower with two antennas */}
        <rect x="520" y="60" width="44" height="184" />
        <rect x="506" y="104" width="72" height="140" />
        <rect x="492" y="150" width="100" height="94" />
        <path d="M530 60V18M554 60V18" stroke="#6f95b3" strokeWidth="4" />
        {/* A tapered tower */}
        <path d="M640 244 654 82H702L716 244Z" />
        <path d="M668 82V36M688 82V36" stroke="#6f95b3" strokeWidth="4" />
      </g>
      <rect x="492" y="150" width="100" height="94" fill="url(#street-windows)" opacity="0.7" />
      <path d="M654 244 662 120H694L702 244Z" fill="url(#street-windows)" opacity="0.7" />
      <g fill="#4d7595">
        {NEAR_TOWERS.map(([x, width, height]) => (
          <g key={x}>
            <rect x={x} y={244 - height} width={width} height={height} />
            <rect x={x} y={244 - height} width={width} height={height} fill="url(#street-windows)" opacity="0.55" />
          </g>
        ))}
      </g>

      {/* Trees */}
      {[40, 396, 830, 1160].map((x) => (
        <g key={x}>
          <rect x={x - 3} y="216" width="6" height="30" fill="#5a4632" />
          <circle cx={x} cy="204" r="22" fill="#3c8a68" />
          <circle cx={x - 13} cy="214" r="13" fill="#3c8a68" />
          <circle cx={x + 13} cy="214" r="13" fill="#3c8a68" />
        </g>
      ))}

      {/* Sidewalk and road */}
      <rect y="244" width="1200" height="16" fill="#dbe5ec" />
      <rect y="260" width="1200" height="60" fill="#24384c" />
      <path d="M0 308H1200" className="lane" stroke="#f5c518" strokeWidth="4" strokeDasharray="40 40" />

      {/* A station: a sign, then a row of parked bikes and open docks */}
      <rect x="424" y="172" width="7" height="76" fill="#0d2438" />
      <circle cx="427" cy="166" r="24" fill="#0a5a9c" />
      <g transform="translate(409 155) scale(0.56)" style={{ color: "#ffffff" }}>
        <BikeShape type="classic" />
      </g>
      <rect x="444" y="244" width="356" height="5" rx="2.5" fill="#5a7286" />
      {PARKED.map((place, index) => {
        const x = 450 + index * 58;
        if (place === "dock") {
          return (
            <g key={index} transform={`translate(${x} 204)`} style={{ color: "#40566a" }}>
              <path d="M32 44V27M26 27V21a6 6 0 0 1 12 0V27Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
            </g>
          );
        }
        return (
          <g key={index} transform={`translate(${x} 208)`} style={{ color: place === "electric" ? "#00897b" : "#0a5a9c" }}>
            <BikeShape type={place} />
          </g>
        );
      })}

      {/* Riders. Each stays put if reduced motion is on, since the moving part
          is only an offset from where it's placed. */}
      <g transform="translate(180 264)">
        <g className="ride" style={{ color: "#ffffff", "--ride-from": "-260px", "--ride-to": "1100px" } as CSSProperties}>
          <Rider />
          <BikeShape type="classic" />
        </g>
      </g>
      <g transform="translate(860 264)">
        <g className="ride ride-fast" style={{ color: "#7fe0d3", "--ride-from": "-940px", "--ride-to": "420px" } as CSSProperties}>
          <Rider />
          <BikeShape type="electric" />
        </g>
      </g>
    </svg>
  );
}

function Rider() {
  return (
    <g fill="none" stroke="#ffb703" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 6 36 -12 45 5M23 6 32 16 29 27" />
      <circle cx="39" cy="-20" r="5.5" fill="#ffb703" stroke="none" />
    </g>
  );
}
