// Interface pieces, shown as pictures of the controls rather than working
// ones: rounded corners, thin 1px lines, no shadows.

const stage =
  "flex h-full flex-col items-center justify-center bg-(--warm-white) p-3";
const stageOnPaper =
  "flex h-full flex-col items-center justify-center bg-(--oat) p-3";

export function Button() {
  return (
    <div className={`${stage} gap-2.5`}>
      <span className="inline-flex h-11 items-center rounded-xl bg-(--sage) px-5 text-sm font-medium">
        Find a spot
      </span>
      <span className="inline-flex h-11 items-center rounded-xl border border-(--line) px-5 text-sm font-medium">
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
    <div className={stageOnPaper}>
      <ul role="list" className="flex flex-wrap justify-center gap-2">
        {chips.map((chip) => (
          <li
            key={chip.label}
            className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] ${
              chip.on
                ? "border-(--sage) bg-(--sage-mist) font-medium"
                : "border-(--line) bg-(--warm-white)"
            }`}
          >
            {chip.on && (
              <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
                <path
                  d="M2 6.5 5 9.5 10 3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
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
    <div className={`${stage} gap-3`}>
      {toggles.map((toggle) => (
        <p
          key={toggle.label}
          className="flex w-full max-w-44 items-center justify-between gap-2 text-[13px]"
        >
          {toggle.label}
          <span
            className={`flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5 ${
              toggle.on
                ? "justify-end border-(--sage-deep) bg-(--sage)"
                : "border-(--walnut)"
            }`}
          >
            <span
              className={`size-4.5 rounded-full ${
                toggle.on ? "bg-(--warm-white)" : "bg-(--walnut)"
              }`}
            />
            <span className="sr-only">{toggle.on ? "on" : "off"}</span>
          </span>
        </p>
      ))}
    </div>
  );
}

const facts = [
  ["Outlets", "Most seats"],
  ["Wifi", "Strong"],
  ["Coffee", "Downstairs"],
];

export function SpotCard() {
  return (
    <div className="flex h-full items-center justify-center bg-(--sage-mist) p-[5cqi]">
      <div className="w-full rounded-2xl border border-(--line) bg-(--warm-white) p-4 text-[13px] leading-5">
        <p className="text-xs text-(--walnut)">Library</p>
        <p className="mt-1 font-(family-name:--newsreader) text-[clamp(1.375rem,7.4cqi,1.875rem)] leading-[1.1]">
          Harper Reading Room
        </p>
        <dl className="mt-3 divide-y divide-(--line) border-y border-(--line)">
          <div className="flex items-center justify-between py-1.5">
            <dt className="text-(--walnut)">Quiet</dt>
            <dd className="flex gap-1">
              {[1, 2, 3, 4, 5].map((dot) => (
                <span
                  key={dot}
                  className={`size-2 rounded-full border border-(--sage-deep) ${
                    dot <= 4 ? "bg-(--sage)" : ""
                  }`}
                />
              ))}
              <span className="sr-only">4 of 5</span>
            </dd>
          </div>
          {facts.map(([label, value]) => (
            <div key={label} className="flex justify-between py-1.5">
              <dt className="text-(--walnut)">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 flex justify-end">
          <span className="inline-flex h-8 items-center rounded-lg border border-(--line) px-3 text-xs font-medium">
            View spot
          </span>
        </div>
      </div>
    </div>
  );
}

export function Badge() {
  return (
    <div className={`${stage} gap-2`}>
      <span className="inline-flex h-6 items-center gap-1.5 rounded-md bg-(--sage-mist) px-2 text-xs font-medium">
        <span className="size-1.5 rounded-full bg-(--sage-deep)" />
        Open late
      </span>
      <span className="inline-flex h-6 items-center rounded-md border border-(--line) px-2 text-xs font-medium">
        Very quiet
      </span>
      <span className="inline-flex h-6 items-center rounded-md bg-(--ink) px-2 text-xs font-medium text-(--warm-white)">
        New
      </span>
    </div>
  );
}

export function ProgressBar() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 bg-(--warm-white) p-3">
      <p className="flex items-baseline justify-between text-[13px]">
        Seats taken
        <span className="font-(family-name:--newsreader) text-xl leading-none">40%</span>
      </p>
      <div className="h-2.5 rounded-full border border-(--sage-deep) p-px">
        <div className="h-full w-2/5 rounded-full bg-(--sage)" />
      </div>
      <p className="text-[11px] leading-4 text-(--walnut)">Calm until 4 PM</p>
    </div>
  );
}
