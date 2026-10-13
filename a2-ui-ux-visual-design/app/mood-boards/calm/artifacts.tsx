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
import {
  BookStack,
  Clock,
  LongTable,
  MidwayBench,
  Outlet,
  Plant,
  ReadingLamp,
  SteamingMug,
} from "./art/scenes";
import { Swatch } from "./art/swatch";
import { LinenTexture, OakGrain, PaperGrain, WindowLight } from "./art/textures";
import { Aa, BigNumber, BodyText, Headline } from "./art/type";

const swatch = (color: (typeof palette)[keyof typeof palette]): Artifact => ({
  kind: "Color",
  name: color.name,
  size: "small",
  art: <Swatch color={color} />,
});

// The Calm board, one line per tile. A tile's number is its place in this
// list. Delete a line to remove a tile, change `size` to resize it (small,
// wide, tall, large, banner, hero), or swap `art` to replace it; the other
// tiles move to fill the space.
export const artifacts: Artifact[] = [
  { kind: "Scene", name: "window light on a long table", size: "hero", art: <LongTable /> },
  swatch(palette.oat),
  swatch(palette.warmWhite),
  { ...swatch(palette.sage), size: "tall" },
  swatch(palette.ink),
  { kind: "Type", name: "headline", size: "wide", art: <Headline /> },
  { kind: "Texture", name: "paper grain", size: "small", art: <PaperGrain /> },
  { kind: "Type", name: "Aa", size: "small", art: <Aa /> },
  swatch(palette.walnut),
  { kind: "UI", name: "button", size: "small", art: <Button /> },
  { kind: "UI", name: "study spot card", size: "large", art: <SpotCard /> },
  { kind: "Type", name: "big number", size: "wide", art: <BigNumber /> },
  { kind: "Scene", name: "reading lamp", size: "tall", art: <ReadingLamp /> },
  { kind: "UI", name: "toggle", size: "small", art: <Toggle /> },
  { kind: "Scene", name: "steaming mug", size: "small", art: <SteamingMug /> },
  { kind: "Texture", name: "linen", size: "small", art: <LinenTexture /> },
  { kind: "Scene", name: "plant", size: "tall", art: <Plant /> },
  { kind: "UI", name: "filter chips", size: "wide", art: <FilterChips /> },
  { kind: "Scene", name: "bench on the Midway", size: "large", art: <MidwayBench /> },
  swatch(palette.sageMist),
  { kind: "Scene", name: "clock at 4:10", size: "small", art: <Clock /> },
  { kind: "UI", name: "badge", size: "small", art: <Badge /> },
  { kind: "Texture", name: "window light", size: "small", art: <WindowLight /> },
  { kind: "Type", name: "body text", size: "wide", art: <BodyText /> },
  { kind: "Scene", name: "book stack", size: "small", art: <BookStack /> },
  { kind: "UI", name: "progress bar", size: "small", art: <ProgressBar /> },
  { kind: "Texture", name: "oak grain", size: "small", art: <OakGrain /> },
  { kind: "Scene", name: "wall outlet", size: "small", art: <Outlet /> },
];
