import { discountedPrice, formatPrice } from "@/utils/format";
import { cn } from "@/utils/cn";

interface PriceTagProps {
  price: number;
  discountPercentage: number;
  size?: "md" | "lg";
}

/**
 * The shelf tag: discounted price on a yellow label, the old price crossed out,
 * and a green "−9%" badge (only when the discount is at least 1%).
 */
export function PriceTag({ price, discountPercentage, size = "md" }: PriceTagProps) {
  const hasDiscount = discountPercentage >= 1;
  const finalPrice = discountedPrice(price, discountPercentage);

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <span className={cn("price-tag tabular-nums", size === "lg" ? "text-3xl" : "text-lg")}>
        {formatPrice(finalPrice)}
      </span>
      {hasDiscount && (
        <>
          <s className={cn("text-ink-500 tabular-nums dark:text-ink-400", size === "lg" ? "text-base" : "text-sm")}>
            <span className="sr-only">Was </span>
            {formatPrice(price)}
          </s>
          <span className="rounded-sm bg-sale px-1.5 py-0.5 text-xs font-bold text-white">
            −{Math.round(discountPercentage)}%
          </span>
        </>
      )}
    </div>
  );
}
