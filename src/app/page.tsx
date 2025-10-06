import { HeroSection } from '@/components/homepage/HeroSection';
import { FeaturedOffers } from '@/components/homepage/FeaturedOffers';
import FeaturedCategories from "@/components/homepage/FeaturedCategories";
import { TrendingProducts } from "@/components/homepage/TrendingProducts";
import { LookbookSection } from "@/components/homepage/LookbookSection";
import { SocialProofSection } from "@/components/homepage/SocialProofSection";

export default function HomePage() {
  return (
    <main className="grid grid-cols-1">
      <HeroSection />
      <FeaturedOffers />
      <FeaturedCategories />
      <TrendingProducts />
      <LookbookSection />
      <SocialProofSection />
    </main>
  );
}
