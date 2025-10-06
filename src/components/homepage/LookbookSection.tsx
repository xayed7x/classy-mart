"use client";

import Image from "next/image";
import Link from "next/link";
import { Parallax } from "react-scroll-parallax";

/**
 * Lookbook Section Component - Immersive Brand Story
 * 
 * Dual-UI Design:
 * Mobile: Elegant story card with aspect-[4/5] (Flow UI)
 * Desktop: Self-contained parallax background (Immersive Editorial)
 * 
 * Purpose: Create "wow" moment that sells lifestyle, not just products
 * 
 * Fixed: Parallax effect now contained within section, no background leakage
 */

export function LookbookSection() {
  return (
    <section className="relative overflow-hidden lg:h-[70vh] mt-16 sm:mt-24">
      {/* Mobile View Container */}
      <div className="px-4 lg:hidden">
        {/* MOBILE VIEW - Story Card */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
          {/* Background Image */}
          <Image
            src="/images/polo-tshirt.png"
            alt="Classy Mart Lookbook"
            fill
            className="object-cover"
            sizes="100vw"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <h2 className="font-heading text-3xl font-bold text-white">
              Engineered for the Modern Wardrobe
            </h2>
            <p className="mt-4 font-sans text-base text-white/90">
              Where timeless design meets contemporary living.
            </p>
            <Link
              href="/about"
              className="mt-6 rounded-full bg-white px-8 py-3 font-sans text-sm font-bold uppercase tracking-wide text-foreground transition-transform hover:scale-105 active:scale-95"
            >
              Discover Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW - Contained Parallax Background */}
      <div className="relative hidden h-full lg:block">
        {/* Parallax Background Image */}
        <Parallax speed={-15} className="absolute inset-0">
          <Image
            src="/images/shirt.png"
            alt="Classy Mart Lookbook Background"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </Parallax>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Floating Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
          <h2 className="font-heading text-6xl font-bold text-white lg:text-7xl">
            Engineered for the Modern Wardrobe
          </h2>
          <p className="mt-6 max-w-2xl font-sans text-xl text-white/90">
            Where timeless design meets contemporary living. Experience fashion that transcends trends.
          </p>
          <Link
            href="/about"
            className="mt-8 rounded-full bg-white px-10 py-4 font-sans text-base font-bold uppercase tracking-wide text-foreground transition-transform hover:scale-105 active:scale-95"
          >
            Discover Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
