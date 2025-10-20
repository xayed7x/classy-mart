import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';

export interface CartItem extends Product {
  quantity: number;
  size?: string;
  color?: string;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],
      addToCart: (item) => {
        set((state) => {
          // Check if item with same id, size, and color already exists
          const existingItem = state.cartItems.find(
            (cartItem) =>
              cartItem.id === item.id &&
              cartItem.size === item.size &&
              cartItem.color === item.color
          );
          
          if (existingItem) {
            // Increment quantity of existing item
            const updatedCart = state.cartItems.map((cartItem) =>
              cartItem.id === item.id &&
              cartItem.size === item.size &&
              cartItem.color === item.color
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );
            return { cartItems: updatedCart };
          } else {
            // Add new item with quantity 1
            return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] };
          }
        });
      },
      removeFromCart: (productId, size, color) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) =>
              !(item.id === productId && item.size === size && item.color === color)
          ),
        })),
      updateQuantity: (productId, quantity, size, color) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === productId && item.size === size && item.color === color
              ? { ...item, quantity }
              : item
          ),
        })),
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: 'classy-mart-cart',
    }
  )
);
