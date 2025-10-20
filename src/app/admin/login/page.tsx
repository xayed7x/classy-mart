'use client';

import { login } from "@/actions/authActions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function LoginPage() {

  const boundLogin = login.bind(null, null);

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 border border-muted-gold/20 rounded-2xl p-8">
        <h1 className="font-heading text-3xl dark:text-soft-white mb-8 text-center">
          Admin Login
        </h1>
        <form action={boundLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-sans dark:text-soft-white mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full p-3 bg-white/10 text-foreground border border-muted-gold/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary font-heading"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-sans dark:text-soft-white mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full p-3 bg-white/10 text-foreground border border-muted-gold/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary font-heading"
            />
          </div>
          <SubmitButton className="w-full dark:bg-primary dark:text-rich-black font-bold uppercase tracking-wider font-heading py-4 rounded-lg transition-transform hover:scale-105">
            Login
          </SubmitButton>
        </form>
      </div>
    </main>
  );
}
