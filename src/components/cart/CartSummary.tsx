import type { ReactNode } from "react";
import type { CartTotals } from "@/types/cart";
import { PROMO, SHIPPING } from "@/utils/constants";
import { formatPrice } from "@/utils/format";

interface CartSummaryProps {
  totals: CartTotals;
  promoCode: string | null;
  onRemovePromo?: () => void;
  children?: ReactNode; // extra content: the promo form, the checkout button…
}

/** Subtotal / Discount / Shipping / Total — the same numbers on Cart and Checkout. */
export function CartSummary({ totals, promoCode, onRemovePromo, children }: CartSummaryProps) {
  const amountToFreeShipping = SHIPPING.freeFrom - (totals.subtotal - totals.discount);

  return (
    <section
      aria-labelledby="summary-title"
      className="flex flex-col gap-4 rounded-2xl border border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-900"
    >
      <h2 id="summary-title" className="text-lg">
        Order summary
      </h2>

      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="tabular-nums">{formatPrice(totals.subtotal)}</dd>
        </div>

        {promoCode && totals.discount > 0 && (
          <div className="flex justify-between text-sale dark:text-emerald-400">
            <dt className="flex items-center gap-2">
              Discount ({promoCode} −{PROMO.percent}%)
              {onRemovePromo && (
                <button
                  type="button"
                  onClick={onRemovePromo}
                  className="focus-ring rounded text-xs font-semibold text-ink-500 underline hover:text-ink-900 dark:text-ink-400 dark:hover:text-white"
                >
                  Remove
                </button>
              )}
            </dt>
            <dd className="tabular-nums">−{formatPrice(totals.discount)}</dd>
          </div>
        )}

        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd className="tabular-nums">{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</dd>
        </div>

        <div className="mt-2 flex justify-between border-t border-ink-200 pt-3 text-base font-bold dark:border-ink-800">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatPrice(totals.total)}</dd>
        </div>
      </dl>

      {totals.shipping > 0 && amountToFreeShipping > 0 && (
        <p className="text-xs text-ink-500 dark:text-ink-400">
          Add {formatPrice(amountToFreeShipping)} more for free shipping.
        </p>
      )}

      {children}
    </section>
  );
}
