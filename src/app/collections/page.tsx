import { getAllProducts } from "@/lib/contentful";
import { CollectionPageContent } from "@/components/collections/CollectionPageContent";

export default async function CollectionsPage() {
  const products = await getAllProducts();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-foreground">
            All Collections
          </h1>
          <p className="mt-4 text-lg font-sans text-muted-foreground max-w-2xl mx-auto">
            Discover our complete range of premium fashion collections, curated for the modern individual.
          </p>
        </div>
        <CollectionPageContent initialProducts={products} />
      </div>
    </main>
  );
}
