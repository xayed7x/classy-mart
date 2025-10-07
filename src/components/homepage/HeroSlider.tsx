"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

/**
 * Hero Slider Component - Swipeable Promotional Carousel
 * 
 * Features:
 * - Horizontal swipe navigation
 * - "Peek" preview of next card
 * - Immersive promotional content
 * - Touch-optimized for mobile
 * 
 * Design: Street-Luxe system with cinematic hero imagery
 */

// Hardcoded promotional data
const promoSlides = [
  {
    id: 1,
    imageUrl: "/images/shirt.png",
    title: "New Collection Drop",
    ctaText: "Shop Now",
  },
  {
    id: 2,
    imageUrl: "/images/polo-tshirt.png",
    title: "Summer Essentials",
    ctaText: "Explore",
  },
  {
    id: 3,
    imageUrl: "/images/pant.avif",
    title: "Limited Edition",
    ctaText: "Discover",
  },
];

export function HeroSlider() {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: false,
  });

  return (
    <section className="bg-light-bg dark:bg-dark-bg px-4">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {promoSlides.map((slide) => (
            <div
              key={slide.id}
              className="relative min-w-[85%] flex-shrink-0 sm:min-w-[70%] md:min-w-[60%]"
            >
              {/* Promo Card */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                {/* Background Image */}
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 85vw, (max-width: 768px) 70vw, 60vw"
                  priority={slide.id === 1}
                />

                {/* Dark Overlay for Text Contrast */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <h2 className="mb-4 font-heading text-3xl font-bold text-dark-text sm:text-4xl">
                    {slide.title}
                  </h2>
                  <button className="rounded-full bg-brand-red text-white dark:bg-brand-green dark:text-dark-bg px-8 py-3 font-sans text-sm font-bold uppercase tracking-wide transition-transform hover:scale-105 active:scale-95">
                    {slide.ctaText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}