/**
 * DEMO OFFERS DATA
 * ================
 * 
 * ডেমো মোডে Featured Offers Carousel এর জন্য হার্ডকোড ডাটা।
 * Dynamic মোডে এই ডাটা Contentful থেকে আসবে।
 * 
 * Images:
 * - Screenshot 2025-10-28 144755.png
 * - Screenshot 2025-10-28 150646.png
 * - Screenshot 2025-10-28 151052.png
 */

export interface DemoOffer {
  id: string;
  title: string;
  ctaButtonText: string;
  ctaLink: string;
  image: string;
}

export const DEMO_OFFERS: DemoOffer[] = [
  {
    id: "offer-1",
    title: "New Arrivals",
    ctaButtonText: "Shop Now",
    ctaLink: "/collections/all",
    image: "/images/Screenshot 2025-10-28 144755.png",
  },
  {
    id: "offer-2",
    title: "Premium Collection",
    ctaButtonText: "Explore",
    ctaLink: "/collections/shirts",
    image: "/images/Screenshot 2025-10-28 150646.png",
  },
  {
    id: "offer-3",
    title: "Winter Sale - Up to 30% Off",
    ctaButtonText: "Shop Sale",
    ctaLink: "/collections/hoodies",
    image: "/images/Screenshot 2025-10-28 151052.png",
  },
];
