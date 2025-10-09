import { ProductCard, Product } from "@/components/products/ProductCard";

// This mock data would eventually come from an API call.
const trendingProducts: Product[] = [
  {
    id: 1,
    handle: "satoshi-sweatshirt",
    name: "Satoshi Sweatshirt",
    price: 120.0,
    imageUrl: "/images/shirt.png", // Placeholder image path
    size: "M",
    color: "Black",
  },
  {
    id: 2,
    handle: "inter-tee-black",
    name: "Inter Tee - Black",
    price: 45.0,
    imageUrl: "/images/polo-tshirt.png", // Placeholder image path
    size: "L",
    color: "Black",
  },
  {
    id: 3,
    handle: "luxe-cargo-pants",
    name: "Luxe Cargo Pants",
    price: 185.0,
    imageUrl: "/images/pant.avif", // Placeholder image path
    size: "32",
    color: "Khaki",
  },
  {
    id: 4,
    handle: "classy-mart-cap",
    name: "Classy Mart Cap",
    price: 35.0,
    imageUrl: "/images/panjabi.webp", // Placeholder image path
    size: "One Size",
    color: "Navy",
  },
];

/**
 * Renders a section showcasing trending products.
 *
 * @returns {React.ReactElement} The TrendingProducts component.
 */
export function TrendingProducts(): React.ReactElement {
  return (
    <section
      aria-labelledby="trending-products-heading"
      className="bg-light-bg dark:bg-dark-bg py-12 sm:py-16"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            id="trending-products-heading"
            className="font-heading text-3xl font-bold uppercase tracking-tight text-light-text dark:text-dark-text sm:text-4xl"
          >
            Trending Now
          </h2>
          <p className="font-sans mx-auto mt-4 max-w-2xl text-lg text-light-accent-text dark:text-dark-accent-text">
            Discover the pieces everyone is talking about this season.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {trendingProducts.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
