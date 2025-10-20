"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  product: any;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
  const { main: mainImage, gallery: galleryImages } = product.images;
  const allImages = [mainImage, ...(galleryImages || [])].filter(Boolean);
  const productName = product.name;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [featuredImage, setFeaturedImage] = useState(allImages[0]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setFeaturedImage(allImages[emblaApi.selectedScrollSnap()]);
  }, [emblaApi, allImages]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      {/* Mobile Carousel */}
      <div className="lg:hidden">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {allImages.map((src: string, index: number) => (
              <div className="relative flex-[0_0_100%] aspect-[4/3]" key={index}>
                <Image
                  src={src}
                  alt={`${productName} image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1023px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {allImages.map((_: string, index: number) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 w-2 rounded-full ${selectedIndex === index ? 'bg-white' : 'bg-gray-400'}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Gallery */}
      <div className="hidden lg:flex flex-col gap-4">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
          <Image
            src={featuredImage}
            alt={`Featured image of ${productName}`}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="50vw"
          />
        </div>
        <div className="grid grid-cols-6 gap-2">
          {allImages.map((src: string, index: number) => (
            <button
              key={index}
              onClick={() => setFeaturedImage(src)}
              className={cn(
                'relative aspect-square w-full overflow-hidden rounded-md transition-all',
                'ring-offset-2 ring-offset-background',
                featuredImage === src ? 'ring-2 ring-primary' : 'hover:opacity-90'
              )}
            >
              <Image
                src={src}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="8vw"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};