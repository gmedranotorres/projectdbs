import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { CanvasColor } from "@/components/mood-board/canvas-color";
import { Collage } from "@/components/mood-board/collage";
import { pressStart, spaceMono } from "@/fonts/arcade";
import { artifacts } from "./artifacts";
import { arcadeVars, palette } from "./palette";

export const metadata: Metadata = { title: "Arcade Mood Board" };

export const viewport: Viewport = { themeColor: palette.navy.hex };

const moodWords = [
  { word: "Loud", color: "text-(--magenta)" },
  { word: "Playful", color: "text-(--cyan)" },
  { word: "Electric", color: "text-(--lime)" },
];

// Each kind of tile throws its hard shadow in its own neon.
const pop =
  "[--pop:var(--magenta)] data-[kind=Color]:[--pop:var(--white)] data-[kind=Texture]:[--pop:var(--cyan)] data-[kind=Type]:[--pop:var(--yellow)] data-[kind=UI]:[--pop:var(--lime)]";

export default function Page() {
  return (
    <main
      className={`${pressStart.variable} ${spaceMono.variable} flex-1 bg-(--navy) font-(family-name:--space-mono) text-(--white) [--collage-gap-wide:1.375rem] [--collage-gap:1rem]`}
      style={{
        ...arcadeVars,
        // faint scanlines over the whole screen
        backgroundImage:
          "repeating-linear-gradient(0deg, rgb(255 255 255 / 0.045) 0 1px, transparent 1px 4px)",
      }}
    >
      <CanvasColor color={palette.navy.hex} scheme="dark" />

      <div className="mx-auto w-full max-w-[88rem] px-4 pb-24 sm:px-8 sm:pb-32 xl:px-12">
        <header className="pb-12 pt-6 sm:pb-16 sm:pt-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex h-11 items-center border-[3px] border-(--white) bg-(--yellow) px-3 font-(family-name:--press-start) text-[10px] leading-none text-(--navy) uppercase shadow-[4px_4px_0_var(--magenta)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--magenta)] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-(--cyan)"
            >
              ← Hub
            </Link>
            <p className="text-right text-xs font-bold tracking-wide text-(--cyan) uppercase">
              Mood board · Arcade
            </p>
          </div>

          <h1 className="mt-12 font-(family-name:--press-start) text-[clamp(1.75rem,8.2vw,6rem)] leading-[1.25] uppercase [text-shadow:0.06em_0.06em_0_var(--magenta),0.12em_0.12em_0_var(--cyan)] sm:mt-20">
            Late-night
            <br />
            <span className="text-(--yellow)">level up</span>
          </h1>

          <ul
            role="list"
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3 font-(family-name:--press-start) text-xs leading-none uppercase sm:text-sm"
          >
            {moodWords.map(({ word, color }) => (
              <li key={word} className={`flex items-center gap-2.5 ${color}`}>
                <span className="size-2 bg-current" aria-hidden="true" />
                {word}
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-xl text-sm leading-relaxed sm:text-base">
            Studying as a game: outlets are power-ups, and coffee restores
            health.
          </p>
        </header>

        <Collage
          artifacts={artifacts}
          tileClassName={`border-[3px] border-(--white) bg-(--navy) shadow-[6px_6px_0_var(--pop)] ${pop}`}
          captionClassName="border-t-[3px] border-(--white) bg-(--navy) px-2 py-1.5 text-[10px] leading-4 font-bold uppercase"
          numberClassName="text-(--pop)"
        />
      </div>
    </main>
  );
}
