export function ProductDetailsSkeleton() {
  return (
    <div role="status" aria-label="Loading product" className="animate-pulse">
      <div className="mb-6 h-5 w-36 rounded bg-ink-200 dark:bg-ink-800" />
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="aspect-square rounded-2xl bg-ink-200 dark:bg-ink-800" />
        <div className="flex flex-col gap-4">
          <div className="h-10 w-3/4 rounded bg-ink-200 dark:bg-ink-800" />
          <div className="h-4 w-1/3 rounded bg-ink-200 dark:bg-ink-800" />
          <div className="h-10 w-1/2 rounded bg-ink-200 dark:bg-ink-800" />
          <div className="h-24 rounded bg-ink-200 dark:bg-ink-800" />
          <div className="h-12 w-2/3 rounded bg-ink-200 dark:bg-ink-800" />
        </div>
      </div>
      <span className="sr-only">Loading product…</span>
    </div>
  );
}
