// Pure formatting helpers: same input -> same output, no side effects.

const priceFormatters = new Map<string, Intl.NumberFormat>();

/** 1299 -> "$1,299.00" */
export function formatPrice(amount: number, currency = "USD"): string {
  let formatter = priceFormatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", { style: "currency", currency });
    priceFormatters.set(currency, formatter);
  }
  return formatter.format(amount);
}

/** Rounds to cents: 10.005 -> 10.01 (avoids 0.1 + 0.2 = 0.30000000000000004 in totals) */
export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** price × (1 − discountPercentage / 100), rounded to 2 decimals */
export function discountedPrice(price: number, discountPercentage: number): number {
  return roundMoney(price * (1 - discountPercentage / 100));
}

/** "2026-11-01T12:00:00.000Z" -> "11/1/2026" (user's locale) */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString();
}

/** 4.666 -> "4.7" */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/** 1 -> "1 item", 3 -> "3 items" */
export function pluralize(count: number, word: string): string {
  return `${count} ${count === 1 ? word : `${word}s`}`;
}

/** "mens-shirts" -> "mens shirts" (CSS capitalizes it for display) */
export function formatCategory(slug: string): string {
  return slug.replace(/-/g, " ");
}

/** 7 -> "10X-00007" */
export function formatOrderNumber(sequence: number): string {
  return `10X-${String(sequence).padStart(5, "0")}`;
}
