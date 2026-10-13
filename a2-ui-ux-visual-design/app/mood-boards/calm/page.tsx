import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { CanvasColor } from "@/components/mood-board/canvas-color";
import { Collage } from "@/components/mood-board/collage";
import { grain } from "@/components/mood-board/grain";
import { inter, newsreader } from "@/fonts/calm";
import { artifacts } from "./artifacts";
import { calmVars, palette } from "./palette";

export const metadata: Metadata = { title: "Calm Mood Board" };

export const viewport: Viewport = { themeColor: palette.oat.hex };

const moodWords = ["Matte", "Warm", "Unhurried"];

export default function Page() {
  return (
    <main
      className={`${newsreader.variable} ${inter.variable} flex-1 bg-(--oat) font-inter text-(--ink)`}
      style={{
        ...calmVars,
        backgroundImage: grain({
          frequency: "0.9",
          color: palette.ink.hex,
          strength: 0.16,
        }),
      }}
    >
      <CanvasColor color={palette.oat.hex} />

      <div className="mx-auto w-full max-w-[88rem] px-4 pb-24 sm:px-8 sm:pb-32 xl:px-12">
        <header className="pb-12 pt-4 sm:pb-20 sm:pt-8">
          <div className="flex items-center justify-between border-b border-(--line) pb-2 text-sm">
            <Link
              href="/"
              className="-ml-2 inline-flex h-11 items-center rounded-lg px-2 font-medium underline decoration-(--sage) decoration-1 underline-offset-[5px] hover:bg-(--sage-mist) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ink)"
            >
              ← Hub
            </Link>
            <p className="text-(--walnut)">Mood board · Calm</p>
          </div>

          <div className="mt-14 sm:mt-24 lg:flex lg:items-end lg:justify-between lg:gap-12">
            <h1 className="font-newsreader text-[clamp(4rem,13vw,10rem)] leading-[0.9] font-light tracking-[-0.03em]">
              Quiet Hours
            </h1>
            <div className="mt-8 lg:mt-0 lg:pb-3 lg:text-right">
              <ul
                role="list"
                className="flex flex-wrap gap-x-3 text-sm font-medium tracking-[0.14em] uppercase lg:justify-end"
              >
                {moodWords.map((word, index) => (
                  <li key={word} className="flex items-center gap-x-3">
                    {index > 0 && (
                      <span
                        className="size-1 rounded-full bg-(--sage-deep)"
                        aria-hidden="true"
                      />
                    )}
                    {word}
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-newsreader text-xl text-(--walnut) italic sm:text-2xl">
                Like a reading room at 4 PM.
              </p>
            </div>
          </div>
        </header>

        <Collage
          artifacts={artifacts}
          tileClassName="overflow-hidden rounded-2xl border border-(--line) bg-(--warm-white)"
          captionClassName="border-t border-(--line) px-3 py-2 text-[11px] leading-4 text-(--walnut)"
          numberClassName="font-medium text-(--ink) tabular-nums"
        />
      </div>
    </main>
  );
}
