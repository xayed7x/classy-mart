import Image from "next/image";
import Link from "next/link";

// This data is correct.
const collections = [
  {
    handle: "essential-tees",
    title: "Essential Tees",
    imageUrl: "/images/shirt.png",
  },
  {
    handle: "outerwear",
    title: "Outerwear",
    imageUrl: "/images/polo-tshirt.png",
  },
  {
    handle: "accessories",
    title: "Accessories",
    imageUrl: "/images/pant.avif",
  },
];

export function FeaturedCollections(): React.ReactElement {
  return (
    <section
      aria-labelledby="featured-collections-heading"
      className="bg-background py-12 sm:py-16"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            id="featured-collections-heading"
            className="font-heading text-3xl font-bold uppercase tracking-tight text-text sm:text-4xl"
          >
            Shop By Collection
          </h2>
          <p className="font-sans mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Explore our curated collections, designed with purpose and passion.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.handle}
              href={`/collections/${collection.handle}`}
              className="group relative"
            >
              {/* THE CHANGE IS ON THE NEXT LINE */}
              <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200">
                <Image
                  src={collection.imageUrl}
                  alt={`A model wearing an item from the ${collection.title} collection.`}
                  fill
                  className="object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent">
                <h3 className="font-heading p-6 text-2xl font-bold text-white">
                  {collection.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
