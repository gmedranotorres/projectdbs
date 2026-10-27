import { clerkMiddleware } from "@clerk/nextjs/server";

// Signed out, a visitor can open only the welcome page and the sign-in and
// sign-up pages (and the steps inside them, like /sign-in/factor-one).
// Anything else sends them to sign in first, and back afterwards.
function isPublic(pathname: string) {
  return (
    pathname === "/" ||
    ["/sign-in", "/sign-up"].some((p) => pathname === p || pathname.startsWith(`${p}/`))
  );
}

export default clerkMiddleware(
  async (auth, req) => {
    if (!isPublic(req.nextUrl.pathname)) await auth.protect();
  },
  { signInUrl: "/sign-in", signUpUrl: "/sign-up" },
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
