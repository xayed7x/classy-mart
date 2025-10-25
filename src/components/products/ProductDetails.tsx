'use client';

import { Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { useCartStore } from '@/stores/cart-store';
import { useCartDrawerStore } from '@/stores/cart-drawer-store';
import { useProductPageStore } from '@/stores/product-page-store';

interface ProductDetailsProps {
  product: any;
  stock: number;
  selectedImage: string;
}

// Stock Indicator Component
function StockIndicator({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
        <p className="text-red-500 font-bold font-sans">Out of Stock</p>
      </div>
    );
  }
  if (stock <= 10) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
        <p className="text-yellow-600 dark:text-yellow-500 font-semibold font-sans">Low Stock - Only {stock} left!</p>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Check size={18} className="text-green-500" />
      <p className="text-green-600 dark:text-green-500 font-semibold font-sans">In Stock</p>
    </div>
  );
}

export function ProductDetails({ product, stock, selectedImage }: ProductDetailsProps) {
  const { selectedSize, setSelectedSize, selectedColor, setSelectedColor } = useProductPageStore();
  const addToCart = useCartStore((state) => state.addToCart);

  // Type guard to check if selectedColor is a swatch object
  const isSwatchObject = (color: any): color is { name: string; hex: string } => {
    return color && typeof color === 'object' && 'name' in color && 'hex' in color;
  };

  const handleAddToCart = () => {
    // Only add to cart if size is selected (and color if product has colorSwatches)
    if (!selectedSize) return;
    if (product.colorSwatches && product.colorSwatches.length > 0 && !selectedColor) return;

    console.log('Adding to cart - selectedColor:', selectedColor);
    console.log('Adding to cart - selectedImage:', selectedImage);
    console.log('Is swatch object?', isSwatchObject(selectedColor));
    
    addToCart({
      ...product,
      size: selectedSize,
      color: selectedColor,
      image: selectedImage, // THE CRITICAL FIX: Use the currently displayed image
      quantity: 1,
    });
    useCartDrawerStore.getState().open();
  };

  // Check if button should be disabled
  const isDisabled = !selectedSize || (product.colorSwatches && product.colorSwatches.length > 0 && !selectedColor) || stock <= 0;


  return (
    <div className="font-sans bg-background text-foreground">
      {/* Mobile View */}
      <div className="p-4 lg:hidden">
        <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
          {product.name}
        </h1>

        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={cn(
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-sans text-muted-foreground ml-1">
            ({product.reviewCount} Reviews)
          </span>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <p className="text-2xl font-bold font-sans text-foreground">
            BDT{product.price}
          </p>
          {product.originalPrice && (
            <p className="text-lg font-sans text-muted-foreground line-through">
              BDT{product.originalPrice}
            </p>
          )}
        </div>

        <div className="mt-6">
          <StockIndicator stock={stock} />
        </div>
        <div className="mt-6 space-y-5">
          <div className="flex items-center gap-4">
            <p className="w-12 font-sans font-medium text-foreground">
              Size
            </p>
            <div className="flex flex-1 gap-2">
              {product.sizes.map((size: string) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? 'default' : 'outline'}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'h-10 w-10 flex-shrink-0 rounded-full text-sm',
                    selectedSize === size && 'bg-primary text-primary-foreground dark:bg-primary dark:text-rich-black'
                  )}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {product.colorSwatches && product.colorSwatches.length > 0 && (
            <div className="flex items-center gap-4">
              <p className="w-12 font-sans font-medium text-foreground">
                Color
              </p>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  {product.colorSwatches.map((swatch: { name: string; hex: string }) => (
                    <button
                      key={swatch.name}
                      onClick={() => setSelectedColor(swatch)}
                      className={cn(
                        'h-10 w-10 rounded-full border-2 transition-all',
                        isSwatchObject(selectedColor) && selectedColor.name === swatch.name
                          ? 'border-primary ring-2 ring-primary ring-offset-2'
                          : 'border-gray-300 dark:border-gray-600'
                      )}
                      aria-label={`Select color ${swatch.name}`}
                      title={swatch.name}
                    >
                      <span
                        className="block h-full w-full rounded-full"
                        style={{ backgroundColor: swatch.hex }}
                      />
                    </button>
                  ))}
                </div>
                {isSwatchObject(selectedColor) && (
                  <p className="text-sm text-muted-foreground">
                    Color: <span className="font-medium text-foreground">{selectedColor.name}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <h1 className="text-4xl font-bold font-heading tracking-tight text-foreground">
          {product.name}
        </h1>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={cn(
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                )}
              />
            ))}
          </div>
          <span className="text-sm font-sans text-muted-foreground ml-1">
            ({product.reviewCount} Reviews)
          </span>
        </div>

        <div className="mt-5 flex items-baseline gap-2">
          <p className="text-3xl font-bold font-sans text-foreground">
            BDT{product.price}
          </p>
          {product.originalPrice && (
            <p className="text-xl font-sans text-muted-foreground line-through">
              BDT{product.originalPrice}
            </p>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-base font-sans font-medium text-foreground">
            Size
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((size: string) => (
              <Button
                key={size}
                variant={selectedSize === size ? 'default' : 'outline'}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  'min-w-[48px] rounded-full',
                  selectedSize === size && 'bg-primary text-primary-foreground dark:bg-primary dark:text-rich-black'
                )}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        {product.colorSwatches && product.colorSwatches.length > 0 && (
          <div className="mt-8">
            <h3 className="text-base font-sans font-medium text-foreground">
              Color
            </h3>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.colorSwatches.map((swatch: { name: string; hex: string }) => (
                <button
                  key={swatch.name}
                  onClick={() => setSelectedColor(swatch)}
                  className={cn(
                    'h-10 w-10 rounded-full border-2 transition-all',
                    isSwatchObject(selectedColor) && selectedColor.name === swatch.name
                      ? 'border-primary ring-2 ring-primary ring-offset-2'
                      : 'border-gray-300 dark:border-gray-600'
                  )}
                  aria-label={`Select color ${swatch.name}`}
                  title={swatch.name}
                >
                  <span
                    className="block h-full w-full rounded-full"
                    style={{ backgroundColor: swatch.hex }}
                  />
                </button>
              ))}
            </div>
            {isSwatchObject(selectedColor) && (
              <p className="mt-3 text-sm text-muted-foreground">
                Selected: <span className="font-medium text-foreground">{selectedColor.name}</span>
              </p>
            )}
          </div>
        )}

        <div className="mt-6">
          <StockIndicator stock={stock} />
        </div>

        <div className="mt-8">
          <AnimatedButton
            onClick={handleAddToCart}
            disabled={isDisabled}
            className="w-full font-sans text-lg font-bold uppercase tracking-wider px-8 py-5 rounded-lg transition-transform bg-primary text-primary-foreground dark:bg-primary dark:text-rich-black shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Add to Cart
          </AnimatedButton>
          {isDisabled && (
            <p className="text-center text-xs text-red-500 mt-2">
              {stock <= 0 ? 'This product is out of stock' : 'Please choose size and color'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
