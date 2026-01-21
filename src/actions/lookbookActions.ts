/**
 * LOOKBOOK ACTIONS
 * ================
 * 
 * DEMO_MODE = true → Mock success
 * DEMO_MODE = false → Contentful + Cloudinary
 */

"use server";

import { revalidatePath } from "next/cache";
import { DEMO_MODE } from "@/lib/demo-mode";

let cloudinary: any = null;
let contentfulManagementClient: any = null;
let contentfulClient: any = null;

if (!DEMO_MODE) {
  try {
    cloudinary = require("@/lib/cloudinary").default;
    const contentful = require("@/lib/contentful");
    contentfulManagementClient = contentful.contentfulManagementClient;
    contentfulClient = contentful.contentfulClient;
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

export async function updateLookbook(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const ctaButtonText = formData.get("ctaButtonText") as string;
  const ctaLink = formData.get("ctaLink") as string;

  // 🎯 DEMO MODE
  if (DEMO_MODE) {
    console.log('🎯 DEMO MODE: Mock lookbook update:', title);
    await new Promise(resolve => setTimeout(resolve, 300));
    revalidatePath("/");
    return { success: true, message: "DEMO MODE: Lookbook updated! (Not persisted)" };
  }

  // [INTEGRATION POINT] Dynamic Mode
  const image = formData.get("backgroundImage") as File;
  const currentImageUrl = formData.get("currentImageUrl") as string | null;

  try {
    let imageUrl;
    if (image && image.size > 0) {
      imageUrl = await uploadImage(image);
    } else {
      imageUrl = currentImageUrl;
    }

    const space = await contentfulManagementClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment("master");

    const entries = await contentfulClient.getEntries({
      content_type: "lookbook",
      limit: 1,
    });

    if (!entries.items || entries.items.length === 0) {
      return { error: "No Lookbook entry found in Contentful." };
    }

    const lookbookEntryId = entries.items[0].sys.id;
    const entry = await environment.getEntry(lookbookEntryId);

    entry.fields.title["en-US"] = title;
    entry.fields.subtitle["en-US"] = subtitle;
    entry.fields.ctaButtonText["en-US"] = ctaButtonText;
    entry.fields.ctaLink["en-US"] = ctaLink;
    entry.fields.backgroundImage["en-US"] = imageUrl;

    const updatedEntry = await entry.update();
    await updatedEntry.publish();

    revalidatePath("/");
    revalidatePath("/admin/homepage/lookbook");

    return { success: true, message: "Lookbook updated successfully!" };
  } catch (error: any) {
    console.error("Contentful API Error:", error);
    return { error: error.message || "Failed to update lookbook." };
  }
}
