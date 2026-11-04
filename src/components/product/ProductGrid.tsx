import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onAdd: (product: Product) => void;
}

// Mobile-first: 1 column -> 2 from 481px -> 3 from 768px -> 4 from 1024px
export function ProductGrid({ products, onAdd }: ProductGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        // key = product.id: stable and unique, so React keeps the right card on re-sort
        <li key={product.id} className="flex">
          <ProductCard product={product} onAdd={onAdd} />
        </li>
      ))}
    </ul>
  );
}
