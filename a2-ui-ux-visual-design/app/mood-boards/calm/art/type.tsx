// Type specimens: Newsreader for headlines and numbers, Inter for the rest.

const note = "text-[11px] leading-4 text-(--walnut)";

export function Aa() {
  return (
    <div className="flex h-full flex-col justify-between bg-(--warm-white) p-3">
      <p className="font-(family-name:--newsreader) text-[50cqmin] leading-none">Aa</p>
      <p className={note}>Newsreader</p>
    </div>
  );
}

export function Headline() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 bg-(--warm-white) p-4">
      <p className="font-(family-name:--newsreader) text-[clamp(1.5rem,8.8cqi,2.625rem)] leading-[1.06] tracking-[-0.01em] text-balance">
        A quiet table, good light, and nowhere to be.
      </p>
      <p className={note}>Headline · Newsreader</p>
    </div>
  );
}

export function BigNumber() {
  return (
    <div className="flex h-full flex-col justify-between bg-(--ink) p-4 text-(--warm-white)">
      <p className="text-[11px] leading-4 text-(--oat)">Open until</p>
      <p className="font-(family-name:--newsreader) text-[58cqb] leading-[0.8] font-light tracking-[-0.02em]">
        11
        <span className="ml-[0.1em] text-[0.34em] tracking-normal">PM</span>
      </p>
    </div>
  );
}

export function BodyText() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 bg-(--warm-white) p-4">
      <p className="text-[clamp(0.8125rem,3.6cqi,0.9375rem)] leading-[1.6]">
        The east reading room stays quiet past four. Most seats have an
        outlet, the wifi holds, and there is coffee downstairs until six.
      </p>
      <p className={note}>Body · Inter</p>
    </div>
  );
}
