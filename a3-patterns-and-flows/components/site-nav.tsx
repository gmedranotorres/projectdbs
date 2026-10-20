"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";

// The same four places on every page. On a phone they sit in a bar at the
// bottom, within reach of a thumb; from 768px up they move into the header.

const icon = "size-6 md:hidden";

const ITEMS: { href: string; label: string; icon: ReactNode; matches: (p: string) => boolean }[] = [
  {
    href: "/",
    label: "Home",
    // The check-in is Home's other face, so Home stays marked there.
    matches: (p) => p === "/" || p === "/check-in",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1v-8.5Z" />
      </svg>
    ),
  },
  {
    href: "/add",
    label: "Add",
    matches: (p) => p === "/add",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    href: "/applications",
    label: "All",
    matches: (p) => p.startsWith("/applications"),
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M9 6.5h11M9 12h11M9 17.5h11" />
        <circle cx="4.75" cy="6.5" r="1" fill="currentColor" />
        <circle cx="4.75" cy="12" r="1" fill="currentColor" />
        <circle cx="4.75" cy="17.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/move",
    label: "Move data",
    matches: (p) => p === "/move",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5" />
      </svg>
    ),
  },
];

// The header: the name, and on a laptop the navigation beside it.
export function SiteHeader() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-serif text-heading">
          Seguimiento
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <MarkedNavItems />
        </nav>
      </div>
    </header>
  );
}

// On a phone, the same four places as a bar at the bottom. It comes last in
// the page, after the footer, so Tab moves top to bottom as you see it:
// header, page, footer, bar. Only one of the two navs shows at a time.
export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <MarkedNavItems />
    </nav>
  );
}

// On an application's page the address is only known in the browser, so
// the links draw first and the current one is marked once it's known.
function MarkedNavItems() {
  return (
    <Suspense fallback={<NavItems pathname={null} />}>
      <CurrentNavItems />
    </Suspense>
  );
}

function CurrentNavItems() {
  return <NavItems pathname={usePathname()} />;
}

function NavItems({ pathname }: { pathname: string | null }) {
  return (
    <ul className="mx-auto grid max-w-3xl grid-cols-4 md:flex md:gap-1">
      {ITEMS.map((item) => {
        const current = pathname !== null && item.matches(pathname);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={`flex min-h-14 flex-col items-center justify-center gap-0.5 px-2 text-label md:min-h-11 md:rounded-control md:px-3 md:text-base ${
                current
                  ? "font-semibold text-ink md:bg-accent-soft"
                  : "text-muted hover:text-ink md:hover:bg-subtle"
              }`}
            >
              {item.icon}
              <span className={current ? "underline decoration-accent-strong decoration-2 underline-offset-4 md:no-underline" : ""}>
                {item.label}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
