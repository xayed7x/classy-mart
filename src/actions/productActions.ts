"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/lib/cloudinary"; // Assuming image uploads are involved
import { contentfulManagementClient } from "@/lib/contentful";

// Interface for upload result with publicId for rollback capability
interface UploadResult {
  url: string;
  publicId: string;
}

// Helper function to upload an image to Cloudinary and return both URL and publicId
async function uploadImageWithId(file: File): Promise<UploadResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const uploadResult: any = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({}, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    }).end(buffer);
  });
  return { url: uploadResult.secure_url, publicId: uploadResult.public_id };
}

// Extract publicId from Cloudinary URL
// URL format: https://res.cloudinary.com/xxx/image/upload/v123/folder/abc123.jpg
function extractPublicId(url: string): string | null {
  if (!url || !url.includes('cloudinary.com')) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return match ? match[1] : null;
}

// Delete images from Cloudinary by publicIds
async function deleteCloudinaryImages(publicIds: string[]): Promise<void> {
  for (const publicId of publicIds) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`Failed to delete Cloudinary image ${publicId}:`, error);
    }
  }
}

export async function createOrUpdateProduct(prevState: any, formData: FormData) {
  const productId = formData.get("productId") as string | null;
  const name = formData.get("name") as string;

  // Server-side validation
  if (!name) {
    return { error: "Product name is required." };
  }

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
  const isFeatured = formData.get("isFeatured") === "on"; // Checkbox value
  const displayOnHomepage = formData.get("displayOnHomepage") === "on"; // Checkbox value
  
  // Parse color swatches JSON
  const colorSwatchesJSON = formData.get("colorSwatches") as string;
  const colorSwatches = colorSwatchesJSON ? JSON.parse(colorSwatchesJSON) : [];

  const mainImageFile = formData.get("mainImage") as File;
  const currentMainImageUrl = formData.get("currentMainImageUrl") as string | null;
  const galleryImageFiles = formData.getAll("galleryImages") as File[];
  const currentGalleryImageUrls = JSON.parse(formData.get("currentGalleryImageUrls") as string || "[]");

  // Track newly uploaded images for rollback on error
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

    // Comprehensive revalidation for all affected pages
    revalidatePath("/"); // Homepage (featured products, just for you)
    revalidatePath("/products"); // All products page
    revalidatePath(`/products/${slug}`); // Individual product page
    revalidatePath("/collections/all"); // All products collection
    revalidatePath(`/collections/${category}`); // Specific category page
    revalidatePath("/admin/products"); // Admin products page

    return { success: true, message: "Product saved successfully!" };
  } catch (error: any) {
    console.error("Contentful API Error:", error);
    
    // ROLLBACK: Delete newly uploaded images from Cloudinary
    if (newlyUploadedPublicIds.length > 0) {
      console.log("Rolling back Cloudinary uploads:", newlyUploadedPublicIds);
      await deleteCloudinaryImages(newlyUploadedPublicIds);
    }
    
    return { error: error.message || "Failed to save product. Please check server logs." };
  }
}

export async function deleteProduct(prevState: any, formData: FormData) {
  const productId = formData.get("productId") as string;

  try {
    const space = await contentfulManagementClient.getSpace(
      process.env.CONTENTFUL_SPACE_ID!
    );
    const environment = await space.getEnvironment("master");

    // Get product details before deletion to know which paths to revalidate
    const entry = await environment.getEntry(productId);
    const productSlug = entry.fields.slug?.['en-US'];
    const productCategory = entry.fields.category?.['en-US'];
    
    // Extract image URLs for Cloudinary cleanup
    const mainImageUrl = entry.fields.mainImage?.['en-US'] as string | undefined;
    const galleryImageUrls = (entry.fields.galleryImages?.['en-US'] || []) as string[];
    
    // Unpublish first if published
    if (entry.isPublished()) {
      await entry.unpublish();
    }
    
    // Then delete from Contentful
    await entry.delete();
    
    // Delete images from Cloudinary
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

    // Comprehensive revalidation for all affected pages
    revalidatePath("/"); // Homepage
    revalidatePath("/products"); // All products page
    if (productSlug) {
      revalidatePath(`/products/${productSlug}`); // Individual product page
    }
    revalidatePath("/collections/all"); // All products collection
    if (productCategory) {
      revalidatePath(`/collections/${productCategory}`); // Specific category page
    }
    revalidatePath("/admin/products"); // Admin products page
  } catch (error: any) {
    console.error("Delete Product Error:", error);
    redirect(
      "/admin/products?error=" +
        encodeURIComponent(error.message || "Failed to delete product.")
    );
  }

  // Success redirect - only reached if try block completes without errors
  redirect(
    "/admin/products?success=" +
      encodeURIComponent("Product deleted successfully!")
  );
}
