import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { NotFound } from "@/components/layout/NotFound";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useNow } from "@/hooks/useNow";
import { useToast } from "@/hooks/useToast";
import { Cart } from "@/models/Cart";
import { getOrderStatus } from "@/models/order";
import { ordersStorage } from "@/models/StorageService";
import type { Order } from "@/types/order";
import { discountedPrice, formatDate, formatPrice } from "@/utils/format";
import { readStateFlag } from "@/utils/guards";
import { parseId } from "@/utils/url";

const NO_ORDERS: Order[] = [];

export default function OrderDetailsPage() {
  const { id: rawId } = useParams<{ id: string }>();
  const id = parseId(rawId);
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [orders] = useLocalStorage(ordersStorage, NO_ORDERS);
  const now = useNow(30_000);

  const order = orders.find((item) => item.id === id);
  useDocumentTitle(order ? `Order #${order.number}` : "Order not found");

  if (!order) return <NotFound />; // /orders/123456

  const status = getOrderStatus(order, now);
  const justPlaced = readStateFlag(location.state, "justPlaced");

  function handleReorder(current: Order) {
    // The same products and quantities go back into the cart (stock limits still apply)
    const results = current.items.map((item) =>
      addItem(
        {
          id: item.productId,
          title: item.title,
          thumbnail: item.thumbnail,
          price: item.price,
          discountPercentage: item.discountPercentage,
          stock: item.stock,
        },
        item.quantity,
      ),
    );
    const allAdded = results.every((result) => result.status === "added");
    showToast(
      allAdded ? "Items added to cart ✓" : "Some items were not added: not enough stock",
      allAdded ? "success" : "error",
    );
    navigate("/cart");
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/orders"
        className="focus-ring self-start rounded text-sm font-semibold text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white"
      >
        ← All orders
      </Link>

      {justPlaced && (
        <p role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-sale dark:bg-emerald-500/15 dark:text-emerald-300">
          ✓ Your order has been placed. Its status updates by itself.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl">Order #{order.number}</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Placed on {formatDate(order.placedAt)}</p>
        </div>
        <OrderStatusBadge status={status} />
      </div>

      <OrderTimeline status={status} />

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/* Items table: on narrow screens it scrolls inside its box, never the whole page */}
        <section aria-label="Items" className="overflow-x-auto rounded-xl border border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="border-b border-ink-200 text-ink-500 dark:border-ink-800 dark:text-ink-400">
              <tr>
                <th scope="col" className="p-3 font-semibold">Product</th>
                <th scope="col" className="p-3 text-right font-semibold">Qty</th>
                <th scope="col" className="p-3 text-right font-semibold">Price</th>
                <th scope="col" className="p-3 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
              {order.items.map((item) => (
                <tr key={item.productId}>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.thumbnail}
                        alt=""
                        width={48}
                        height={48}
                        loading="lazy"
                        className="size-12 rounded-md bg-ink-50 object-contain dark:bg-ink-800"
                      />
                      <Link to={`/products/${item.productId}`} className="focus-ring rounded font-semibold hover:underline">
                        {item.title}
                      </Link>
                    </div>
                  </td>
                  <td className="p-3 text-right tabular-nums">{item.quantity}</td>
                  <td className="p-3 text-right tabular-nums">
                    {formatPrice(discountedPrice(item.price, item.discountPercentage))}
                  </td>
                  <td className="p-3 text-right font-semibold tabular-nums">{formatPrice(Cart.lineTotal(item))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="flex flex-col gap-4">
          <section className="rounded-xl border border-ink-200 bg-white p-4 text-sm dark:border-ink-800 dark:bg-ink-900">
            <h2 className="mb-2 text-base">Shipping to</h2>
            <address className="leading-relaxed not-italic">
              {order.shipping.fullName}
              <br />
              {order.shipping.address}, {order.shipping.city}
              <br />
              {order.shipping.email}
            </address>
          </section>

          <section className="rounded-xl border border-ink-200 bg-white p-4 text-sm dark:border-ink-800 dark:bg-ink-900">
            <h2 className="mb-2 text-base">Payment</h2>
            <dl className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sale dark:text-emerald-400">
                  <dt>Discount ({order.promoCode})</dt>
                  <dd className="tabular-nums">−{formatPrice(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="tabular-nums">{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</dd>
              </div>
              <div className="mt-1 flex justify-between border-t border-ink-200 pt-2 text-base font-bold dark:border-ink-800">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </section>

          <Button size="lg" onClick={() => handleReorder(order)}>
            Reorder
          </Button>
        </div>
      </div>
    </div>
  );
}
