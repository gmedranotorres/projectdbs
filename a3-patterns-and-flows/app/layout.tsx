import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import { BottomNav, SiteHeader } from "@/components/site-nav";
import { StorageBanner } from "@/components/storage-banner";
import { TextLink, ToastProvider } from "@/components/ui";
import "./globals.css";

// Calm's fonts, set up as in A2: Newsreader for headlines, Inter for the
// interface. globals.css reads them through --newsreader and --inter.
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--newsreader",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--inter",
});

export const metadata: Metadata = {
  title: {
    default: "Seguimiento",
    template: "%s · Seguimiento",
  },
  description: "A weekly check-in for your job search",
};

// viewport-fit=cover lets the bottom nav clear the iPhone home bar.
export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* One toast region for the whole site. */}
        <ToastProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-30 focus:rounded-control focus:bg-surface focus:px-4 focus:py-2"
          >
            Skip to content
          </a>
          <SiteHeader />
          <StorageBanner />
          {/* tabIndex -1: "Skip to content" moves focus here in every browser, so
              the next Tab starts inside the page. It's not a control, so no ring. */}
          <main
            id="main"
            tabIndex={-1}
            className="mx-auto w-full max-w-3xl flex-1 px-4 pt-6 pb-12 outline-none md:pt-10 md:pb-16"
          >
            {children}
          </main>
          {/* Room below for the phone's bottom bar. */}
          <footer className="mx-auto w-full max-w-3xl px-4 pb-28 md:pb-10">
            <p className="border-t border-line pt-4 text-sm text-muted">
              Saved on this device ·{" "}
              <TextLink href="/check-in">Weekly check-in</TextLink>
            </p>
          </footer>
          <BottomNav />
        </ToastProvider>
      </body>
    </html>
  );
}
