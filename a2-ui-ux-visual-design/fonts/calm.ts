import { Inter, Newsreader } from "next/font/google";

// Calm: Newsreader for headlines, Inter for the interface.
// Use them with the font-newsreader and font-inter classes.
export const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--newsreader",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--inter",
});
