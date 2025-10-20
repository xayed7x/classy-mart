import { getFeaturedProducts, getAllFeaturedOffers, getLookbookData } from '@/lib/contentful';
import { HeroSection } from '@/components/homepage/HeroSection';
import { FeaturedOffers } from '@/components/homepage/FeaturedOffers';
import { LookbookSection } from '@/components/homepage/LookbookSection';
import { TrendingProducts } from '@/components/homepage/TrendingProducts';
import { SocialProofSection } from '@/components/homepage/SocialProofSection';

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const featuredOffers = await getAllFeaturedOffers();
  const lookbookData = await getLookbookData();

  return (
    <main>
      <HeroSection offers={featuredOffers} /> {/* HeroSection now takes offers for mobile */}
      <FeaturedOffers offers={featuredOffers} /> {/* New FeaturedOffers for desktop */}
      <TrendingProducts products={featuredProducts} />
      <LookbookSection lookbook={lookbookData} />
      <SocialProofSection />
    </main>
  );
}
