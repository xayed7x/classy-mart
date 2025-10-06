import Link from "next/link";
import { Home, LayoutGrid, ShoppingBag, User } from "lucide-react";

/**
 * Bottom Navigation Bar Component - Mobile-First "Flow UI"
 * 
 * Provides persistent, thumb-friendly navigation on mobile devices.
 * Creates a native app-like experience with sticky bottom positioning.
 * 
 * Visibility: Mobile/Tablet only (hidden on desktop via lg:hidden)
 * Design: Street-Luxe system with psychology-driven UX
 */
export function BottomNavBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-accent bg-background px-2 py-3 pb-6 lg:hidden"
      aria-label="Mobile navigation"
    >
      {/* Home */}
      <Link
        href="/"
        className="flex flex-col items-center gap-1 text-foreground transition-colors hover:text-primary active:text-primary"
      >
        <Home strokeWidth={1.5} size={24} />
        <span className="text-xs font-medium">Home</span>
      </Link>

      {/* Categories */}
      <Link
        href="/categories"
        className="flex flex-col items-center gap-1 text-foreground transition-colors hover:text-primary active:text-primary"
      >
        <LayoutGrid strokeWidth={1.5} size={24} />
        <span className="text-xs font-medium">Categories</span>
      </Link>

      {/* Cart with Badge */}
      <Link
        href="/cart"
        className="relative flex flex-col items-center gap-1 text-foreground transition-colors hover:text-primary active:text-primary"
      >
        <div className="relative">
          <ShoppingBag strokeWidth={1.5} size={24} />
          {/* Cart Badge - Notification Counter */}
          <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
            0
          </div>
        </div>
        <span className="text-xs font-medium">Cart</span>
      </Link>

      {/* Account */}
      <Link
        href="/account"
        className="flex flex-col items-center gap-1 text-foreground transition-colors hover:text-primary active:text-primary"
      >
        <User strokeWidth={1.5} size={24} />
        <span className="text-xs font-medium">Account</span>
      </Link>
    </nav>
  );
}
