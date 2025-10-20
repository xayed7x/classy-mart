"use server";

import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
  // Placeholder for login logic
  // In a real app, you would validate credentials and set a session
  redirect("/admin");
}
