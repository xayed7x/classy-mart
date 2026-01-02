"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { getOptimizedCloudinaryUrl } from "@/lib/utils";

interface HeroSectionProps {
  offers: any[];
}

export function HeroSection({ offers }: HeroSectionProps) {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
  });

  const renderOfferCard = (offer: any, index: number) => (
    <div key={index} className="flex-grow-0 flex-shrink-0 basis-4/5 ml-4">
      <Link href={offer.ctaLink || "#"}>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
          <Image
            src={getOptimizedCloudinaryUrl(offer.image, { width: 600 })}
            alt={offer.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 h-full flex flex-col justify-end p-6">
            <h2 className="font-bold font-heading text-3xl md:text-4xl text-[#F0EBE3]">
              {offer.title}
            </h2>
            <div className="mt-2 inline-block self-start bg-overlay-button text-[#1A1A1A] backdrop-blur-sm text-sm font-semibold font-sans px-4 py-2 rounded-full">
              {offer.ctaButtonText}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  const renderSkeletonCard = (index: number) => (
    <div key={index} className="flex-grow-0 flex-shrink-0 basis-4/5 ml-4 animate-pulse">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-300 dark:bg-gray-700">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col justify-end p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile View (lg:hidden) */}
      <div className="lg:hidden overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {offers && offers.length > 0
            ? offers.map(renderOfferCard)
            : Array.from({ length: 3 }).map((_, i) => renderSkeletonCard(i))}
        </div>
      </div>

      {/* Desktop View (hidden lg:block) */}
      <div className="hidden lg:block">
        <section className="relative h-[80vh] w-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            src="/videos/hero-video-optimized.mp4"
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="relative z-20 h-full flex flex-col justify-center items-center py-12">
            <h1 className="text-6xl font-heading text-center text-white">
              Style, Redefined.
            </h1>
          </div>
        </section>
      </div>
    </>
  );
}
