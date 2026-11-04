interface SpinnerProps {
  label?: string;
}

export function Spinner({ label = "Loading…" }: SpinnerProps) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-16 text-ink-500">
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-ink-200 border-t-brand-600 dark:border-ink-700 dark:border-t-brand-400"
      />
      <span className="text-sm">{label}</span>
    </div>
  );
}
