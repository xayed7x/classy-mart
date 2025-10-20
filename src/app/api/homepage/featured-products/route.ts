import { getFeaturedProducts } from '@/lib/contentful';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const products = await getFeaturedProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
