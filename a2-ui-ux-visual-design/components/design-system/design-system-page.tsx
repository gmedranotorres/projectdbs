import type { ReactNode } from "react";
import { CanvasColor } from "@/components/mood-board/canvas-color";
import { InlineLink } from "@/components/ui/link";
import { Theme } from "@/components/ui/theme";
import { siteName } from "@/content/spots";
import { ColorRoles } from "./color-roles";
import { ControlStates } from "./control-states";
import { Gallery } from "./gallery";
import { Section } from "./section";
import { SpacingShape } from "./spacing-shape";
import { TypeRoles } from "./type-roles";
import { UiStates } from "./ui-states";

// A design system page: the same six numbered sections for every style.
// A style brings its theme, its fonts, a page background and two pictures
// from its mood board; everything else is shared.
export function DesignSystemPage({
  theme,
  slug,
  moodName,
  fonts,
  background,
  cardMedia,
  panelMedia,
}: {
  theme: Theme;
  // the style's name in addresses and ids: "calm"
  slug: string;
  // the name of the style's mood board: "Quiet Hours"
  moodName: string;
  // the class names next/font gives for the style's fonts
  fonts: string;
  // the page's background picture, drawn in code
  background?: string;
  // pictures from the mood board, for the card and the detail panel
  cardMedia: ReactNode;
  panelMedia: ReactNode;
}) {
  // The ids carry the style's name, so a link to "#calm-components" can
  // never land on another design system's section.
  const sections = [
    "Color roles",
    "Type roles",
    "Spacing and shape",
    "Components",
    "Control states",
    "UI states",
  ].map((title) => ({
    title,
    id: `${slug}-${title.toLowerCase().replaceAll(" ", "-")}`,
  }));

  return (
    <Theme
      theme={theme}
      as="main"
      className={`${fonts} flex-1 bg-(--ui-bg)`}
      style={{ backgroundImage: background }}
    >
      <CanvasColor color={theme.colors.background.hex} scheme={theme.scheme} />

      <div className="mx-auto w-full max-w-[76rem] px-4 pb-24 sm:px-8 sm:pb-32 xl:px-12">
        <header className="pb-12 pt-4 sm:pb-16 sm:pt-8">
          <div className="ui-rule-bottom flex items-center justify-between pb-2">
            <InlineLink href="/" className="inline-flex h-11 items-center">
              ← Hub
            </InlineLink>
            <p className="ui-label ui-muted">{`Design system · ${theme.name}`}</p>
          </div>

          {/* Each run of words is one piece of text, so letters are spaced
              as in a sentence typed out whole. */}
          <h1 className="ui-display mt-12 sm:mt-20">
            {`${theme.name} design system`}
          </h1>
          <p className="mt-5 max-w-2xl text-lg">
            {`The ${moodName} mood board turned into a UI library for `}
            {siteName}: its colors, type and shapes, and every component the
            site could use, in every state.{" "}
            <InlineLink href={`/mood-boards/${slug}`}>
              See the mood board
            </InlineLink>
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
          <ColorRoles theme={theme} />
        </Section>

        <Section
          number={2}
          {...sections[1]}
          intro="Four roles, each shown in the site’s own words."
        >
          <TypeRoles theme={theme} />
        </Section>

        <Section
          number={3}
          {...sections[2]}
          intro="The spacing scale, the corner radii, the line widths and the shadow."
        >
          <SpacingShape theme={theme} />
        </Section>

        <Section
          number={4}
          {...sections[3]}
          intro="Every component the site could use. They all work: try them with the mouse and with the keyboard."
        >
          <Gallery slug={slug} cardMedia={cardMedia} panelMedia={panelMedia} />
        </Section>

        <Section
          number={5}
          {...sections[4]}
          intro="The button, the chip and the toggle in each of their six states, and the card that opens in its four, side by side. These are pictures of the states and do not respond; the live components in section 4 take the same looks on real hover, keyboard focus and press."
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
