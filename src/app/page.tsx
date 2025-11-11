import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const siteUrl = 'https://classymart2024.com';

export const metadata: Metadata = {
  title: 'Classy Mart | Premium Men\'s Fashion & Clothing in Bangladesh',
  description: 'Discover authentic, premium quality men\'s clothing at Classy Mart. Shop the latest collection of shirts, t-shirts, pants, jackets, and Panjabis online in Bangladesh. Cash on delivery available.',
  openGraph: {
    title: 'Classy Mart | Premium Men\'s Fashion & Clothing in Bangladesh',
    description: 'The new standard for men\'s fashion in Bangladesh. Shop our latest collection of premium apparel.',
    images: [
      {
        url: `${siteUrl}/logo.png`, // Absolute URL
        width: 1200,
        height: 630,
        alt: 'Classy Mart Logo',
      },
    ],
    type: 'website',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Classy Mart | Premium Men\'s Fashion & Clothing in Bangladesh',
    description: 'The new standard for men\'s fashion in Bangladesh. Shop our latest collection of premium apparel.',
    images: [`${siteUrl}/Screenshot 2025-10-17 115959.png`], // Absolute URL
  },
};

import { Suspense } from 'react';
import { getFeaturedProducts, getAllFeaturedOffers, getLookbookData, getJustForYouProducts, getAllSocialPosts } from '@/lib/contentful';
import { HeroSection } from '@/components/homepage/HeroSection';
import { FeaturedOffers } from '@/components/homepage/FeaturedOffers';
import FeaturedCategories from '@/components/homepage/FeaturedCategories';
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
      <div className="md:hidden">
        <FeaturedCategories />
      </div>
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
