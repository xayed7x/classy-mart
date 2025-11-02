import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store',
  };

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    console.log('🔵 Admin API: Fetching orders with status filter:', status);

    let query = supabaseAdmin.from('orders').select('*');

    if (status && status !== 'all') {
      console.log('🔵 Admin API: Applying filter - order_status =', status);
      query = query.eq('order_status', status);
    } else {
      console.log('🔵 Admin API: No filter applied (showing all orders)');
    }

    const { data: orders, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('🔴 API: Supabase query error:', error);
      throw error;
    }

    console.log(`✅ Admin API: Retrieved ${orders?.length || 0} orders`);
    if (orders && orders.length > 0) {
      console.log('Sample order statuses:', orders.slice(0, 3).map(o => ({ id: o.id.substring(0, 8), status: o.order_status })));
    }

    return NextResponse.json({ success: true, data: orders }, { headers });
  } catch (error: any) {
    console.error('API: Error fetching orders in route:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers }
    );
  }
}
