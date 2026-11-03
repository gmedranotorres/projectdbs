"use client";

import { useAuth } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useMemo } from "react";
import type { Database } from "./database.types";

// Supabase in the browser, signed in as the Clerk user. Only the publishable
// key: never the secret key. Every request carries Clerk's token, so row-level
// security sees the Clerk user id as auth.jwt()->>'sub'.
//
// One client for the life of the page, because a new client would drop the
// Realtime connection. Clerk's token changes about once a minute, but getToken
// itself doesn't, so the client asks for the current token each time. Realtime
// asks on every heartbeat, which is what keeps an open page signed in.
export function useSupabase() {
  const { getToken } = useAuth();

  return useMemo(
    () =>
      createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        // There's no signed-in person while the server draws the page.
        { accessToken: async () => (typeof window === "undefined" ? null : ((await getToken()) ?? null)) },
      ),
    [getToken],
  );
}
