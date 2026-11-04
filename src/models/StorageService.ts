import { STORAGE_KEYS, type StorageKey } from "@/utils/constants";
import { isAuthUser, isCartState, isOrderList, isReviewsByProduct, isTheme } from "@/utils/guards";

/**
 * The single gateway to localStorage — a generic class: one implementation, many data types.
 *
 * localStorage only stores strings, and JSON.parse returns data without a type.
 * So `get()` checks the parsed value with a type guard and returns `null`
 * for anything broken or tampered with, instead of crashing the app.
 */
export class StorageService<T> {
  constructor(
    private readonly key: StorageKey,
    private readonly isValid: (value: unknown) => value is T,
  ) {}

  get(): T | null {
    try {
      const raw = localStorage.getItem(this.key);
      if (raw === null) return null;
      const parsed: unknown = JSON.parse(raw);
      return this.isValid(parsed) ? parsed : null;
    } catch {
      // Invalid JSON or storage blocked (private mode) — behave as "nothing saved"
      return null;
    }
  }

  set(value: T): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(value));
    } catch {
      // Quota exceeded or storage blocked — the app keeps working from memory
    }
  }

  remove(): void {
    try {
      localStorage.removeItem(this.key);
    } catch {
      // ignore
    }
  }
}

// One instance per key — the rest of the app never touches localStorage directly
export const userStorage = new StorageService(STORAGE_KEYS.user, isAuthUser);
export const cartStorage = new StorageService(STORAGE_KEYS.cart, isCartState);
export const ordersStorage = new StorageService(STORAGE_KEYS.orders, isOrderList);
export const reviewsStorage = new StorageService(STORAGE_KEYS.reviews, isReviewsByProduct);
export const themeStorage = new StorageService(STORAGE_KEYS.theme, isTheme);
