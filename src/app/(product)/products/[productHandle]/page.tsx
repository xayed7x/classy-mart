'use client';

import { useEffect, useState } from 'react';
import { ProductPageLayout } from "@/components/products/ProductPageLayout";
import { getProductBySlug } from "@/lib/contentful";
import { useProductPageStore } from '@/stores/product-page-store';

interface ProductPageProps {
  params: { productHandle: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { reset } = useProductPageStore();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    // This function will be called when the component is unmounted (i.e., user navigates away)
    return () => {
      reset();
    };
  }, [reset]);

  useEffect(() => {
    async function fetchProduct() {
      const productData = await getProductBySlug(params.productHandle);
      setProduct(productData);
    }
    fetchProduct();
  }, [params.productHandle]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <ProductPageLayout product={product} />
  );
}