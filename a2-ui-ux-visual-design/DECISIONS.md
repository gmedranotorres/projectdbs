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
- The line under each board's mood words ("Like a reading room at 4 PM.", "Studying as a game: outlets are power-ups, and coffee restores health.") comes from my brief.
- All text and control colors on Calm and Arcade pass WCAG AA contrast.
