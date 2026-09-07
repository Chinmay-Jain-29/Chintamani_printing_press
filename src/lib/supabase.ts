import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Cache client singletons in global scope for serverless runtime efficiency
declare global {
  // eslint-disable-next-line no-var
  var __supabaseAdmin: SupabaseClient | undefined;
  // eslint-disable-next-line no-var
  var __supabasePublic: SupabaseClient | undefined;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Returns true if the required Supabase environment variables are present.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && (supabaseServiceRoleKey || supabaseAnonKey));
}

/**
 * Server-only Supabase client with administrative / service_role privileges.
 * Automatically bypasses Row Level Security for authorized administrative backend APIs.
 * NEVER expose this client or the service-role key to browser/client-side JavaScript.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  if (globalThis.__supabaseAdmin) {
    return globalThis.__supabaseAdmin;
  }

  const client = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  globalThis.__supabaseAdmin = client;
  return client;
}

/**
 * Public Supabase client using anon public key.
 * Subject to Row Level Security policies. Safe for client or public reads.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  if (globalThis.__supabasePublic) {
    return globalThis.__supabasePublic;
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });

  globalThis.__supabasePublic = client;
  return client;
}
