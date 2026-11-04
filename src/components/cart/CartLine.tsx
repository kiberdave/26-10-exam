import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Cart } from "@/models/Cart";
import type { CartItem } from "@/types/cart";
import { discountedPrice, formatPrice } from "@/utils/format";

interface CartLineProps {
  item: CartItem;
  onQuantityChange: (productId: number, qty: number) => void;
  onRemove: (item: CartItem) => void;
}

export function CartLine({ item, onQuantityChange, onRemove }: CartLineProps) {
  const unitPrice = discountedPrice(item.price, item.discountPercentage);

  return (
    <li className="grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-3 py-5 sm:grid-cols-[5.5rem_1fr_auto]">
      <img
        src={item.thumbnail}
        alt=""
        width={88}
        height={88}
        loading="lazy"
        className="row-span-2 size-18 rounded-lg border border-ink-200 bg-white object-contain p-1 sm:size-22 dark:border-ink-800 dark:bg-ink-900"
      />

      <div className="min-w-0">
        <Link
          to={`/products/${item.productId}`}
          className="focus-ring rounded font-semibold hover:text-brand-700 hover:underline dark:hover:text-brand-300"
        >
          {item.title}
        </Link>
        <p className="mt-1 text-sm text-ink-500 tabular-nums dark:text-ink-400">
          {formatPrice(unitPrice)} each
        </p>
      </div>

      <p className="hidden text-right font-bold tabular-nums sm:block">{formatPrice(Cart.lineTotal(item))}</p>

      <div className="col-start-2 flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
        <QuantityStepper
          size="sm"
          value={item.quantity}
          max={item.stock}
          onChange={(qty) => onQuantityChange(item.productId, qty)}
          label={`Quantity of ${item.title}`}
        />
        <p className="font-bold tabular-nums sm:hidden">{formatPrice(Cart.lineTotal(item))}</p>
        <Button variant="danger" size="sm" onClick={() => onRemove(item)} aria-label={`Remove ${item.title}`}>
          Remove
        </Button>
      </div>
    </li>
  );
}
