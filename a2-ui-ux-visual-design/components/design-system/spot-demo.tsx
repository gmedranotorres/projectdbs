"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { SpotCard } from "@/components/ui/card";
import { List, ListRow } from "@/components/ui/list";
import { DetailPanel } from "@/components/ui/panel";
import { guideLine, spots, type Spot } from "@/content/spots";
import { Specimen } from "./section";

// The card, the list rows and the detail panel, working together the way
// they will on the site: the card's button or any row opens the panel for
// that spot, and "Save" remembers the spot until the page is reloaded.
// Nothing is stored anywhere.
export function SpotDemo({
  cardMedia,
  panelMedia,
}: {
  // pictures drawn in code, in the style of the page
  cardMedia: ReactNode;
  panelMedia: ReactNode;
}) {
  const [spot, setSpot] = useState<Spot>(spots[0]);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);

  const show = (next: Spot) => {
    setSpot(next);
    setOpen(true);
  };
  const saveButton = (target: Spot) => {
    const isSaved = saved.includes(target.id);
    return (
      <Button
        variant="secondary"
        pressed={isSaved}
        onClick={() =>
          setSaved(
            isSaved
              ? saved.filter((id) => id !== target.id)
              : [...saved, target.id],
          )
        }
      >
        {isSaved ? "Saved" : "Save"}
      </Button>
    );
  };

  return (
    <>
      <Specimen title="Card for a spot">
        <SpotCard
          name={spots[0].name}
          kind={spots[0].kind}
          media={cardMedia}
          actions={
            <>
              <Button onClick={() => show(spots[0])}>View details</Button>
              {saveButton(spots[0])}
            </>
          }
        />
      </Specimen>

      <Specimen title="List rows" note="Each row opens the detail panel.">
        <List>
          {spots.map((item) => (
            <ListRow
              key={item.id}
              title={item.name}
              note={item.kind}
              onClick={() => show(item)}
            />
          ))}
        </List>
      </Specimen>

      <Specimen
        title="Detail panel"
        note="Opens from the card or a row. Closes with Escape or the × button, and the focus returns to where you were."
      >
        <Button variant="secondary" onClick={() => show(spots[0])}>
          Open the panel
        </Button>
        <DetailPanel
          open={open}
          onClose={() => setOpen(false)}
          title={spot.name}
          kind={spot.kind}
        >
          <div className="h-28 overflow-hidden rounded-(--ui-radius-md) border border-(--ui-border)">
            {panelMedia}
          </div>
          <p>{guideLine}.</p>
          <div>{saveButton(spot)}</div>
        </DetailPanel>
      </Specimen>
    </>
  );
}
