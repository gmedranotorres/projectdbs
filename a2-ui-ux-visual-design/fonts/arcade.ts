import { Press_Start_2P, Space_Mono } from "next/font/google";

// Arcade: Press Start 2P for headlines, Space Mono for body text.
// A page sets both variables on its <main>; text then picks a font with
// font-(family-name:--press-start) or font-(family-name:--space-mono).
export const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--press-start",
});

export const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--space-mono",
});
