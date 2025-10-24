"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { toast } from "sonner";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { useRouter } from "next/navigation";

interface CustomerAuthModalProps {
  children?: React.ReactNode;
}

export function CustomerAuthModal({ children }: CustomerAuthModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const supabase = createClient();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error on new submission
    setLoading(true);

    const email = formData.email;
    const password = formData.password;
    const fullName = formData.fullName;

    // Log the data you are about to send


    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      // --- THIS IS THE KEY DIAGNOSTIC ---
      if (error) {

        setError(error.message); // Set the error state to display it
        setLoading(false);
        return; // Stop the function here
      }
      // ------------------------------------

      // If successful, you can log the success and maybe close the modal

      toast.success(
        "Account created! Please check your email to verify your account."
      );
      setIsOpen(false);
      setFormData({ email: "", password: "", fullName: "" });
      // You would typically close the modal and show a "success" message here
      // or automatically log them in. For now, let's just confirm it works.
    } catch (err) {
      // This will catch any other unexpected JS errors

      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(error.message);
        throw error;
      }

      toast.success("Welcome back!");
      setIsOpen(false);
      // Refresh the page to update the UI
      router.push("/account");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit =
    mode === "signup"
      ? (e: React.FormEvent<HTMLFormElement>) => handleSignUp(e)
      : (e: React.FormEvent<HTMLFormElement>) => handleSignIn(e);

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setFormData({ email: "", password: "", fullName: "" });
    setError(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children || (
          <button
            aria-label="Account"
            className="text-foreground dark:text-foreground/60 hover:text-foreground dark:hover:text-foreground"
          >
            <User strokeWidth={1.5} size={20} />
          </button>
        )}
      </SheetTrigger>
      <SheetContent position="right" size="sm" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl font-heading text-foreground dark:text-soft-white">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </SheetTitle>
          <SheetDescription className="dark:text-soft-white">
            {mode === "signin"
              ? "Sign in to access your account"
              : "Sign up to start shopping"}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-sans dark:text-soft-white mb-2"
              >
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
                placeholder="John Doe"
                className="w-full p-3 bg-white/10 text-foreground border border-muted-gold/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary font-heading"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-sans dark:text-soft-white mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              placeholder="you@example.com"
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
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              placeholder="••••••••"
              minLength={6}
              className="w-full p-3 bg-white/10 text-foreground border border-muted-gold/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary font-heading"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4 dark:text-soft-white">{error}</p>}

          <SubmitButton
            className="w-full dark:bg-primary dark:text-rich-black font-bold uppercase tracking-wider font-heading py-4 rounded-lg transition-transform hover:scale-105 disabled:opacity-50"
          >
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </SubmitButton>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm dark:text-soft-white hover:text-muted-gold"
            >
              {mode === "signin"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
