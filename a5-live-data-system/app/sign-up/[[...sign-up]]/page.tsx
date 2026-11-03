import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Loading } from "@/components/ui";

export const metadata: Metadata = { title: "Sign up" };

// Clerk's form reads the address, so it waits inside Suspense.
export default function SignUpPage() {
  return (
    <div className="flex justify-center">
      <Suspense fallback={<Loading />}>
        <SignUp />
      </Suspense>
    </div>
  );
}
