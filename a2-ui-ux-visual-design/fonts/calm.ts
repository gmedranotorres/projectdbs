import { Newsreader } from "next/font/google";

// Calm: Newsreader for headlines, Inter for the interface.
// A page sets both variables on its <main>; text then picks a font with
// font-(family-name:--newsreader) or font-(family-name:--inter).
export const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--newsreader",
});

export { inter } from "./inter";
