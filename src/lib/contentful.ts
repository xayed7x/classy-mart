/**
 * CONTENTFUL INTEGRATION
 * ======================
 * 
 * এই ফাইলটি Contentful CMS থেকে ডাটা ফেচ করে।
 * 
 * DEMO_MODE = true হলে → হার্ডকোড ডাটা রিটার্ন করবে
 * DEMO_MODE = false হলে → Contentful API কল করবে
 * 
 * [INTEGRATION POINT] মার্ক করা জায়গাগুলো dynamic mode এ API ব্যবহার করে
 */

import { createClient } from "contentful";
import { createClient as createManagementClient } from "contentful-management";
import { Product } from "@/types/product";
import { DEMO_MODE } from "./demo-mode";
import { ALL_PRODUCTS } from "@/data/products";
import { DEMO_OFFERS } from "@/data/demo-offers";
import { getDemoLookbookData } from "@/data/demo-lookbook";
import { DEMO_SOCIAL_POSTS } from "@/data/demo-social";

// ============================================
// [INTEGRATION POINT] Contentful Clients
// Dynamic মোডে এই clients ব্যবহার হয়
// ============================================
let contentfulClient: ReturnType<typeof createClient> | null = null;
let contentfulManagementClient: ReturnType<typeof createManagementClient> | null = null;

// Only initialize clients when not in demo mode and env vars exist
if (!DEMO_MODE && process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_DELIVERY_API_ACCESS_TOKEN) {
  contentfulClient = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_DELIVERY_API_ACCESS_TOKEN,
  });
}

if (!DEMO_MODE && process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN) {
  contentfulManagementClient = createManagementClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN,
  });
}

// Export for use in other files (may be null in demo mode)
export { contentfulClient, contentfulManagementClient };

// ============================================
// Helper Functions
// ============================================

function transformContentfulProduct(entry: any): Product {
  if (!entry || !entry.fields) {
    return null as any;
  }

  const fields = entry.fields;
  const mainImage = fields.mainImage || "/images/placeholder.png";
  const galleryImages = fields.galleryImages || [];

  return {
    id: entry.sys.id,
    name: fields.name || "Unnamed Product",
    slug: fields.slug || "",
    price: fields.price || 0,
    originalPrice: fields.originalPrice,
    images: {
      main: mainImage,
      gallery: galleryImages,
    },
    category: fields.category || "uncategorized",
    subcategory: fields.subcategory || "",
    sizes: fields.sizes || [],
    colors: fields.colors || [],
    shortDescription: fields.shortDescription || "",
    longDescription: fields.longDescription || "",
    sizingAndFit: fields.sizingAndFit || "",
    materialsAndCare: fields.materialsAndCare || "",
    stock: fields.stock || 0,
    isFeatured: fields.isFeatured || false,
    rating: fields.rating || 0,
    reviewCount: fields.reviewCount || 0,
    colorSwatches: fields.colorSwatches || [],
    salePercentage:
      fields.originalPrice && fields.price
        ? Math.round(
            ((fields.originalPrice - fields.price) / fields.originalPrice) * 100
          )
        : undefined,
  };
}

function transformContentfulOffer(entry: any) {
  if (!entry || !entry.fields) return null;
  return {
    id: entry.sys.id,
    title: entry.fields.title || "",
    ctaButtonText: entry.fields.ctaButtonText || "",
    ctaLink: entry.fields.ctaLink || "",
    image: entry.fields.image || "",
  };
}

function transformContentfulSocialPost(entry: any) {
  if (!entry || !entry.fields) return null;
  return {
    id: entry.sys.id,
    image: entry.fields.image || "",
    postLink: entry.fields.postLink || "",
  };
}

// ============================================
// PRODUCT FUNCTIONS
// ============================================

export async function getFeaturedProducts(): Promise<Product[]> {
  // 🎯 DEMO MODE: Return hardcoded featured products
  if (DEMO_MODE) {
    return ALL_PRODUCTS.filter(p => p.isFeatured).slice(0, 8);
  }

  // [INTEGRATION POINT] Dynamic Mode: Fetch from Contentful
  try {
    if (!contentfulClient) throw new Error("Contentful client not initialized");
    const entries = await contentfulClient.getEntries({
      content_type: "product",
      "fields.isFeatured": true,
      limit: 8,
    });
    if (!entries.items) return [];
    return entries.items.map((entry) => transformContentfulProduct(entry));
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export async function getJustForYouProducts(): Promise<Product[]> {
  // 🎯 DEMO MODE: Return a random subset of products
  if (DEMO_MODE) {
    // Return products that are not featured (simulating "just for you")
    return ALL_PRODUCTS.filter(p => !p.isFeatured).slice(0, 8);
  }

  // [INTEGRATION POINT] Dynamic Mode: Fetch from Contentful
  try {
    if (!contentfulClient) throw new Error("Contentful client not initialized");
    const entries = await contentfulClient.getEntries({
      content_type: "product",
      "fields.displayOnHomepage": true,
    });
    if (!entries.items) return [];
    return entries.items.map((entry) => transformContentfulProduct(entry));
  } catch (error) {
    console.error("Error fetching just for you products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  // 🎯 DEMO MODE: Find product in hardcoded data
  if (DEMO_MODE) {
    return ALL_PRODUCTS.find(p => p.slug === slug) || null;
  }

  // [INTEGRATION POINT] Dynamic Mode: Fetch from Contentful
  try {
    if (!contentfulClient) throw new Error("Contentful client not initialized");
    const entries = await contentfulClient.getEntries({
      content_type: "product",
      "fields.slug": slug,
      limit: 1,
    });
    if (!entries.items || entries.items.length === 0) return null;
    return transformContentfulProduct(entries.items[0]);
  } catch (error) {
    console.error(`Error fetching product by slug ${slug}:`, error);
    return null;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  // 🎯 DEMO MODE: Return all hardcoded products
  if (DEMO_MODE) {
    return ALL_PRODUCTS;
  }

  // [INTEGRATION POINT] Dynamic Mode: Fetch from Contentful
  try {
    if (!contentfulClient) throw new Error("Contentful client not initialized");
    const entries = await contentfulClient.getEntries({
      content_type: "product",
    });
    if (!entries.items) return [];
    return entries.items.map((entry) => transformContentfulProduct(entry));
  } catch (error: any) {
    return [];
  }
}

interface ProductCollectionQuery {
  content_type: 'product';
  'fields.category'?: string;
}

export async function getProductsByCollection(collectionHandle: string): Promise<Product[]> {
  // 🎯 DEMO MODE: Filter hardcoded products by category
  if (DEMO_MODE) {
    if (collectionHandle === 'all') {
      return ALL_PRODUCTS;
    }
    return ALL_PRODUCTS.filter(
      p => p.category.toLowerCase() === collectionHandle.toLowerCase()
    );
  }

  // [INTEGRATION POINT] Dynamic Mode: Fetch from Contentful
  try {
    if (!contentfulClient) throw new Error("Contentful client not initialized");
    const query: ProductCollectionQuery = {
      content_type: "product",
      'fields.category': collectionHandle.toLowerCase(),
    };

    if (collectionHandle === 'all') {
      delete query['fields.category'];
    }

    const entries = await contentfulClient.getEntries(query);
    if (!entries.items) return [];
    return entries.items.map((entry) => transformContentfulProduct(entry));
  } catch (error) {
    console.error(`Error fetching products for collection ${collectionHandle}:`, error);
    return [];
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  // 🎯 DEMO MODE: Search in hardcoded products
  if (DEMO_MODE) {
    const lowerQuery = query.toLowerCase();
    return ALL_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.shortDescription?.toLowerCase().includes(lowerQuery) ||
      p.longDescription?.toLowerCase().includes(lowerQuery)
    );
  }

  // [INTEGRATION POINT] Dynamic Mode: Search via Contentful
  try {
    if (!contentfulClient) throw new Error("Contentful client not initialized");
    const entries = await contentfulClient.getEntries({
      content_type: "product",
      query: query,
    });
    if (!entries.items) return [];
    return entries.items.map((entry) => transformContentfulProduct(entry));
  } catch (error) {
    console.error(`Error searching products for query "${query}":`, error);
    return [];
  }
}

export async function getProductBySlugRaw(slug: string): Promise<any | null> {
  // 🎯 DEMO MODE: Return product with simulated Contentful structure
  if (DEMO_MODE) {
    const product = ALL_PRODUCTS.find(p => p.slug === slug);
    if (!product) return null;
    return {
      sys: { id: product.id },
      fields: {
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        mainImage: product.images.main,
        galleryImages: product.images.gallery,
        category: product.category,
        subcategory: product.subcategory,
        sizes: product.sizes,
        colors: product.colors,
        shortDescription: product.shortDescription,
        longDescription: product.longDescription,
        sizingAndFit: product.sizingAndFit,
        materialsAndCare: product.materialsAndCare,
        stock: product.stock,
        isFeatured: product.isFeatured,
        rating: product.rating,
        reviewCount: product.reviewCount,
      },
    };
  }

  // [INTEGRATION POINT] Dynamic Mode: Fetch raw from Contentful
  try {
    if (!contentfulClient) throw new Error("Contentful client not initialized");
    const entries = await contentfulClient.getEntries({
      content_type: "product",
      "fields.slug": slug,
      limit: 1,
    });
    if (!entries.items || entries.items.length === 0) return null;
    return entries.items[0];
  } catch (error) {
    console.error(`Error fetching raw product by slug ${slug}:`, error);
    return null;
  }
}

// ============================================
// OFFERS FUNCTIONS
// ============================================

export async function getAllFeaturedOffers() {
  // 🎯 DEMO MODE: Return hardcoded offers
  if (DEMO_MODE) {
    return DEMO_OFFERS;
  }

  // [INTEGRATION POINT] Dynamic Mode: Fetch from Contentful
  try {
    if (!contentfulClient) throw new Error("Contentful client not initialized");
    const entries = await contentfulClient.getEntries({
      content_type: "featuredOffer",
    });
    return entries.items.map(transformContentfulOffer);
  } catch (error) {
    console.error("Error fetching featured offers:", error);
    return [];
  }
}

export async function getFeaturedOfferById(id: string) {
  // 🎯 DEMO MODE: Find offer by ID
  if (DEMO_MODE) {
    return DEMO_OFFERS.find(offer => offer.id === id) || null;
  }

  // [INTEGRATION POINT] Dynamic Mode: Fetch from Contentful
  try {
    if (!contentfulClient) throw new Error("Contentful client not initialized");
    const entry = await contentfulClient.getEntry(id);
    return transformContentfulOffer(entry);
  } catch (error) {
    console.error(`Error fetching offer by id ${id}:`, error);
    return null;
  }
}

// ============================================
// LOOKBOOK FUNCTIONS
// ============================================

export async function getLookbookData() {
  // 🎯 DEMO MODE: Return hardcoded lookbook data
  if (DEMO_MODE) {
    return getDemoLookbookData();
  }

  // [INTEGRATION POINT] Dynamic Mode: Fetch from Contentful
  try {
    if (!contentfulClient) throw new Error("Contentful client not initialized");
    const entries = await contentfulClient.getEntries({
      content_type: 'lookbook',
      limit: 1,
      include: 2
    });

    if (entries.items.length === 0) {
      return null;
    }
    
    return entries.items[0];

  } catch (error) {
    return null;
  }
}

export async function getLookbookEntryRAW(): Promise<any | null> {
  // 🎯 DEMO MODE: Return hardcoded lookbook
  if (DEMO_MODE) {
    return getDemoLookbookData();
  }

  // [INTEGRATION POINT] Dynamic Mode: Fetch from Contentful
  try {
    if (!contentfulClient) throw new Error("Contentful client not initialized");
    const entries = await contentfulClient.getEntries({
      content_type: "lookbook",
      limit: 1,
      include: 2
    });
    if (!entries.items || entries.items.length === 0) return null;
    return entries.items[0];
  } catch (error) {
    console.error("Error fetching raw lookbook entry:", error);
    return null;
  }
}

// ============================================
// SOCIAL POSTS FUNCTIONS
// ============================================

export async function getAllSocialPosts() {
  // 🎯 DEMO MODE: Return hardcoded social posts
  if (DEMO_MODE) {
    return DEMO_SOCIAL_POSTS;
  }

  // [INTEGRATION POINT] Dynamic Mode: Fetch from Contentful
  try {
    if (!contentfulClient) throw new Error("Contentful client not initialized");
    const entries = await contentfulClient.getEntries({
      content_type: "socialPost",
      order: ["-sys.createdAt"],
    });
    return entries.items.map(transformContentfulSocialPost).filter((post): post is NonNullable<typeof post> => post !== null);
  } catch (error) {
    console.error("Error fetching social posts:", error);
    return [];
  }
}

export async function getSocialPostById(id: string) {
  // 🎯 DEMO MODE: Find social post by ID
  if (DEMO_MODE) {
    return DEMO_SOCIAL_POSTS.find(post => post.id === id) || null;
  }

  // [INTEGRATION POINT] Dynamic Mode: Fetch from Contentful
  try {
    if (!contentfulClient) throw new Error("Contentful client not initialized");
    const entry = await contentfulClient.getEntry(id);
    return transformContentfulSocialPost(entry);
  } catch (error) {
    console.error(`Error fetching social post by id ${id}:`, error);
    return null;
  }
}

// ============================================
// COLLECTIONS FUNCTIONS
// ============================================

export async function getAllCollections(): Promise<string[]> {
  // 🎯 DEMO MODE: Get unique categories from hardcoded products
  if (DEMO_MODE) {
    const categories = new Set<string>();
    ALL_PRODUCTS.forEach(product => {
      if (product.category) {
        categories.add(product.category.toLowerCase());
      }
    });
    return Array.from(categories);
  }

  // [INTEGRATION POINT] Dynamic Mode: Get from Contentful
  try {
    const products = await getAllProducts();
    const categories = new Set<string>();
    products.forEach(product => {
      if (product.category) {
        categories.add(product.category.toLowerCase());
      }
    });
    return Array.from(categories);
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
}
