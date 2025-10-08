import Link from "next/link";
import Image from "next/image";
import React from "react";

// This is our hardcoded data. Later, this will come from a CMS.
// Ensure you have images at these paths in your /public folder.
const categories = [
  {
    id: 1,
    name: "T-SHIRTS",
    slug: "t-shirts",
    imageUrl: "/images/polo-tshirt.png",
  },
  {
    id: 2,
    name: "SHIRTS",
    slug: "shirts",
    imageUrl: "/images/shirt.png",
  },
  {
    id: 3,
    name: "PANTS",
    slug: "pants",
    imageUrl: "/images/pant.avif",
  },
  {
    id: 4,
    name: "PANJABIS",
    slug: "panjabis",
    imageUrl: "/images/panjabi.webp",
  },
];

const FeaturedCategories = () => {
  return (
    <section>
      <div className="lg:hidden mt-8">
        <div className="px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading text-light-text dark:text-aura-soft-white">
              Categories
            </h2>
            <Link
              href="/collection"
              className="text-sm font-sans text-light-accent-text dark:text-aura-gold transition-colors hover:text-light-text dark:hover:text-aura-soft-white"
            >
              See all
            </Link>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/collection/${category.slug}`}
                className="block whitespace-nowrap rounded-full border border-light-accent dark:border-aura-gold bg-light-bg dark:bg-aura-black px-4 py-2 text-sm font-medium font-sans text-light-text dark:text-aura-gold transition-colors hover:bg-light-accent/50 dark:hover:bg-dark-accent/50"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="text-center">
          <h2 className="text-4xl font-bold font-heading text-light-text dark:text-aura-soft-white sm:text-5xl">
            Shop by Collection
          </h2>
          <p className="mt-4 font-sans text-base text-light-accent-text dark:text-aura-gold">
            Explore our curated collections, designed with purpose and passion.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/collection/${category.slug}`}
              className="group relative overflow-hidden rounded-xl"
            >
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={category.imageUrl}
                  alt={`Image for ${category.name} category`}
                  fill
                  className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <h3 className="text-xl font-bold font-heading text-aura-soft-white">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
