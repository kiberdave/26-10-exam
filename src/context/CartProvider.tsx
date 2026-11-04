import { useCallback, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import { Cart } from "@/models/Cart";
import { cartStorage } from "@/models/StorageService";
import type { CartProduct, CartState } from "@/types/cart";
import { CartContext, type AddToCartResult, type CartContextValue } from "./CartContext";
import { cartReducer, initCart } from "./cart.reducer";

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  // useReducer(reducer, initialArg, init) — init runs once and reads shop_cart
  const [state, dispatch] = useReducer(cartReducer, undefined, initCart);

  // Save to localStorage after every change (a side effect -> useEffect, not the reducer)
  useEffect(() => {
    cartStorage.set(state);
  }, [state]);

  // "Latest value" ref: lets addItem read the current cart while keeping a stable
  // identity. Stable callbacks let React.memo(ProductCard) skip re-renders when the cart changes.
  const stateRef = useRef<CartState>(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const getQuantity = useCallback(
    (productId: number): number =>
      stateRef.current.items.find((item) => item.productId === productId)?.quantity ?? 0,
    [],
  );

  const addItem = useCallback(
    (product: CartProduct, qty: number): AddToCartResult => {
      if (product.stock <= 0) return { status: "out-of-stock" };

      const inCart = getQuantity(product.id);
      if (inCart + qty > product.stock) {
        return { status: "limit", inCart, stock: product.stock };
      }

      dispatch({ type: "ADD_ITEM", product, qty });
      // Update the ref right away, so a fast second click sees the new quantity
      stateRef.current = cartReducer(stateRef.current, { type: "ADD_ITEM", product, qty });
      return { status: "added", quantity: qty };
    },
    [getQuantity],
  );

  const setQuantity = useCallback((productId: number, qty: number) => {
    dispatch({ type: "SET_QTY", productId, qty });
  }, []);

  const removeItem = useCallback((productId: number) => {
    dispatch({ type: "REMOVE_ITEM", productId });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const applyPromo = useCallback((code: string): boolean => {
    if (!Cart.isValidPromo(code)) return false;
    dispatch({ type: "APPLY_PROMO", code });
    return true;
  }, []);

  const removePromo = useCallback(() => dispatch({ type: "REMOVE_PROMO" }), []);

  // Derived data: calculated from state, never stored separately
  const totals = useMemo(
    () => new Cart(state.items, state.promoCode).totals(),
    [state.items, state.promoCode],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      promoCode: state.promoCode,
      totals,
      getQuantity,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      applyPromo,
      removePromo,
    }),
    [state, totals, getQuantity, addItem, setQuantity, removeItem, clearCart, applyPromo, removePromo],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
