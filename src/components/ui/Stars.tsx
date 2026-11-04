interface StarsProps {
  rating: number; // 0..5
}

/** ★★★★☆ — rounded to whole stars, with a readable label for screen readers. */
export function Stars({ rating }: StarsProps) {
  const filled = Math.round(rating);
  return (
    <span aria-label={`${rating.toFixed(1)} out of 5 stars`} className="text-sm tracking-tight">
      <span aria-hidden="true" className="text-low">
        {"★".repeat(filled)}
      </span>
      <span aria-hidden="true" className="text-ink-300 dark:text-ink-600">
        {"★".repeat(5 - filled)}
      </span>
    </span>
  );
}
