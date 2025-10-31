"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, Menu, User, LogOut, Package } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useCartStore } from "@/stores/cart-store";
import { useCartDrawerStore } from "@/stores/cart-drawer-store";
import { useSearchStore } from "@/stores/search-store";
import { CustomerAuthModal } from "@/components/auth/CustomerAuthModal";
import { MobileNav } from "@/components/layout/MobileNav";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

/**
 * Main Header Component - Mobile-First Design
 * 
 * Mobile: Logo + Welcome Message + Search + Hamburger Menu
 * Desktop: Logo + Navigation + Search + ShoppingBag
 * 
 * Note: Welcome message and ShoppingBag positioning optimized per device.
 * Follows the "Street-Luxe" design system with psychology-driven UX.
 */
export function Header() {
  const { cartItems } = useCartStore();
  const { open } = useCartDrawerStore();
  const { open: openSearch } = useSearchStore();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    window.location.reload();
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background text-foreground">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Group: Logo + Welcome Message */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" aria-label="Classy Mart Homepage" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Classy Mart"
              width={120}
              height={40}
              priority
              className="h-8 w-auto"
            />
            <span className="hidden lg:block font-heading text-xl font-bold text-foreground">Classy Mart</span>
          </Link>

          {/* Welcome Message (Mobile Only) */}
          {user && (
            <div className="lg:hidden">
              {user && profile ? (
                <p className="font-bold text-foreground dark:text-foreground">Welcome back, {profile.full_name || user.email}</p>
              ) : (
                <p className="font-bold text-foreground dark:text-foreground">Welcome back, Guest</p>
              )}
            </div>
          )}
        </div>

        {/* Middle Section: Desktop Navigation (hidden on mobile, visible on md:) */}
        <nav className="hidden md:flex" aria-label="Main navigation">
          <ul className="flex items-center space-x-8">
            <li>
              <Link
                href="/collections/all"
                className="font-sans text-sm font-medium uppercase tracking-wide transition-colors dark:text-foreground/60 dark:hover:text-foreground hover:text-primary"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                href="/story"
                className="font-sans text-sm font-medium uppercase tracking-wide text-foreground dark:text-foreground/60 hover:text-foreground dark:hover:text-foreground"
              >
                Our Story
              </Link>
            </li>

            <li>
              <Link
                href="/contact"
                className="font-sans text-sm font-medium uppercase tracking-wide text-foreground dark:text-foreground/60 hover:text-foreground dark:hover:text-foreground"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right Section: Action Icons */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="hidden md:flex">
            {user ? (
              <Link
                href="/account"
                aria-label="Account"
                className="text-foreground dark:text-foreground/60 hover:text-foreground dark:hover:text-foreground"
              >
                <User strokeWidth={1.5} size={20} />
              </Link>
            ) : (
              <CustomerAuthModal />
            )}
          </div>
          <button
            aria-label="Search"
            className="text-foreground dark:text-foreground/60 hover:text-foreground dark:hover:text-foreground"
            onClick={openSearch}
          >
            <Search strokeWidth={1.5} size={20} />
          </button>
          {/* Shopping Bag Icon (hidden on mobile, visible on desktop) */}
          <button
            aria-label="Shopping cart"
            className="hidden text-foreground dark:text-foreground/60 hover:text-foreground dark:hover:text-foreground lg:flex relative"
            onClick={open}
          >
            <ShoppingCart strokeWidth={1.5} size={20} />
            {totalItems > 0 && (
              <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary dark:bg-primary text-[10px] font-bold text-black">
                {totalItems}
              </div>
            )}
          </button>
          {/* Mobile Menu Icon (visible only on mobile) */}
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}