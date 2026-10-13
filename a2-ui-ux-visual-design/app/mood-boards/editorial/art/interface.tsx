// Interface pieces, shown as pictures of the controls rather than working
// ones: square corners, hairlines, no shadows. Maroon marks what is on.

const stage = "flex h-full flex-col items-center justify-center bg-(--paper) p-3";
const label =
  "font-(family-name:--inter) text-[10px] leading-4 font-medium tracking-[0.12em] uppercase";

export function Button() {
  return (
    <div className={`${stage} gap-2.5`}>
      <span
        className={`${label} inline-flex h-11 items-center bg-(--ink) px-4 text-(--paper)`}
      >
        Read the guide
      </span>
      <span
        className={`${label} inline-flex h-11 items-center border border-(--ink) px-4`}
      >
        Save
      </span>
    </div>
  );
}

const chips = [
  { label: "Quiet", on: true },
  { label: "Outlets", on: true },
  { label: "Wifi", on: false },
  { label: "Open late", on: false },
  { label: "Coffee", on: false },
];

export function FilterChips() {
  return (
    <div className={stage}>
      <ul role="list" className="flex flex-wrap justify-center gap-2">
        {chips.map((chip) => (
          <li
            key={chip.label}
            className={`${label} inline-flex h-9 items-center border px-3 ${
              chip.on
                ? "border-(--maroon) bg-(--maroon) text-(--paper)"
                : "border-(--ink)"
            }`}
          >
            {chip.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

const toggles = [
  { label: "Open now", on: true },
  { label: "Quiet only", on: false },
];

export function Toggle() {
  return (
    <div className={`${stage} gap-3.5`}>
      {toggles.map((toggle) => (
        <p
          key={toggle.label}
          className={`${label} flex w-full max-w-44 items-center justify-between gap-2`}
        >
          {toggle.label}
          <span
            className={`flex h-6 w-11 shrink-0 border p-0.5 ${
              toggle.on
                ? "justify-end border-(--maroon) bg-(--maroon)"
                : "border-(--ink)"
            }`}
          >
            <span className={`w-4 ${toggle.on ? "bg-(--paper)" : "bg-(--ink)"}`} />
            <span className="sr-only">{toggle.on ? "on" : "off"}</span>
          </span>
        </p>
      ))}
    </div>
  );
}

// A study spot as a guide listing: a rank, a verdict, and a score out of
// five for each thing students care about.
const ratings = [
  ["Quiet", 5],
  ["Outlets", 4],
  ["Wifi", 4],
  ["Coffee", 1],
] as const;

export function SpotCard() {
  return (
    <div className="flex h-full items-center justify-center bg-(--fog) p-[5cqi]">
      <div className="w-full border border-(--ink) bg-(--paper) p-4">
        <p className={`${label} flex items-baseline justify-between text-(--gray)`}>
          Library
          <span className="font-(family-name:--playfair) text-xl leading-none font-normal tracking-normal text-(--maroon) normal-case italic lining-nums">
            No. 3
          </span>
        </p>
        <p className="mt-1.5 font-(family-name:--playfair) text-[clamp(1.375rem,7.4cqi,1.875rem)] leading-[1.05] font-bold">
          Mansueto Reading Room
        </p>
        <p className="mt-2 text-sm leading-snug italic">
          A glass dome, long tables, and a hush you can hear.
        </p>
        <dl className="mt-3 divide-y divide-(--ink)/25 border-y border-(--ink)">
          {ratings.map(([name, score]) => (
            <div key={name} className="flex items-center justify-between py-1.5">
              <dt className={label}>{name}</dt>
              <dd className="flex gap-1">
                {[1, 2, 3, 4, 5].map((mark) => (
                  <span
                    key={mark}
                    className={`size-2 border border-(--ink) ${
                      mark <= score ? "bg-(--ink)" : ""
                    }`}
                  />
                ))}
                <span className="sr-only">{score} of 5</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className={`${label} mt-3 flex items-center justify-between`}>
          Open until 11 PM
          <span className="text-(--maroon) underline underline-offset-4">
            Read more
          </span>
        </p>
      </div>
    </div>
  );
}

export function Badge() {
  return (
    <div className={`${stage} gap-2.5`}>
      <span
        className={`${label} inline-flex h-6 items-center bg-(--maroon) px-2 text-(--paper)`}
      >
        Editors’ pick
      </span>
      <span className={`${label} inline-flex h-6 items-center border border-(--ink) px-2`}>
        Open late
      </span>
      <span
        className={`${label} inline-flex h-6 items-center bg-(--ink) px-2 text-(--paper)`}
      >
        New
      </span>
    </div>
  );
}

export function ProgressBar() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 bg-(--paper) p-3">
      <p className={`${label} flex items-baseline justify-between`}>
        Seats taken
        <span className="font-(family-name:--playfair) text-2xl leading-none font-bold tracking-normal lining-nums">
          40%
        </span>
      </p>
      <div className="h-2 border border-(--ink)">
        <div className="h-full w-2/5 bg-(--ink)" />
      </div>
      <p className={`${label} flex justify-between text-(--gray)`}>
        <span>Empty</span>
        <span>Full</span>
      </p>
    </div>
  );
}
