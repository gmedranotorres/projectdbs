import type { Artifact } from "@/components/mood-board/collage";
import { palette } from "./palette";
import {
  Badge,
  Button,
  FilterChips,
  ProgressBar,
  SpotCard,
  Toggle,
} from "./art/interface";
import { Maze } from "./art/maze";
import {
  CoffeeCup,
  HighScores,
  LevelThree,
  MoonOverLake,
  PlugPowerUp,
  PressStart,
  WifiSignal,
  XpBar,
} from "./art/scenes";
import { Swatch } from "./art/swatch";
import { Dither, GridFloor, Scanlines } from "./art/textures";
import { Aa, BigNumber, BodyText, Headline } from "./art/type";

const swatch = (color: (typeof palette)[keyof typeof palette]): Artifact => ({
  kind: "Color",
  name: color.name,
  size: "small",
  art: <Swatch color={color} />,
});

// The Arcade board, one line per tile. A tile's number is its place in this
// list. Delete a line to remove a tile, change `size` to resize it (small,
// wide, tall, large, banner, hero), or swap `art` to replace it; the other
// tiles move to fill the space.
export const artifacts: Artifact[] = [
  swatch(palette.magenta),
  swatch(palette.cyan),
  { kind: "Scene", name: "press start to study", size: "hero", art: <PressStart /> },
  { kind: "Scene", name: "high scores", size: "tall", art: <HighScores /> },
  swatch(palette.yellow),
  { kind: "Type", name: "headline", size: "wide", art: <Headline /> },
  { kind: "Scene", name: "level 3: the Reg", size: "wide", art: <LevelThree /> },
  swatch(palette.lime),
  { kind: "UI", name: "study spot card", size: "large", art: <SpotCard /> },
  { kind: "Scene", name: "coffee cup", size: "small", art: <CoffeeCup /> },
  { kind: "UI", name: "button", size: "small", art: <Button /> },
  { kind: "Type", name: "big number", size: "wide", art: <BigNumber /> },
  { kind: "Texture", name: "glowing grid floor", size: "wide", art: <GridFloor /> },
  { kind: "Scene", name: "moon over lake", size: "tall", art: <MoonOverLake /> },
  { kind: "Texture", name: "scanlines", size: "small", art: <Scanlines /> },
  { kind: "Type", name: "Aa", size: "small", art: <Aa /> },
  { kind: "Scene", name: "plug power-up", size: "small", art: <PlugPowerUp /> },
  { kind: "UI", name: "filter chips", size: "wide", art: <FilterChips /> },
  { kind: "Texture", name: "dithering", size: "tall", art: <Dither /> },
  { kind: "Scene", name: "XP bar", size: "wide", art: <XpBar /> },
  { kind: "UI", name: "toggle", size: "small", art: <Toggle /> },
  swatch(palette.navy),
  { kind: "UI", name: "badge", size: "small", art: <Badge /> },
  swatch(palette.white),
  { kind: "Scene", name: "wifi signal", size: "small", art: <WifiSignal /> },
  { kind: "UI", name: "progress bar", size: "small", art: <ProgressBar /> },
  { kind: "Type", name: "body text", size: "wide", art: <BodyText /> },
  { kind: "Texture", name: "generative maze", size: "small", art: <Maze /> },
];
