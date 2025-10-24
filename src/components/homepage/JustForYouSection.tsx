import { ProductCard } from "@/components/products/ProductCard";

interface JustForYouSectionProps {
  products: any[];
}

export function JustForYouSection({ products }: JustForYouSectionProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-heading text-foreground sm:text-3xl">
            Just for You
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
