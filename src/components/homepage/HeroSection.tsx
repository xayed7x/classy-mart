"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";

const promoCards = [
  {
    href: "/collection/new-arrivals",
    title: "New Collection Drop",
    cta: "Shop Now",
    image: "/images/shirt1.png",
  },
  {
    href: "/collection/summer-essentials",
    title: "Summer Essentials",
    cta: "Discover More",
    image: "/images/tshirt2.png",
  },
  {
    href: "/collection/limited-edition",
    title: "Limited Edition",
    cta: "View Exclusive Items",
    image: "/images/shirt2.png",
  },
  {
    href: "/collection/all-white",
    title: "All White Everything",
    cta: "Explore the Collection",
    image: "/images/shirt3.png",
  },
];

export function HeroSection() {
  const [mobileEmblaRef] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
  });
  const [desktopEmblaRef] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  return (
    <>
      {/* Mobile: Flow UI Carousel */}
      <div className="lg:hidden overflow-hidden" ref={mobileEmblaRef}>
        <div className="flex">
          {promoCards.map((card, index) => (
            <div key={index} className="flex-grow-0 flex-shrink-0 basis-4/5 ml-4">
              <Link href={card.href}>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative z-10 h-full flex flex-col justify-end p-6 text-dark-text">
                    <h2 className="font-bold text-2xl md:text-3xl">
                      {card.title}
                    </h2>
                    <div className="mt-2 inline-block self-start bg-dark-text text-dark-bg text-sm font-semibold font-sans px-4 py-2 rounded-full">
                      {card.cta}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Cinematic Showcase */}
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
            <h1 className="text-6xl font-heading text-center text-dark-text">
              Style, Redefined.
            </h1>
          </div>
        </section>
      </div>
    </>
  );
}