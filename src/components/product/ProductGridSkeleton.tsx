interface ProductGridSkeletonProps {
  count?: number;
}

/** Grey placeholder cards with the same size as real ones — no layout jump when data arrives. */
export function ProductGridSkeleton({ count = 12 }: ProductGridSkeletonProps) {
  return (
    <div role="status" aria-label="Loading products">
      <ul aria-hidden="true" className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: count }, (_, index) => (
          <li
            key={index}
            className="flex animate-pulse flex-col gap-3 rounded-xl border border-ink-200 bg-white p-3 dark:border-ink-800 dark:bg-ink-900"
          >
            <div className="aspect-square rounded-lg bg-ink-100 dark:bg-ink-800" />
            <div className="h-3 w-1/3 rounded bg-ink-100 dark:bg-ink-800" />
            <div className="h-4 w-4/5 rounded bg-ink-100 dark:bg-ink-800" />
            <div className="h-6 w-1/2 rounded bg-ink-100 dark:bg-ink-800" />
            <div className="h-11 rounded-lg bg-ink-100 dark:bg-ink-800" />
          </li>
        ))}
      </ul>
      <span className="sr-only">Loading products…</span>
    </div>
  );
}
