import type { CatalogParams, SortOption } from "@/types/api";
import { PRODUCTS_PER_PAGE } from "./constants";

export const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: "", label: "Default" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Rating: high to low" },
  { value: "title-asc", label: "Name A→Z" },
];

// Type guard: narrows an arbitrary URL string to SortOption
export function isSortOption(value: string): value is SortOption {
  return SORT_OPTIONS.some((option) => option.value === value);
}

// URL value -> DummyJSON query params. Record<...> forces a mapping for every option:
// add a new SortOption and TypeScript complains here until you map it.
const SORT_TO_API: Record<Exclude<SortOption, "">, { sortBy: string; order: "asc" | "desc" }> = {
  "price-asc": { sortBy: "price", order: "asc" },
  "price-desc": { sortBy: "price", order: "desc" },
  "rating-desc": { sortBy: "rating", order: "desc" },
  "title-asc": { sortBy: "title", order: "asc" },
};

/** Reads the catalog state from the URL (the URL is the single source of truth, P2.8). */
export function readCatalogParams(searchParams: URLSearchParams): CatalogParams {
  const sortParam = searchParams.get("sort") ?? "";
  const pageParam = Number(searchParams.get("page") ?? "1");

  return {
    q: (searchParams.get("q") ?? "").trim(),
    category: searchParams.get("category") ?? "",
    sort: isSortOption(sortParam) ? sortParam : "",
    page: Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1,
  };
}

/**
 * Builds the DummyJSON path for the catalog:
 *  - q        -> /products/search?q=...
 *  - category -> /products/category/{slug}
 *  - nothing  -> /products
 * Search and category are mutually exclusive (API limitation). Sort and pagination work with all three.
 */
export function buildProductsPath(params: CatalogParams): string {
  const query = new URLSearchParams();
  query.set("limit", String(PRODUCTS_PER_PAGE));
  query.set("skip", String((params.page - 1) * PRODUCTS_PER_PAGE));

  if (params.sort !== "") {
    const sort = SORT_TO_API[params.sort];
    query.set("sortBy", sort.sortBy);
    query.set("order", sort.order);
  }

  if (params.q) {
    query.set("q", params.q);
    return `/products/search?${query.toString()}`;
  }
  if (params.category) {
    return `/products/category/${encodeURIComponent(params.category)}?${query.toString()}`;
  }
  return `/products?${query.toString()}`;
}

/** Number(id) must be a positive integer, otherwise there is nothing to request (P3.2). */
export function parseId(raw: string | undefined): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}
