/**
 * SUPABASE SERVER CLIENT
 * ======================
 * 
 * DEMO_MODE = true → Returns null (no Supabase in demo)
 * DEMO_MODE = false → Creates real Supabase client
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Check if we're in demo mode or if env vars are missing
const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  // 🎯 DEMO MODE: Return null if no Supabase credentials
  if (isDemoMode) {
    console.warn('🎯 DEMO MODE: Supabase server client not available');
    return null;
  }

  // [INTEGRATION POINT] Dynamic Mode: Create real client
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
};
