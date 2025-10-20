"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Filter } from "lucide-react";
import { ProductGrid } from "@/components/collections/ProductGrid";
import FilterSidebar from "@/components/collections/FilterSidebar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/Sheet";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import Link from "next/link";
import { ProductGridSkeleton } from "@/components/collections/ProductGridSkeleton";

// Category configuration
const CATEGORIES = [
  { name: "All", slug: "all" },
  { name: "T-Shirts", slug: "t-shirts" },
  { name: "Shirts", slug: "shirts" },
  { name: "Pants", slug: "pants" },
  { name: "Panjabis", slug: "panjabis" },
];

export default function CollectionPage() {
  const params = useParams();
  const collectionHandle = params.collectionHandle as string;

  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeFilters, setActiveFilters] = useState<{ sizes: string[]; colors: string[] }>({ sizes: [], colors: [] });
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data fetching
  useEffect(() => {
    if (!collectionHandle) return;

    async function fetchProducts() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/collections/${collectionHandle}`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const result = await response.json();
        setProducts(result.data);
        setFilteredProducts(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [collectionHandle]);

  // Filter logic
  useEffect(() => {
    let result = [...products];
    if (activeFilters.sizes.length > 0) {
      result = result.filter(p => p.sizes.some(s => activeFilters.sizes.includes(s)));
    }
    if (activeFilters.colors.length > 0) {
      result = result.filter(p => p.colors.some(c => activeFilters.colors.includes(c)));
    }
    setFilteredProducts(result);
  }, [activeFilters, products]);

  // Filter change handler
  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => {
      const key = filterType === "size" ? "sizes" : "colors";
      const currentValues = prev[key];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [key]: newValues };
    });
    // Close sheet on mobile after applying a filter
    if (window.innerWidth < 1024) {
      setIsSheetOpen(false);
    }
  };

  const getCollectionTitle = () => {
    if (collectionHandle === "all") return "All Products";
    const category = CATEGORIES.find(c => c.slug === collectionHandle);
    return category?.name || collectionHandle;
  };

  const getAllSizes = () => [...new Set(products.flatMap(p => p.sizes))];
  const getAllColors = () => [...new Set(products.flatMap(p => p.colors))];

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Pills */}
        <div className="mb-8 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/collections/${category.slug}`}
                className={cn(
                  "whitespace-nowrap rounded-full border px-6 py-2 text-sm font-medium font-sans transition-colors",
                  collectionHandle === category.slug
                    ? "bg-primary text-primary-foreground dark:bg-primary dark:text-rich-black border-primary"
                    : "bg-background text-foreground border-border hover:bg-secondary"
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-foreground">
            {getCollectionTitle()}
          </h1>
          <p className="mt-2 text-lg text-foreground font-sans">
            We have {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsSheetOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <Filter size={20} strokeWidth={2} />
            Filters
            {(activeFilters.sizes.length > 0 || activeFilters.colors.length > 0) && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {activeFilters.sizes.length + activeFilters.colors.length}
              </span>
            )}
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-4">
              <FilterSidebar
                filterOptions={{
                  size: getAllSizes(),
                  color: getAllColors(),
                }}
                onFilterChange={handleFilterChange}
                onClose={() => {}} // Not needed for desktop
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div>
            {isLoading ? <ProductGridSkeleton /> : <ProductGrid products={filteredProducts} />}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent position="left" size="lg">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <FilterSidebar
            filterOptions={{
              size: getAllSizes(),
              color: getAllColors(),
            }}
            onFilterChange={handleFilterChange}
            onClose={() => setIsSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </main>
  );
}
