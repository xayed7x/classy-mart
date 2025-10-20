import { getFeaturedOfferById } from "@/lib/contentful";
import { OfferFormClient } from "./OfferFormClient";

interface OfferEditorPageProps {
  params: {
    offerId: string;
  };
}

export default async function OfferEditorPage({ params }: OfferEditorPageProps) {
  const { offerId } = params;
  const isNew = offerId === "new";
  const offer = isNew ? null : await getFeaturedOfferById(offerId);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {isNew ? "Create New Offer" : "Edit Offer"}
      </h1>
      <OfferFormClient initialOffer={offer} isNew={isNew} />
    </div>
  );
}