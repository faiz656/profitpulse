import { createClient } from "@supabase/supabase-js";
import { createBrowserClient, createServerClient as createSSRServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client (for client components)
export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Legacy singleton for simple use
let _client: ReturnType<typeof createClient> | null = null;
export function getSupabase() {
  if (_client) return _client;
  if (!supabaseUrl || supabaseUrl === "your_supabase_url_here") {
    throw new Error("Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL to .env.local");
  }
  _client = createClient(supabaseUrl, supabaseAnonKey);
  return _client;
}

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
