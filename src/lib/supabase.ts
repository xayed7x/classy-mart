/**
 * SUPABASE ADMIN CLIENT
 * =====================
 * 
 * DEMO_MODE = true → Exports null clients
 * DEMO_MODE = false → Creates real Supabase clients
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if we're in demo mode (missing credentials)
const isDemoMode = !supabaseUrl || !supabaseAnonKey;

// 🎯 DEMO MODE: Export null if no credentials
// [INTEGRATION POINT] Dynamic Mode: Create real clients
export const supabase = isDemoMode 
  ? null 
  : createClient(supabaseUrl!, supabaseAnonKey!);

export const supabaseAdmin = (isDemoMode || !supabaseServiceRoleKey)
  ? null
  : createClient(supabaseUrl!, supabaseServiceRoleKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
