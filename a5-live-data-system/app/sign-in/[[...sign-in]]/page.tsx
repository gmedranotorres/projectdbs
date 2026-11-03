import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Loading } from "@/components/ui";

export const metadata: Metadata = { title: "Sign in" };

// Clerk's form reads the address, so it waits inside Suspense.
export default function SignInPage() {
  return (
    <div className="flex justify-center">
      <Suspense fallback={<Loading />}>
        <SignIn />
      </Suspense>
    </div>
  );
}
