"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/lib/cloudinary";
import { contentfulManagementClient, contentfulClient } from "@/lib/contentful"; // Import contentfulClient for getLookbookData

// Helper function to upload an image to Cloudinary (re-using from offerActions)
async function uploadImage(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const uploadResult: any = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({}, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      })
      .end(buffer);
  });
  return uploadResult.secure_url;
}

export async function updateLookbook(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const ctaButtonText = formData.get("ctaButtonText") as string;
  const ctaLink = formData.get("ctaLink") as string;
  const image = formData.get("backgroundImage") as File; // Assuming field name is backgroundImage
  const currentImageUrl = formData.get("currentImageUrl") as string | null;

  try {
    let imageUrl;
    if (image && image.size > 0) {
      imageUrl = await uploadImage(image);
    } else {
      imageUrl = currentImageUrl;
    }

    const space = await contentfulManagementClient.getSpace(
      process.env.CONTENTFUL_SPACE_ID!
    );
    const environment = await space.getEnvironment("master");

    // Fetch the single lookbook entry
    const entries = await contentfulClient.getEntries({
      content_type: "lookbook",
      limit: 1,
    });

    if (!entries.items || entries.items.length === 0) {
      return { error: "No Lookbook entry found in Contentful. Please create one." };
    }

    const lookbookEntryId = entries.items[0].sys.id;
    const entry = await environment.getEntry(lookbookEntryId);

    entry.fields.title["en-US"] = title;
    entry.fields.subtitle["en-US"] = subtitle;
    entry.fields.ctaButtonText["en-US"] = ctaButtonText;
    entry.fields.ctaLink["en-US"] = ctaLink;
    entry.fields.backgroundImage["en-US"] = imageUrl; // Assuming backgroundImage is localized

    // Correct update/publish sequence
    const updatedEntry = await entry.update(); // Save the draft and get the NEW version
    await updatedEntry.publish(); // Publish using the NEW version

    revalidatePath("/");
    revalidatePath("/admin/homepage/lookbook");

    return { success: true, message: "Lookbook updated successfully!" };
  } catch (error: any) {
    console.error("Contentful API Error:", error);
    return { error: error.message || "Failed to update lookbook. Please check server logs." };
  }
}
