/**
 * DEMO ORDERS DATA
 * ================
 * 
 * ডেমো মোডে Admin Panel এর জন্য Mock Orders।
 * Dynamic মোডে এই ডাটা Supabase থেকে আসবে।
 */

export interface DemoOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string;
  customer_city: string;
  ordered_products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    images?: { main: string };
  }>;
  subtotal: number;
  shipping_cost: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  user_id: string | null;
}

// In-memory store for demo orders (persists during session)
let demoOrdersList: DemoOrder[] = [
  {
    id: "demo-order-1",
    order_number: "CM-10001",
    customer_name: "আহমেদ রহমান",
    customer_phone: "+880 1712-345678",
    customer_email: "ahmed@example.com",
    customer_address: "123 Gulshan Avenue, Gulshan-1",
    customer_city: "Dhaka",
    ordered_products: [
      {
        id: "2",
        name: "Premium Polo T-Shirt",
        price: 45.00,
        quantity: 2,
        images: { main: "/images/polo-tshirt.png" },
      },
    ],
    subtotal: 90.00,
    shipping_cost: 60,
    total_amount: 150.00,
    payment_method: "cod",
    payment_status: "pending",
    order_status: "pending",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    user_id: null,
  },
  {
    id: "demo-order-2",
    order_number: "CM-10002",
    customer_name: "করিম উদ্দিন",
    customer_phone: "+880 1898-765432",
    customer_email: null,
    customer_address: "45 Dhanmondi, Road 27",
    customer_city: "Dhaka",
    ordered_products: [
      {
        id: "14",
        name: "Embroidered Silk Panjabi",
        price: 150.00,
        quantity: 1,
        images: { main: "/images/panjabi.webp" },
      },
      {
        id: "9",
        name: "Modern Slim-Fit Chinos",
        price: 88.00,
        quantity: 1,
        images: { main: "/images/pant.avif" },
      },
    ],
    subtotal: 238.00,
    shipping_cost: 60,
    total_amount: 298.00,
    payment_method: "cod",
    payment_status: "pending",
    order_status: "processing",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    user_id: null,
  },
  {
    id: "demo-order-3",
    order_number: "CM-10003",
    customer_name: "সাকিব আল হাসান",
    customer_phone: "+880 1555-123456",
    customer_email: "sakib@example.com",
    customer_address: "78 Banani, Block C",
    customer_city: "Dhaka",
    ordered_products: [
      {
        id: "5",
        name: "Classic Oxford Button-Down Shirt",
        price: 75.00,
        quantity: 3,
        images: { main: "/images/shirt.png" },
      },
    ],
    subtotal: 225.00,
    shipping_cost: 60,
    total_amount: 285.00,
    payment_method: "cod",
    payment_status: "paid",
    order_status: "delivered",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    user_id: null,
  },
];

// Get all demo orders
export function getDemoOrders(): DemoOrder[] {
  return [...demoOrdersList].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

// Get demo order by ID
export function getDemoOrderById(orderId: string): DemoOrder | null {
  return demoOrdersList.find((order) => order.id === orderId) || null;
}

// Add new demo order (for checkout flow)
export function addDemoOrder(orderData: Omit<DemoOrder, 'id' | 'order_number' | 'created_at'>): DemoOrder {
  const newOrder: DemoOrder = {
    ...orderData,
    id: `demo-order-${Date.now()}`,
    order_number: `CM-${10000 + demoOrdersList.length + 1}`,
    created_at: new Date().toISOString(),
  };
  demoOrdersList = [newOrder, ...demoOrdersList];
  return newOrder;
}

// Update demo order status
export function updateDemoOrderStatus(orderId: string, status: string): boolean {
  const orderIndex = demoOrdersList.findIndex((order) => order.id === orderId);
  if (orderIndex === -1) return false;
  
  demoOrdersList[orderIndex] = {
    ...demoOrdersList[orderIndex],
    order_status: status,
  };
  return true;
}

// Get user's demo orders (by user_id)
export function getUserDemoOrders(userId: string): DemoOrder[] {
  return demoOrdersList
    .filter((order) => order.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
