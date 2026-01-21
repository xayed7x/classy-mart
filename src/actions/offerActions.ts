/**
 * OFFER ACTIONS
 * =============
 * 
 * DEMO_MODE = true → Mock success
 * DEMO_MODE = false → Contentful + Cloudinary
 */

"use server";

import { revalidatePath } from "next/cache";
import { DEMO_MODE } from "@/lib/demo-mode";

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

async function uploadImage(file: File): Promise<string> {
  if (!cloudinary) throw new Error("Cloudinary not configured");
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const uploadResult: any = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({}, (error: any, result: any) => {
      if (error) reject(error);
      else resolve(result);
    }).end(buffer);
  });
  return uploadResult.secure_url;
}

export async function createOrUpdateOffer(prevState: any, formData: FormData) {
  const offerId = formData.get("offerId") as string | null;
  const data = {
    title: formData.get("title") as string,
    ctaButtonText: formData.get("ctaButtonText") as string,
    ctaLink: formData.get("ctaLink") as string,
  };

  if (!data.title || !data.ctaButtonText || !data.ctaLink) {
    return { error: "Title, Button Text, and Link are required fields." };
  }

  // 🎯 DEMO MODE
  if (DEMO_MODE) {
    console.log('🎯 DEMO MODE: Mock offer save:', data.title);
    await new Promise(resolve => setTimeout(resolve, 300));
    revalidatePath("/");
    return { success: true, message: "DEMO MODE: Offer saved! (Not persisted)" };
  }

  // [INTEGRATION POINT] Dynamic Mode
  const imageFile = formData.get("image") as File;
  const currentImageUrl = formData.get("currentImageUrl") as string;
  let imageUrl = currentImageUrl;

  try {
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile);
    }

    const fields = {
      title: { "en-US": data.title },
      ctaButtonText: { "en-US": data.ctaButtonText },
      ctaLink: { "en-US": data.ctaLink },
      image: { "en-US": imageUrl },
    };

    const space = await contentfulManagementClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment("master");

    if (offerId) {
      const entry = await environment.getEntry(offerId);
      entry.fields = fields;
      const updatedEntry = await entry.update();
      if (updatedEntry.isPublished()) await updatedEntry.publish();
    } else {
      const newEntry = await environment.createEntry("featuredOffer", { fields });
      await newEntry.publish();
    }

    revalidatePath("/");
    revalidatePath("/admin/homepage/offers");
    return { success: true, message: "Offer saved successfully!" };
  } catch (error: any) {
    console.error("Contentful API Error:", error);
    return { error: error.message || "Failed to save offer." };
  }
}

export async function deleteOffer(prevState: any, formData: FormData) {
  const offerId = formData.get("offerId") as string;

  // 🎯 DEMO MODE
  if (DEMO_MODE) {
    console.log('🎯 DEMO MODE: Mock offer delete:', offerId);
    await new Promise(resolve => setTimeout(resolve, 300));
    revalidatePath("/");
    return { success: true, message: "DEMO MODE: Offer deleted! (Not persisted)" };
  }

  // [INTEGRATION POINT] Dynamic Mode
  try {
    const space = await contentfulManagementClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment("master");
    const entry = await environment.getEntry(offerId);
    await entry.unpublish();
    await entry.delete();
    revalidatePath("/");
    revalidatePath("/admin/homepage/offers");
    return { success: true, message: "Offer deleted successfully!" };
  } catch (error: any) {
    console.error("Delete Offer Error:", error);
    return { error: error.message || "Failed to delete offer." };
  }
}