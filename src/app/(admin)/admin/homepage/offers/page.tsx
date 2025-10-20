import { Suspense } from 'react';
import { getAllFeaturedOffers } from "@/lib/contentful";
import { OffersClientList } from "./OffersClientList";

export default async function OffersListPage() {
  const offers = await getAllFeaturedOffers();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OffersClientList offers={offers} />
    </Suspense>
  );
}
