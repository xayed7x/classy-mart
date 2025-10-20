import { NextResponse } from "next/server";
import { getProductsByCollection } from "@/lib/contentful";

export async function GET(
  request: Request,
  { params }: { params: { collectionHandle: string } }
) {
  const { collectionHandle } = params;

  // --- ADD THIS LOG ---
  console.log(`--- API Route: Received handle: "${collectionHandle}" ---`);

  try {
    const products = await getProductsByCollection(collectionHandle);
    
    // --- ADD THIS LOG ---
    console.log(`--- API Route: Found ${products.length} products for handle "${collectionHandle}" ---`);

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    console.error("API Error fetching products for collection:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}