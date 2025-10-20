"use client";

import { useFormState } from "react-dom";
import { createOrUpdateOffer } from "@/actions/offerActions";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { AdminInput } from "@/components/admin/AdminInput";
import { SubmitButton } from "@/components/ui/SubmitButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface OfferFormClientProps {
  initialOffer: any | null;
  isNew: boolean;
}

const initialState = {
  error: undefined,
  message: "",
  success: false,
};

export function OfferFormClient({ initialOffer, isNew }: OfferFormClientProps) {
  const [state, formAction] = useFormState(createOrUpdateOffer, initialState);
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialOffer?.image || null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.push("/admin/homepage/offers");
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <form action={formAction} className="space-y-4">
      {initialOffer && (
        <input type="hidden" name="offerId" value={initialOffer.id} />
      )}
      {initialOffer && (
        <input
          type="hidden"
          name="currentImageUrl"
          value={initialOffer.image}
        />
      )}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="title">Title</Label>
        <AdminInput
          id="title"
          name="title"
          defaultValue={initialOffer?.title}
          required
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor="ctaButtonText">Button Text</Label>
        <AdminInput
          id="ctaButtonText"
          name="ctaButtonText"
          defaultValue={initialOffer?.ctaButtonText}
          required
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor="ctaLink">Button Link</Label>
        <AdminInput
          id="ctaLink"
          name="ctaLink"
          defaultValue={initialOffer?.ctaLink}
          required
        />
      </div>
      <div className="flex flex-col space-y-2">
        <Label htmlFor="image">Background Image</Label>
        <AdminInput
          id="image"
          name="image"
          type="file"
          onChange={handleFileChange}
        />
        {previewUrl && (
          <div className="mt-4">
            <Image
              src={previewUrl}
              alt="Image preview"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>
        )}
      </div>
      <SubmitButton className="bg-green-500 text-black hover:bg-green-600">
        Save Offer
      </SubmitButton>
    </form>
  );
}
