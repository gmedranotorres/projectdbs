import { Show } from "@clerk/nextjs";
import { Suspense, type ReactNode } from "react";
import { ButtonLink } from "./ui";

// Clerk's sign-in, sign-up and account menu, dressed in Calm. Every value
// is a token from globals.css, so they change with the rest of the site.
// Fields are outlined in line-strong, as ours are: line alone is too faint.
export const calmAppearance = {
  variables: {
    colorPrimary: "var(--accent)",
    colorPrimaryForeground: "var(--accent-ink)",
    colorDanger: "var(--error)",
    colorForeground: "var(--ink)",
    colorMutedForeground: "var(--muted)",
    colorMuted: "var(--subtle)",
    colorBackground: "var(--surface)",
    colorInput: "var(--surface)",
    colorInputForeground: "var(--ink)",
    colorBorder: "var(--line-strong)",
    colorNeutral: "var(--ink)",
    colorRing: "var(--focus)",
    colorShadow: "var(--ink)",
    fontFamily: "var(--type-sans)",
    fontFamilyButtons: "var(--type-sans)",
    borderRadius: "var(--radius-medium)",
  },
  elements: {
    // The account menu's button reaches 44px for a finger, like ours.
    userButtonTrigger: { minWidth: "2.75rem", minHeight: "2.75rem", justifyContent: "center" },
    userButtonAvatarBox: { width: "2.25rem", height: "2.25rem" },
  },
};

// Only for someone signed in; `signedOut` shows otherwise. Who's signed in
// is read from the request, so this streams in after the rest of the page.
export function SignedInOnly({ children, signedOut }: { children: ReactNode; signedOut?: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <Show when="signed-in" fallback={signedOut}>
        {children}
      </Show>
    </Suspense>
  );
}

// The header's way in, for someone signed out.
export function SignInLinks() {
  return (
    <div className="flex items-center gap-2">
      <ButtonLink href="/sign-in" variant="quiet" size="sm">
        Sign in
      </ButtonLink>
      <ButtonLink href="/sign-up" size="sm">
        Sign up
      </ButtonLink>
    </div>
  );
}
