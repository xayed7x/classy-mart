import { ProductCard } from "@/components/products/ProductCard";

interface TrendingProductsProps {
  products: any[];
}

export function TrendingProducts({ products }: TrendingProductsProps) {
  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Trending Now
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}