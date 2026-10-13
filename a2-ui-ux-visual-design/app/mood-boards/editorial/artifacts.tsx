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
  Byline,
  DropCap,
  HalftoneArch,
  Masthead,
  MidwayMap,
  NumberedPick,
  PullQuote,
  RatingsKey,
} from "./art/scenes";
import { Swatch } from "./art/swatch";
import {
  ColumnRules,
  Crosshatch,
  HalftoneDots,
  NewsprintGrain,
} from "./art/textures";
import { Aa, BigNumber, BodyText, Headline } from "./art/type";

const swatch = (color: (typeof palette)[keyof typeof palette]): Artifact => ({
  kind: "Color",
  name: color.name,
  size: "small",
  art: <Swatch color={color} />,
});

// The Editorial board, one line per tile. A tile's number is its place in
// this list. Delete a line to remove a tile, change `size` to resize it
// (small, wide, tall, large, banner, hero), or swap `art` to replace it;
// the other tiles move to fill the space.
export const artifacts: Artifact[] = [
  { kind: "Scene", name: "masthead", size: "banner", art: <Masthead /> },
  swatch(palette.newsprint),
  swatch(palette.ink),
  { kind: "Scene", name: "halftone Gothic arch", size: "large", art: <HalftoneArch /> },
  { kind: "Type", name: "headline", size: "wide", art: <Headline /> },
  swatch(palette.maroon),
  { kind: "Scene", name: "numbered pick", size: "tall", art: <NumberedPick /> },
  { kind: "Texture", name: "newsprint grain", size: "small", art: <NewsprintGrain /> },
  { kind: "Type", name: "Aa", size: "small", art: <Aa /> },
  { kind: "UI", name: "button", size: "small", art: <Button /> },
  { kind: "Scene", name: "pull quote", size: "wide", art: <PullQuote /> },
  { kind: "UI", name: "study spot card", size: "large", art: <SpotCard /> },
  { kind: "Texture", name: "halftone dots", size: "small", art: <HalftoneDots /> },
  swatch(palette.gray),
  { kind: "UI", name: "toggle", size: "small", art: <Toggle /> },
  { kind: "Scene", name: "ratings key", size: "small", art: <RatingsKey /> },
  { kind: "Type", name: "big number", size: "wide", art: <BigNumber /> },
  { kind: "Scene", name: "line map of the Midway", size: "banner", art: <MidwayMap /> },
  { kind: "Texture", name: "column rules", size: "tall", art: <ColumnRules /> },
  swatch(palette.fog),
  { kind: "Scene", name: "drop cap", size: "wide", art: <DropCap /> },
  { kind: "UI", name: "filter chips", size: "wide", art: <FilterChips /> },
  { kind: "UI", name: "badge", size: "small", art: <Badge /> },
  { kind: "Type", name: "body text", size: "wide", art: <BodyText /> },
  { kind: "Scene", name: "byline", size: "small", art: <Byline /> },
  { kind: "UI", name: "progress bar", size: "small", art: <ProgressBar /> },
  { kind: "Texture", name: "crosshatch", size: "small", art: <Crosshatch /> },
  swatch(palette.paper),
];
