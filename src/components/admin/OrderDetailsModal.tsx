'use client';

import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/Sheet';
import { Package, User, MapPin, CreditCard, DollarSign } from 'lucide-react';

interface OrderProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  images?: {
    main: string;
  };
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  customer_city: string;
  ordered_products: OrderProduct[];
  subtotal: number;
  shipping_cost: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
}

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent size="lg" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Order Details</SheetTitle>
          <SheetDescription>
            Order ID: {order.id.substring(0, 8)}...
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Customer Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Customer Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{order.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{order.customer_phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{order.customer_email}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Shipping Address</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">City:</span>
                <span className="font-medium">{order.customer_city}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Address:</span>
                <p className="font-medium mt-1">{order.customer_address}</p>
              </div>
            </div>
          </div>

          {/* Ordered Products */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Ordered Products</h3>
            </div>
            <div className="space-y-3">
              {order.ordered_products.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-md"
                >
                  <Image
                    src={item.images?.main || '/logo.png'}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    {(item.size || item.color) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ' • '}
                        {item.color && `Color: ${item.color}`}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">BDT {item.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      Total: BDT {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Payment Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium uppercase">{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status:</span>
                <span className={`font-medium capitalize ${
                  order.payment_status === 'paid' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {order.payment_status}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Pricing Details</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">BDT {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping Cost:</span>
                <span className="font-medium">BDT {order.shipping_cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
                <span className="font-semibold text-base">Total Amount:</span>
                <span className="font-bold text-lg text-primary">
                  BDT {order.total_amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Status:</span>
                <span className={`font-medium capitalize px-3 py-1 rounded-full text-xs ${
                  order.order_status === 'delivered' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : order.order_status === 'shipped'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : order.order_status === 'processing'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {order.order_status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span className="font-medium">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
