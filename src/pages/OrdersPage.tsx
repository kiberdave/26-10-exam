import { useMemo } from "react";
import { Link } from "react-router-dom";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { buttonClasses } from "@/components/ui/buttonStyles";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useNow } from "@/hooks/useNow";
import { countItems, getOrderStatus } from "@/models/order";
import { ordersStorage } from "@/models/StorageService";
import type { Order } from "@/types/order";
import { formatDate, formatPrice, pluralize } from "@/utils/format";

const NO_ORDERS: Order[] = [];
const STATUS_REFRESH_MS = 30_000;

export default function OrdersPage() {
  useDocumentTitle("Orders");

  const [orders] = useLocalStorage(ordersStorage, NO_ORDERS);
  const now = useNow(STATUS_REFRESH_MS); // re-render every 30 s -> statuses move on their own

  // Newest first. Copy before sorting: .sort() mutates, and state must stay immutable.
  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => b.placedAt.localeCompare(a.placedAt)),
    [orders],
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl md:text-4xl">Orders</h1>

      {sortedOrders.length === 0 ? (
        <EmptyState title="You have no orders yet." description="Your placed orders and their status will appear here.">
          <Link to="/" className={buttonClasses("primary")}>
            Browse products
          </Link>
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-3">
          {sortedOrders.map((order) => (
            <li key={order.id}>
              <Link
                to={`/orders/${order.id}`}
                className="focus-ring grid gap-3 rounded-xl border border-ink-200 bg-white p-4 transition-colors hover:border-ink-300 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-ink-700"
              >
                <div>
                  <p className="font-bold">#{order.number}</p>
                  <p className="text-sm text-ink-500 dark:text-ink-400">
                    {formatDate(order.placedAt)} · {pluralize(countItems(order), "item")}
                  </p>
                </div>
                <p className="font-bold tabular-nums">{formatPrice(order.total)}</p>
                <OrderStatusBadge status={getOrderStatus(order, now)} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
