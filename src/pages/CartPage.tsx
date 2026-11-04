import { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartLine } from "@/components/cart/CartLine";
import { CartSummary } from "@/components/cart/CartSummary";
import { PromoCodeForm } from "@/components/cart/PromoCodeForm";
import { Button } from "@/components/ui/Button";
import { buttonClasses } from "@/components/ui/buttonStyles";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCart } from "@/hooks/useCart";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useToast } from "@/hooks/useToast";
import type { CartItem } from "@/types/cart";
import { pluralize } from "@/utils/format";
import { readStateString } from "@/utils/guards";

export default function CartPage() {
  useDocumentTitle("Cart");

  const { items, promoCode, totals, setQuantity, removeItem, clearCart, applyPromo, removePromo } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  // Checkout sends people here with a message when the cart is empty
  const notice = readStateString(location.state, "notice");

  const handleRemove = useCallback(
    (item: CartItem) => {
      removeItem(item.productId);
      showToast("Removed from cart", "info");
    },
    [removeItem, showToast],
  );

  function handleClear() {
    if (window.confirm("Clear the cart? This cannot be undone.")) {
      clearCart();
    }
  }

  function handleApplyPromo(code: string): boolean {
    const applied = applyPromo(code);
    if (applied) showToast("Promo code applied ✓");
    return applied;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl md:text-4xl">Cart</h1>
        {notice && (
          <p role="status" className="rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-900 dark:bg-brand-500/15 dark:text-brand-100">
            {notice}
          </p>
        )}
        <EmptyState title="Your cart is empty." description="Products you add will show up here.">
          <Link to="/" className={buttonClasses("primary")}>
            Browse products
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h1 className="text-3xl md:text-4xl">Cart</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">{pluralize(totals.itemCount, "item")}</p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-label="Cart items">
          <ul className="divide-y divide-ink-200 border-y border-ink-200 dark:divide-ink-800 dark:border-ink-800">
            {items.map((item) => (
              <CartLine key={item.productId} item={item} onQuantityChange={setQuantity} onRemove={handleRemove} />
            ))}
          </ul>
          <Button variant="ghost" size="sm" onClick={handleClear} className="mt-3 -ml-3">
            Clear cart
          </Button>
        </section>

        {/* On mobile the summary simply follows the list (single column) */}
        <div className="lg:sticky lg:top-24">
          <CartSummary totals={totals} promoCode={promoCode} onRemovePromo={removePromo}>
            {!promoCode && <PromoCodeForm onApply={handleApplyPromo} />}
            {/* A guest is sent to /login by ProtectedRoute — no second check here */}
            <Button size="lg" className="w-full" onClick={() => navigate("/checkout")}>
              Proceed to checkout
            </Button>
          </CartSummary>
        </div>
      </div>
    </div>
  );
}
