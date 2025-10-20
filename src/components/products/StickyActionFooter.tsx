'use client';

import AnimatedButton from '@/components/ui/AnimatedButton';
import { useCartDrawerStore } from '@/stores/cart-drawer-store';
import { useCartStore } from '@/stores/cart-store';
import { useProductPageStore } from '@/stores/product-page-store';

interface StickyActionFooterProps {
  product: any;
}

export function StickyActionFooter({ product }: StickyActionFooterProps) {
  const { selectedSize, selectedColor } = useProductPageStore();
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    // Only add to cart if size is selected (and color if product has colors)
    if (!selectedSize) return;
    if (product.colors.length > 0 && !selectedColor) return;

    addToCart({
      ...product,
      size: selectedSize,
      color: selectedColor || undefined,
      quantity: 1,
    });
    useCartDrawerStore.getState().open();
  };

  // Check if button should be disabled
  const isDisabled = !selectedSize || (product.colors.length > 0 && !selectedColor);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-4 z-10 border-t">
      <AnimatedButton
        onClick={handleAddToCart}
        disabled={isDisabled}
        className="w-full font-bold uppercase tracking-wider h-12 bg-primary text-primary-foreground dark:bg-primary dark:text-rich-black rounded-md border-0 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add to Cart
      </AnimatedButton>
      {isDisabled && (
        <p className="text-center text-xs text-red-500 mt-2">
          Please choose size and color
        </p>
      )}
    </div>
  );
}