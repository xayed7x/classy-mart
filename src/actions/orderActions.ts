"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server"; // Corrected import
import { cookies } from "next/headers";

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
  totalAmount: number;
}

export async function placeOrder(
  cartDetails: CartDetails,
  formData: FormData
) {
  let orderId = null;
  const cookieStore = cookies();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  console.log("placeOrder: User ID from session:", user?.id);

  try {
    // Extract form data
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const customerName = `${firstName} ${lastName}`.trim();
    const customerPhone = formData.get("phone") as string;
    const streetAddress = formData.get("address") as string;
    const upazila = formData.get("upazila") as string;
    const district = formData.get("district") as string;
    const division = formData.get("division") as string;
    const customerAddress = `${streetAddress}, ${upazila}, ${district}, ${division}`.trim();
    const customerCity = district;
    const customerEmail = formData.get("email") as string;
    const paymentMethod = formData.get("paymentMethod") as string;

    // Construct the order payload according to Supabase schema
    const orderPayload = {
      user_id: user ? user.id : null, // This is the key line
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      customer_city: customerCity,
      customer_email: customerEmail,
      ordered_products: cartDetails.items,
      subtotal: cartDetails.subtotal,
      shipping_cost: 0,
      total_amount: cartDetails.totalAmount,
      payment_method: paymentMethod,
      payment_status: "pending",
      order_status: "pending",
    };

    // Insert order into Supabase
    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert(orderPayload)
      .select("id")
      .single();

    if (error) {
      throw error;
    }
    orderId = data.id;

    // Revalidate admin orders page
    revalidatePath("/admin/orders");

    // ❌ THE SUCCESS REDIRECT IS NO LONGER HERE
  } catch (error: any) {
    // This will now only catch REAL errors (database connection, etc.)
    return redirect(`/payment/fail?error=${encodeURIComponent(error.message)}`);
  }

  // ✅ THE SUCCESS REDIRECT IS NOW HERE
  // This line will only be reached if the try block completed successfully.
  redirect(`/payment/success?order_id=${orderId}`);
}

export async function getOrderDetails(orderId: string) {
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
    };
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    return null;
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ order_status: status })
      .eq("id", orderId);

    if (error) {
      throw error;
    }

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error };
  }
}

export async function getUserOrders() {
  const cookieStore = cookies();
  const supabase = await createClient(); // Corrected usage

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user) {
    console.log("getUserOrders: No session or user found.");
    return [];
  }

  console.log("getUserOrders: Fetching orders for user ID:", session.user.id);

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getUserOrders: Error fetching user orders:", error);
    return [];
  }

  console.log("getUserOrders: Fetched orders:", orders);
  return orders;
}

export async function getUserOrderById(orderId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Security check: user must be logged in
  if (!user) {
    console.log("getUserOrderById: No user found.");
    return null;
  }

  console.log("getUserOrderById: Fetching order", orderId, "for user ID:", user.id);

  // Critical security measure: filter by BOTH order ID AND user ID
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id) // Ensures user can only access their own orders
    .single();

  if (error) {
    console.error("getUserOrderById: Error fetching order:", error);
    return null;
  }

  console.log("getUserOrderById: Fetched order:", order);
  return order;
}
