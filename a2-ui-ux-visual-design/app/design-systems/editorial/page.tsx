import type { Metadata, Viewport } from "next";
import { MidwayMap } from "@/app/mood-boards/editorial/art/scenes";
import { HalftoneDots } from "@/app/mood-boards/editorial/art/textures";
import { editorialVars } from "@/app/mood-boards/editorial/palette";
import { DesignSystemPage } from "@/components/design-system/design-system-page";
import { grain } from "@/components/mood-board/grain";
import { inter, playfair, sourceSerif } from "@/fonts/editorial";
import { editorial } from "@/themes/editorial";

export const metadata: Metadata = { title: "Editorial Design System" };

export const viewport: Viewport = {
  themeColor: editorial.colors.background.hex,
};

export default function Page() {
  return (
    <DesignSystemPage
      theme={editorial}
      slug="editorial"
      moodName="Hyde Park Study Guide"
      fonts={`${playfair.variable} ${sourceSerif.variable} ${inter.variable}`}
      // the same fine newsprint grain as the mood board
      background={grain({
        frequency: "0.9",
        color: editorial.colors.text.hex,
        strength: 0.14,
      })}
      // The two pictures are the mood board's own drawings. The map takes an
      // id of its own here, because the board's page can be in the document
      // at the same time.
      cardMedia={
        <div className="h-full" style={editorialVars}>
          <MidwayMap id="editorial-ds-map-hatch" />
        </div>
      }
      panelMedia={
        <div className="h-full" style={editorialVars}>
          <HalftoneDots />
        </div>
      }
    />
  );
}
