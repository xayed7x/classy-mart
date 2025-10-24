export const dynamic = 'force-dynamic';

import { getFeaturedProducts, getAllFeaturedOffers, getLookbookData, getJustForYouProducts } from '@/lib/contentful';
import { HeroSection } from '@/components/homepage/HeroSection';
import { FeaturedOffers } from '@/components/homepage/FeaturedOffers';
import { LookbookSection } from '@/components/homepage/LookbookSection';
import { TrendingProducts } from '@/components/homepage/TrendingProducts';
import { JustForYouSection } from '@/components/homepage/JustForYouSection';
import { SocialProofSection } from '@/components/homepage/SocialProofSection';

export default async function Home() {
  // Data is fetched ONCE on the server when the page is requested
  const [featuredProducts, featuredOffers, lookbookData, justForYouProducts] = await Promise.all([
    getFeaturedProducts(),
    getAllFeaturedOffers(),
    getLookbookData(),
    getJustForYouProducts(),
  ]);

  return (
    <main>
      <HeroSection offers={featuredOffers} />
      <FeaturedOffers offers={featuredOffers} />
      <TrendingProducts products={featuredProducts} />
      <JustForYouSection products={justForYouProducts} />
      <LookbookSection lookbook={lookbookData} />
      <SocialProofSection />
    </main>
  );
}
