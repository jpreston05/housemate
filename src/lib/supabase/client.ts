import { createBrowserClient } from "@supabase/ssr";

// For Client Components ("use client"). Runs in the user's browser, so it only
// ever uses the public key — every request is still checked by RLS.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
