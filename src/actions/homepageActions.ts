/**
 * HOMEPAGE ACTIONS (Social Posts)
 * ================================
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

export async function createOrUpdateSocialPost(prevState: any, formData: FormData) {
  const postId = formData.get("postId") as string | null;
  const postLink = formData.get("postLink") as string;

  if (!postLink) {
    return { error: "Post Link is a required field." };
  }

  // 🎯 DEMO MODE
  if (DEMO_MODE) {
    console.log('🎯 DEMO MODE: Mock social post save');
    await new Promise(resolve => setTimeout(resolve, 300));
    revalidatePath("/");
    return { success: true, message: "DEMO MODE: Social post saved! (Not persisted)" };
  }

  // [INTEGRATION POINT] Dynamic Mode
  const imageFile = formData.get("image") as File;
  const currentImageUrl = formData.get("currentImageUrl") as string;
  let imageUrl = currentImageUrl;

  try {
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile);
    }

    if (!imageUrl) {
      return { error: "Image is required." };
    }

    const fields = {
      image: { "en-US": imageUrl },
      postLink: { "en-US": postLink },
    };

    const space = await contentfulManagementClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment("master");

    if (postId) {
      const entry = await environment.getEntry(postId);
      entry.fields = fields;
      const updatedEntry = await entry.update();
      if (updatedEntry.isPublished()) await updatedEntry.publish();
    } else {
      const newEntry = await environment.createEntry("socialPost", { fields });
      await newEntry.publish();
    }

    revalidatePath("/");
    revalidatePath("/admin/homepage/social");
    return { success: true, message: "Social post saved successfully!" };
  } catch (error: any) {
    console.error("Contentful API Error:", error);
    return { error: error.message || "Failed to save social post." };
  }
}

export async function deleteSocialPost(prevState: any, formData: FormData) {
  const postId = formData.get("postId") as string;

  // 🎯 DEMO MODE
  if (DEMO_MODE) {
    console.log('🎯 DEMO MODE: Mock social post delete:', postId);
    await new Promise(resolve => setTimeout(resolve, 300));
    revalidatePath("/");
    return { success: true, message: "DEMO MODE: Social post deleted! (Not persisted)" };
  }

  // [INTEGRATION POINT] Dynamic Mode
  try {
    const space = await contentfulManagementClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment("master");
    const entry = await environment.getEntry(postId);
    await entry.unpublish();
    await entry.delete();
    revalidatePath("/");
    revalidatePath("/admin/homepage/social");
    return { success: true, message: "Social post deleted successfully!" };
  } catch (error: any) {
    console.error("Delete Social Post Error:", error);
    return { error: error.message || "Failed to delete social post." };
  }
}
