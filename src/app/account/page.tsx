import { getUserOrders } from "@/actions/orderActions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { OrderHistoryCard } from "@/components/account/OrderHistoryCard";
import { Package } from "lucide-react";
import { signOut } from "@/actions/authActions";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const orders = await getUserOrders();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Account Details Section */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold font-heading mb-6">My Account</h1>
        <div className="bg-card border border-border p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold font-heading mb-4">Account Details</h2>
          <div className="space-y-2">
            <p className="text-foreground">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            {user.user_metadata?.full_name && (
              <p className="text-foreground">
                <span className="font-medium">Name:</span> {user.user_metadata.full_name}
              </p>
            )}
          </div>
          <form action={signOut} className="mt-6">
            <button
              type="submit"
              className="dark:bg-primary dark:text-rich-black font-bold uppercase tracking-wider font-heading py-2 px-4 rounded-lg transition-transform hover:scale-105 disabled:opacity-50 text-sm"
            >
              Sign Out
            </button>
          </form>
        </div>
      </section>

      {/* Order History Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold font-heading">Order History</h2>
          {orders.length > 0 && (
            <Link
              href="/account/orders"
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              View All Orders
            </Link>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 border border-border rounded-lg bg-card">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold font-heading mb-2">
              No orders yet
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              You haven't placed any orders yet. Start shopping to see your order history here.
            </p>
            <Link
              href="/collections/all"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Show only the 3 most recent orders */}
            {orders.slice(0, 3).map((order) => (
              <OrderHistoryCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}