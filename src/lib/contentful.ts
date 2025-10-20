import { createClient } from "contentful";
import { createClient as createManagementClient } from "contentful-management";
import { Product } from "@/types/product";

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_DELIVERY_API_ACCESS_TOKEN!,
});

export const contentfulManagementClient = createManagementClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN!,
});

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
    salePercentage:
      fields.originalPrice && fields.price
        ? Math.round(
            ((fields.originalPrice - fields.price) / fields.originalPrice) * 100
          )
        : undefined,
  };
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
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

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
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
  try {
    const entries = await contentfulClient.getEntries({
      content_type: "product",
    });
    if (!entries.items) return [];
    return entries.items.map((entry) => transformContentfulProduct(entry));
  } catch (error: any) {
    console.error("--- CONTENTFUL FETCH FAILED for Products ---");
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    return [];
  }
}

interface ProductCollectionQuery {
  content_type: 'product';
  'fields.category'?: string;
}

export async function getProductsByCollection(collectionHandle: string): Promise<Product[]> {
  try {
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
  try {
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
  try {
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

export async function getAllFeaturedOffers() {
  const entries = await contentfulClient.getEntries({
    content_type: "featuredOffer",
  });
  return entries.items.map(transformContentfulOffer);
}

export async function getFeaturedOfferById(id: string) {
  const entry = await contentfulClient.getEntry(id);
  return transformContentfulOffer(entry);
}

export async function getLookbookData() {
  const entries = await contentfulClient.getEntries({
    content_type: "lookbook",
    limit: 1,
  });
  if (!entries.items || entries.items.length === 0) return null;
  return entries.items[0]; // Return the raw entry
}

function transformContentfulLookbook(entry: any) {
  if (!entry || !entry.fields) return null;
  const imageUrl = entry.fields.backgroundImage?.fields?.file?.url;
  return {
    title: entry.fields.title || "",
    subtitle: entry.fields.subtitle || "",
    ctaButtonText: entry.fields.ctaButtonText || "",
    ctaLink: entry.fields.ctaLink || "",
    backgroundImage: imageUrl ? `https:${imageUrl}` : "/images/polo-tshirt.png",
  };
}

export async function getLookbookEntryRAW(): Promise<any | null> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: "lookbook",
      limit: 1,
    });
    if (!entries.items || entries.items.length === 0) return null;
    return entries.items[0];
  } catch (error) {
    console.error("Error fetching raw lookbook entry:", error);
    return null;
  }
}

export async function getLookbookEntry(): Promise<any | null> {
  const rawEntry = await getLookbookEntryRAW();
  return transformContentfulLookbook(rawEntry);
}