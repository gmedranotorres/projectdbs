// The content of Hyde Park Study Spots: the eight spots, the three filters,
// and the site's own lines. Everything that names a spot reads it from here.
//
// The words are Gabriela's, used exactly as she wrote them. Nothing is
// added: no hours, distances or ratings beyond what her notes say.

export type Filter = "Quiet & views" | "Big tables" | "Coworking";

export type Spot = {
  id: string;
  name: string;
  type: string;
  filter: Filter;
  // the street address, as Google Maps needs it
  address: string;
  // a few words that go with the address when it is shown
  addressNote?: string;
  note: string;
};

export const filters: Filter[] = ["Quiet & views", "Big tables", "Coworking"];

// Why she goes, by filter.
export const whyIGo: Record<Filter, string> = {
  "Quiet & views": "Quiet spots and beautiful views.",
  "Big tables": "Big tables to work at.",
  Coworking: "Good for coworking.",
};

export const spots: Spot[] = [
  {
    id: "harper",
    name: "Harper Reading Room",
    type: "Reading room",
    filter: "Quiet & views",
    address: "1116 E 59th St",
    note: "On the third floor of Harper Memorial Library, lit by a long row of tall arched windows. The Main Reading Room is for quiet solo work and the North Reading Room is for groups. Harper Cafe is there too, but no food or drinks in the Main Reading Room.",
  },
  {
    id: "regenstein",
    name: "Regenstein Library",
    type: "Library",
    filter: "Quiet & views",
    address: "1100 E 57th St",
    note: "The busiest library on campus, with private study rooms and quiet corners across seven floors of stacks. During reading period and finals, the 1st Floor Reading Room stays open until 4 a.m. for students with a UChicago ID.",
  },
  {
    id: "ida-noyes",
    name: "Ida Noyes Hall",
    type: "Student center",
    filter: "Quiet & views",
    address: "1212 E 59th St",
    note: "A Gothic student center built in 1916. The Cloister Club looks out on the Midway through cathedral windows, and there’s a fireplace just outside the Library Lounge. Its rooms are also booked for events, so check before you settle in.",
  },
  {
    id: "mansueto",
    name: "Mansueto Grand Reading Room",
    type: "Library",
    filter: "Quiet & views",
    address: "1100 E 57th St",
    addressNote: "beside the Reg",
    note: "Long tables under a glass dome. During exams, it’s the quiet room that stays open until 4 a.m.",
  },
  {
    id: "crerar",
    name: "Crerar Library",
    type: "Library",
    filter: "Big tables",
    address: "5730 S Ellis Ave",
    note: "The library that anchors the Science Quad, with big tables for spreading out.",
  },
  {
    id: "keller",
    name: "Keller Center",
    type: "Harris Public Policy",
    filter: "Big tables",
    address: "1307 E 60th St",
    note: "Harris’s home just south of the Midway, with the Harris Café, a kitchenette, and team rooms for students on the lower level, plus big tables.",
  },
  {
    id: "plein-air",
    name: "Plein Air Café",
    type: "Café",
    filter: "Coworking",
    address: "5751 S Woodlawn Ave",
    note: "A bright café in the Seminary Co-op building, with big windows facing Robie House. Seats go fast at lunch.",
  },
  {
    id: "build",
    name: "Build Coffee & Books",
    type: "Café and bookstore",
    filter: "Coworking",
    address: "6100 S Blackstone Ave",
    note: "A café and independent bookstore in Woodlawn’s Experimental Station, with small-press books, zines and community events.",
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
