// One shape for every piece of async data (discriminated union).
// After `if (state.status === "success")` TypeScript knows that `state.data` exists.
export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string; httpStatus?: number };

// Sort options shown in the catalog <select> (value "" = Default)
export type SortOption = "" | "price-asc" | "price-desc" | "rating-desc" | "title-asc";

// Everything the catalog request depends on — read from the URL
export interface CatalogParams {
  q: string;
  category: string;
  sort: SortOption;
  page: number;
}
