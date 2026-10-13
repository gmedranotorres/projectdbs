import type { ReactNode } from "react";
import "./collage.css";

export type ArtifactKind = "Color" | "Type" | "Texture" | "UI" | "Scene";

// How many grid cells a tile covers: small 1×1, wide 2×1, tall 1×2,
// large 2×2, banner 4×1, hero 4×2.
export type TileSize = "small" | "wide" | "tall" | "large" | "banner" | "hero";

// One tile of a mood board. A board is a list of these: the position in the
// list is the number shown on the tile.
export type Artifact = {
  kind: ArtifactKind;
  name: string;
  size: TileSize;
  art: ReactNode;
};

// The collage shared by the three boards. Each board passes its own classes
// to dress the tiles; the grid, numbering and captions are the same.
export function Collage({
  artifacts,
  tileClassName,
  artClassName = "",
  captionClassName,
  numberClassName,
}: {
  artifacts: Artifact[];
  tileClassName: string;
  artClassName?: string;
  captionClassName: string;
  numberClassName?: string;
}) {
  return (
    <div className="collage-frame">
      <ul role="list" className="collage">
        {artifacts.map((artifact, index) => (
          <li
            key={`${artifact.kind} ${artifact.name}`}
            data-size={artifact.size}
          >
            <figure className={`flex h-full flex-col ${tileClassName}`}>
              <div className={`collage-art ${artClassName}`}>
                {artifact.art}
              </div>
              <figcaption className={captionClassName}>
                <span className={numberClassName}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                {` · ${artifact.kind} · ${artifact.name}`}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
