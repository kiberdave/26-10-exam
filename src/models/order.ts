import type { CartState } from "@/types/cart";
import type { Order, OrderStatus, ShippingInfo } from "@/types/order";
import { ORDER_STATUS_MINUTES } from "@/utils/constants";
import { formatOrderNumber } from "@/utils/format";
import { Cart } from "./Cart";

/**
 * Builds an Order from the current cart and the checkout form.
 * Pure function: it does not save anything — the caller decides where the order goes.
 */
export function createOrder(
  cart: CartState,
  shipping: ShippingInfo,
  existingOrdersCount: number,
  now: Date = new Date(),
): Order {
  const totals = new Cart(cart.items, cart.promoCode).totals();

  return {
    id: now.getTime(),
    number: formatOrderNumber(existingOrdersCount + 1),
    items: cart.items.map((item) => ({ ...item })), // copy: later cart changes don't touch the order
    shipping: {
      fullName: shipping.fullName.trim(),
      email: shipping.email.trim(),
      address: shipping.address.trim(),
      city: shipping.city.trim(),
    },
    promoCode: cart.promoCode,
    subtotal: totals.subtotal,
    discount: totals.discount,
    shippingCost: totals.shipping,
    total: totals.total,
    placedAt: now.toISOString(),
  };
}

/**
 * The status is NOT stored — it is calculated from the time that has passed:
 * < 1 min -> Processing, 1–3 min -> Shipped, > 3 min -> Delivered.
 * One input, one answer — easy to test: getOrderStatus(order, someDate).
 */
export function getOrderStatus(order: Order, now: Date = new Date()): OrderStatus {
  const minutesPassed = (now.getTime() - new Date(order.placedAt).getTime()) / 60_000;

  if (minutesPassed < ORDER_STATUS_MINUTES.shippedAfter) return "Processing";
  if (minutesPassed < ORDER_STATUS_MINUTES.deliveredAfter) return "Shipped";
  return "Delivered";
}

export const ORDER_STEPS: readonly OrderStatus[] = ["Processing", "Shipped", "Delivered"];

export function countItems(order: Order): number {
  return order.items.reduce((count, item) => count + item.quantity, 0);
}
