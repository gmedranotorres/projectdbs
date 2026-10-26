// The content of Hyde Park Study Spots: the eight spots, the three filters,
// the two "Also" toggles, and the site's own lines. Everything that names a
// spot reads it from here.
//
// The words are Gabriela's, used exactly as she wrote them. Nothing is
// added: no hours, distances or ratings beyond what her notes say.

export type Filter = "Quiet & views" | "Big tables" | "Coworking";

// The second row of filters. Each can be switched on with any filter above.
export type Also = "Coffee nearby" | "Open late (finals)";

// The Calm mood board's scenes, one of which stands in for a spot's photo
// until there is one.
export type Scene = "lamp" | "mug" | "long-table" | "books" | "plant" | "bench";

export type Spot = {
  id: string;
  name: string;
  type: string;
  filter: Filter;
  also: Also[];
  // the street address, as Google Maps needs it
  address: string;
  // a few words that go with the address when it is shown
  addressNote?: string;
  note: string;
  // Gabriela's own photo, "/photos/<id>.jpg" in public/photos, or null
  // until she adds one; `alt` says what the photo shows
  photo: string | null;
  alt: string;
  // the scene shown while `photo` is null
  scene: Scene;
};

export const filters: Filter[] = ["Quiet & views", "Big tables", "Coworking"];

export const alsoOptions: Also[] = ["Coffee nearby", "Open late (finals)"];

// How each one reads as a badge in the detail panel.
export const alsoBadge: Record<Also, string> = {
  "Coffee nearby": "Coffee nearby",
  "Open late (finals)": "Open until 4 a.m. in finals",
};

// Why she goes, by filter.
export const whyIGo: Record<Filter, string> = {
  "Quiet & views": "Quiet spots and beautiful views.",
  "Big tables": "Big tables to work at.",
  Coworking: "Good for coworking.",
};

export const spots: Spot[] = [
  {
    id: "harper-reading-room",
    name: "Harper Reading Room",
    type: "Reading room",
    filter: "Quiet & views",
    also: ["Coffee nearby"], // Harper Cafe
    address: "1116 E 59th St",
    note: "On the third floor of Harper Memorial Library, lit by a long row of tall arched windows. The Main Reading Room is for quiet solo work and the North Reading Room is for groups. Harper Cafe is there too, but no food or drinks in the Main Reading Room.",
    photo: null,
    alt: "Harper Reading Room’s long tables under tall arched windows",
    scene: "long-table",
  },
  {
    id: "regenstein",
    name: "Regenstein Library",
    type: "Library",
    filter: "Quiet & views",
    also: ["Coffee nearby", "Open late (finals)"], // Ex Libris café
    address: "1100 E 57th St",
    note: "The busiest library on campus, with private study rooms and quiet corners across seven floors of stacks. During reading period and finals, the 1st Floor Reading Room stays open until 4 a.m. for students with a UChicago ID.",
    photo: null,
    alt: "A quiet corner among the stacks of Regenstein Library",
    scene: "books",
  },
  {
    id: "ida-noyes",
    name: "Ida Noyes Hall",
    type: "Student center",
    filter: "Quiet & views",
    also: [],
    address: "1212 E 59th St",
    note: "A Gothic student center built in 1916. The Cloister Club looks out on the Midway through cathedral windows, and there’s a fireplace just outside the Library Lounge. Its rooms are also booked for events, so check before you settle in.",
    photo: null,
    alt: "The Cloister Club in Ida Noyes Hall, with cathedral windows looking out on the Midway",
    scene: "bench",
  },
  {
    id: "mansueto",
    name: "Mansueto Grand Reading Room",
    type: "Library",
    filter: "Quiet & views",
    also: ["Open late (finals)"],
    address: "1100 E 57th St",
    addressNote: "beside the Reg",
    note: "Long tables under a glass dome. During exams, it’s the quiet room that stays open until 4 a.m.",
    photo: null,
    alt: "Long tables under the glass dome of the Mansueto Grand Reading Room",
    scene: "long-table",
  },
  {
    id: "crerar",
    name: "Crerar Library",
    type: "Library",
    filter: "Big tables",
    also: [],
    address: "5730 S Ellis Ave",
    note: "The library that anchors the Science Quad, with big tables for spreading out.",
    photo: null,
    alt: "Big tables for spreading out in Crerar Library",
    scene: "lamp",
  },
  {
    id: "keller-center",
    name: "Keller Center",
    type: "Harris Public Policy",
    filter: "Big tables",
    also: ["Coffee nearby"], // Harris Café
    address: "1307 E 60th St",
    note: "Harris’s home just south of the Midway, with the Harris Café, a kitchenette, and team rooms for students on the lower level, plus big tables.",
    photo: null,
    alt: "Big tables in the Keller Center, Harris’s home south of the Midway",
    scene: "plant",
  },
  {
    id: "plein-air-cafe",
    name: "Plein Air Café",
    type: "Café",
    filter: "Coworking",
    also: ["Coffee nearby"],
    address: "5751 S Woodlawn Ave",
    note: "A bright café in the Seminary Co-op building, with big windows facing Robie House. Seats go fast at lunch.",
    photo: null,
    alt: "Plein Air Café’s big windows facing Robie House",
    scene: "mug",
  },
  {
    id: "build-coffee",
    name: "Build Coffee & Books",
    type: "Café and bookstore",
    filter: "Coworking",
    also: ["Coffee nearby"],
    address: "6100 S Blackstone Ave",
    note: "A café and independent bookstore in Woodlawn’s Experimental Station, with small-press books, zines and community events.",
    photo: null,
    alt: "Build Coffee & Books, a café and bookstore in Woodlawn’s Experimental Station",
    scene: "mug",
  },
];

// The address as it is shown: "1100 E 57th St, beside the Reg".
export const shownAddress = (spot: Spot) =>
  spot.addressNote ? `${spot.address}, ${spot.addressNote}` : spot.address;

// Google Maps directions to a spot. Every spot is in Chicago, so the city is
// added here for the map; it is not part of what the page shows.
export const directionsUrl = (spot: Spot) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${spot.address}, Chicago, IL`,
  )}`;

export const siteName = "Hyde Park Study Spots";
// The line under the site's title.
export const siteIntro =
  "Eight places I study near campus, sorted by what they're good for.";

// Two lines the design system pages use as sample text.
export const siteLine =
  "A guide that helps UChicago students decide where to study.";
export const guideLine =
  "A relaxing and comfortable spot is a good way to focus on your work";
