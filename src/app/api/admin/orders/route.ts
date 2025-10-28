import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabaseAdmin.from('orders').select('*');

    if (status && status !== 'all') {
      query = query.eq('order_status', status);
    }

    const { data: orders, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('API: Supabase query error:', error);
      throw error;
    }

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('API: Error fetching orders in route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', message: error.message },
      { status: 500 }
    );
  }
}
