import { Stars } from "@/components/ui/Stars";
import type { Review } from "@/types/product";
import { formatDate } from "@/utils/format";

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return <p className="text-sm text-ink-500 dark:text-ink-400">No reviews yet. Be the first to write one.</p>;
  }

  return (
    <ul className="divide-y divide-ink-200 dark:divide-ink-800">
      {reviews.map((review) => (
        // Reviews have no id: date + name together are unique (dates are ISO with ms)
        <li key={`${review.date}-${review.reviewerName}`} className="py-4 first:pt-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold">{review.reviewerName}</p>
            <time dateTime={review.date} className="text-xs text-ink-500 dark:text-ink-400">
              {formatDate(review.date)}
            </time>
          </div>
          <Stars rating={review.rating} />
          <p className="mt-1 text-sm text-ink-700 dark:text-ink-200">{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}
