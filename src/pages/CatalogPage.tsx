import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { productsEndpoints } from "@/api/products.api";
import { CatalogToolbar } from "@/components/catalog/CatalogToolbar";
import { Pagination } from "@/components/catalog/Pagination";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch } from "@/hooks/useFetch";
import type { AsyncState, SortOption } from "@/types/api";
import type { Category, Product, ProductsResponse } from "@/types/product";
import { PRODUCTS_PER_PAGE } from "@/utils/constants";
import { pluralize } from "@/utils/format";
import { readCatalogParams } from "@/utils/url";

type ParamChanges = Partial<Record<"q" | "category" | "sort" | "page", string | null>>;

export default function CatalogPage() {
  useDocumentTitle("Catalog");

  // q, category, sort and page live in the URL, not in useState:
  // refresh, Back/Forward and sharing a link all keep the same view.
  const [searchParams, setSearchParams] = useSearchParams();
  const params = readCatalogParams(searchParams);

  // The path string is the effect dependency inside useFetch: new filters -> new request
  const { state, reload } = useFetch<ProductsResponse>(productsEndpoints.list(params));
  const { state: categoriesState } = useFetch<Category[]>(productsEndpoints.categories());

  const addToCart = useAddToCart();
  // Stable callback (useCallback) so React.memo(ProductCard) can skip re-renders
  const handleAdd = useCallback((product: Product) => addToCart(product, 1), [addToCart]);

  // One helper for all URL updates; null removes a parameter
  const updateParams = useCallback(
    (changes: ParamChanges, options?: { replace?: boolean }) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          for (const [key, value] of Object.entries(changes)) {
            if (value) next.set(key, value);
            else next.delete(key);
          }
          return next;
        },
        { replace: options?.replace ?? false },
      );
    },
    [setSearchParams],
  );

  // Search and category are mutually exclusive (DummyJSON limitation); any filter -> page 1
  const handleSearch = useCallback(
    (q: string) => updateParams({ q: q || null, category: null, page: null }, { replace: true }),
    [updateParams],
  );
  const handleCategoryChange = useCallback(
    (slug: string) => updateParams({ category: slug || null, q: null, page: null }),
    [updateParams],
  );
  const handleSortChange = useCallback(
    (sort: SortOption) => updateParams({ sort: sort || null, page: null }),
    [updateParams],
  );
  function handlePageChange(page: number) {
    updateParams({ page: page === 1 ? null : String(page) });
    window.scrollTo(0, 0);
  }
  function clearFilters() {
    setSearchParams({});
  }

  const categories = categoriesState.status === "success" ? categoriesState.data : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h1 className="text-3xl md:text-4xl">Catalog</h1>
        {state.status === "success" && (
          <p className="text-sm text-ink-500 dark:text-ink-400">
            {params.q ? `${pluralize(state.data.total, "result")} for “${params.q}”` : pluralize(state.data.total, "product")}
          </p>
        )}
      </div>

      <CatalogToolbar
        q={params.q}
        category={params.category}
        sort={params.sort}
        categories={categories}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
      />

      <CatalogResults
        state={state}
        page={params.page}
        onRetry={reload}
        onAdd={handleAdd}
        onPageChange={handlePageChange}
        onClearFilters={clearFilters}
      />
    </div>
  );
}

interface CatalogResultsProps {
  state: AsyncState<ProductsResponse>;
  page: number;
  onRetry: () => void;
  onAdd: (product: Product) => void;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

// Loading -> Error -> Empty -> Success, in this order (early returns)
function CatalogResults({ state, page, onRetry, onAdd, onPageChange, onClearFilters }: CatalogResultsProps) {
  if (state.status === "idle" || state.status === "loading") {
    return <ProductGridSkeleton />;
  }

  if (state.status === "error") {
    return <ErrorMessage title="Couldn't load products" message={state.message} onRetry={onRetry} />;
  }

  const { products, total, skip } = state.data;

  if (products.length === 0) {
    return (
      <EmptyState title="No products found." description="Try another search word or category.">
        <Button variant="secondary" onClick={onClearFilters}>
          Clear filters
        </Button>
      </EmptyState>
    );
  }

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);
  const from = skip + 1;
  const to = skip + products.length;

  return (
    <>
      <ProductGrid products={products} onAdd={onAdd} />
      <div className="flex flex-col items-center gap-3 pt-2">
        <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
        <p className="text-sm text-ink-500 dark:text-ink-400">
          Showing {from}–{to} of {total}
        </p>
      </div>
    </>
  );
}
