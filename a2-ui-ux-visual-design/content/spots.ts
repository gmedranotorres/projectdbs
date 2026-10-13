// The content of Hyde Park Study Spots: the eight spots and the three
// filters. Everything that names a spot reads it from here.
//
// `kind` is a plain label taken from each spot's name. Nothing here states
// hours, distances or ratings: those have not been checked.

export type Spot = { id: string; name: string; kind: string };

export const spots: Spot[] = [
  { id: "harper", name: "Harper Reading Room", kind: "Reading room" },
  { id: "regenstein", name: "Regenstein", kind: "Library" },
  { id: "ida-noyes", name: "Ida Noyes Hall", kind: "Campus hall" },
  { id: "mansueto", name: "Mansueto Grand Reading Room", kind: "Reading room" },
  { id: "crerar", name: "Crerar Library", kind: "Library" },
  { id: "keller", name: "Keller Center", kind: "Campus building" },
  { id: "plein-air", name: "Plein Air Café", kind: "Café" },
  { id: "build", name: "Build Coffee & Books", kind: "Café" },
];

export const filters = ["Quiet & views", "Big tables", "Coworking"];

export const siteName = "Hyde Park Study Spots";
export const siteLine =
  "A guide that helps UChicago students decide where to study.";
// The guide's own line, used wherever a sentence of body text is needed.
export const guideLine =
  "A relaxing and comfortable spot is a good way to focus on your work";
