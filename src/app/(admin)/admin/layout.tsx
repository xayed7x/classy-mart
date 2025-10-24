"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans antialiased flex min-h-screen bg-rich-black text-soft-white">
      <Toaster richColors position="top-right" />
      <aside className="w-64 bg-rich-black text-soft-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Admin
            <Link href="/admin" aria-label="Admin Dashboard Home">
              <Home strokeWidth={1.5} size={20} />
            </Link>
          </h2>
        </div>
        <nav className="mt-6">
          <h3 className="px-6 py-2 text-xs uppercase text-muted-gold font-semibold">Store Management</h3>
          <ul>
            <li>
              <Link href="/admin/orders">
                <p className="block px-6 py-3 hover:bg-muted-gold/10">Orders</p>
              </Link>
            </li>
            <li>
              <Link href="/admin/products">
                <p className="block px-6 py-3 hover:bg-muted-gold/10">Products</p>
              </Link>
            </li>
          </ul>
          <h3 className="px-6 py-2 mt-4 text-xs uppercase text-muted-gold font-semibold">Homepage Management</h3>
          <ul>
            <li>
              <Link href="/admin/homepage/lookbook">
                <p className="block px-6 py-3 hover:bg-muted-gold/10">Lookbook</p>
              </Link>
            </li>
            <li>
              <Link href="/admin/homepage/offers">
                <p className="block px-6 py-3 hover:bg-muted-gold/10">Featured Offers</p>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-background">{children}</main>
    </div>
  );
}