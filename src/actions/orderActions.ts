/**
 * ORDER ACTIONS
 * =============
 * 
 * এই ফাইলটি Order placement এবং management পরিচালনা করে।
 * 
 * DEMO_MODE = true হলে → Mock orders তৈরি হবে (Supabase ছাড়া)
 * DEMO_MODE = false হলে → Supabase API ব্যবহার হবে
 * 
 * [INTEGRATION POINT] মার্ক করা জায়গাগুলো dynamic mode এ API ব্যবহার করে
 */

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DEMO_MODE } from "@/lib/demo-mode";
import { 
  addDemoOrder, 
  getDemoOrders, 
  getDemoOrderById, 
  updateDemoOrderStatus,
  getUserDemoOrders 
} from "@/data/demo-orders";

// ============================================
// [INTEGRATION POINT] Supabase Clients
// Dynamic মোডে এই clients ব্যবহার হয়
// ============================================
let supabaseAdmin: any = null;
let createSupabaseClient: any = null;

// Only import Supabase when not in demo mode
if (!DEMO_MODE) {
  try {
    const supabaseLib = require("@/lib/supabase");
    supabaseAdmin = supabaseLib.supabaseAdmin;
    const serverLib = require("@/lib/supabase/server");
    createSupabaseClient = serverLib.createClient;
  } catch (error) {
    console.warn("Supabase not configured - running in demo mode");
  }
}

// Contentful Management for stock reduction (only in dynamic mode)
let contentfulManagement: any = null;
if (!DEMO_MODE) {
  try {
    contentfulManagement = require('contentful-management');
  } catch (error) {
    console.warn("Contentful Management not configured");
  }
}

// ============================================
// Types
// ============================================

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images?: {
    main: string;
  };
}

interface CartDetails {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
}

// ============================================
// ORDER PLACEMENT
// ============================================

export async function placeOrder(
  cartDetails: CartDetails,
  formData: FormData
) {
  let orderId = null;

  // Extract form data
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const customerName = `${firstName} ${lastName}`.trim();
  const customerPhone = formData.get("phone") as string;
  const streetAddress = formData.get("address") as string;
  const upazila = formData.get("upazila") as string;
  const district = formData.get("district") as string;
  const customerAddress = `${streetAddress}, ${upazila}, ${district}`.trim();
  const customerCity = district;
  const customerEmail = (formData.get("email") as string) || null;
  const paymentMethod = formData.get("paymentMethod") as string;

  // 🎯 DEMO MODE: Create mock order (no database)
  if (DEMO_MODE) {
    console.log('🎯 DEMO MODE: Creating mock order...');
    
    const demoOrder = addDemoOrder({
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      customer_address: customerAddress,
      customer_city: customerCity,
      ordered_products: cartDetails.items,
      subtotal: cartDetails.subtotal,
      shipping_cost: cartDetails.shippingCost,
      total_amount: cartDetails.totalAmount,
      payment_method: paymentMethod,
      payment_status: "pending",
      order_status: "pending",
      user_id: null,
    });
    
    console.log('✅ DEMO MODE: Mock order created:', demoOrder.id);
    redirect(`/payment/success?order_id=${demoOrder.id}`);
  }

  // [INTEGRATION POINT] Dynamic Mode: Use Supabase
  const cookieStore = await cookies();
  const supabase = createSupabaseClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  try {
    // Construct the order payload according to Supabase schema
    const orderPayload = {
      user_id: user ? user.id : null,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      customer_city: customerCity,
      customer_email: customerEmail,
      ordered_products: cartDetails.items,
      subtotal: cartDetails.subtotal,
      shipping_cost: cartDetails.shippingCost,
      total_amount: cartDetails.totalAmount,
      payment_method: paymentMethod,
      payment_status: "pending",
      order_status: "pending",
    };

    // Insert order into Supabase
    console.log('🔵 Inserting order to Supabase...');
    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert(orderPayload)
      .select("id")
      .single();

    if (error) {
      console.error('🔴 Supabase insert failed:', error);
      throw error;
    }
    
    if (!data) {
      console.error('🔴 No data returned from insert');
      throw new Error('Failed to create order - no data returned');
    }
    
    orderId = data.id;
    console.log('✅ Order inserted successfully. ID:', orderId);

    // --- AUTOMATED STOCK REDUCTION LOGIC ---
    // Reduce stock in Contentful for each ordered item
    if (contentfulManagement) {
      try {
        const client = contentfulManagement.createClient({
          accessToken: process.env.CONTENTFUL_MANAGEMENT_API_ACCESS_TOKEN!,
        });
        const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
        const environment = await space.getEnvironment('master');

        // Process each item in the cart
        for (const item of cartDetails.items) {
          if (!item.id) {
            console.warn(`Skipping item without ID: ${item.name}`);
            continue;
          }

          try {
            const entry = await environment.getEntry(item.id);
            const currentStock = entry.fields.stock?.['en-US'] || 0;
            const newStock = currentStock - item.quantity;
            entry.fields.stock = { 'en-US': Math.max(0, newStock) };
            const updatedEntry = await entry.update();
            await updatedEntry.publish();
            console.log(`✅ Stock updated for ${item.name}: ${currentStock} → ${Math.max(0, newStock)}`);
          } catch (itemError) {
            console.error(`Failed to update stock for item ${item.id}:`, itemError);
          }
        }
      } catch (contentfulError) {
        console.error('⚠️ Failed to update stock in Contentful:', contentfulError);
      }
    }
    // --- END OF STOCK REDUCTION LOGIC ---

    // Revalidate admin orders page and products
    revalidatePath("/admin/orders");
    revalidatePath("/products");
    revalidatePath("/");

  } catch (error: any) {
    console.error('Error in placeOrder:', error);
    return redirect(`/payment/fail?error=${encodeURIComponent(error.message)}`);
  }

  // Redirect to success page
  redirect(`/payment/success?order_id=${orderId}`);
}

// ============================================
// ORDER DETAILS
// ============================================

export async function getOrderDetails(orderId: string) {
  // 🎯 DEMO MODE: Get from mock data
  if (DEMO_MODE) {
    const order = getDemoOrderById(orderId);
    if (!order) return null;
    return {
      cart: order.ordered_products,
      total: order.total_amount,
      order_number: order.order_number,
    };
  }

  // [INTEGRATION POINT] Dynamic Mode: Fetch from Supabase
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) {
      throw error;
    }

    return {
      cart: data.ordered_products,
      total: data.total_amount,
      order_number: data.order_number,
    };
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    return null;
  }
}

// ============================================
// ORDER STATUS UPDATE
// ============================================

export async function updateOrderStatus(orderId: string, status: string) {
  // 🎯 DEMO MODE: Update mock order
  if (DEMO_MODE) {
    console.log(`🎯 DEMO MODE: Updating order ${orderId} to ${status}`);
    const success = updateDemoOrderStatus(orderId, status);
    revalidatePath("/admin/orders");
    return { success };
  }

  // [INTEGRATION POINT] Dynamic Mode: Update in Supabase
  try {
    console.log(`🔵 Updating order ${orderId.substring(0, 8)}... status to: ${status}`);
    
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ order_status: status })
      .eq("id", orderId);

    if (error) {
      console.error('🔴 Failed to update order status:', error);
      throw error;
    }

    console.log(`✅ Order status updated successfully to: ${status}`);
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("🔴 Failed to update order status:", error);
    return { success: false, error };
  }
}

// ============================================
// USER ORDERS
// ============================================

export async function getUserOrders() {
  // 🎯 DEMO MODE: Return empty (no user system in demo)
  if (DEMO_MODE) {
    console.log('🎯 DEMO MODE: Returning empty user orders');
    return [];
  }

  // [INTEGRATION POINT] Dynamic Mode: Fetch from Supabase
  const cookieStore = await cookies();
  const supabase = createSupabaseClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  console.log('🔵 getUserOrders: Fetching orders for user:', user.id);
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("🔴 getUserOrders: Error fetching user orders:", error);
    return [];
  }

  console.log(`✅ getUserOrders: Found ${orders?.length || 0} orders`);
  return orders;
}

export async function getUserOrderById(orderId: string) {
  // 🎯 DEMO MODE: Return null (no user system in demo)
  if (DEMO_MODE) {
    console.log('🎯 DEMO MODE: getUserOrderById - returning null');
    return null;
  }

  // [INTEGRATION POINT] Dynamic Mode: Fetch from Supabase
  const cookieStore = await cookies();
  const supabase = createSupabaseClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("getUserOrderById: Error fetching order:", error);
    return null;
  }

  return order;
}

// ============================================
// ADMIN: GET ALL ORDERS
// ============================================

export async function getAllOrders() {
  // 🎯 DEMO MODE: Return mock orders
  if (DEMO_MODE) {
    console.log('🎯 DEMO MODE: Returning demo orders');
    return getDemoOrders();
  }

  // [INTEGRATION POINT] Dynamic Mode: Fetch from Supabase
  try {
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all orders:", error);
      return [];
    }

    return orders;
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    return [];
  }
}
