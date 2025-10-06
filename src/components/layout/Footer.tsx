import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";

/**
 * Main Site Footer Component
 * 
 * Purpose: Comprehensive navigation, trust-building, and information hub
 * 
 * Structure:
 * - 4-column grid (Brand, Shop, About, Support)
 * - Copyright section with payment methods
 */

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-accent bg-accent/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
          {/* Column 1: Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Classy Mart"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-4 font-sans text-sm text-muted-foreground">
              Redefining modern fashion with curated collections for the contemporary wardrobe.
            </p>
            
            {/* Social Media Icons */}
            <div className="mt-6 flex gap-4">
              <Link
                href="https://instagram.com/classymart"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground transition-colors hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram strokeWidth={1.5} size={20} />
              </Link>
              <Link
                href="https://facebook.com/classymart"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground transition-colors hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook strokeWidth={1.5} size={20} />
              </Link>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">
              Shop
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/category/t-shirts"
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link
                  href="/category/shirts"
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Shirts
                </Link>
              </li>
              <li>
                <Link
                  href="/category/pants"
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Pants
                </Link>
              </li>
              <li>
                <Link
                  href="/category/panjabis"
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Panjabis
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: About */}
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">
              About
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/about"
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/journal"
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Journal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-returns"
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <hr className="mt-12 border-accent" />
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Copyright Notice */}
          <p className="font-sans text-sm text-muted-foreground">
            © {currentYear} Classy Mart. All Rights Reserved.
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs text-muted-foreground">
              We Accept:
            </span>
            <div className="flex gap-2 font-sans text-xs font-medium text-foreground">
              <span className="rounded border border-accent px-2 py-1">Visa</span>
              <span className="rounded border border-accent px-2 py-1">Mastercard</span>
              <span className="rounded border border-accent px-2 py-1">bKash</span>
              <span className="rounded border border-accent px-2 py-1">Nagad</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
