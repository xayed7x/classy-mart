import { getLookbookData } from '@/lib/contentful';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const lookbook = await getLookbookData();
    return NextResponse.json(lookbook);
  } catch (error) {
    console.error('Error fetching lookbook data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
