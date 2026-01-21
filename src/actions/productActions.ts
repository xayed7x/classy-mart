/**
 * PRODUCT ACTIONS
 * ===============
 * 
 * এই ফাইলটি Product CRUD operations পরিচালনা করে।
 * 
 * DEMO_MODE = true হলে → মক সাকসেস রিটার্ন (no database write)
 * DEMO_MODE = false হলে → Contentful + Cloudinary API ব্যবহার হবে
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DEMO_MODE } from "@/lib/demo-mode";

// ============================================
// [INTEGRATION POINT] Cloudinary & Contentful
// Dynamic মোডে এই clients ব্যবহার হয়
// ============================================
let cloudinary: any = null;
let contentfulManagementClient: any = null;

if (!DEMO_MODE) {
  try {
    cloudinary = require("@/lib/cloudinary").default;
    const contentful = require("@/lib/contentful");
    contentfulManagementClient = contentful.contentfulManagementClient;
  } catch (error) {
    console.warn("Cloudinary/Contentful not configured");
  }
}

// ============================================
// Types & Helpers
// ============================================

interface UploadResult {
  url: string;
  publicId: string;
}

async function uploadImageWithId(file: File): Promise<UploadResult> {
  if (!cloudinary) throw new Error("Cloudinary not configured");
  
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const uploadResult: any = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({}, (error: any, result: any) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    }).end(buffer);
  });
  return { url: uploadResult.secure_url, publicId: uploadResult.public_id };
}

function extractPublicId(url: string): string | null {
  if (!url || !url.includes('cloudinary.com')) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return match ? match[1] : null;
}

async function deleteCloudinaryImages(publicIds: string[]): Promise<void> {
  if (!cloudinary) return;
  
  for (const publicId of publicIds) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`Failed to delete Cloudinary image ${publicId}:`, error);
    }
  }
}

// ============================================
// CREATE / UPDATE PRODUCT
// ============================================

export async function createOrUpdateProduct(prevState: any, formData: FormData) {
  const productId = formData.get("productId") as string | null;
  const name = formData.get("name") as string;

  if (!name) {
    return { error: "Product name is required." };
  }

  // 🎯 DEMO MODE: Return mock success
  if (DEMO_MODE) {
    console.log('🎯 DEMO MODE: Mock product save for:', name);
    
    // Simulate some processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    revalidatePath("/");
    revalidatePath("/admin/products");
    
    return { 
      success: true, 
      message: "DEMO MODE: Product saved successfully! (Changes not persisted)" 
    };
  }

  // [INTEGRATION POINT] Dynamic Mode: Save to Contentful
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '-');
  const data = {
    price: parseInt(formData.get('price') as string || '0', 10),
    originalPrice: parseInt(formData.get('originalPrice') as string || '0', 10),
    stock: parseInt(formData.get('stock') as string || '0', 10),
    rating: parseFloat(formData.get("rating") as string || '0'),
    reviewCount: parseInt(formData.get("reviewCount") as string || '0', 10),
  };

  const category = formData.get("category") as string;
  const subcategory = formData.get("subcategory") as string;
  const sizes = (formData.get("sizes") as string).split(',').map(s => s.trim()).filter(Boolean);
  const shortDescription = formData.get("shortDescription") as string;
  const longDescription = formData.get("longDescription") as string;
  const sizingAndFit = formData.get("sizingAndFit") as string;
  const materialsAndCare = formData.get("materialsAndCare") as string;
  const isFeatured = formData.get("isFeatured") === "on";
  const displayOnHomepage = formData.get("displayOnHomepage") === "on";
  
  const colorSwatchesJSON = formData.get("colorSwatches") as string;
  const colorSwatches = colorSwatchesJSON ? JSON.parse(colorSwatchesJSON) : [];

  const mainImageFile = formData.get("mainImage") as File;
  const currentMainImageUrl = formData.get("currentMainImageUrl") as string | null;
  const galleryImageFiles = formData.getAll("galleryImages") as File[];
  const currentGalleryImageUrls = JSON.parse(formData.get("currentGalleryImageUrls") as string || "[]");

  const newlyUploadedPublicIds: string[] = [];

  try {
    let mainImageUrl: string | null = currentMainImageUrl;
    if (mainImageFile && mainImageFile.size > 0) {
      const result = await uploadImageWithId(mainImageFile);
      mainImageUrl = result.url;
      newlyUploadedPublicIds.push(result.publicId);
    }

    let galleryImageUrls: string[] = [...currentGalleryImageUrls];
    for (const file of galleryImageFiles) {
      if (file && file.size > 0) {
        const result = await uploadImageWithId(file);
        galleryImageUrls.push(result.url);
        newlyUploadedPublicIds.push(result.publicId);
      }
    }

    const fields = {
      name: { "en-US": name },
      slug: { "en-US": slug },
      price: { "en-US": data.price },
      originalPrice: { "en-US": data.originalPrice },
      category: { "en-US": category },
      subcategory: { "en-US": subcategory },
      stock: { "en-US": data.stock },
      sizes: { "en-US": sizes },
      shortDescription: { "en-US": shortDescription },
      longDescription: { "en-US": longDescription },
      sizingAndFit: { "en-US": sizingAndFit },
      materialsAndCare: { "en-US": materialsAndCare },
      isFeatured: { "en-US": isFeatured },
      displayOnHomepage: { "en-US": displayOnHomepage },
      rating: { "en-US": data.rating },
      reviewCount: { "en-US": data.reviewCount },
      mainImage: { "en-US": mainImageUrl },
      galleryImages: { "en-US": galleryImageUrls },
      colorSwatches: { "en-US": colorSwatches }
    };

    const space = await contentfulManagementClient.getSpace(
      process.env.CONTENTFUL_SPACE_ID!
    );
    const environment = await space.getEnvironment("master");

    if (productId) {
      const entry = await environment.getEntry(productId);
      entry.fields = fields;
      const updatedEntry = await entry.update();
      if (updatedEntry.isPublished()) {
        await updatedEntry.publish();
      }
    } else {
      const newEntry = await environment.createEntry("product", {
        fields,
      });
      await newEntry.publish();
    }

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${slug}`);
    revalidatePath("/collections/all");
    revalidatePath(`/collections/${category}`);
    revalidatePath("/admin/products");

    return { success: true, message: "Product saved successfully!" };
  } catch (error: any) {
    console.error("Contentful API Error:", error);
    
    if (newlyUploadedPublicIds.length > 0) {
      console.log("Rolling back Cloudinary uploads:", newlyUploadedPublicIds);
      await deleteCloudinaryImages(newlyUploadedPublicIds);
    }
    
    return { error: error.message || "Failed to save product. Please check server logs." };
  }
}

// ============================================
// DELETE PRODUCT
// ============================================

export async function deleteProduct(prevState: any, formData: FormData) {
  const productId = formData.get("productId") as string;

  // 🎯 DEMO MODE: Return mock success
  if (DEMO_MODE) {
    console.log('🎯 DEMO MODE: Mock product delete for ID:', productId);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    revalidatePath("/");
    revalidatePath("/admin/products");
    
    redirect(
      "/admin/products?success=" +
        encodeURIComponent("DEMO MODE: Product deleted! (Not actually removed)")
    );
  }

  // [INTEGRATION POINT] Dynamic Mode: Delete from Contentful
  try {
    const space = await contentfulManagementClient.getSpace(
      process.env.CONTENTFUL_SPACE_ID!
    );
    const environment = await space.getEnvironment("master");

    const entry = await environment.getEntry(productId);
    const productSlug = entry.fields.slug?.['en-US'];
    const productCategory = entry.fields.category?.['en-US'];
    
    const mainImageUrl = entry.fields.mainImage?.['en-US'] as string | undefined;
    const galleryImageUrls = (entry.fields.galleryImages?.['en-US'] || []) as string[];
    
    if (entry.isPublished()) {
      await entry.unpublish();
    }
    
    await entry.delete();
    
    const publicIdsToDelete: string[] = [];
    if (mainImageUrl) {
      const id = extractPublicId(mainImageUrl);
      if (id) publicIdsToDelete.push(id);
    }
    for (const url of galleryImageUrls) {
      const id = extractPublicId(url);
      if (id) publicIdsToDelete.push(id);
    }
    if (publicIdsToDelete.length > 0) {
      console.log("Deleting Cloudinary images:", publicIdsToDelete);
      await deleteCloudinaryImages(publicIdsToDelete);
    }

    revalidatePath("/");
    revalidatePath("/products");
    if (productSlug) {
      revalidatePath(`/products/${productSlug}`);
    }
    revalidatePath("/collections/all");
    if (productCategory) {
      revalidatePath(`/collections/${productCategory}`);
    }
    revalidatePath("/admin/products");
  } catch (error: any) {
    console.error("Delete Product Error:", error);
    redirect(
      "/admin/products?error=" +
        encodeURIComponent(error.message || "Failed to delete product.")
    );
  }

  redirect(
    "/admin/products?success=" +
      encodeURIComponent("Product deleted successfully!")
  );
}
