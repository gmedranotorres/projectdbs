import Image from "next/image";
import type { ReactNode } from "react";
import {
  BookStack,
  LongTable,
  MidwayBench,
  Plant,
  ReadingLamp,
  SteamingMug,
} from "@/app/mood-boards/calm/art/scenes";
import { calmVars } from "@/app/mood-boards/calm/palette";
import type { Scene, Spot } from "@/content/spots";

// The Calm mood board's own scenes, as they are. Two of them name their
// parts with an id, which must be different for every copy on the page.
const scenes: Record<Scene, (id: string) => ReactNode> = {
  lamp: (id) => <ReadingLamp id={id} />,
  mug: () => <SteamingMug />,
  "long-table": (id) => <LongTable id={id} />,
  books: () => <BookStack />,
  plant: () => <Plant />,
  bench: () => <MidwayBench />,
};

// What goes in a spot's picture frame: Gabriela's photo of the place, or,
// until she adds one, the scene from the mood board that fits it. The scene
// is decoration, so screen readers skip it; a photo has its alt text.
//
// `place` ("card", "panel") tells the copies of one spot apart, and `sizes`
// tells the browser how wide the photo shows, so it loads a fitting size.
export function SpotPicture({
  spot,
  place,
  sizes,
}: {
  spot: Spot;
  place: string;
  sizes: string;
}) {
  if (spot.photo) {
    return <Image src={spot.photo} alt={spot.alt} fill sizes={sizes} />;
  }
  return (
    <div className="h-full" style={calmVars}>
      {scenes[spot.scene](`spot-${place}-${spot.id}`)}
    </div>
  );
}
