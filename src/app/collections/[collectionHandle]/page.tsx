"use client";
import { useState, useEffect } from "react";
import FilterSidebar from "@/components/collections/FilterSidebar";
import { ProductCard, Product } from "@/components/products/ProductCard";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

// Mock product data
const mockProducts: Product[] = [
  { id: 1, name: "Classic White T-Shirt", size: "M", color: "White", handle: "classic-white-t-shirt", price: 25, imageUrl: "/images/shirt1.png" },
  { id: 2, name: "Black Denim Jeans", size: "32", color: "Black", handle: "black-denim-jeans", price: 75, imageUrl: "/images/pant.avif" },
  { id: 3, name: "Blue Striped Shirt", size: "L", color: "Blue", handle: "blue-striped-shirt", price: 45, imageUrl: "/images/shirt2.png" },
  { id: 4, name: "Red Polo Shirt", size: "M", color: "Red", handle: "red-polo-shirt", price: 35, imageUrl: "/images/polo-tshirt.png" },
  { id: 5, name: "Gray Chinos", size: "34", color: "Gray", handle: "gray-chinos", price: 60, imageUrl: "/images/shirt3.png" },
  { id: 6, name: "White Sneakers", size: "10", color: "White", handle: "white-sneakers", price: 80, imageUrl: "/images/tshirt2.png" },
];

const CollectionPage = () => {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [activeFilters, setActiveFilters] = useState<{ size: string[]; color: string[] }>({
    size: [],
    color: [],
  });
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      const filterValues = newFilters[filterType];
      if (filterValues.includes(value)) {
        newFilters[filterType] = filterValues.filter((item) => item !== value);
      } else {
        filterValues.push(value);
      }
      return newFilters;
    });
  };

  useEffect(() => {
    let tempProducts = [...products];

    if (activeFilters.size.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        activeFilters.size.includes(product.size)
      );
    }

    if (activeFilters.color.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        activeFilters.color.includes(product.color)
      );
    }

    setFilteredProducts(tempProducts);
  }, [activeFilters, products]);

  const filterOptions = {
    size: ["M", "L", "32", "34", "10"],
    color: ["White", "Black", "Blue", "Red", "Gray"],
  };

  return (
    <div>
      <div className="container mx-auto">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Products</h1>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent position="left" size="sm">
              <FilterSidebar
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
                onClose={() => setIsSheetOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-4 p-4">
          <div className="col-span-1">
            <FilterSidebar
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
              onClose={() => {}}
            />
          </div>
          <div className="col-span-3">
            <div className="grid grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Product Grid */}
        <div className="lg:hidden p-4">
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
