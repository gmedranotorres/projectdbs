# Decisions

One entry per round: what I asked, what changed, and what I rejected or decided myself.

## Round 1 · 2026-10-12 · Scaffold the app and the hub

**What I asked.** A Next.js app with Tailwind in `a2-ui-ux-visual-design` (create-next-app, App Router, TypeScript, npm, no other packages); AGENTS.md with my project rules and a one-line CLAUDE.md; the homepage as a neutral hub with three numbered sections; and placeholder pages so no link 404s.

**What changed.**
- New app from create-next-app (Next.js 16.4, React 19, Tailwind 4), with only the packages it installs by default.
- Hub at `/`: the header, then 1 Mood Boards, 2 Design Systems (Calm, Arcade, Editorial each) and 3 My Site (Open Hyde Park Study Spots). Checked at 390px and 1440px.
- Seven placeholder pages, each with its title and a "← Hub" link: `/mood-boards/{calm,arcade,editorial}`, `/design-systems/{calm,arcade,editorial}`, `/study-spots`.
- AGENTS.md, CLAUDE.md, and `Gabriela_Personal_Profile.md` added to `.gitignore`.

**What I decided myself.**
- The site is Hyde Park Study Spots: a guide that helps UChicago students decide where to study.
- The three styles are Calm, Arcade and Editorial.
- The hub is neutral, in none of the three styles: white background, black text, one sans-serif, generous spacing.
- Static only: no database, backend, accounts, external APIs, or stored data.

**What I rejected.** Nothing yet.

**Choices Claude made that I have not reviewed yet.**
- The hub's sans-serif is the system font of each device (San Francisco on a Mac, Segoe UI on Windows), so the app loads no web font. The Geist fonts that come with create-next-app were removed.
- Links are underlined; on hover they turn white on black, and on keyboard focus they get a black outline.
- The Next.js and Vercel logos that come with create-next-app (the favicon and the images in `public/`) were deleted, because my rules allow no real logos. The tab icon is now a plain black square with a white dot, drawn in SVG.
- Each placeholder is its own folder under `app/`, so each page can later get its own design.
- AGENTS.md keeps the short block Next.js writes about reading its bundled docs; `next dev` puts it back if it is removed.

## Round 2 · 2026-10-12 · Three mood boards

**What I asked.** Three mood boards at `/mood-boards/calm`, `/mood-boards/arcade` and `/mood-boards/editorial`, each a different visual style for Hyde Park Study Spots. Every board has a mood name, 3–4 mood words and a "← Hub" link; 28 artifacts in a collage of mixed tile sizes (about 6 color swatches with hex values, 4 type specimens, 4 textures, 6 interface pieces, 8 small SVG scenes); a number and a caption on every tile; the page itself dressed in the style; everything generated in code; artifacts stored as data plus small components; 2 columns at 390px and more at 1440px; fonts loaded with next/font. Calm first, then Arcade, then Editorial, with a commit and a push after each, 5 minutes apart.

**What changed.**
- A shared collage (`components/mood-board/`): the grid, the tile numbers and the captions are the same on every board; each board passes its own look. Six tile sizes (small, wide, tall, large, banner, hero). 2 columns on a phone, 4 on a tablet, 6 from 1280px. Checked at 390px, 768px, 1024px and 1440px.
- Each board is one list (`artifacts.tsx`), one line per tile, plus small drawing components in `art/` and its six colors in `palette.ts`. Deleting a line removes a tile, changing `size` resizes it, and the other tiles move to fill the space.
- Calm, "Quiet Hours" (`/mood-boards/calm`): oat paper with a fine grain, Newsreader and Inter, rounded tiles with 1px lines and no shadows. Mood words: Matte, Warm, Unhurried.
- Arcade, "Late-Night Level Up" (`/mood-boards/arcade`): near-black navy with faint scanlines, Press Start 2P and Space Mono, square tiles with thick white borders and a hard offset shadow. The shadow color shows the kind of tile: magenta for scenes, yellow for type, cyan for textures, lime for UI, white for colors. Mood words: Loud, Playful, Electric. The pixel art is original, typed out as grids of characters in the code.
- Editorial, "The Hyde Park Study Guide" (`/mood-boards/editorial`): newsprint with a fine grain, Playfair Display, Source Serif 4 and small uppercase Inter labels, a masthead with a double rule, square tiles under a hairline with the caption on top like a magazine kicker, no shadows. Mood words: Curated, Confident, Crisp.

**What I decided myself.**
- The starting direction for each board: its name, mood, palette, fonts, textures, corners and shadows, and seven of its scenes.
- The order (Calm, Arcade, Editorial) and a commit and push after each.

**What I rejected.** Nothing yet. I will adjust the boards after I see them.

**Choices Claude made that I have not reviewed yet.**
- Tile numbers follow the order of the list, so removing a tile moves the later numbers up by one.
- Captions use short kind names: Color, Type, Texture, UI, Scene ("UI" for interface pieces, so captions fit on one line on a phone).
- The interface pieces are pictures of controls, not working ones; working states belong to the design systems.
- Calm: the exact hex values (oat `#EBE2D0`, warm white `#FBF7EE`, brown ink `#3A2B21`, walnut `#6B5848`, sage `#8A9E80`, sage mist `#DDE4D4`); the two colors I did not name (walnut for quiet text, sage mist as the tint of the accent); the fourth texture (oak grain); the eighth scene (a wall outlet with a charger); and the sample text, such as "Harper Reading Room" on the card.
- Arcade: the exact hex values (navy `#0B0B27`, magenta `#FF2BD6`, cyan `#22E5FF`, lime `#B8FF3C`, yellow `#FFE83D`, white `#F5F2FF`); white as the sixth color, for text; the fourth texture (a starfield); the eighth scene (a pixel wifi signal); the study spot card as a character-select card with stats out of ten; and the made-up initials and hours on the high-score table.
- Editorial: the exact hex values (newsprint `#F2EEE3`, black ink `#151311`, deep maroon `#7A1C24`, warm gray `#6E675E`, pale gray `#DAD4C6`, paper white `#FCFAF5`); the two colors I did not name (pale gray as a tint, paper white for surfaces); the third mood word, "Crisp" (my brief gave two); the fourth texture (crosshatch); the eighth scene (a ratings key with an icon for quiet, outlets, wifi, open late and coffee); and the sample text, such as "Mansueto Reading Room" as pick No. 3 and the pull quote.
- The line map of the Midway is a sketch: the street names and their order are real, the distances and the five numbered pins are not.
- Scenes that are mostly words (the Arcade title screen, the Editorial masthead, pull quote, drop cap, numbered pick and byline) are set in live text over or beside SVG drawings, so the words stay sharp and readable at every tile size.
- The line under each board's mood words ("Like a reading room at 4 PM.", "Studying as a game: outlets are power-ups, and coffee restores health.", "Like a city magazine's weekend guide.") comes from my brief.
- All text and control colors on the three boards pass WCAG AA contrast.

## Round 3 · 2026-10-13 · Mood boards after my review

**What I asked.** Keep Calm as it is. Make Arcade feel alive: keep 28 tiles but animate several of them (twinkling stars in the title screen, a grid floor that scrolls toward you, steam rising from the coffee cup, an XP bar that fills and resets, a blinking "INSERT COFFEE TO CONTINUE", flickering scanlines, and one generative tile drawn on a canvas), with CSS animations or a small canvas, no new packages, and still frames when prefers-reduced-motion is on. On Editorial, mention only my eight spots, remove the made-up details and any opening hours, use my own line as the pull quote, and keep the Midway map only if the pins can sit roughly where my spots are. On all boards, take hours and walking times off the sample spot cards.

**What changed.**
- Calm: only the spot card changed. It no longer shows a walking time, an "open until" row or "Open now".
- Arcade: seven pieces now move. The stars on the title screen twinkle, its last line blinks, and its floor scrolls; the grid floor tile scrolls toward you; steam rises off the coffee cup; the XP bar fills one segment at a time, flashes "LEVEL UP!" and starts over; the scanlines roll and flicker. Tile 28 is now a maze drawn on a canvas, different on every visit.
- All of Arcade's CSS animation is in one file (`art/motion.css`) and runs only when the visitor has not asked their device to reduce motion. With reduced motion on, every tile shows a still frame and the canvas draws one finished maze.
- Editorial: the pull quote is my line, with no source under it. The card and the numbered pick say "Mansueto Grand Reading Room". The drop cap paragraph now lists my eight spots, and the big number is "8" for those eight spots. Nothing on the board states an hour any more.
- Editorial map: kept. The avenues are spaced by their real street numbers, and each of my eight spots has a dot and its name where its street address puts it.
- Spot cards on Arcade and Editorial: no hours.

**What I decided myself.**
- Calm stays as it is.
- The guide covers eight spots: Harper Reading Room, Regenstein, Ida Noyes Hall, Mansueto Grand Reading Room, Crerar Library, Keller Center, Plein Air Café and Build Coffee & Books.
- The pull quote: "A relaxing and comfortable spot is a good way to focus on your work".
- No hours or walking times on the cards until we have checked them.

**What I rejected.**
- Arcade as a board of still pictures.
- On Editorial: "twelve tables", "six of our twelve picks", the "Overheard at the Reg" quote, opening hours, and any spot that is not on my list.
- Hours and walking times on the sample spot cards.

**Choices Claude made that I have not reviewed yet.**
- The generative tile is a random maze, and it took the place of the starfield (the texture Claude had added), so each board still has 6 colors, 4 type, 4 textures, 6 UI pieces and 8 scenes.
- The title screen's floor scrolls as well as the grid floor tile.
- The XP bar lost its "2340/3000" readout, because a moving bar would contradict a fixed number. It now says "NEXT: LVL 4".
- On the cards, "Open now" (Calm, Arcade) and "Open late" (Arcade) went too, because they are also claims about hours.
- Editorial, beyond what I listed: the body text and the old drop cap paragraph were rewritten because they described a place that does not exist (and one said "until six"); the tiny filler text in the column rules tile is now my list of spots; "Our pick for late nights" became "Our pick for deep focus".
- The map uses short names (Harper, Regenstein, Ida Noyes, Mansueto, Crerar, Keller, Plein Air, Build) and dots with names instead of numbers, so it does not suggest a ranking. The eight addresses were looked up online on 2026-10-13. West to east is to scale; north to south is squeezed to fit the strip.
- Still unchecked on the boards: the sample ratings on the cards, the "No. 3" rank and the one-line description of Mansueto, and the hours that appear outside the cards on Calm and Arcade (the "11 PM" type tiles from my brief, "Calm until 4 PM", and Arcade's body text saying the Reg "stays open late").
- The animations loop with no pause button; the device's reduce-motion setting is the only switch.

## Round 4 · 2026-10-13 · Calm design system

**What I asked.** Build `/design-systems/calm` as a UI library made from the Calm mood board, with every component my site could use, in every state, using my real content: my eight spots and my three filters (Quiet & views, Big tables, Coworking), with no invented hours, distances or ratings. Six numbered sections: color roles with hex and contrast computed in code, flagging any text pair under 4.5:1 and suggesting a fix without changing a color; type roles; spacing and shape; components, including a detail panel that opens from the card and closes with Escape or ×; control states side by side, forced with a data-state attribute, with the live components taking the same styles on real hover, focus and press; and UI states. Build the components once, shared, reading tokens from CSS variables. Every control needs a visible keyboard focus.

**What changed.**
- `/design-systems/calm` is the UI library, in the six sections I asked for. Checked in Chrome at 390px, 768px, 1024px and 1440px, with the keyboard, and with reduced motion on.
- A shared component library in `components/ui/`: button, link, text input, select, checkbox, radios, toggle, tabs, filter chip, spot card, list row, badge, detail panel, and the empty, loading, error and success states. One stylesheet (`ui.css`) styles them all and names no color or font: it reads tokens, CSS variables that start with `--ui-`.
- A theme supplies the tokens. Calm's is `themes/calm.ts`, and its colors come straight from the mood board's palette file, so a hex changed there changes the board, the design system and the site together.
- The six sections are shared components too (`components/design-system/`), so the Arcade and Editorial design systems need a theme, not a new page.
- My eight spots and three filters now live in one file, `content/spots.ts`. The Editorial mood board reads its names from it.
- Contrast is computed with the WCAG formula (`lib/color.ts`). Every text pair the components use passes 4.5:1, and every mark and outline a control needs passes 3:1. One pair is flagged: sage as a text color on the background is 2.24:1. The library never uses it that way. The page suggests a darker version, `#646752` (4.53:1). No color was changed.
- Each state is one rule in the stylesheet with two triggers, the real one and the forced one, so the specimens in section 5 and the live components in section 4 cannot drift apart.
- The detail panel is a real modal dialog: Escape and × close it, the keyboard stays inside it while it is open, and the focus goes back to the button that opened it.

**What I decided myself.**
- Calm is the style for my site.
- The content: my eight spots and my three filters.
- No invented hours, distances or ratings.
- No color changes without asking me.

**What I rejected.** Nothing new this round.

**Choices Claude made that I have not reviewed yet.**
- The border role is `#C8BDAD`: the board's thin line (brown ink at 20%) as a solid color on oat paper.
- Two supporting colors beside the six roles, both from the board: sage mist as the accent tint, and the deeper sage `#747E65` for marks that must be seen.
- Where the library departs from the board for contrast: fields, checkboxes, radios and the switch are outlined in the muted text color, because the border role is only 1.44:1; the switch, the checks and the selected tab use the deeper sage (3.3:1) instead of sage (2.24:1); and the primary button gets lighter on hover, not darker, so its label stays readable.
- Type sizes: display 40 to 64px, heading 24px, body 16px, label 13px. Corners 6, 12, 16px and full. Lines 1px and 2px. No shadow.
- Each spot has a one-word "kind" taken from its name (Reading room, Library, Campus hall, Campus building, Café). I should check them.
- Spots are not tagged with my filters yet, because I have not said which spot belongs to which filter. The card and the panel show little for the same reason.
- Interface words that are not from my brief: "Find a spot", "Save" and "Saved", "View details", "Search spots", "Saved only", "A to Z" and "Z to A", "All spots", "Clear filters", "Try again", "Loading spots…".
- The card's picture is the window scene from the mood board. The detail panel is a sheet on the right on wide screens and at the bottom on phones.
- The error state uses an icon and words, not red: Calm has one accent, and adding a color is my call.
- Section 5 shows the secondary button as well as the primary one.
- A short index of the six sections at the top of the page.

## Round 5 · 2026-10-13 · The site, Hyde Park Study Spots

**What I asked.** Build my site at `/study-spots` in the Calm style, using the Calm design system's tokens and components without restyling them. It is for UChicago students choosing where to study today, so the first thing they see is the spots and the filters. A header with "← Hub", the title and one line; filter chips (All, Quiet & views, Big tables, Coworking) with a count of matching spots; a card for each spot with its name, type and filter; a detail panel that opens from a card by click or Enter (on the right at desktop, a bottom sheet on mobile) with why I go, the note, the address and a "Get directions" button that opens Google Maps in a new tab; Escape or × closes it and returns focus to the card. The accent green only on "Get directions"; selected chips in the sage tint with a check. 1 column at 390px, 2 or 3 at 1440px. Nothing else on the page. Use exactly my spot content.

**What changed.**
- `/study-spots` is the site: the header, four filter chips, the count ("8 spots", or "4 of 8 spots" with a filter on), eight cards and the detail panel. Checked in Chrome at 390px (1 column), 768px and 1024px (2 columns) and 1440px (3 columns), with the mouse, with the keyboard, and with reduced motion on.
- My spot content is in `content/spots.ts`, word for word: each spot's name, type, filter, address and note, and my three "why I go" lines. A test compared every card and every panel on the page with my brief, and they match.
- "Get directions" opens Google Maps directions to the spot's street address in a new tab. It is the only thing on the page in the accent green.
- The page uses the Calm theme and the shared components as they are. It adds only layout.
- The Calm design system page now shows my real types and "Regenstein Library" in its list rows, because it reads the same content file.

**What I decided myself.**
- All the content: the eight spots with their types, filters, addresses and notes, the three "why I go" lines, the title and the line under it.
- The page has nothing but the header, the filters and the spots.
- The accent green is for "Get directions" only.

**What I rejected.** A hero image and extra sections. Hours, distances and ratings that are not in my own notes.

**Choices Claude made that I have not reviewed yet.**
- Four additions to the shared library, which the site needed and the design system page does not show yet: a card that opens as a whole (with its own hover, focus and pressed looks and a small arrow in the corner); filter chips that work as one choice, so picking one unpicks the others and the arrow keys move between them; a button that is a link, for "Get directions"; and a small "opens elsewhere" arrow icon on that button.
- Cards have no picture, because I asked for name, type and filter only.
- The count reads "8 spots" for All and "4 of 8 spots" with a filter on.
- The panel labels its three parts "Why I go", "Note" and "Address".
- The map link adds "Chicago, IL" to the street address so Google finds the right place; the page shows only my address. Mansueto's "beside the Reg" is shown but not sent to the map.
- Mansueto and Regenstein share the address 1100 E 57th St, so both get the same directions.
- The Editorial mood board keeps "Regenstein", the name I gave for that board; the site says "Regenstein Library".
- Nothing is stored: a reload goes back to All.

## Round 6 · 2026-10-13 · The site's pieces on the Calm design system page

**What I asked.** Add the clickable card and the single-choice chips to the Calm design system page, so it documents everything the site uses.

**What changed.**
- Section 4 has three new working examples: "Card that opens" (the whole card is one button and opens the detail panel), "Filter chips, one choice" (All plus my three filters; picking one unpicks the others) and "Button that is a link" ("Get directions", with the small arrow).
- Section 5 shows the card that opens in its four states: rest, hover, focus and pressed. The live card matches those pictures on real hover and press.
- Checked in Chrome at 390px, 768px, 1024px and 1440px and with the keyboard. The site still passes the same checks as in Round 5.

**What I decided myself.** The design system page should show everything the site uses.

**What I rejected.** Nothing this round.

**Choices Claude made that I have not reviewed yet.**
- "Button that is a link" was added too. I named only the card and the chips, but it was the third piece the site uses that the page did not show.
- The card has four states, not six, because a card is never selected or disabled.
- The examples use Plein Air Café for the card and Harper Reading Room's address for "Get directions".
- The two example cards' names are now one heading level lower, so they sit under their labels in the page outline. Nothing looks different.

## Round 7 · 2026-10-13 · Arcade and Editorial design systems

**What I asked.** Build `/design-systems/arcade` and `/design-systems/editorial` with the same six sections and the same shared components, each dressed from its own mood board. They must differ in more than color: fonts, corners, border weights, shadows, label casing and focus style (Arcade: thick borders and hard offset shadows; Editorial: hairlines, square corners and small uppercase labels). Same content rules and contrast checks as Calm. Commit and push after each one.

**What changed.**
- The three design systems are now one page component (`components/design-system/design-system-page.tsx`) given a different theme. Nothing in the components or the sections is written per style.
- A theme now carries more than colors and fonts: its corner radii, line widths, the shadow of raised things at rest, under the pointer and pressed, how things move when pressed, the casing and font of labels and button text, and the keyboard focus ring's color, width, style and distance. It also says which color sits on which fill, so text stays readable on bright fills.
- Calm did not change. Its design system page and the site were compared before and after this work, at 1440px and 390px: every element's computed styles are the same and the pictures are identical pixel for pixel.
- Arcade (`/design-systems/arcade`, theme in `themes/arcade.ts`), from the Late-Night Level Up board: Press Start 2P and Space Mono; labels and headings in capitals; square corners; 3px white edges; a hard magenta shadow under the primary button, cards and selected chips, which they sink into under the pointer and when pressed; a 3px cyan focus ring set 4px away from the control. Yellow is the one main action, lime is whatever is switched on.
- Arcade's contrast: all 15 listed pairs pass, and a check of every piece of text on the page found none under 4.5:1. Nothing is flagged.
- Editorial (`/design-systems/editorial`, theme in `themes/editorial.ts`), from The Hyde Park Study Guide board: Playfair Display over Source Serif 4; small uppercase Inter labels with wide spacing; square corners; 1px black hairlines and no shadow; a maroon focus ring drawn as a double rule, like the one under the masthead. The primary button is maroon, darker under the pointer and black when pressed.
- Editorial's contrast: all 15 listed pairs pass, and no text on the page is under 4.5:1. Nothing is flagged.
- Both checked in Chrome at 390px, 768px, 1024px and 1440px, with the keyboard, and with reduced motion on. Measured in the browser, the three systems differ in display, body and button fonts, label casing, corners, edge width, shadow, focus ring and what a press does.

**What I decided myself.**
- The two new design systems use the same six sections and the same components as Calm.
- What must differ between the styles: fonts, corners, border weights, shadows, label casing and focus style.
- Arcade gets thick borders and hard offset shadows; Editorial gets hairlines, square corners and small uppercase labels.

**What I rejected.** Design systems that differ only in color.

**Choices Claude made that I have not reviewed yet.**
- Arcade's roles: navy background; a slightly lighter navy (12% white) for surfaces; white text; cyan for muted text; white for borders; yellow as the accent. Lime and magenta are listed beside the six as "Highlight" and "Shadow".
- On Arcade's bright fills (yellow, lime) the text is navy, not white.
- Radios stay round in every style, including the square-cornered ones, so they never look like checkboxes.
- Under the pointer: Calm darkens an edge, Arcade turns it lime and moves raised things halfway into their shadow.
- Arcade's sizes: display 24 to 40px, heading 16px, body 15px, label 12px, button text 10px.
- The card picture on the Arcade page is the mood board's grid floor, which moves; the panel picture is its scanlines. Both are still with reduced motion.
- The corner radii box in section 3 shows one box when every corner is the same, as in Arcade.
- A page's rules and frames now follow the theme's line width, so they are 3px on Arcade.
- Editorial's roles: newsprint background; paper white for surfaces; black ink for text and for borders; warm gray for muted text; deep maroon as the accent. Pale gray is listed beside the six as "Tint".
- Editorial's primary button is maroon. On the mood board it was black; maroon is the accent, and the shared primary button uses the accent.
- Editorial's selected chips are pale gray with a check and a maroon hairline, not filled maroon as on the mood board, so "selected" works the same way in all three systems.
- Warm gray would be 3.78:1 on the pale gray tint, so quiet text that lands on the tint (the note in a list row under the pointer) turns black there.
- Editorial's sizes: display 40 to 72px, heading 24px, body 17px, label 11px, button text 12px.
- The card picture on the Editorial page is the mood board's Midway map; the panel picture is its halftone dots.
- Section numbers use lining figures, because Playfair Display's old-style 1 reads as a capital I. Calm and Arcade look the same as before.
- Arcade and Editorial both have square corners, as my mood board brief said. They differ from each other in fonts, edge width, shadow, focus ring and color.

## Round 8 · 2026-10-25 · Peer feedback round

**What I asked.** Answer two classmates' comments on Assignment 2, changing only what I listed: better contrast for small text (Ariel), photo slots (Ariel), more of the Calm mood board's visuals on the site (Gbenga), and more ways to filter (Gbenga). Check the site at 390px and 1440px, with the keyboard only and with reduced motion, and run the build.

**What changed, and the feedback each change answers.**
- *Ariel: "small light text is hard to read on the beige and tan backgrounds."* Changed in the Calm tokens (`themes/calm.ts`), so the site and `/design-systems/calm` both changed. Cards, the detail panel, fields and chips are now plain white (`#FFFFFF`, was warm white `#FBF7EE`); oat paper is only the page background. Muted text is now `#564538` (was walnut `#6B5848`): walnut darkened with brown ink, still warm brown. The Color roles section shows the new hex values and ratios, worked out in code with the WCAG formula.
- Contrast before and after, for every pair that changed:

  | Pair | Before | After |
  | --- | --- | --- |
  | Muted text on background (labels, the count) | 5.24:1 | 7.08:1 |
  | Muted text on surface (labels on cards, placeholder text) | 6.31:1 | 9.11:1 |
  | Muted text on accent tint (a list row's note under the pointer) | 5.18:1 | 7.00:1 |
  | Text on surface (card names, chip text, field text) | 12.69:1 | 13.57:1 |
  | Text on accent, hovered (primary button under the pointer) | 5.92:1 | 5.99:1 |
  | Surface on text (the strong badge) | 12.69:1 | 13.57:1 |
  | Control outline on background (a mark, needs 3:1) | 5.24:1 | 7.08:1 |
  | Control outline on surface (a mark, needs 3:1) | 6.31:1 | 9.11:1 |
  | Deeper accent on surface, and surface on deeper accent (marks) | 4.00:1 | 4.27:1 |
  | Disabled text on background (design system page only) | 2.92:1 | 3.51:1 |
  | Disabled text on surface (design system page only) | 3.22:1 | 4.00:1 |

- *Ariel: "students choose a spot by how it looks."* Each spot has a `photo` field in `content/spots.ts`: `"/photos/<id>.jpg"` once I add my own photo to `public/photos`, `null` until then. All eight are `null` for now. The ids are the slugs I gave (harper-reading-room, regenstein, ida-noyes, mansueto, crerar, keller-center, plein-air-cafe, build-coffee). Cards show the picture at the top, 4:3, with rounded corners and the card's 1px line; the detail panel shows it larger. Photos go through next/image, with alt text that describes the place. No photo was downloaded or hotlinked.
- *Gbenga: "more of the mood board's visual elements should reach the site."* While a spot's photo is `null`, its picture frame shows one of the Calm board's own scene components: the window light on a long table for Harper and Mansueto, the stack of books for Regenstein, the bench on the Midway for Ida Noyes, the reading lamp for Crerar, the plant for Keller, and the steaming mug for Plein Air and Build. A small reading lamp sits next to the site's title. No other sections were added.
- *Gbenga: "one student may care about open late, another about coffee nearby."* The "Good for" chips are unchanged (All, Quiet & views, Big tables, Coworking; one at a time). A second row, "Also", has two chips that switch on and off and combine with any "Good for" choice: "Coffee nearby" (Harper Reading Room, Regenstein, Keller Center, Plein Air Café, Build Coffee & Books) and "Open late (finals)" (Regenstein, Mansueto). A spot shows when it matches the "Good for" choice and every "Also" chip that is on. The count says how many match ("5 of 8 spots"). When nothing matches, the design system's empty state says "No spots match these filters", and its "Clear filters" button goes back to All. The detail panel shows the spot's badges: "Coffee nearby", "Open until 4 a.m. in finals". The Calm design system's Components section has a new "Also" chips specimen.
- Checked in Chrome at 390px (1 column) and 1440px (3 columns): no sideways scrolling; with the keyboard (Tab reaches ← Hub, the "Good for" row, both "Also" chips and every card; Enter opens a card's panel; Escape closes it and the focus goes back to the card); and with reduced motion on (nothing animates, nothing slides). A scan of every piece of text on the site found none under 4.5:1; the lowest is the "Get directions" label, 4.71:1. A test photo, made for the check and then deleted, showed that next/image loads a photo into the card and the panel with its alt text. `npm run build` passes.

**What I decided myself.**
- Only my own photos go in `public/photos`: nothing downloaded or hotlinked.
- The "Good for" chips stay as they are, one choice at a time; the "Also" chips are a second row that combines with them.
- Which spots are "Coffee nearby" and "Open late (finals)".

**What I decided not to do, and why.**
- No live Google Maps data (opening hours, busy times, ratings). The site is static, with no external APIs.
- No hours, distances or ratings I haven't verified. The only hour on the site is the 4 a.m. finals closing my own notes give for Regenstein and Mansueto.

**Choices Claude made that I have not reviewed yet.**
- My instruction was to darken muted text until every text pair reached 4.5:1, but every pair already did (the lowest was 5.24:1). So the target became 7:1 on the page background, the level WCAG asks of small text at AAA. The theme works the color out with that rule, so changing 7 in `themes/calm.ts` changes it.
- Disabled controls stay under 4.5:1 (3.51:1 at worst), because the shared stylesheet fades them to 70%. WCAG does not ask contrast of disabled controls, and the site has none; the design system page shows them in Control states.
- The surface is pure white, not a color from the mood board. The scenes inside the picture frames keep the board's own colors.
- The "Good for" row now has a visible label, "Good for", so it matches the labeled "Also" row (it had a hidden label, "Filter the spots").
- The card's picture is framed inside the card's padding, so all four corners are rounded. The card's small arrow moved to the bottom corner, below the picture. This is a new option on the shared card (`picture`), so the Arcade and Editorial pages did not change.
- Two scenes appear twice: the long table (Harper, Mansueto) and the mug (Plein Air, Build). The lamp beside the title is the board's reading lamp, which Crerar also uses. To show the lamp more than once, it now takes an id the way the long table already does; the drawing did not change.
- The alt text for each spot is written from my notes (for example "Long tables under the glass dome of the Mansueto Grand Reading Room"). I should check each one against my photo when I add it.
- The badges are a list of words in the panel only; the cards keep their one "Good for" badge.
- The "Also" chips are checkboxes and the "Good for" chips are radios, so Space switches an "Also" chip and the arrow keys change the "Good for" choice. Enter alone does neither.
- The design system's empty-state wording, "No spots match this filter", became "No spots match these filters" on the site, because two rows can be on at once.
