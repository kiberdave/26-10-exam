import type { CatalogParams } from "@/types/api";
import { buildProductsPath } from "@/utils/url";

/**
 * All DummyJSON product endpoints in one place. Components never build URLs by hand:
 *   const { state } = useFetch<ProductsResponse>(productsEndpoints.list(params));
 *
 * Response types:
 *   list / byCategory -> ProductsResponse  { products, total, skip, limit }
 *   byId              -> Product           (404 -> ApiError with status 404)
 *   categories        -> Category[]        [{ slug, name, url }]
 */
export const productsEndpoints = {
  list: (params: CatalogParams): string => buildProductsPath(params),
  byId: (id: number): string => `/products/${id}`,
  categories: (): string => "/products/categories",
  byCategory: (slug: string, limit: number): string =>
    `/products/category/${encodeURIComponent(slug)}?limit=${limit}`,
};
