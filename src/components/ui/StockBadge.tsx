import { LOW_STOCK_LIMIT } from "@/utils/constants";
import { cn } from "@/utils/cn";

interface StockBadgeProps {
  stock: number;
}

// stock > 5 -> "In stock"; 1..5 -> "Only N left!" (orange); 0 -> "Out of stock" (red)
export function StockBadge({ stock }: StockBadgeProps) {
  const isOut = stock <= 0;
  const isLow = !isOut && stock <= LOW_STOCK_LIMIT;

  const text = isOut ? "Out of stock" : isLow ? `Only ${stock} left!` : "In stock";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-semibold",
        isOut && "text-out dark:text-red-400",
        isLow && "text-low dark:text-amber-400",
        !isOut && !isLow && "text-sale dark:text-emerald-400",
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {text}
    </span>
  );
}
