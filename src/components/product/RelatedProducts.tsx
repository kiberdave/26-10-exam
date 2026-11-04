import { useMemo } from "react";
import { productsEndpoints } from "@/api/products.api";
import { useFetch } from "@/hooks/useFetch";
import type { Product, ProductsResponse } from "@/types/product";
import { ProductGrid } from "./ProductGrid";
import { ProductGridSkeleton } from "./ProductGridSkeleton";

interface RelatedProductsProps {
  category: string;
  currentId: number;
  onAdd: (product: Product) => void;
}

/** Same category, without the current product, max 4 — rendered with the same ProductCard. */
export function RelatedProducts({ category, currentId, onAdd }: RelatedProductsProps) {
  const { state } = useFetch<ProductsResponse>(productsEndpoints.byCategory(category, 5));

  const related = useMemo(
    () =>
      state.status === "success"
        ? state.data.products.filter((product) => product.id !== currentId).slice(0, 4)
        : [],
    [state, currentId],
  );

  // Related products are a bonus: on error or when there are none, the section just hides
  if (state.status === "error" || (state.status === "success" && related.length === 0)) {
    return null;
  }

  return (
    <section aria-labelledby="related-title" className="mt-14">
      <h2 id="related-title" className="mb-4 text-xl">
        Related products
      </h2>
      {state.status === "success" ? (
        <ProductGrid products={related} onAdd={onAdd} />
      ) : (
        <ProductGridSkeleton count={4} />
      )}
    </section>
  );
}
