export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { getFeaturedProducts, getAllFeaturedOffers, getLookbookData, getJustForYouProducts, getAllSocialPosts } from '@/lib/contentful';
import { HeroSection } from '@/components/homepage/HeroSection';
import { FeaturedOffers } from '@/components/homepage/FeaturedOffers';
import { LookbookSection } from '@/components/homepage/LookbookSection';
import { TrendingProducts } from '@/components/homepage/TrendingProducts';
import { JustForYouSection } from '@/components/homepage/JustForYouSection';
import { SocialProofSection } from '@/components/homepage/SocialProofSection';
import { HomepageSkeleton } from '@/components/skeletons/HomepageSkeleton';

async function HomeContent() {
  // Data is fetched ONCE on the server when the page is requested
  const [featuredProducts, featuredOffers, lookbookData, justForYouProducts, socialPosts] = await Promise.all([
    getFeaturedProducts(),
    getAllFeaturedOffers(),
    getLookbookData(),
    getJustForYouProducts(),
    getAllSocialPosts(),
  ]);

  return (
    <>
      <HeroSection offers={featuredOffers} />
      <FeaturedOffers offers={featuredOffers} />
      <TrendingProducts products={featuredProducts} />
      <JustForYouSection products={justForYouProducts} />
      <LookbookSection lookbook={lookbookData} />
      <SocialProofSection socialPosts={socialPosts} />
    </>
  );
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={<HomepageSkeleton />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
