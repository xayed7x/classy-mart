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
    <footer className="border-t border-light-accent dark:border-dark-accent bg-light-accent/30 dark:bg-dark-accent/30 py-16 sm:py-24">
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
            <p className="mt-4 font-sans text-sm text-light-accent-text dark:text-dark-accent-text">
              Redefining modern fashion with curated collections for the contemporary wardrobe.
            </p>
            
            {/* Social Media Icons */}
            <div className="mt-6 flex gap-4">
              <Link
                href="https://instagram.com/classymart"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light-text dark:text-dark-text hover:text-brand-red dark:hover:text-brand-green"
                aria-label="Instagram"
              >
                <Instagram strokeWidth={1.5} size={20} />
              </Link>
              <Link
                href="https://facebook.com/classymart"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light-text dark:text-dark-text hover:text-brand-red dark:hover:text-brand-green"
                aria-label="Facebook"
              >
                <Facebook strokeWidth={1.5} size={20} />
              </Link>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h3 className="font-heading text-base font-bold text-light-text dark:text-dark-text">
              Shop
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/category/t-shirts"
                  className="font-sans text-sm text-light-accent-text dark:text-dark-accent-text hover:text-light-text dark:hover:text-dark-text"
                >
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link
                  href="/category/shirts"
                  className="font-sans text-sm text-light-accent-text dark:text-dark-accent-text hover:text-light-text dark:hover:text-dark-text"
                >
                  Shirts
                </Link>
              </li>
              <li>
                <Link
                  href="/category/pants"
                  className="font-sans text-sm text-light-accent-text dark:text-dark-accent-text hover:text-light-text dark:hover:text-dark-text"
                >
                  Pants
                </Link>
              </li>
              <li>
                <Link
                  href="/category/panjabis"
                  className="font-sans text-sm text-light-accent-text dark:text-dark-accent-text hover:text-light-text dark:hover:text-dark-text"
                >
                  Panjabis
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: About */}
          <div>
            <h3 className="font-heading text-base font-bold text-light-text dark:text-dark-text">
              About
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/about"
                  className="font-sans text-sm text-light-accent-text dark:text-dark-accent-text hover:text-light-text dark:hover:text-dark-text"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="font-sans text-sm text-light-accent-text dark:text-dark-accent-text hover:text-light-text dark:hover:text-dark-text"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/journal"
                  className="font-sans text-sm text-light-accent-text dark:text-dark-accent-text hover:text-light-text dark:hover:text-dark-text"
                >
                  Journal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h3 className="font-heading text-base font-bold text-light-text dark:text-dark-text">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="font-sans text-sm text-light-accent-text dark:text-dark-accent-text hover:text-light-text dark:hover:text-dark-text"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-returns"
                  className="font-sans text-sm text-light-accent-text dark:text-dark-accent-text hover:text-light-text dark:hover:text-dark-text"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="font-sans text-sm text-light-accent-text dark:text-dark-accent-text hover:text-light-text dark:hover:text-dark-text"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <hr className="mt-12 border-light-accent dark:border-dark-accent" />
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Copyright Notice */}
          <p className="font-sans text-sm text-light-accent-text dark:text-dark-accent-text">
            © {currentYear} Classy Mart. All Rights Reserved.
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs text-light-accent-text dark:text-dark-accent-text">
              We Accept:
            </span>
            <div className="flex gap-2 font-sans text-xs font-medium text-light-text dark:text-dark-text">
              <span className="rounded border border-light-accent dark:border-dark-accent px-2 py-1">Visa</span>
              <span className="rounded border border-light-accent dark:border-dark-accent px-2 py-1">Mastercard</span>
              <span className="rounded border border-light-accent dark:border-dark-accent px-2 py-1">bKash</span>
              <span className="rounded border border-light-accent dark:border-dark-accent px-2 py-1">Nagad</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
