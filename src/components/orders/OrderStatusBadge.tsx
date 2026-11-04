import type { OrderStatus } from "@/types/order";
import { cn } from "@/utils/cn";

// Record<OrderStatus, string>: TypeScript makes sure every status has a style
const STATUS_STYLES: Record<OrderStatus, string> = {
  Processing: "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200",
  Shipped: "bg-brand-50 text-brand-800 dark:bg-brand-500/20 dark:text-brand-100",
  Delivered: "bg-emerald-50 text-sale dark:bg-emerald-500/15 dark:text-emerald-300",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-bold", STATUS_STYLES[status])}>
      {status}
    </span>
  );
}
