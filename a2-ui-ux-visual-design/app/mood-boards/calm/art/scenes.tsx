// Scenes drawn in SVG: flat matte shapes and thin lines in the six palette
// colors. Each one fills its tile and crops from the center if the tile is
// resized, so the subject sits in the middle.

// Lines stay 1px on screen however large the tile is.
const svg = "h-full w-full [&_*]:[vector-effect:non-scaling-stroke]";
const slice = "xMidYMid slice";

const wall = "fill-[color-mix(in_srgb,var(--oat)_45%,var(--warm-white))]";
const paleWood = "fill-[color-mix(in_srgb,var(--walnut)_45%,var(--oat))]";

const windows = [80, 240, 400, 560, 720];
const chairs = [160, 320, 480, 640];

// A row of arched windows, a long table with reading lamps, and the light
// slanting across them. Drawn wide: a narrow tile keeps the middle window.
export function LongTable() {
  const light = windows.map((x) => (
    <path key={x} d={`M${x - 44} 242H${x + 44}L${x + 186} 420H${x + 98}Z`} />
  ));
  return (
    <svg viewBox="0 0 800 420" preserveAspectRatio={slice} className={svg} aria-hidden="true">
      <defs>
        <clipPath id="calm-table-window">
          <path d="M0 236V92Q0 54 44 30Q88 54 88 92V236Z" />
        </clipPath>
        <filter id="calm-table-blur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>

      <rect width="800" height="420" className={wall} />
      <rect y="376" width="800" height="44" fill="var(--oat)" />

      {windows.map((x) => (
        <g key={x} transform={`translate(${x - 44} 0)`} stroke="var(--line)">
          <path d="M0 236V92Q0 54 44 30Q88 54 88 92V236Z" fill="var(--warm-white)" />
          <g clipPath="url(#calm-table-window)" stroke="none">
            <circle cx="14" cy="238" r="46" fill="var(--sage-mist)" />
            <circle cx="74" cy="250" r="40" fill="var(--sage-mist)" />
          </g>
          <path d="M44 30V236M0 92H88M0 164H88" fill="none" />
          <rect x="-6" y="236" width="100" height="6" fill="var(--warm-white)" />
        </g>
      ))}

      <g filter="url(#calm-table-blur)" fill="var(--warm-white)" opacity="0.8">
        {light}
      </g>

      {/* table */}
      <rect y="340" width="800" height="5" className={paleWood} />
      {[100, 400, 700].map((x) => (
        <path
          key={x}
          d={`M${x - 16} 274h8l-5 102h-8zM${x + 8} 274h8l5 102h-8z`}
          fill="var(--walnut)"
        />
      ))}
      <rect y="267" width="800" height="8" className={paleWood} />
      <rect y="258" width="800" height="9" fill="var(--walnut)" />

      {/* on the table: reading lamps, books, a mug */}
      {windows.map((x) => (
        <g key={x}>
          <path d={`M${x} 254V226`} stroke="var(--ink)" fill="none" />
          <rect x={x - 13} y="253" width="26" height="5" rx="2" fill="var(--ink)" />
          <path
            d={`M${x - 26} 229Q${x - 26} 210 ${x} 210Q${x + 26} 210 ${x + 26} 229Z`}
            fill="var(--sage)"
            stroke="var(--sage-deep)"
          />
        </g>
      ))}
      <g stroke="var(--ink)">
        <path d="M338 258V256Q349 247 360 254Q371 247 382 256V258Z" fill="var(--warm-white)" />
        <path d="M360 254V258" fill="none" />
        <rect x="434" y="245" width="13" height="13" rx="2" fill="var(--warm-white)" />
        <path d="M447 248q7 0 7 4.5t-7 4.5" fill="none" />
        <path d="M498 258V256Q509 247 520 254Q531 247 542 256V258Z" fill="var(--warm-white)" />
      </g>
      <rect x="276" y="251" width="34" height="7" rx="1" fill="var(--sage-deep)" />
      <rect x="280" y="245" width="27" height="6" rx="1" fill="var(--warm-white)" stroke="var(--ink)" />
      <rect x="112" y="250" width="36" height="8" rx="1" fill="var(--warm-white)" stroke="var(--ink)" />
      <rect x="116" y="243" width="28" height="7" rx="1" fill="var(--sage-deep)" />
      <rect x="640" y="251" width="34" height="7" rx="1" fill="var(--sage-deep)" />

      {/* chairs pulled up on the near side */}
      {chairs.map((x) => (
        <g key={x} stroke="var(--ink)" fill="none">
          <path
            d={`M${x - 22} 306V250Q${x - 22} 236 ${x} 236Q${x + 22} 236 ${x + 22} 250V306M${x - 10} 240V306M${x} 236V306M${x + 10} 240V306M${x - 22} 312L${x - 26} 376M${x + 22} 312L${x + 26} 376`}
          />
          <rect x={x - 27} y="306" width="54" height="7" rx="2" className={paleWood} />
        </g>
      ))}

      {/* the same light again, faintly, over the furniture it crosses */}
      <g filter="url(#calm-table-blur)" fill="var(--warm-white)" opacity="0.3">
        {light}
      </g>
    </svg>
  );
}

// A pendant lamp with a sage shade, and its pool of light on an open book.
export function ReadingLamp() {
  return (
    <svg viewBox="0 0 200 440" preserveAspectRatio={slice} className={svg} aria-hidden="true">
      <defs>
        <linearGradient id="calm-lamp-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--warm-white)", stopOpacity: 0.95 }} />
          <stop offset="1" style={{ stopColor: "var(--warm-white)", stopOpacity: 0.15 }} />
        </linearGradient>
      </defs>
      <rect width="200" height="440" fill="var(--oat)" />
      <path d="M56 206H144L204 396H-4Z" fill="url(#calm-lamp-glow)" />
      <path d="M100 0V150" stroke="var(--ink)" fill="none" />
      <circle cx="100" cy="210" r="10" fill="var(--warm-white)" stroke="var(--line)" />
      <path d="M52 204Q52 150 100 150Q148 150 148 204Z" fill="var(--sage)" stroke="var(--sage-deep)" />
      <rect x="47" y="201" width="106" height="7" rx="3.5" fill="var(--sage-deep)" />
      <rect y="396" width="200" height="44" fill="var(--walnut)" />
      <path
        d="M46 396V390Q73 374 100 386Q127 374 154 390V396Z"
        fill="var(--warm-white)"
        stroke="var(--ink)"
      />
      <path d="M100 386V396M62 388Q78 381 92 386M108 386Q122 381 138 388" stroke="var(--line)" fill="none" />
    </svg>
  );
}

export function SteamingMug() {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio={slice} className={svg} aria-hidden="true">
      <rect width="200" height="200" fill="var(--sage-mist)" />
      <rect y="152" width="200" height="48" fill="var(--oat)" />
      <path d="M0 152H200" stroke="var(--line)" fill="none" />
      <g stroke="var(--ink)" fill="var(--warm-white)">
        <ellipse cx="96" cy="153" rx="62" ry="7" />
        <path d="M130 98h12a17 17 0 0 1 0 34h-13v-8h12a9 9 0 0 0 0-18h-11z" />
        <path d="M58 88H134V124Q134 150 110 150H82Q58 150 58 124Z" />
        <ellipse cx="96" cy="88" rx="38" ry="6" fill="var(--walnut)" />
      </g>
      <g fill="none" stroke="var(--walnut)" strokeLinecap="round">
        <path d="M80 70q-9-11 0-22t0-22" />
        <path d="M97 64q-9-11 0-22t0-22" />
        <path d="M114 70q-9-11 0-22t0-22" />
      </g>
    </svg>
  );
}

// Leaves up the stem: where each starts, how far it leans, how big, and
// whether it takes the deeper sage.
const leaves = [
  { y: 322, lean: -62, scale: 1, deep: true },
  { y: 296, lean: 56, scale: 1.05, deep: false },
  { y: 262, lean: -48, scale: 1.1, deep: false },
  { y: 228, lean: 44, scale: 1.05, deep: true },
  { y: 192, lean: -36, scale: 1, deep: false },
  { y: 158, lean: 30, scale: 0.95, deep: true },
  { y: 124, lean: -6, scale: 0.9, deep: false },
];

export function Plant() {
  return (
    <svg viewBox="0 0 200 440" preserveAspectRatio={slice} className={svg} aria-hidden="true">
      <rect width="200" height="440" fill="var(--warm-white)" />
      <rect y="404" width="200" height="36" fill="var(--oat)" />
      <path d="M0 404H200" stroke="var(--line)" fill="none" />
      <path d="M100 334C98 262 103 190 100 120" stroke="var(--sage-deep)" fill="none" />
      {leaves.map((leaf) => (
        <g key={leaf.y} transform={`translate(100 ${leaf.y}) rotate(${leaf.lean}) scale(${leaf.scale})`}>
          <path
            d="M0 0C21-16 23-58 0-84C-23-58-21-16 0 0Z"
            fill={leaf.deep ? "var(--sage-deep)" : "var(--sage)"}
          />
          <path d="M0-4V-72" stroke="var(--warm-white)" strokeOpacity="0.45" fill="none" />
        </g>
      ))}
      <path d="M62 334H138L129 404H71Z" className={paleWood} stroke="var(--ink)" />
      <rect x="55" y="322" width="90" height="14" rx="3" className={paleWood} stroke="var(--ink)" />
    </svg>
  );
}

// The Midway: a long lawn, two old trees, a bench with a book left on it,
// and a low line of campus towers in the distance.
export function MidwayBench() {
  return (
    <svg viewBox="0 0 400 420" preserveAspectRatio={slice} className={svg} aria-hidden="true">
      <rect width="400" height="420" fill="var(--warm-white)" />
      <path
        d="M0 250V232H26V218H40V232H64V208l9-16 9 16V232H118V224H150V232H186V200l8-14 8 14V232H240V222H268V232H308V206l9-16 9 16V232H352V224H380V232H400V250Z"
        className={paleWood}
        opacity="0.4"
      />
      <rect y="250" width="400" height="170" fill="var(--sage-mist)" />
      <path d="M0 250H400" stroke="var(--line)" fill="none" />
      <path d="M0 388Q200 356 400 388V420H0Z" fill="var(--oat)" />

      <ellipse cx="72" cy="352" rx="96" ry="9" fill="var(--sage)" opacity="0.35" />
      <ellipse cx="330" cy="352" rx="96" ry="9" fill="var(--sage)" opacity="0.35" />
      <path d="M62 352C66 300 60 250 68 190H84C80 250 84 300 88 352Z" fill="var(--walnut)" />
      <path d="M318 352C322 300 316 250 322 180H338C336 250 340 300 344 352Z" fill="var(--walnut)" />
      <circle cx="20" cy="150" r="62" fill="var(--sage-deep)" />
      <circle cx="140" cy="140" r="58" fill="var(--sage-deep)" />
      <circle cx="78" cy="98" r="84" fill="var(--sage)" />
      <circle cx="386" cy="150" r="60" fill="var(--sage-deep)" />
      <circle cx="262" cy="132" r="56" fill="var(--sage-deep)" />
      <circle cx="328" cy="88" r="88" fill="var(--sage)" />

      <ellipse cx="200" cy="356" rx="92" ry="6" fill="var(--sage)" opacity="0.45" />
      <g stroke="var(--ink)" fill="var(--warm-white)">
        <path d="M136 290V354M264 290V354M148 322V354M252 322V354" fill="none" />
        <rect x="126" y="286" width="148" height="8" rx="2" />
        <rect x="126" y="300" width="148" height="8" rx="2" />
        <rect x="122" y="318" width="156" height="8" rx="2" />
        <rect x="186" y="311" width="30" height="7" rx="1" fill="var(--sage-deep)" />
      </g>
    </svg>
  );
}

export function Clock() {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio={slice} className={svg} aria-hidden="true">
      <rect width="200" height="200" fill="var(--warm-white)" />
      <circle cx="100" cy="100" r="70" fill="var(--oat)" stroke="var(--ink)" />
      <circle cx="100" cy="100" r="61" fill="var(--warm-white)" stroke="var(--line)" />
      {Array.from({ length: 12 }, (_, hour) => (
        <path
          key={hour}
          d={hour % 3 === 0 ? "M100 45V54" : "M100 45V50"}
          transform={`rotate(${hour * 30} 100 100)`}
          stroke="var(--ink)"
          fill="none"
        />
      ))}
      <g className="font-(family-name:--newsreader)" fontSize="15" textAnchor="middle" fill="var(--ink)">
        <text x="100" y="74">12</text>
        <text x="137" y="105">3</text>
        <text x="100" y="138">6</text>
        <text x="63" y="105">9</text>
      </g>
      {/* 4:10 */}
      <g stroke="var(--ink)" strokeLinecap="round" fill="none">
        <path d="M100 100V70" strokeWidth="2.5" transform="rotate(125 100 100)" />
        <path d="M100 100V52" strokeWidth="1.5" transform="rotate(60 100 100)" />
      </g>
      <circle cx="100" cy="100" r="4" fill="var(--sage-deep)" />
    </svg>
  );
}

export function BookStack() {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio={slice} className={svg} aria-hidden="true">
      <rect width="200" height="200" fill="var(--oat)" />
      <rect y="160" width="200" height="40" fill="var(--warm-white)" />
      <path d="M0 160H200" stroke="var(--line)" fill="none" />
      <rect x="36" y="134" width="128" height="26" rx="2" fill="var(--walnut)" />
      <rect x="50" y="112" width="106" height="22" rx="2" fill="var(--sage)" />
      <rect x="42" y="93" width="118" height="19" rx="2" fill="var(--warm-white)" stroke="var(--ink)" />
      <rect x="58" y="72" width="94" height="21" rx="2" fill="var(--sage-deep)" />
      <path
        d="M50 134V160M56 134V160M64 112V134M56 93V112M72 72V93M92 147H132M88 123H124M84 102.5H120"
        stroke="var(--ink)"
        strokeOpacity="0.35"
        fill="none"
      />
      {/* reading glasses left on top */}
      <g stroke="var(--ink)" fill="none" strokeWidth="1.25">
        <circle cx="90" cy="62" r="10" />
        <circle cx="118" cy="62" r="10" />
        <path d="M100 60q4-4 8 0M80 60L70 56M128 60L140 55" />
      </g>
    </svg>
  );
}

// A wall outlet with a charger plugged in: the thing every student looks
// for first.
export function Outlet() {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio={slice} className={svg} aria-hidden="true">
      <rect width="200" height="200" fill="var(--oat)" />
      <rect y="166" width="200" height="34" fill="var(--warm-white)" />
      <path d="M0 166H200" stroke="var(--line)" fill="none" />
      <rect x="64" y="34" width="64" height="100" rx="10" fill="var(--warm-white)" stroke="var(--ink)" />
      <g fill="var(--ink)">
        <rect x="85" y="50" width="4" height="13" rx="1" />
        <rect x="103" y="50" width="4" height="13" rx="1" />
        <path d="M92 69h8v4a4 4 0 0 1-8 0z" />
      </g>
      <circle cx="96" cy="84" r="2.5" fill="none" stroke="var(--ink)" />
      <rect x="78" y="94" width="36" height="30" rx="7" fill="var(--sage)" stroke="var(--sage-deep)" />
      <path
        d="M96 124C96 172 138 132 150 166S186 196 204 184"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
