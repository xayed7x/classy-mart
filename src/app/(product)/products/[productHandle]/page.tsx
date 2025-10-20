'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductPageLayout } from "@/components/products/ProductPageLayout";
import { useProductPageStore } from '@/stores/product-page-store';

export default function ProductPage() {
  const { reset } = useProductPageStore();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const { productHandle } = params;

  useEffect(() => {
    // This function will be called when the component is unmounted (i.e., user navigates away)
    return () => {
      reset();
    };
  }, [reset]);

  useEffect(() => {
    if (!productHandle) return;

    async function fetchProduct() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/products/${productHandle}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const productData = await response.json();
        setProduct(productData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [productHandle]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <ProductPageLayout product={product} />
  );
}