import type { Product } from "./product";

// What the cart needs to know about a product. Product satisfies it, and so does
// a line from an old order (used by "Reorder").
export type CartProduct = Pick<
  Product,
  "id" | "title" | "thumbnail" | "price" | "discountPercentage" | "stock"
>;

// One cart line: product data copied at the moment of adding + quantity.
export type CartItem = Omit<CartProduct, "id"> & {
  productId: number;
  quantity: number;
};

export interface CartState {
  items: CartItem[];
  promoCode: string | null;
}

// Discriminated union: `type` tells TypeScript which fields exist in each action.
export type CartAction =
  | { type: "ADD_ITEM"; product: CartProduct; qty: number }
  | { type: "SET_QTY"; productId: number; qty: number }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "CLEAR" }
  | { type: "APPLY_PROMO"; code: string }
  | { type: "REMOVE_PROMO" };

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}
