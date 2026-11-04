import { memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { PriceTag } from "@/components/ui/PriceTag";
import { StockBadge } from "@/components/ui/StockBadge";
import type { Product } from "@/types/product";
import { formatCategory, formatRating } from "@/utils/format";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void; // callback prop: the parent decides what "add" means
}

/**
 * One product in the grid (also reused in "Related products").
 * The title link is "stretched" over the whole card (after:absolute after:inset-0):
 * clicking anywhere opens the product, Tab + Enter works from the keyboard,
 * and the button sits above the link (relative z-10) so it only adds to cart.
 *
 * React.memo: when the cart changes, the catalog re-renders, but cards whose
 * props did not change (same product, same stable onAdd) are skipped.
 */
export const ProductCard = memo(function ProductCard({ product, onAdd }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="relative flex w-full flex-col rounded-xl border border-ink-200 bg-white p-3 transition-colors focus-within:border-brand-400 hover:border-ink-300 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-ink-700">
      <div className="aspect-square overflow-hidden rounded-lg bg-ink-50 dark:bg-ink-800">
        <img
          src={product.thumbnail}
          alt={product.title}
          width={300}
          height={300}
          loading="lazy"
          decoding="async"
          className="size-full object-contain p-2"
        />
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-2 px-1">
        <p className="text-xs text-ink-500 capitalize dark:text-ink-400">
          {formatCategory(product.category)}
          {product.brand && ` · ${product.brand}`}
        </p>

        <h3 className="line-clamp-2 text-base leading-snug font-semibold">
          <Link
            to={`/products/${product.id}`}
            className="rounded-sm outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:underline"
          >
            {product.title}
          </Link>
        </h3>

        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium" aria-label={`Rated ${formatRating(product.rating)} out of 5`}>
            <span aria-hidden="true" className="text-low">
              ★
            </span>{" "}
            {formatRating(product.rating)}
          </span>
          <StockBadge stock={product.stock} />
        </div>

        <div className="mt-1">
          <PriceTag price={product.price} discountPercentage={product.discountPercentage} />
        </div>

        <Button
          className="relative z-10 mt-auto w-full"
          disabled={isOutOfStock}
          onClick={() => onAdd(product)}
          aria-label={isOutOfStock ? `${product.title} is out of stock` : `Add ${product.title} to cart`}
        >
          {isOutOfStock ? "Out of stock" : "Add to cart"}
        </Button>
      </div>
    </article>
  );
});
