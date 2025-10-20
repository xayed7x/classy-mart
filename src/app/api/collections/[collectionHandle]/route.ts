import { getProductsByCollection } from '@/lib/contentful';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { collectionHandle: string } }) {
  const { collectionHandle } = params;

  try {
    const products = await getProductsByCollection(collectionHandle);

    return NextResponse.json({ data: products });
  } catch (error) {
    console.error('Error fetching products for collection:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
