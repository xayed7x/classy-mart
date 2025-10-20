"use client";

import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { StickyActionFooter } from "./StickyActionFooter";
import { ProductPageContent } from "./ProductPageContent";

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
        <Link
          href="/cart"
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-accent"
          aria-label="View cart"
        >
          <ShoppingBag size={20} strokeWidth={2} />
        </Link>
      </div>

      {/* Page Content */}
      <ProductPageContent product={product} />

      {/* Mobile-Only Sticky Action Footer */}
      <StickyActionFooter product={product} />
    </div>
  );
}
