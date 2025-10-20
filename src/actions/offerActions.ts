"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/lib/cloudinary";
import { contentfulManagementClient } from "@/lib/contentful";

// Helper function to upload an image to Cloudinary
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

export async function createOrUpdateOffer(prevState: any, formData: FormData) {
  const offerId = formData.get("offerId") as string | null;

  const data = {
    title: formData.get("title") as string,
    ctaButtonText: formData.get("ctaButtonText") as string,
    ctaLink: formData.get("ctaLink") as string,
  };

  // Server-side validation
  if (!data.title || !data.ctaButtonText || !data.ctaLink) {
    return { error: "Title, Button Text, and Link are required fields." };
  }

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

    const space = await contentfulManagementClient.getSpace(
      process.env.CONTENTFUL_SPACE_ID!
    );
    const environment = await space.getEnvironment("master");

    if (offerId) {
      const entry = await environment.getEntry(offerId);
      entry.fields = fields;
      const updatedEntry = await entry.update();
      if (updatedEntry.isPublished()) {
        await updatedEntry.publish();
      }
    } else {
      const newEntry = await environment.createEntry("featuredOffer", {
        fields,
      });
      await newEntry.publish();
    }

    revalidatePath("/");
    revalidatePath("/admin/homepage/offers");

    return { success: true, message: "Offer saved successfully!" };
  } catch (error: any) {
    console.error("Contentful API Error:", error);
    if (error.sys?.id === 'ValidationFailed' || error.name === 'ValidationFailed') {
      return { error: "Save failed. Please ensure all required fields in Contentful have valid content." };
    }
    return { error: error.message || "Failed to save offer. Please check server logs." };
  }
}

export async function deleteOffer(prevState: any, formData: FormData) {
  const offerId = formData.get("offerId") as string;

  try {
    const space = await contentfulManagementClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment("master");

    const entry = await environment.getEntry(offerId);
    await entry.unpublish();
    await entry.delete();

    // Revalidate paths after successful deletion
    revalidatePath("/");
    revalidatePath("/admin/homepage/offers");

    return { success: true, message: "Offer deleted successfully!" };
  } catch (error: any) {
    console.error("Delete Offer Error:", error);
    return { error: error.message || "Failed to delete offer." };
  }
}