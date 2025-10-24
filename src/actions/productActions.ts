"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/lib/cloudinary"; // Assuming image uploads are involved
import { contentfulManagementClient } from "@/lib/contentful";

// Helper function to upload an image to Cloudinary (re-using from offerActions)
async function uploadImage(file: File): Promise<string> {
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
  return uploadResult.secure_url;
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

  try {
    let mainImageUrl: string | null = currentMainImageUrl;
    if (mainImageFile && mainImageFile.size > 0) {
      mainImageUrl = await uploadImage(mainImageFile);
    }

    let galleryImageUrls: string[] = [...currentGalleryImageUrls];
    for (const file of galleryImageFiles) {
      if (file && file.size > 0) {
        const url = await uploadImage(file);
        galleryImageUrls.push(url);
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

    revalidatePath("/products");
    revalidatePath("/admin/products");

    return { success: true, message: "Product saved successfully!" };
  } catch (error: any) {
    console.error("Contentful API Error:", error);
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

    const entry = await environment.getEntry(productId);
    
    // Unpublish first if published
    if (entry.isPublished()) {
      await entry.unpublish();
    }
    
    // Then delete
    await entry.delete();

    // Revalidate paths after successful deletion
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");
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
