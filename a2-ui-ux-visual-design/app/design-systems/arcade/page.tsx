import type { Metadata, Viewport } from "next";
import { GridFloor, Scanlines } from "@/app/mood-boards/arcade/art/textures";
import { arcadeVars } from "@/app/mood-boards/arcade/palette";
import { DesignSystemPage } from "@/components/design-system/design-system-page";
import { pressStart, spaceMono } from "@/fonts/arcade";
import { arcade } from "@/themes/arcade";

export const metadata: Metadata = { title: "Arcade Design System" };

export const viewport: Viewport = { themeColor: arcade.colors.background.hex };

export default function Page() {
  return (
    <DesignSystemPage
      theme={arcade}
      slug="arcade"
      moodName="Late-Night Level Up"
      fonts={`${pressStart.variable} ${spaceMono.variable}`}
      // the same faint scanlines as the mood board
      background="repeating-linear-gradient(0deg, rgb(255 255 255 / 0.045) 0 1px, transparent 1px 4px)"
      // The two pictures are the mood board's own textures. The floor takes
      // an id of its own here, because the board's page can be in the
      // document at the same time.
      cardMedia={
        <div className="h-full" style={arcadeVars}>
          <GridFloor id="arcade-ds-floor-sky" />
        </div>
      }
      panelMedia={
        <div className="h-full" style={arcadeVars}>
          <Scanlines />
        </div>
      }
    />
  );
}
