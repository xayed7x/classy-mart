/**
 * DEMO LOOKBOOK DATA
 * ==================
 * 
 * ডেমো মোডে Lookbook Section এর জন্য হার্ডকোড ডাটা।
 * Dynamic মোডে এই ডাটা Contentful থেকে আসবে।
 * 
 * Using: shirt edited.png for lookbook background
 */

export interface DemoLookbook {
  id: string;
  title: string;
  subtitle: string;
  ctaButtonText: string;
  ctaLink: string;
  backgroundImage: string;
  images: string[];
}

export const DEMO_LOOKBOOK: DemoLookbook = {
  id: "lookbook-1",
  title: "The Lookbook",
  subtitle: "Explore our latest collection styled for the modern gentleman",
  ctaButtonText: "View Collection",
  ctaLink: "/collections/all",
  backgroundImage: "/images/shirt edited.png",
  images: [
    "/images/shirt edited.png",
    "/images/ChatGPT Image Oct 27, 2025, 09_08_04 PM.png",
    "/images/Hoddie.png",
    "/images/ChatGPT Image Oct 27, 2025, 08_13_31 PM.png",
  ],
};

// Transform function to match Contentful data structure
export function getDemoLookbookData() {
  return {
    sys: { id: DEMO_LOOKBOOK.id },
    fields: {
      title: DEMO_LOOKBOOK.title,
      subtitle: DEMO_LOOKBOOK.subtitle,
      ctaButtonText: DEMO_LOOKBOOK.ctaButtonText,
      ctaLink: DEMO_LOOKBOOK.ctaLink,
      backgroundImage: DEMO_LOOKBOOK.backgroundImage,
      images: DEMO_LOOKBOOK.images,
    },
  };
}
