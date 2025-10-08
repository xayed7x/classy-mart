import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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
  return (
    <header className="sticky top-0 z-50 w-full border-b border-light-accent dark:border-aura-accent-border bg-light-bg dark:bg-aura-black">
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
            <span className="hidden lg:block font-heading text-xl font-bold text-light-text dark:text-aura-soft-white">Classy Mart</span>
          </Link>

          {/* Welcome Message (Mobile Only) */}
          <div className="lg:hidden">
            <p className="text-sm text-light-accent-text dark:text-aura-gold">Welcome back,</p>
            <p className="font-bold text-light-text dark:text-aura-soft-white">Classy Mart User</p>
          </div>
        </div>

        {/* Middle Section: Desktop Navigation (hidden on mobile, visible on lg:) */}
        <nav className="hidden lg:flex" aria-label="Main navigation">
          <ul className="flex items-center space-x-8">
            <li>
              <Link
                href="/category/t-shirts"
                className="font-sans text-sm font-medium uppercase tracking-wide text-light-text dark:text-aura-gold hover:text-brand-red dark:hover:text-aura-soft-white"
              >
                T-Shirts
              </Link>
            </li>
            <li>
              <Link
                href="/category/shirts"
                className="font-sans text-sm font-medium uppercase tracking-wide text-light-text dark:text-aura-gold hover:text-brand-red dark:hover:text-aura-soft-white"
              >
                Shirts
              </Link>
            </li>
            <li>
              <Link
                href="/category/pants"
                className="font-sans text-sm font-medium uppercase tracking-wide text-light-text dark:text-aura-gold hover:text-brand-red dark:hover:text-aura-soft-white"
              >
                Pants
              </Link>
            </li>
            <li>
              <Link
                href="/category/panjabis"
                className="font-sans text-sm font-medium uppercase tracking-wide text-light-text dark:text-aura-gold hover:text-brand-red dark:hover:text-aura-soft-white"
              >
                Panjabis
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right Section: Action Icons */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button
            aria-label="Search"
            className="text-light-text dark:text-aura-gold hover:text-brand-red dark:hover:text-aura-soft-white"
          >
            <Search strokeWidth={1.5} size={20} />
          </button>
          {/* Shopping Bag Icon (hidden on mobile, visible on desktop) */}
          <button
            aria-label="Shopping bag"
            className="hidden text-light-text dark:text-aura-gold hover:text-brand-red dark:hover:text-aura-soft-white lg:flex"
          >
            <ShoppingBag strokeWidth={1.5} size={20} />
          </button>
          {/* Mobile Menu Icon (visible only on mobile) */}
          <button
            aria-label="Open menu"
            className="text-light-text dark:text-aura-gold hover:text-brand-red dark:hover:text-aura-soft-white lg:hidden"
          >
            <Menu strokeWidth={1.5} size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}