import { ORDER_STEPS } from "@/models/order";
import type { OrderStatus } from "@/types/order";
import { cn } from "@/utils/cn";

interface OrderTimelineProps {
  status: OrderStatus;
}

/** Processing ✓ → Shipped ✓ → Delivered ○ — a real sequence, so numbered steps make sense here. */
export function OrderTimeline({ status }: OrderTimelineProps) {
  const currentIndex = ORDER_STEPS.indexOf(status);

  return (
    <ol className="grid grid-cols-3 gap-2" aria-label="Order progress">
      {ORDER_STEPS.map((step, index) => {
        const isDone = index <= currentIndex;
        return (
          <li key={step} className="flex flex-col gap-2">
            <span
              className={cn(
                "h-1.5 rounded-full",
                isDone ? "bg-brand-600 dark:bg-brand-400" : "bg-ink-200 dark:bg-ink-800",
              )}
            />
            <span className={cn("text-sm font-semibold", !isDone && "text-ink-400 dark:text-ink-500")}>
              <span aria-hidden="true">{isDone ? "✓ " : "○ "}</span>
              {step}
              <span className="sr-only">{isDone ? " — done" : " — not yet"}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
