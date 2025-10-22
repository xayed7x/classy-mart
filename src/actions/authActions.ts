"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signInAdmin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      error: "Email and password are required",
    };
  }

  const supabase = await createClient();

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
    // Sign out the user if they're not an admin
    await supabase.auth.signOut();
    return {
      error: "Access denied. Admin privileges required.",
    };
  }

  // Success - redirect to admin dashboard
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function login(prevState: any, formData: FormData) {
  // Alias for backward compatibility
  return signInAdmin(prevState, formData);
}
