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

export async function createOrUpdateSocialPost(prevState: any, formData: FormData) {
  const postId = formData.get("postId") as string | null;

  const data = {
    postLink: formData.get("postLink") as string,
  };

  // Server-side validation
  if (!data.postLink) {
    return { error: "Post Link is a required field." };
  }

  const imageFile = formData.get("image") as File;
  const currentImageUrl = formData.get("currentImageUrl") as string;
  let imageUrl = currentImageUrl;

  try {
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile);
    }

    if (!imageUrl) {
      return { error: "Image is required. Please upload an image." };
    }

    const fields = {
      image: { "en-US": imageUrl },
      postLink: { "en-US": data.postLink },
    };

    const space = await contentfulManagementClient.getSpace(
      process.env.CONTENTFUL_SPACE_ID!
    );
    const environment = await space.getEnvironment("master");

    if (postId) {
      const entry = await environment.getEntry(postId);
      entry.fields = fields;
      const updatedEntry = await entry.update();
      if (updatedEntry.isPublished()) {
        await updatedEntry.publish();
      }
    } else {
      const newEntry = await environment.createEntry("socialPost", {
        fields,
      });
      await newEntry.publish();
    }

    revalidatePath("/");
    revalidatePath("/admin/homepage/social");

    return { success: true, message: "Social post saved successfully!" };
  } catch (error: any) {
    console.error("Contentful API Error:", error);
    if (error.sys?.id === 'ValidationFailed' || error.name === 'ValidationFailed') {
      return { error: "Save failed. Please ensure all required fields in Contentful have valid content." };
    }
    return { error: error.message || "Failed to save social post. Please check server logs." };
  }
}

export async function deleteSocialPost(prevState: any, formData: FormData) {
  const postId = formData.get("postId") as string;

  try {
    const space = await contentfulManagementClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment("master");

    const entry = await environment.getEntry(postId);
    await entry.unpublish();
    await entry.delete();

    // Revalidate paths after successful deletion
    revalidatePath("/");
    revalidatePath("/admin/homepage/social");

    return { success: true, message: "Social post deleted successfully!" };
  } catch (error: any) {
    console.error("Delete Social Post Error:", error);
    return { error: error.message || "Failed to delete social post." };
  }
}
