// Type specimens: Playfair Display for display, Source Serif 4 for text,
// small uppercase Inter for labels.

const label =
  "font-(family-name:--inter) text-[10px] leading-4 font-medium tracking-[0.12em] uppercase";
const display = "font-(family-name:--playfair)";

export function Aa() {
  return (
    <div className="flex h-full flex-col justify-between bg-(--paper) p-3">
      <p className={`${display} text-[52cqmin] leading-none font-black`}>
        A<span className="font-normal italic">a</span>
      </p>
      <p className={`${label} text-(--gray)`}>Playfair Display</p>
    </div>
  );
}

export function Headline() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 bg-(--paper) p-4">
      <p className={`${label} text-(--maroon)`}>The weekend guide</p>
      <p
        className={`${display} text-[clamp(1.375rem,7.6cqi,2.125rem)] leading-[1.05] font-bold tracking-[-0.01em] text-balance`}
      >
        Where Hyde Park goes to get things done
      </p>
      <p className="text-[clamp(0.8125rem,3.6cqi,0.9375rem)] leading-snug italic">
        Twelve tables, ranked by how quiet they stay.
      </p>
    </div>
  );
}

export function BigNumber() {
  return (
    <div className="flex h-full flex-col justify-between bg-(--paper) p-4">
      <p className={`${label} border-b border-(--ink) pb-1.5 text-(--gray)`}>
        Open until
      </p>
      <div className="flex items-end justify-between gap-4">
        <p className={`${display} text-[58cqb] leading-[0.8] font-black lining-nums`}>
          11
          <span className="ml-[0.08em] text-[0.3em] font-normal tracking-[0.04em]">
            PM
          </span>
        </p>
        <p className="max-w-[9.5rem] text-right text-[clamp(0.75rem,3.4cqi,0.875rem)] leading-snug italic">
          Six of our twelve picks stay open this late.
        </p>
      </div>
    </div>
  );
}

export function BodyText() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 bg-(--paper) p-4">
      <p className="text-[clamp(0.8125rem,3.6cqi,0.9375rem)] leading-[1.55]">
        The third floor is the quiet one. Bring a charger, because the
        outlets run along the east wall only, and plan on coffee from the
        cart downstairs until six.
      </p>
      <p className={`${label} text-(--gray)`}>Body · Source Serif 4</p>
    </div>
  );
}
