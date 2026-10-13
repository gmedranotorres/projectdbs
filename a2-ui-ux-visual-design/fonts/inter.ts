import { Inter } from "next/font/google";

// Inter is shared: Calm uses it for the interface, Editorial for small
// uppercase labels. Loading it here once keeps it a single font on the site.
export const inter = Inter({
  subsets: ["latin"],
  variable: "--inter",
});
