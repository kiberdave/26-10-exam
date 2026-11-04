import { useCallback } from "react";
import type { CartProduct } from "@/types/cart";
import { useCart } from "./useCart";
import { useToast } from "./useToast";

/**
 * Add to cart + the right message, in one place.
 * Used by the catalog card, the product page and "Reorder" — the texts never drift apart.
 */
export function useAddToCart(): (product: CartProduct, qty?: number) => boolean {
  const { addItem } = useCart();
  const { showToast } = useToast();

  return useCallback(
    (product: CartProduct, qty = 1) => {
      const result = addItem(product, qty);

      switch (result.status) {
        case "added":
          showToast("Added to cart ✓");
          return true;
        case "limit":
          showToast(
            result.inCart > 0
              ? `Only ${result.stock} in stock — you already have ${result.inCart} in your cart`
              : `Only ${result.stock} in stock`,
            "error",
          );
          return false;
        case "out-of-stock":
          showToast("This product is out of stock", "error");
          return false;
      }
    },
    [addItem, showToast],
  );
}
