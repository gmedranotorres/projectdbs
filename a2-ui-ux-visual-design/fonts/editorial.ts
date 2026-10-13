import { Playfair_Display, Source_Serif_4 } from "next/font/google";

// Editorial: Playfair Display for display type, Source Serif 4 for text,
// Inter for small uppercase labels.
// A page sets the three variables on its <main>; text then picks a font
// with font-(family-name:--playfair), font-(family-name:--source-serif) or
// font-(family-name:--inter).
export const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--playfair",
});

export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--source-serif",
});

export { inter } from "./inter";
