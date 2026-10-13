import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { CanvasColor } from "@/components/mood-board/canvas-color";
import { Collage } from "@/components/mood-board/collage";
import { grain } from "@/components/mood-board/grain";
import { inter, playfair, sourceSerif } from "@/fonts/editorial";
import { artifacts } from "./artifacts";
import { editorialVars, palette } from "./palette";

export const metadata: Metadata = { title: "Editorial Mood Board" };

export const viewport: Viewport = { themeColor: palette.newsprint.hex };

const moodWords = ["Curated", "Confident", "Crisp"];

const label =
  "font-(family-name:--inter) text-[11px] leading-4 font-medium tracking-[0.14em] uppercase";

export default function Page() {
  return (
    <main
      className={`${playfair.variable} ${sourceSerif.variable} ${inter.variable} flex-1 bg-(--newsprint) font-(family-name:--source-serif) text-(--ink) [--collage-caption:2rem] [--collage-gap-wide:1.5rem] [--collage-gap:1rem]`}
      style={{
        ...editorialVars,
        backgroundImage: grain({
          frequency: "0.9",
          color: palette.ink.hex,
          strength: 0.14,
        }),
      }}
    >
      <CanvasColor color={palette.newsprint.hex} />

      <div className="mx-auto w-full max-w-[88rem] px-4 pb-24 sm:px-8 sm:pb-32 xl:px-12">
        <header className="pb-10 pt-2 text-center sm:pb-14 sm:pt-4">
          <div className={`${label} flex items-center justify-between border-b border-(--ink)`}>
            <Link
              href="/"
              className="inline-flex h-11 items-center underline decoration-1 underline-offset-4 hover:text-(--maroon) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--maroon)"
            >
              ← Hub
            </Link>
            <p className="text-(--gray)">Mood board · Editorial</p>
          </div>

          <h1 className="border-b-4 border-double border-(--ink) py-7 font-(family-name:--playfair) text-[clamp(2.75rem,6.4vw,6rem)] leading-[0.95] font-black tracking-[-0.02em] text-balance sm:py-10">
            The Hyde Park Study Guide
          </h1>

          <ul
            role="list"
            className={`${label} flex flex-wrap items-center justify-center gap-x-4 border-b border-(--ink) py-2.5`}
          >
            {moodWords.map((word, index) => (
              <li key={word} className="flex items-center gap-x-4">
                {index > 0 && (
                  <span className="size-1 rotate-45 bg-(--maroon)" aria-hidden="true" />
                )}
                {word}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-lg italic sm:text-xl">
            Like a city magazine’s weekend guide.
          </p>
        </header>

        <Collage
          artifacts={artifacts}
          tileClassName="border-t border-(--ink)"
          captionClassName="order-first py-2 font-(family-name:--inter) text-[10px] leading-4 font-medium tracking-[0.08em] text-(--gray) uppercase"
          numberClassName="font-semibold text-(--maroon)"
        />
      </div>
    </main>
  );
}
