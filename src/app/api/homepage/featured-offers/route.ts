import { getAllFeaturedOffers } from '@/lib/contentful';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const offers = await getAllFeaturedOffers();
    return NextResponse.json(offers);
  } catch (error) {
    console.error('Error fetching featured offers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
