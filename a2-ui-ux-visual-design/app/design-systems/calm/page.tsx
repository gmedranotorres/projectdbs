import type { Metadata, Viewport } from "next";
import { LongTable } from "@/app/mood-boards/calm/art/scenes";
import { WindowLight } from "@/app/mood-boards/calm/art/textures";
import { calmVars } from "@/app/mood-boards/calm/palette";
import { ColorRoles } from "@/components/design-system/color-roles";
import { ControlStates } from "@/components/design-system/control-states";
import { Gallery } from "@/components/design-system/gallery";
import { Section } from "@/components/design-system/section";
import { SpacingShape } from "@/components/design-system/spacing-shape";
import { TypeRoles } from "@/components/design-system/type-roles";
import { UiStates } from "@/components/design-system/ui-states";
import { CanvasColor } from "@/components/mood-board/canvas-color";
import { grain } from "@/components/mood-board/grain";
import { InlineLink } from "@/components/ui/link";
import { Theme } from "@/components/ui/theme";
import { siteName } from "@/content/spots";
import { inter, newsreader } from "@/fonts/calm";
import { calm } from "@/themes/calm";

export const metadata: Metadata = { title: "Calm Design System" };

export const viewport: Viewport = { themeColor: calm.colors.background.hex };

// The ids carry the style's name, so a link to "#calm-components" can never
// land on another design system's section.
const sections = [
  { id: "calm-color-roles", title: "Color roles" },
  { id: "calm-type-roles", title: "Type roles" },
  { id: "calm-spacing-and-shape", title: "Spacing and shape" },
  { id: "calm-components", title: "Components" },
  { id: "calm-control-states", title: "Control states" },
  { id: "calm-ui-states", title: "UI states" },
];

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

      <div className="mx-auto w-full max-w-[76rem] px-4 pb-24 sm:px-8 sm:pb-32 xl:px-12">
        <header className="pb-12 pt-4 sm:pb-16 sm:pt-8">
          <div className="flex items-center justify-between border-b border-(--ui-border) pb-2">
            <InlineLink href="/" className="inline-flex h-11 items-center">
              ← Hub
            </InlineLink>
            <p className="ui-label ui-muted">Design system · Calm</p>
          </div>

          <h1 className="ui-display mt-12 sm:mt-20">Calm design system</h1>
          <p className="mt-5 max-w-2xl text-lg">
            The Quiet Hours mood board turned into a UI library for {siteName}:
            its colors, type and shapes, and every component the site could
            use, in every state.{" "}
            <InlineLink href="/mood-boards/calm">See the mood board</InlineLink>
          </p>

          <nav aria-label="Sections" className="mt-8">
            <ol className="flex flex-wrap gap-x-6 gap-y-1">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <InlineLink
                    href={`#${section.id}`}
                    className="inline-flex h-11 items-center gap-2"
                  >
                    <span className="ui-muted tabular-nums">{index + 1}</span>
                    {section.title}
                  </InlineLink>
                </li>
              ))}
            </ol>
          </nav>
        </header>

        <Section
          number={1}
          {...sections[0]}
          intro="Six roles, taken from the mood board’s palette. Each ratio is measured against the background."
        >
          <ColorRoles theme={calm} />
        </Section>

        <Section
          number={2}
          {...sections[1]}
          intro="Four roles, each shown in the site’s own words."
        >
          <TypeRoles theme={calm} />
        </Section>

        <Section
          number={3}
          {...sections[2]}
          intro="The spacing scale, the corner radii, the line widths and the shadow."
        >
          <SpacingShape theme={calm} />
        </Section>

        <Section
          number={4}
          {...sections[3]}
          intro="Every component the site could use. They all work: try them with the mouse and with the keyboard."
        >
          <Gallery
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
        </Section>

        <Section
          number={5}
          {...sections[4]}
          intro="The button, the chip and the toggle in each of their six states, side by side. These are pictures of the states and do not respond; the live components in section 4 take the same looks on real hover, keyboard focus and press."
        >
          <ControlStates />
        </Section>

        <Section
          number={6}
          {...sections[5]}
          intro="What the site shows when no spot matches, while it loads, when loading fails, and after saving."
        >
          <UiStates />
        </Section>
      </div>
    </Theme>
  );
}
