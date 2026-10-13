import type { Metadata, Viewport } from "next";
import { LongTable } from "@/app/mood-boards/calm/art/scenes";
import { WindowLight } from "@/app/mood-boards/calm/art/textures";
import { calmVars } from "@/app/mood-boards/calm/palette";
import { DesignSystemPage } from "@/components/design-system/design-system-page";
import { grain } from "@/components/mood-board/grain";
import { inter, newsreader } from "@/fonts/calm";
import { calm } from "@/themes/calm";

export const metadata: Metadata = { title: "Calm Design System" };

export const viewport: Viewport = { themeColor: calm.colors.background.hex };

export default function Page() {
  return (
    <DesignSystemPage
      theme={calm}
      slug="calm"
      moodName="Quiet Hours"
      fonts={`${newsreader.variable} ${inter.variable}`}
      // the same fine paper grain as the mood board
      background={grain({
        frequency: "0.9",
        color: calm.colors.text.hex,
        strength: 0.16,
      })}
      // The two pictures are the mood board's own drawings. Each takes an id
      // of its own here, because the board's page can be in the document at
      // the same time.
      cardMedia={
        <div className="h-full" style={calmVars}>
          <LongTable id="calm-ds-table" />
        </div>
      }
      panelMedia={
        <div className="h-full" style={calmVars}>
          <WindowLight id="calm-ds-window-blur" />
        </div>
      }
    />
  );
}
