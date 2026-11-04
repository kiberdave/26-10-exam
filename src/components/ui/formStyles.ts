import { cn } from "@/utils/cn";

/** Shared look for <input>, <select>, <textarea>; red border when the field has an error. */
export function inputClasses(hasError = false, className?: string): string {
  return cn(
    "w-full rounded-lg border bg-white px-3 py-2.5 text-base text-ink-900 placeholder:text-ink-400 transition-colors",
    "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25 focus:outline-none",
    "disabled:cursor-not-allowed disabled:bg-ink-100",
    "dark:bg-ink-900 dark:text-ink-100 dark:placeholder:text-ink-500 dark:disabled:bg-ink-800",
    hasError
      ? "border-out focus:border-out focus:ring-out/25 dark:border-red-400"
      : "border-ink-200 hover:border-ink-300 dark:border-ink-700 dark:hover:border-ink-600",
    className,
  );
}
