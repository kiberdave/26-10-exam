import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  children?: ReactNode; // the action: a link or a button — the parent decides (children = "slot")
}

export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-xl border border-dashed border-ink-300 px-6 py-14 text-center dark:border-ink-700">
      <p className="text-lg font-semibold">{title}</p>
      {description && <p className="text-sm text-ink-500 dark:text-ink-400">{description}</p>}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}
