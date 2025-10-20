import { getProductBySlug } from '@/lib/contentful';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { productHandle: string } }) {
  const { productHandle } = params;

  try {
    const product = await getProductBySlug(productHandle);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
