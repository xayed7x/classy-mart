"use client";

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/homepage/HeroSection';
import { FeaturedOffers } from '@/components/homepage/FeaturedOffers';
import { LookbookSection } from '@/components/homepage/LookbookSection';
import { TrendingProducts } from '@/components/homepage/TrendingProducts';
import { SocialProofSection } from '@/components/homepage/SocialProofSection';
import { HomepageSkeleton } from '@/components/homepage/HomepageSkeleton';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [featuredOffers, setFeaturedOffers] = useState<any[]>([]);
  const [lookbookData, setLookbookData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const [productsResponse, offersResponse, lookbookResponse] = await Promise.all([
          fetch('/api/homepage/featured-products'),
          fetch('/api/homepage/featured-offers'),
          fetch('/api/homepage/lookbook'),
        ]);

        if (!productsResponse.ok) throw new Error('Failed to fetch featured products');
        if (!offersResponse.ok) throw new Error('Failed to fetch featured offers');
        if (!lookbookResponse.ok) throw new Error('Failed to fetch lookbook data');

        const products = await productsResponse.json();
        const offers = await offersResponse.json();
        const lookbook = await lookbookResponse.json();

        setFeaturedProducts(products);
        setFeaturedOffers(offers);
        setLookbookData(lookbook);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return <HomepageSkeleton />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main>
      <HeroSection offers={featuredOffers} />
      <FeaturedOffers offers={featuredOffers} />
      <TrendingProducts products={featuredProducts} />
      <LookbookSection lookbook={lookbookData} />
      <SocialProofSection />
    </main>
  );
}
