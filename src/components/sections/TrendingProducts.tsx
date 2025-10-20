import { ProductCard } from "@/components/products/ProductCard";
import { Product } from "@/types/product";

// TODO: Fetch trending products from Contentful
const trendingProducts: Product[] = [];

/**
 * Renders a section showcasing trending products.
 *
 * @returns {React.ReactElement} The TrendingProducts component.
 */
export function TrendingProducts(): React.ReactElement {
  // Don't render if no products
  if (trendingProducts.length === 0) {
    return <></>;
  }

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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
