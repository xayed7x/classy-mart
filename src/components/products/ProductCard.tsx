import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Define the shape of our product data
export interface Product {
  id: number;
  handle: string;
  name: string;
  price: number;
  imageUrl: string;
  size: string;
  color: string;
}

interface ProductCardProps {
  product: Product;
}

/**
 * Renders a card for a single product.
 *
 * @param {ProductCardProps} props - The properties for the product card.
 * @returns {React.ReactElement} The ProductCard component.
 */
export function ProductCard({ product }: ProductCardProps): React.ReactElement {
  return (
    <Link href={`/products/${product.handle}`} className="group">
      <div className="overflow-hidden rounded-md bg-light-accent dark:bg-dark-accent">
        <div className="aspect-square w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={500} // Provide base width for aspect ratio
            height={500} // Provide base height for aspect ratio
            className="h-full w-full object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </div>
      </div>
      <div className="mt-3 flex justify-between">
        <h3 className="font-sans text-sm font-medium text-light-text dark:text-dark-text">
          {product.name}
        </h3>
        <p className="font-sans text-sm font-medium text-light-text dark:text-dark-text">
          ${product.price.toFixed(2)}
        </p>
      </div>
      <div className="mt-1 flex justify-between">
        <p className="font-sans text-sm text-light-text dark:text-dark-text">
          {product.size}
        </p>
        <p className="font-sans text-sm text-light-text dark:text-dark-text">
          {product.color}
        </p>
      </div>
    </Link>
  );
}
