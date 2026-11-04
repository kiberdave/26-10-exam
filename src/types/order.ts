import type { CartItem } from "./cart";

// Literal union: only these three strings are valid statuses.
export type OrderStatus = "Processing" | "Shipped" | "Delivered";

// Checkout form fields. No payment data exists in this project.
export interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
}

export interface Order {
  id: number; // Date.now() at the moment of placing
  number: string; // "10X-00001" — sequential, 5 digits
  items: CartItem[];
  shipping: ShippingInfo;
  promoCode: string | null;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  placedAt: string; // new Date().toISOString()
}
