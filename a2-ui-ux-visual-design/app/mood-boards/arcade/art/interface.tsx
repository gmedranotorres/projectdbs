// Interface pieces, shown as pictures of the controls rather than working
// ones: square corners, thick borders, hard offset shadows.

const stage = "flex h-full flex-col items-center justify-center bg-(--navy) p-3";
const label = "font-(family-name:--press-start) text-[10px] leading-none uppercase";

export function Button() {
  return (
    <div className={`${stage} gap-4`}>
      <span
        className={`${label} inline-flex h-11 items-center border-[3px] border-(--white) bg-(--yellow) px-4 text-(--navy) shadow-[5px_5px_0_var(--magenta)]`}
      >
        Start
      </span>
      <span
        className={`${label} inline-flex h-11 items-center border-[3px] border-(--cyan) px-4 text-(--cyan)`}
      >
        Continue
      </span>
    </div>
  );
}

const chips = [
  { label: "Quiet", on: true },
  { label: "Outlets", on: true },
  { label: "Wifi", on: false },
  { label: "Late", on: false },
  { label: "Coffee", on: false },
];

export function FilterChips() {
  return (
    <div className={stage}>
      <ul role="list" className="flex flex-wrap justify-center gap-x-3 gap-y-3.5">
        {chips.map((chip) => (
          <li
            key={chip.label}
            className={`inline-flex h-9 items-center gap-2 border-[3px] px-3 text-xs font-bold uppercase ${
              chip.on
                ? "border-(--white) bg-(--lime) text-(--navy) shadow-[4px_4px_0_var(--magenta)]"
                : "border-(--white)"
            }`}
          >
            {chip.on && <span className="size-2 bg-(--navy)" aria-hidden="true" />}
            {chip.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

const toggles = [
  { label: "Open now", on: true },
  { label: "Quiet", on: false },
];

export function Toggle() {
  return (
    <div className={`${stage} gap-4`}>
      {toggles.map((toggle) => (
        <p
          key={toggle.label}
          className="flex w-full max-w-44 items-center justify-between gap-2 text-xs font-bold uppercase"
        >
          {toggle.label}
          <span
            className={`flex h-7 w-12 shrink-0 border-[3px] border-(--white) p-0.5 ${
              toggle.on ? "justify-end bg-(--lime)" : ""
            }`}
          >
            <span
              className={`w-4 ${toggle.on ? "bg-(--navy)" : "bg-(--white)"}`}
            />
            <span className="sr-only">{toggle.on ? "on" : "off"}</span>
          </span>
        </p>
      ))}
    </div>
  );
}

// A study spot as a character-select card: each thing students care about
// is a stat out of ten.
const stats = [
  { label: "Quiet", value: 8, color: "bg-(--cyan)" },
  { label: "Outlets", value: 6, color: "bg-(--lime)" },
  { label: "Wifi", value: 9, color: "bg-(--yellow)" },
  { label: "Coffee", value: 7, color: "bg-(--magenta)" },
];

export function SpotCard() {
  return (
    <div
      className="flex h-full items-center justify-center bg-(--navy) p-[5cqi]"
      style={{
        // a pixel checkerboard behind the card
        backgroundImage:
          "repeating-conic-gradient(var(--panel) 0 25%, transparent 0 50%)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="w-full border-[3px] border-(--white) bg-(--navy) p-4 shadow-[6px_6px_0_var(--magenta)]">
        <p className="flex items-baseline justify-between gap-2 font-(family-name:--press-start) text-[clamp(0.875rem,5.2cqi,1.25rem)] leading-none text-(--yellow) uppercase">
          The Reg
          <span className="text-[0.55em] text-(--white)">LVL 3</span>
        </p>
        <p className="mt-2.5 text-xs font-bold text-(--cyan) uppercase">
          Library · Open late
        </p>
        <dl className="mt-4 space-y-2.5">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 text-xs font-bold uppercase">
              <dt className="w-[4.75rem] shrink-0">{stat.label}</dt>
              <dd className="flex flex-1 items-center gap-2">
                <span className="flex h-3.5 flex-1 gap-0.5" aria-hidden="true">
                  {Array.from({ length: 10 }, (_, segment) => (
                    <span
                      key={segment}
                      className={`flex-1 ${
                        segment < stat.value ? stat.color : "bg-(--panel)"
                      }`}
                    />
                  ))}
                </span>
                <span className="w-4 text-right tabular-nums">
                  {stat.value}
                  <span className="sr-only"> of 10</span>
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 flex items-center justify-between">
          <span
            className={`${label} inline-flex h-9 items-center border-[3px] border-(--white) bg-(--yellow) px-3 text-(--navy)`}
          >
            Select
          </span>
          <span className={`${label} text-(--lime)`}>Open now</span>
        </p>
      </div>
    </div>
  );
}

export function Badge() {
  return (
    <div className={`${stage} gap-3`}>
      <span
        className={`${label} inline-flex h-7 items-center bg-(--magenta) px-2 text-(--navy)`}
      >
        New!
      </span>
      <span
        className={`${label} inline-flex h-7 items-center border-[3px] border-(--cyan) px-2 text-(--cyan)`}
      >
        Open late
      </span>
      <span
        className={`${label} inline-flex h-7 items-center bg-(--lime) px-2 text-(--navy)`}
      >
        +1 UP
      </span>
    </div>
  );
}

export function ProgressBar() {
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 bg-(--navy) p-3">
      <p className="flex items-baseline justify-between text-xs font-bold uppercase">
        Seats
        <span className={`${label} text-(--yellow)`}>6/10</span>
      </p>
      <div className="flex h-6 gap-0.5 border-[3px] border-(--white) p-0.5" aria-hidden="true">
        {Array.from({ length: 10 }, (_, segment) => (
          <span
            key={segment}
            className={`flex-1 ${segment < 6 ? "bg-(--magenta)" : ""}`}
          />
        ))}
      </div>
      <p className="text-[10px] leading-4 font-bold text-(--cyan) uppercase">
        4 left · hurry
      </p>
    </div>
  );
}
