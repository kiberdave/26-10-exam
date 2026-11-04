import { Cart } from "@/models/Cart";
import { cartStorage } from "@/models/StorageService";
import type { CartAction, CartItem, CartState } from "@/types/cart";
import { PROMO } from "@/utils/constants";

export const EMPTY_CART: CartState = { items: [], promoCode: null };

/** Lazy initializer for useReducer (3rd argument): runs once, reads shop_cart. */
export function initCart(): CartState {
  return cartStorage.get() ?? EMPTY_CART;
}

/**
 * Pure function: (old state, action) -> new state.
 * - never mutates `state` — always returns new objects/arrays (immutable updates)
 * - never touches localStorage (saving happens in CartProvider's useEffect)
 * - an invalid action (e.g. more than in stock) returns the SAME state -> no re-render
 */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, qty } = action;
      const existing = state.items.find((item) => item.productId === product.id);
      const nextQuantity = (existing?.quantity ?? 0) + qty;

      if (qty < 1 || nextQuantity > product.stock) return state;

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: nextQuantity, stock: product.stock }
              : item,
          ),
        };
      }

      const newItem: CartItem = {
        productId: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price,
        discountPercentage: product.discountPercentage,
        stock: product.stock,
        quantity: qty,
      };
      return { ...state, items: [...state.items, newItem] };
    }

    case "SET_QTY": {
      const target = state.items.find((item) => item.productId === action.productId);
      if (!target || !Number.isInteger(action.qty)) return state;
      if (action.qty < 1 || action.qty > target.stock) return state;

      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === action.productId ? { ...item, quantity: action.qty } : item,
        ),
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== action.productId),
      };

    case "CLEAR":
      return EMPTY_CART;

    case "APPLY_PROMO":
      return Cart.isValidPromo(action.code) ? { ...state, promoCode: PROMO.code } : state;

    case "REMOVE_PROMO":
      return { ...state, promoCode: null };

    default: {
      // If a new action type is added to CartAction and not handled above,
      // `action` is no longer `never` here and TypeScript shows an error.
      const exhaustiveCheck: never = action;
      return exhaustiveCheck;
    }
  }
}
