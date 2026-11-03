import { ClerkProvider, UserButton } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import Link from "next/link";
import { siteAppearance, SignedInOnly, SignInLinks } from "@/components/account";
import { SpinningWheel } from "@/components/bikes";
import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--barlow",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--inter",
});

export const metadata: Metadata = {
  title: { default: "Estaciones", template: "%s · Estaciones" },
  description: "Follow the Divvy bike stations you use, and watch them change live.",
};

export const viewport: Viewport = { viewportFit: "cover" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${barlow.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <ClerkProvider appearance={siteAppearance} signInUrl="/sign-in" signUpUrl="/sign-up">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-30 focus:rounded-control focus:bg-surface focus:px-4 focus:py-2"
          >
            Skip to content
          </a>
          <header className="border-b border-line bg-surface">
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
              <Link href="/" className="flex items-center gap-2 font-display text-[1.75rem] leading-none font-bold tracking-wide text-ink uppercase">
                <SpinningWheel spinning={false} className="size-7 text-accent" />
                Estaciones
              </Link>
              <div className="flex min-h-11 items-center gap-2">
                <SignedInOnly signedOut={<SignInLinks />}>
                  <UserButton />
                </SignedInOnly>
              </div>
            </div>
            <div aria-hidden="true" className="road-stripe" />
          </header>
          <main id="main" tabIndex={-1} className="mx-auto w-full max-w-3xl flex-1 px-4 pt-6 pb-12 outline-none md:pt-10">
            {children}
          </main>
          <footer className="mx-auto w-full max-w-3xl px-4 pb-8">
            <p className="border-t border-line pt-4 text-sm text-muted">
              A class project using Divvy&apos;s public data feed. Not made by or connected to Divvy or Lyft.
            </p>
          </footer>
        </ClerkProvider>
      </body>
    </html>
  );
}
