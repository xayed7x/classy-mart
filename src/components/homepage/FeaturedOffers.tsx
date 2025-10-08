"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";

const promoCards = [
  {
    href: "/collection/new-arrivals",
    title: "New Collection Drop",
    cta: "Shop Now",
    image: "/images/shirt.png",
  },
  {
    href: "/collection/summer-essentials",
    title: "Summer Essentials",
    cta: "Discover More",
    image: "/images/polo-tshirt.png",
  },
  {
    href: "/collection/limited-edition",
    title: "Limited Edition",
    cta: "View Exclusive Items",
    image: "/images/pant.avif",
  },
  {
    href: "/collection/all-white",
    title: "All White Everything",
    cta: "Explore the Collection",
    image: "/images/panjabi.webp",
  },
];

export function FeaturedOffers() {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  return (
    <div className="hidden lg:block">
      <section className="py-12 bg-light-accent/50 dark:bg-aura-accent-border/50">
        <div className="container mx-auto">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {promoCards.map((card, index) => (
                  <div key={index} className="flex-grow-0 flex-shrink-0 basis-1/3 pl-6">
                    <Link href={card.href}>
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="relative z-10 h-full flex flex-col justify-end p-6 text-aura-soft-white">
                          <h2 className="font-bold text-2xl">
                            {card.title}
                          </h2>
                          <div className="mt-2 inline-block self-start bg-aura-soft-white text-aura-black text-sm font-semibold px-4 py-2 rounded-full">
                            {card.cta}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </section>
    </div>
  );
}