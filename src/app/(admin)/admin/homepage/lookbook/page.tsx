import { getLookbookData } from "@/lib/contentful";
import { LookbookFormClient } from "./LookbookFormClient";

export default async function LookbookPage() {
  const lookbookData = await getLookbookData();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Lookbook</h1>
      {lookbookData ? (
        <LookbookFormClient initialLookbook={lookbookData} />
      ) : (
        <p>No Lookbook entry found. Please create one in Contentful.</p>
      )}
    </div>
  );
}
