'use client';

import { ProductGallery } from './ProductGallery';
import { ProductDetails } from './ProductDetails';
import { ProductInformation } from './ProductInformation';

interface ProductPageContentProps {
  product: any;
}

export function ProductPageContent({ product }: ProductPageContentProps) {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-40">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div>
            <ProductGallery product={product} />
          </div>
          <div className="mt-8 lg:mt-0 lg:p-4">
            <ProductDetails product={product} stock={product.stock} />
          </div>
        </div>
        <div className="mt-12">
          <ProductInformation product={product} />
        </div>
      </div>
    </>
  );
}
