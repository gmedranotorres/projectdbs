"use client";

import { useSession } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useMemo } from "react";

// Supabase in the browser, signed in as the Clerk user. Every request carries
// Clerk's session token, so row-level security sees the Clerk user id as
// auth.jwt()->>'sub'. Signed out, there is no token and the tables return
// nothing. Only the publishable key: never the secret key.
export function useSupabase() {
  const { session } = useSession();

  return useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        { accessToken: async () => (await session?.getToken()) ?? null },
      ),
    [session],
  );
}
