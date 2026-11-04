import type { CartItem, CartState } from "@/types/cart";
import type { Order } from "@/types/order";
import type { Product, Review, ReviewsByProduct } from "@/types/product";
import type { AuthUser } from "@/types/user";

// Type guards: functions that check an `unknown` value at runtime and tell
// TypeScript its real type (`value is X`). Data from localStorage / JSON.parse has
// no type at all — a guard is the honest way to trust it (an `as` cast would just lie).

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    isNumber(value.id) &&
    isString(value.title) &&
    isNumber(value.price) &&
    isNumber(value.stock) &&
    isString(value.thumbnail)
  );
}

export function isReview(value: unknown): value is Review {
  return (
    isRecord(value) &&
    isNumber(value.rating) &&
    isString(value.comment) &&
    isString(value.date) &&
    isString(value.reviewerName)
  );
}

export function isReviewsByProduct(value: unknown): value is ReviewsByProduct {
  return (
    isRecord(value) &&
    Object.values(value).every((list) => Array.isArray(list) && list.every(isReview))
  );
}

export function isCartItem(value: unknown): value is CartItem {
  return (
    isRecord(value) &&
    isNumber(value.productId) &&
    isString(value.title) &&
    isString(value.thumbnail) &&
    isNumber(value.price) &&
    isNumber(value.discountPercentage) &&
    isNumber(value.stock) &&
    isNumber(value.quantity) &&
    value.quantity > 0
  );
}

export function isCartState(value: unknown): value is CartState {
  return (
    isRecord(value) &&
    Array.isArray(value.items) &&
    value.items.every(isCartItem) &&
    (value.promoCode === null || isString(value.promoCode))
  );
}

export function isOrder(value: unknown): value is Order {
  return (
    isRecord(value) &&
    isNumber(value.id) &&
    isString(value.number) &&
    Array.isArray(value.items) &&
    value.items.every(isCartItem) &&
    isRecord(value.shipping) &&
    isNumber(value.total) &&
    isString(value.placedAt)
  );
}

export function isOrderList(value: unknown): value is Order[] {
  return Array.isArray(value) && value.every(isOrder);
}

export function isAuthUser(value: unknown): value is AuthUser {
  return (
    isRecord(value) &&
    isString(value.username) &&
    isString(value.firstName) &&
    isString(value.lastName) &&
    isString(value.email) &&
    isString(value.phone)
  );
}

export function isTheme(value: unknown): value is "light" | "dark" {
  return value === "light" || value === "dark";
}

/**
 * React Router's `location.state` can be anything (or null after a refresh).
 * Reads one string field from it safely.
 */
export function readStateString(state: unknown, key: string): string | null {
  if (!isRecord(state)) return null;
  const value = state[key];
  return typeof value === "string" ? value : null;
}

export function readStateFlag(state: unknown, key: string): boolean {
  return isRecord(state) && state[key] === true;
}
