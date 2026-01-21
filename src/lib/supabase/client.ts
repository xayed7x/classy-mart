/**
 * SUPABASE BROWSER CLIENT
 * =======================
 * 
 * DEMO_MODE = true → Returns null (no Supabase in demo)
 * DEMO_MODE = false → Creates real Supabase client
 */

import { createBrowserClient } from '@supabase/ssr';

// Check if we're in demo mode or if env vars are missing
const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
  // 🎯 DEMO MODE: Return null if no Supabase credentials
  if (isDemoMode) {
    console.warn('🎯 DEMO MODE: Supabase browser client not available');
    return null;
  }

  // [INTEGRATION POINT] Dynamic Mode: Create real client
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
