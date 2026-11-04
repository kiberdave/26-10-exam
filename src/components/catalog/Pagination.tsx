import { cn } from "@/utils/cn";
import { getPageItems } from "@/utils/pagination";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const baseButton =
  "focus-ring grid h-11 min-w-11 place-items-center rounded-lg px-3 text-sm font-semibold tabular-nums transition-colors";

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const arrowClass = cn(
    baseButton,
    "text-ink-700 hover:bg-ink-100 disabled:cursor-not-allowed disabled:text-ink-300 disabled:hover:bg-transparent dark:text-ink-200 dark:hover:bg-ink-800 dark:disabled:text-ink-700",
  );

  return (
    <nav aria-label="Pagination" className="flex justify-center">
      <ul className="flex flex-wrap items-center justify-center gap-1">
        <li>
          <button
            type="button"
            className={arrowClass}
            onClick={() => onChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            ‹
          </button>
        </li>

        {getPageItems(page, totalPages).map((item, index) =>
          item === "gap" ? (
            // A gap has no own identity; its position is stable enough for a key here
            <li key={`gap-${index}`} aria-hidden="true" className="px-1 text-ink-400">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                onClick={() => onChange(item)}
                aria-current={item === page ? "page" : undefined}
                aria-label={`Page ${item}`}
                className={cn(
                  baseButton,
                  item === page
                    ? "bg-ink-900 text-white dark:bg-white dark:text-ink-900"
                    : "text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800",
                )}
              >
                {item}
              </button>
            </li>
          ),
        )}

        <li>
          <button
            type="button"
            className={arrowClass}
            onClick={() => onChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            ›
          </button>
        </li>
      </ul>
    </nav>
  );
}
