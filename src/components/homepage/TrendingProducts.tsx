"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Plus } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

// Hardcoded trending products data with complete attributes
const products = [
  {
    id: 1,
    name: "Classic White Tee",
    category: "T-Shirts",
    price: 29.99,
    originalPrice: 39.99,
    salePercentage: 25,
    rating: 4.5,
    reviewCount: 128,
    image1: "/images/polo-tshirt.png",
    image2: "/images/tshirt2.png",
    slug: "classic-white-tee",
  },
  {
    id: 2,
    name: "Slim Fit Oxford Shirt",
    category: "Shirts",
    price: 49.99,
    originalPrice: null,
    salePercentage: null,
    rating: 4.8,
    reviewCount: 95,
    image1: "/images/shirt.png",
    image2: "/images/shirt1.png",
    slug: "slim-fit-oxford-shirt",
  },
  {
    id: 3,
    name: "Tailored Chinos",
    category: "Pants",
    price: 59.99,
    originalPrice: 79.99,
    salePercentage: 20,
    rating: 4.6,
    reviewCount: 203,
    image1: "/images/pant.avif",
    image2: "/images/shirt2.png",
    slug: "tailored-chinos",
  },
  {
    id: 4,
    name: "Premium Cotton Panjabi",
    category: "Panjabis",
    price: 79.99,
    originalPrice: null,
    salePercentage: null,
    rating: 5.0,
    reviewCount: 67,
    image1: "/images/panjabi.webp",
    image2: "/images/shirt3.png",
    slug: "premium-cotton-panjabi",
  },
  {
    id: 5,
    name: "Graphic Print Tee",
    category: "T-Shirts",
    price: 34.99,
    originalPrice: 44.99,
    salePercentage: 22,
    rating: 4.3,
    reviewCount: 156,
    image1: "/images/tshirt2.png",
    image2: "/images/polo-tshirt.png",
    slug: "graphic-print-tee",
  },
  {
    id: 6,
    name: "Linen Casual Shirt",
    category: "Shirts",
    price: 54.99,
    originalPrice: null,
    salePercentage: null,
    rating: 4.7,
    reviewCount: 84,
    image1: "/images/shirt1.png",
    image2: "/images/shirt.png",
    slug: "linen-casual-shirt",
  },
  {
    id: 7,
    name: "Straight Leg Denim",
    category: "Pants",
    price: 69.99,
    originalPrice: null,
    salePercentage: null,
    rating: 4.4,
    reviewCount: 112,
    image1: "/images/shirt2.png",
    image2: "/images/pant.avif",
    slug: "straight-leg-denim",
  },
  {
    id: 8,
    name: "Embroidered Panjabi",
    category: "Panjabis",
    price: 89.99,
    originalPrice: 109.99,
    salePercentage: 18,
    rating: 4.9,
    reviewCount: 143,
    image1: "/images/shirt3.png",
    image2: "/images/panjabi.webp",
    slug: "embroidered-panjabi",
  },
];

function ProductCard({ product }: { product: typeof products[0] }) {
  return (
    <div className="group rounded-lg border border-light-accent dark:border-dark-accent p-2">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
        <Image
          src={product.image1}
          alt={product.name}
          fill
          className="object-cover transition-all duration-300 lg:group-hover:scale-105 lg:group-hover:opacity-0"
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
        />
        <Image
          src={product.image2}
          alt={`${product.name} - alternate view`}
          fill
          className="absolute inset-0 object-cover opacity-0 transition-all duration-300 lg:group-hover:scale-105 lg:group-hover:opacity-100"
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.salePercentage && (
          <div className="absolute left-2 top-2 rounded-full bg-brand-red px-3 py-1 text-xs font-bold text-white dark:bg-brand-green dark:text-dark-bg">
            -{product.salePercentage}%
          </div>
        )}
        <button
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-light-bg/90 dark:bg-dark-bg/90 text-light-text dark:text-dark-text transition-colors hover:bg-light-bg dark:hover:bg-dark-bg hover:text-brand-red dark:hover:text-brand-green"
          aria-label="Add to wishlist"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart strokeWidth={1.5} size={16} />
        </button>
      </div>
      <Link href={`/product/${product.slug}`} className="mt-2 block text-left">
        <h3 className="font-heading text-base font-bold text-light-text dark:text-dark-text text-left">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-left">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(product.rating)
                    ? "fill-brand-red text-brand-red dark:fill-brand-green dark:text-brand-green"
                    : "fill-none text-light-accent-text dark:text-dark-accent-text"
                }
              />
            ))}
          </div>
          <span className="text-xs text-light-accent-text dark:text-dark-accent-text">
            ({product.reviewCount})
          </span>
        </div>
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <div>
          <p className="font-sans text-lg font-bold text-light-text dark:text-dark-text">
            ${product.price.toFixed(2)}
          </p>
          {product.originalPrice && (
            <p className="text-sm text-light-accent-text dark:text-dark-accent-text line-through">
              ${product.originalPrice.toFixed(2)}
            </p>
          )}
        </div>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-light-text dark:bg-dark-text text-light-bg dark:text-dark-bg transition-transform hover:scale-110 active:scale-95"
          aria-label="Quick add to cart"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Plus strokeWidth={2} size={20} />
        </button>
      </div>
    </div>
  );
}

export function TrendingProducts() {
  const [emblaRef] = useEmblaCarousel({
    loop: false,
    align: "start",
    dragFree: true,
  });

  return (
    <section className="w-full bg-light-accent/50 dark:bg-dark-accent/50 mt-0 lg:mt-24 pb-12 md:pb-24 lg:pb-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col lg:items-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-heading tracking-tighter sm:text-5xl mb-2 lg:text-center">
              Trending Now
            </h2>
            <p className="hidden lg:block max-w-[900px] text-light-accent-text dark:text-dark-accent-text md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed lg:text-center">
              Discover our most popular and best-selling items.
            </p>
          </div>
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden mt-2">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {products.map((product) => (
                <div className="flex-[0_0_80%] sm:flex-[0_0_50%] p-2" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-4 gap-8 mt-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}