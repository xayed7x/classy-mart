"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  if (!product || !product.slug) {
    return null;
  }

  const { name, slug, price, originalPrice, images, rating, reviewCount, salePercentage } = product;
  const mainImage = images?.main || "/images/placeholder.png";
  const hoverImage = images?.gallery?.[0] || mainImage; // Use first gallery image for hover, or mainImage

  return (
    <div className="group flex h-full flex-col rounded-lg border border-border dark:border-zinc-800 p-4">
      <Link href={`/products/${slug}`} className="block flex-1">
        <div className="relative aspect-[3/4] overflow-hidden rounded-md">
          {/* Main Image */}
          <Image
            src={mainImage}
            alt={name || "Product Image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-all duration-300 lg:group-hover:scale-105 lg:group-hover:opacity-0"
          />
          {/* Hover Image (Desktop Only) */}
          {hoverImage && hoverImage !== mainImage && (
            <Image
              src={hoverImage}
              alt={`${name || "Product Image"} - Hover`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="absolute left-0 top-0 object-cover opacity-0 transition-all duration-300 lg:group-hover:scale-105 lg:group-hover:opacity-100"
            />
          )}

          {/* Sale Badge */}
          {salePercentage && salePercentage > 0 && (
            <div className="absolute left-2 top-2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-black">
              -{salePercentage}%
            </div>
          )}

          {/* Wishlist Button */}
          <button
            className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-muted-foreground transition-colors hover:bg-background hover:text-primary"
            aria-label="Add to wishlist"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart strokeWidth={1.5} size={16} />
          </button>
        </div>

        <div className="mt-4 flex flex-1 flex-col text-left">
          {/* Product Name */}
          <h3 className="font-heading text-base font-bold text-foreground truncate">
            {name}
          </h3>

          {/* Star Rating */}
          <div className="mt-1 flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    rating && i < rating
                      ? "fill-primary text-primary"
                      : "fill-none text-muted-foreground"
                  }
                />
              ))}
            </div>
            {reviewCount && (
              <span className="text-xs text-muted-foreground">
                ({reviewCount})
              </span>
            )}
          </div>

          {/* Action Row: Price + Explore Link */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="font-sans text-lg font-bold text-foreground">
                BDT{price}
              </p>
              {originalPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  BDT{originalPrice.toFixed(2)}
                </p>
              )}
            </div>
            <div className="relative h-10 w-24 hidden lg:flex items-center justify-center rounded-full bg-green-500 px-4 py-2 text-sm font-bold text-rich-black font-heading transition-all duration-300 group-hover:bg-green-600">
              Explore
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}