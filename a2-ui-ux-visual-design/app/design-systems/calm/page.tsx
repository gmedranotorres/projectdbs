import type { Metadata, Viewport } from "next";
import { LongTable } from "@/app/mood-boards/calm/art/scenes";
import { WindowLight } from "@/app/mood-boards/calm/art/textures";
import { calmVars } from "@/app/mood-boards/calm/palette";
import { DesignSystemPage } from "@/components/design-system/design-system-page";
import { Specimen } from "@/components/design-system/section";
import { FilterChip } from "@/components/ui/choice";
import { grain } from "@/components/mood-board/grain";
import { alsoOptions } from "@/content/spots";
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
      // the site's second row of filters
      moreComponents={
        <Specimen
          title="“Also” chips"
          note="The site’s second row. Each one switches on and off, and they work together with any choice in the one-choice row: a spot shows when it matches all of them."
        >
          <fieldset>
            <legend className="ui-label ui-muted">Also</legend>
            <div className="ui-chip-row mt-2">
              {alsoOptions.map((option, index) => (
                <FilterChip
                  key={option}
                  name="calm-also"
                  value={option}
                  defaultChecked={index === 0}
                >
                  {option}
                </FilterChip>
              ))}
            </div>
          </fieldset>
        </Specimen>
      }
    />
  );
}
