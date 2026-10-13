// Type specimens: Press Start 2P for headlines and numbers, Space Mono for
// the rest. Big type gets a hard offset shadow instead of a glow.

const note = "text-[10px] leading-4 font-bold tracking-wide text-(--cyan) uppercase";
const hardShadow = "[text-shadow:0.09em_0.09em_0_var(--magenta)]";

export function Aa() {
  return (
    <div className="flex h-full flex-col justify-between bg-(--navy) p-3">
      <p
        className={`font-(family-name:--press-start) text-[34cqmin] leading-[1.2] text-(--yellow) ${hardShadow}`}
      >
        Aa
      </p>
      <p className={note}>Press Start 2P</p>
    </div>
  );
}

export function Headline() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 bg-(--navy) p-4">
      <p
        className={`font-(family-name:--press-start) text-[clamp(1rem,7.6cqi,2.125rem)] leading-[1.35] uppercase ${hardShadow}`}
      >
        Choose your
        <br />
        <span className="text-(--yellow)">study spot</span>
      </p>
      <p className={note}>Headline · Press Start 2P</p>
    </div>
  );
}

export function BigNumber() {
  return (
    <div className="flex h-full flex-col justify-between bg-(--navy) p-4">
      <p className={note}>Open till</p>
      <p className="font-(family-name:--press-start) text-[20cqi] leading-none tracking-[-0.1em] text-(--yellow) [text-shadow:0.06em_0.06em_0_var(--magenta),0.12em_0.12em_0_var(--cyan)]">
        11PM
      </p>
    </div>
  );
}

export function BodyText() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 bg-(--navy) p-4">
      <p className="text-[clamp(0.75rem,3.3cqi,0.875rem)] leading-[1.6]">
        Find an outlet before your battery hits zero. Coffee restores one
        heart. The Reg unlocks at level 3, and it stays open late.
      </p>
      <p className={note}>Body · Space Mono</p>
    </div>
  );
}
