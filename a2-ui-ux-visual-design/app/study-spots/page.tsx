import type { Metadata, Viewport } from "next";
import { CanvasColor } from "@/components/mood-board/canvas-color";
import { grain } from "@/components/mood-board/grain";
import { InlineLink } from "@/components/ui/link";
import { Theme } from "@/components/ui/theme";
import { siteIntro, siteName } from "@/content/spots";
import { inter, newsreader } from "@/fonts/calm";
import { calm } from "@/themes/calm";
import { SpotBrowser } from "./spot-browser";

export const metadata: Metadata = { title: siteName };

export const viewport: Viewport = { themeColor: calm.colors.background.hex };

// The site, in the Calm style. Everything here is the Calm design system:
// its tokens (themes/calm.ts) and its components (components/ui), used as
// they are. The page adds only where things sit.
export default function Page() {
  return (
    <Theme
      theme={calm}
      as="main"
      className={`${newsreader.variable} ${inter.variable} flex-1 bg-(--ui-bg)`}
      style={{
        // the same fine paper grain as the mood board
        backgroundImage: grain({
          frequency: "0.9",
          color: calm.colors.text.hex,
          strength: 0.16,
        }),
      }}
    >
      <CanvasColor color={calm.colors.background.hex} />

      <div className="mx-auto w-full max-w-[76rem] px-4 pb-16 sm:px-8 sm:pb-24 xl:px-12">
        <header className="pt-4 sm:pt-6">
          <InlineLink href="/" className="inline-flex h-11 items-center">
            ← Hub
          </InlineLink>
          <h1 className="ui-display mt-4 sm:mt-8">{siteName}</h1>
          <p className="mt-3 max-w-2xl">{siteIntro}</p>
        </header>

        <SpotBrowser />
      </div>
    </Theme>
  );
}
