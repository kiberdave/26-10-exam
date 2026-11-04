import { useParams } from "react-router-dom";
import { productsEndpoints } from "@/api/products.api";
import { NotFound } from "@/components/layout/NotFound";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ProductDetailsSkeleton } from "@/components/product/ProductDetailsSkeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useFetch } from "@/hooks/useFetch";
import type { Product } from "@/types/product";
import { parseId } from "@/utils/url";

export default function ProductPage() {
  const { id: rawId } = useParams<{ id: string }>();
  const id = parseId(rawId); // "abc" or "-1" -> null -> no request at all

  // id is part of the path -> part of useFetch's dependencies.
  // Opening a related product changes id -> a new request (the classic bug is forgetting this).
  const { state, reload } = useFetch<Product>(id === null ? null : productsEndpoints.byId(id));

  if (id === null) return <NotFound />;

  if (state.status === "idle" || state.status === "loading") return <ProductDetailsSkeleton />;

  if (state.status === "error") {
    if (state.httpStatus === 404) return <NotFound />; // /products/999999
    return <ErrorMessage title="Couldn't load this product" message={state.message} onRetry={reload} />;
  }

  // key: a different product = a fresh component (gallery, quantity and tab reset)
  return <ProductDetails key={state.data.id} product={state.data} />;
}
