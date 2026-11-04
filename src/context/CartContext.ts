import { createContext } from "react";
import type { CartItem, CartProduct, CartTotals } from "@/types/cart";

// What addItem tells the caller — so the UI can show the right message.
export type AddToCartResult =
  | { status: "added"; quantity: number }
  | { status: "limit"; inCart: number; stock: number }
  | { status: "out-of-stock" };

export interface CartContextValue {
  items: CartItem[];
  promoCode: string | null;
  totals: CartTotals;
  getQuantity: (productId: number) => number;
  addItem: (product: CartProduct, qty: number) => AddToCartResult;
  setQuantity: (productId: number, qty: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
}

// null = "used outside of <CartProvider>" — useCart() turns that into a clear error
export const CartContext = createContext<CartContextValue | null>(null);
