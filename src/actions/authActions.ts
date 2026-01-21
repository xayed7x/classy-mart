/**
 * AUTH ACTIONS
 * ============
 * 
 * এই ফাইলটি Authentication পরিচালনা করে।
 * 
 * DEMO_MODE = true হলে → Mock admin login (password: "demo")
 * DEMO_MODE = false হলে → Supabase Auth ব্যবহার হবে
 */

"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DEMO_MODE } from "@/lib/demo-mode";

// ============================================
// [INTEGRATION POINT] Supabase Client
// Dynamic মোডে Supabase Auth ব্যবহার হয়
// ============================================
let createSupabaseClient: any = null;

if (!DEMO_MODE) {
  try {
    const serverLib = require("@/lib/supabase/server");
    createSupabaseClient = serverLib.createClient;
  } catch (error) {
    console.warn("Supabase auth not configured");
  }
}

// ============================================
// ADMIN LOGIN
// ============================================

export async function signInAdmin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      error: "Email and password are required",
    };
  }

  // 🎯 DEMO MODE: Mock admin login
  if (DEMO_MODE) {
    console.log('🎯 DEMO MODE: Attempting demo admin login...');
    
    // Simple demo password check
    if (password === "demo" || password === "admin123") {
      console.log('✅ DEMO MODE: Admin login successful');
      
      // Set a demo auth cookie
      const cookieStore = await cookies();
      cookieStore.set('demo-admin-auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      });
      
      redirect("/admin");
    } else {
      return {
        error: "Invalid credentials. For demo, use password: 'demo'",
      };
    }
  }

  // [INTEGRATION POINT] Dynamic Mode: Use Supabase Auth
  try {
    const cookieStore = await cookies();
    const supabase = createSupabaseClient(cookieStore);

    // Sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return {
        error: authError.message,
      };
    }

    // Check if user has admin role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      await supabase.auth.signOut();
      return {
        error: "Access denied. Admin privileges required.",
      };
    }

    redirect("/admin");
  } catch (error: any) {
    console.error("Error in signInAdmin:", error);
    return {
      error: error.message || "An unexpected error occurred. Please try again.",
    };
  }
}

// ============================================
// SIGN OUT
// ============================================

export async function signOutUser() {
  // 🎯 DEMO MODE: Clear demo auth cookie
  if (DEMO_MODE) {
    console.log('🎯 DEMO MODE: Signing out...');
    const cookieStore = await cookies();
    cookieStore.delete('demo-admin-auth');
    return redirect('/');
  }

  // [INTEGRATION POINT] Dynamic Mode: Supabase signout
  const cookieStore = await cookies();
  const supabase = createSupabaseClient(cookieStore);

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }

    // Manually find and remove all Supabase auth cookies
    const allCookies = cookieStore.getAll();
    allCookies.forEach((cookie: any) => {
      if (cookie.name.startsWith('sb-') && cookie.name.includes('-auth-token')) {
        cookieStore.delete(cookie.name);
      }
    });

  } catch (err) {
    console.error('Unexpected error during sign out:', err);
  }
  
  return redirect('/');
}

// ============================================
// HELPER: Check Demo Admin Auth
// ============================================

export async function isDemoAdminAuthenticated(): Promise<boolean> {
  if (!DEMO_MODE) return false;
  
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('demo-admin-auth');
  return authCookie?.value === 'true';
}

// ============================================
// ALIAS FOR BACKWARD COMPATIBILITY
// ============================================

export async function login(prevState: any, formData: FormData) {
  return signInAdmin(prevState, formData);
}
