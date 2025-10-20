import { create } from 'zustand';

interface ProductPageState {
  selectedSize: string | null;
  selectedColor: string | null;
  setSelectedSize: (size: string) => void;
  setSelectedColor: (color: string) => void;
  reset: () => void;
}

export const useProductPageStore = create<ProductPageState>((set) => ({
  selectedSize: null,
  selectedColor: null,
  setSelectedSize: (size) => set({ selectedSize: size }),
  setSelectedColor: (color) => set({ selectedColor: color }),
  reset: () => set({ selectedSize: null, selectedColor: null }),
}));
