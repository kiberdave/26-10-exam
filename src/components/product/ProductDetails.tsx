import { useCallback, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { PriceTag } from "@/components/ui/PriceTag";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { StockBadge } from "@/components/ui/StockBadge";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/useToast";
import { reviewsStorage } from "@/models/StorageService";
import type { Product, Review, ReviewsByProduct } from "@/types/product";
import { SHIPPING } from "@/utils/constants";
import { formatCategory, formatPrice, formatRating, pluralize } from "@/utils/format";
import type { ReviewFormValues } from "@/utils/validation";
import { ProductGallery } from "./ProductGallery";
import { ProductTabs } from "./ProductTabs";
import { RelatedProducts } from "./RelatedProducts";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";

const NO_REVIEWS: Review[] = [];
const EMPTY_REVIEWS_MAP: ReviewsByProduct = {};

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  useDocumentTitle(product.title);

  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, displayName } = useAuth();
  const { items } = useCart();
  const addToCart = useAddToCart();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [reviewsMap, setReviewsMap] = useLocalStorage(reviewsStorage, EMPTY_REVIEWS_MAP);

  const isOutOfStock = product.stock <= 0;
  const inCart = items.find((item) => item.productId === product.id)?.quantity ?? 0;
  const images = product.images.length > 0 ? product.images : [product.thumbnail];

  // Local reviews first (newest on top), then the ones from the API
  const localReviews = reviewsMap[String(product.id)] ?? NO_REVIEWS;
  const reviews = useMemo(() => [...localReviews, ...product.reviews], [localReviews, product.reviews]);

  // Recalculated only when the review list changes, not on every quantity click
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return product.rating;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  }, [reviews, product.rating]);

  function handleBack() {
    // Came from inside the app -> real "back" (the catalog filters are kept in the URL).
    // Opened the link directly -> there is no app history, go to the catalog.
    if (location.key !== "default") navigate(-1);
    else navigate("/");
  }

  function handleAddToCart() {
    const added = addToCart(product, quantity);
    if (added) setQuantity(1);
  }

  const handleRelatedAdd = useCallback((related: Product) => addToCart(related, 1), [addToCart]);

  const handleReviewSubmit = useCallback(
    (values: ReviewFormValues) => {
      const review: Review = {
        rating: values.rating,
        comment: values.comment,
        date: new Date().toISOString(),
        reviewerName: isLoggedIn ? displayName : "Guest",
      };
      // Immutable update: a new object with a new array for this product
      setReviewsMap({ ...reviewsMap, [String(product.id)]: [review, ...localReviews] });
      showToast("Review added ✓");
    },
    [isLoggedIn, displayName, reviewsMap, setReviewsMap, product.id, localReviews, showToast],
  );

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={handleBack} className="-ml-3 mb-4">
        ← Back to catalog
      </Button>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <ProductGallery images={images} title={product.title} />

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              {product.brand && <span>{product.brand} · </span>}
              <Link
                to={`/?category=${encodeURIComponent(product.category)}`}
                className="focus-ring rounded font-medium text-brand-700 capitalize hover:underline dark:text-brand-300"
              >
                {formatCategory(product.category)}
              </Link>
            </p>
            <h1 className="text-3xl leading-tight md:text-4xl">{product.title}</h1>
            <p className="text-sm">
              <span aria-hidden="true" className="text-low">
                ★
              </span>{" "}
              <span className="font-semibold">{formatRating(averageRating)}</span>
              <span className="text-ink-500 dark:text-ink-400"> · {pluralize(reviews.length, "review")}</span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <PriceTag price={product.price} discountPercentage={product.discountPercentage} size="lg" />
            <StockBadge stock={product.stock} />
          </div>

          <p className="max-w-prose leading-relaxed text-ink-700 dark:text-ink-200">{product.description}</p>

          <div className="flex flex-wrap items-center gap-3">
            <QuantityStepper
              value={quantity}
              max={Math.max(1, product.stock)}
              onChange={setQuantity}
              disabled={isOutOfStock}
            />
            <Button size="lg" onClick={handleAddToCart} disabled={isOutOfStock} className="flex-1 sm:flex-none">
              {isOutOfStock ? "Out of stock" : "Add to cart"}
            </Button>
          </div>

          {inCart > 0 && (
            <p className="text-sm text-ink-600 dark:text-ink-300">
              {inCart} in your cart.{" "}
              <Link to="/cart" className="focus-ring rounded font-semibold text-brand-700 hover:underline dark:text-brand-300">
                View cart
              </Link>
            </p>
          )}

          <p className="text-sm text-ink-500 dark:text-ink-400">
            Free shipping on orders from {formatPrice(SHIPPING.freeFrom)}.
          </p>
        </div>
      </div>

      <div className="mt-12 max-w-3xl">
        <ProductTabs
          tabs={[
            {
              id: "description",
              label: "Description",
              content: (
                <div className="flex flex-col gap-4">
                  <p className="leading-relaxed text-ink-700 dark:text-ink-200">{product.description}</p>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                    {product.brand && (
                      <>
                        <dt className="text-ink-500 dark:text-ink-400">Brand</dt>
                        <dd>{product.brand}</dd>
                      </>
                    )}
                    <dt className="text-ink-500 dark:text-ink-400">Category</dt>
                    <dd className="capitalize">{formatCategory(product.category)}</dd>
                    <dt className="text-ink-500 dark:text-ink-400">Available</dt>
                    <dd>{pluralize(product.stock, "unit")}</dd>
                  </dl>
                </div>
              ),
            },
            {
              id: "reviews",
              label: `Reviews (${reviews.length})`,
              content: (
                <div className="flex flex-col gap-6">
                  <ReviewForm onSubmit={handleReviewSubmit} />
                  <ReviewList reviews={reviews} />
                </div>
              ),
            },
          ]}
        />
      </div>

      <RelatedProducts category={product.category} currentId={product.id} onAdd={handleRelatedAdd} />
    </div>
  );
}
