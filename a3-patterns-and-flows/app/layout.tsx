import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteNav } from "@/components/site-nav";
import { StorageBanner } from "@/components/storage-banner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-30 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SiteNav />
        <StorageBanner />
        <main
          id="main"
          className="mx-auto w-full max-w-3xl flex-1 px-4 pb-32 pt-6 md:pb-16 md:pt-10"
        >
          {children}
        </main>
      </body>
    </html>
  );
}
