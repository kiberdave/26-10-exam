// `as const` makes every value a literal type ("shop_cart", not just string)
// and the object read-only — a typo in a storage key becomes a compile error.
export const STORAGE_KEYS = {
  user: "shop_user",
  cart: "shop_cart",
  orders: "shop_orders",
  reviews: "shop_reviews",
  theme: "shop_theme",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// Can be overridden with VITE_API_BASE_URL in a .env file (e.g. a local mock server)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://dummyjson.com";

export const PRODUCTS_PER_PAGE = 12;
export const SEARCH_DEBOUNCE_MS = 400;

export const PROMO = {
  code: "10X10",
  percent: 10,
} as const;

export const SHIPPING = {
  freeFrom: 100,
  cost: 10,
} as const;

// Order status simulation (P6.2): minutes passed since placedAt
export const ORDER_STATUS_MINUTES = {
  shippedAfter: 1,
  deliveredAfter: 3,
} as const;

export const LOW_STOCK_LIMIT = 5;
