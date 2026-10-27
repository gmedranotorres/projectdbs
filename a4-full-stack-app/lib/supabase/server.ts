import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Supabase in server routes and server actions, signed in as the Clerk user
// making the request. The caller still checks sign-in with auth() itself
// first (see AGENTS.md). Only the publishable key: never the secret key.
export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { accessToken: async () => (await auth()).getToken() },
  );
}
