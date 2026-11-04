import type { CartItem, CartTotals } from "@/types/cart";
import { PROMO, SHIPPING } from "@/utils/constants";
import { discountedPrice, roundMoney } from "@/utils/format";

// The contract: anything that calls itself a cart must be able to calculate these.
export interface ICart {
  subtotal(): number;
  discount(): number;
  shipping(): number;
  total(): number;
}

/**
 * All cart money calculations, without any UI — easy to test and reuse
 * (the Cart page, the Checkout summary and the order use the same numbers).
 * The class does not change the cart: it only reads items and calculates.
 */
export class Cart implements ICart {
  static readonly FREE_SHIPPING_FROM = SHIPPING.freeFrom;
  static readonly SHIPPING_COST = SHIPPING.cost;

  constructor(
    private readonly items: CartItem[],
    private readonly promoCode: string | null,
  ) {}

  /** "10x10" and "10X10" are both valid (case-insensitive). */
  static isValidPromo(code: string): boolean {
    return code.trim().toUpperCase() === PROMO.code;
  }

  static lineTotal(item: CartItem): number {
    return roundMoney(discountedPrice(item.price, item.discountPercentage) * item.quantity);
  }

  // Getter: used like a property — cart.itemCount, not cart.itemCount()
  get itemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  /** Σ discounted price × quantity */
  subtotal(): number {
    return roundMoney(this.items.reduce((sum, item) => sum + Cart.lineTotal(item), 0));
  }

  /** 10% with a valid promo code, otherwise 0 */
  discount(): number {
    if (!this.promoCode || !Cart.isValidPromo(this.promoCode)) return 0;
    return roundMoney((this.subtotal() * PROMO.percent) / 100);
  }

  /** Free from $100 (after the promo discount), otherwise a flat $10. Empty cart ships nothing. */
  shipping(): number {
    if (this.isEmpty) return 0;
    return this.subtotal() - this.discount() >= Cart.FREE_SHIPPING_FROM ? 0 : Cart.SHIPPING_COST;
  }

  total(): number {
    return roundMoney(this.subtotal() - this.discount() + this.shipping());
  }

  totals(): CartTotals {
    return {
      itemCount: this.itemCount,
      subtotal: this.subtotal(),
      discount: this.discount(),
      shipping: this.shipping(),
      total: this.total(),
    };
  }
}
