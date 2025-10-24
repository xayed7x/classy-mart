"use client";

import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { StickyActionFooter } from "./StickyActionFooter";
import { ProductPageContent } from "./ProductPageContent";
import { useCartDrawerStore } from "@/stores/cart-drawer-store";
import { useCartStore } from "@/stores/cart-store";

/**
 * Product Page Layout Component
 * 
 * Dedicated layout for PDP that replaces main site header/footer
 * Provides mobile-focused header and sticky action footer
 */

interface ProductPageLayoutProps {
  product: any;
}

export function ProductPageLayout({ product }: ProductPageLayoutProps) {
  const { open } = useCartDrawerStore();
  const { cartItems } = useCartStore();
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background shadow-lg">
      {/* Mobile-Only Focused Header */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-accent bg-background px-4 py-2 lg:hidden">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-accent"
          aria-label="Go back"
        >
          <ArrowLeft size={20} strokeWidth={2} />
        </Link>
        <button
          onClick={open}
          className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-accent"
          aria-label="View cart"
        >
          <ShoppingBag size={20} strokeWidth={2} />
          {totalItems > 0 && (
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-black">
              {totalItems}
            </div>
          )}
        </button>
      </div>

      {/* Page Content */}
      <ProductPageContent product={product} />

      {/* Mobile-Only Sticky Action Footer */}
      <StickyActionFooter product={product} stock={product.stock} />
    </div>
  );
}
