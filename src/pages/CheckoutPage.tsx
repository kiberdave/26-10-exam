import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/Button";
import { buttonClasses } from "@/components/ui/buttonStyles";
import { TextField } from "@/components/ui/TextField";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { createOrder } from "@/models/order";
import { ordersStorage } from "@/models/StorageService";
import type { Order, ShippingInfo } from "@/types/order";
import { formatPrice } from "@/utils/format";
import { hasErrors, validateShipping } from "@/utils/validation";

// Order placing is simulated locally — this short pause only makes the "Placing order…" state visible
const FAKE_PROCESSING_MS = 700;

type ShippingField = keyof ShippingInfo;

export default function CheckoutPage() {
  useDocumentTitle("Checkout");

  const { user } = useAuth();
  const { items, promoCode, totals, clearCart } = useCart();

  // Controlled form: ONE state object for all four fields (keys = input `name`s)
  const [values, setValues] = useState<ShippingInfo>(() => ({
    fullName: user ? `${user.firstName} ${user.lastName}`.trim() || user.username : "",
    email: user?.email ?? "",
    address: "",
    city: "",
  }));
  const [touched, setTouched] = useState<Partial<Record<ShippingField, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Errors are derived from the values on every render (no separate errors state)
  const errors = validateShipping(values);

  function visibleError(field: ShippingField): string | undefined {
    return submitAttempted || touched[field] ? errors[field] : undefined;
  }

  // One handler for every input: [name]: value
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // no page reload
    setSubmitAttempted(true);

    if (hasErrors(errors)) {
      // Move focus to the first invalid field — keyboard and screen-reader friendly
      const firstInvalid = Object.keys(errors)[0];
      if (firstInvalid) document.getElementById(`checkout-${firstInvalid}`)?.focus();
      return;
    }

    setIsSubmitting(true); // disables "Place order" -> no double orders
    await new Promise((resolve) => setTimeout(resolve, FAKE_PROCESSING_MS));

    const existingOrders = ordersStorage.get() ?? [];
    const order = createOrder({ items, promoCode }, values, existingOrders.length);
    ordersStorage.set([...existingOrders, order]);

    setPlacedOrder(order); // show "Thank you!" …
    clearCart(); // … and empty the cart (the header badge updates at once)
    setIsSubmitting(false);
  }

  // 1) Order just placed -> confirmation (checked first: the cart is already empty now)
  if (placedOrder) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-12 text-center">
        <p aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-sale text-2xl text-white">
          ✓
        </p>
        <h1 className="text-3xl">Thank you! Your order has been placed.</h1>
        <p className="text-ink-600 dark:text-ink-300">
          Order <strong>#{placedOrder.number}</strong> · Total{" "}
          <strong className="tabular-nums">{formatPrice(placedOrder.total)}</strong>
        </p>
        <p className="text-sm text-ink-500 dark:text-ink-400">
          A confirmation would go to {placedOrder.shipping.email}. Nothing was charged — this is a demo shop.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link to={`/orders/${placedOrder.id}`} state={{ justPlaced: true }} className={buttonClasses("primary")}>
            View order
          </Link>
          <Link to="/" className={buttonClasses("secondary")}>
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  // 2) Nothing to check out -> back to the cart with a message
  if (items.length === 0) {
    return (
      <Navigate to="/cart" replace state={{ notice: "Your cart is empty. Add products before checking out." }} />
    );
  }

  // 3) The form
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl md:text-4xl">Checkout</h1>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5 rounded-2xl border border-ink-200 bg-white p-5 md:p-6 dark:border-ink-800 dark:bg-ink-900"
        >
          <h2 className="text-lg">Shipping details</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="checkout-fullName"
              name="fullName"
              label="Full name"
              autoComplete="name"
              value={values.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={visibleError("fullName")}
              className="sm:col-span-2"
            />
            <TextField
              id="checkout-email"
              name="email"
              type="email"
              label="Email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={visibleError("email")}
              className="sm:col-span-2"
            />
            <TextField
              id="checkout-address"
              name="address"
              label="Address"
              autoComplete="street-address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={visibleError("address")}
            />
            <TextField
              id="checkout-city"
              name="city"
              label="City"
              autoComplete="address-level2"
              value={values.city}
              onChange={handleChange}
              onBlur={handleBlur}
              error={visibleError("city")}
            />
          </div>

          <p className="text-sm text-ink-500 dark:text-ink-400">
            Payment is not collected: the order is simulated and saved only in this browser.
          </p>

          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto sm:self-start">
            {isSubmitting ? "Placing order…" : "Place order"}
          </Button>
        </form>

        <div className="flex flex-col gap-4 lg:sticky lg:top-24">
          <CartSummary totals={totals} promoCode={promoCode}>
            <ul className="flex flex-col gap-2 border-t border-ink-200 pt-3 text-sm dark:border-ink-800">
              {items.map((item) => (
                <li key={item.productId} className="flex justify-between gap-3">
                  <span className="min-w-0 truncate">
                    {item.quantity} × {item.title}
                  </span>
                </li>
              ))}
            </ul>
          </CartSummary>
          <Link
            to="/cart"
            className="focus-ring self-start rounded text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
          >
            Edit cart
          </Link>
        </div>
      </div>
    </div>
  );
}
