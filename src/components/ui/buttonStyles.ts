import { cn } from "@/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 disabled:bg-ink-200 disabled:text-ink-500 dark:bg-brand-500 dark:hover:bg-brand-400 dark:disabled:bg-ink-800 dark:disabled:text-ink-500",
  secondary:
    "border border-ink-200 bg-white text-ink-900 hover:border-ink-300 hover:bg-ink-50 disabled:text-ink-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:hover:bg-ink-800",
  ghost:
    "text-ink-600 hover:bg-ink-100 hover:text-ink-900 disabled:text-ink-300 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white",
  danger: "text-out hover:bg-out/10 disabled:text-ink-300",
};

// md and lg are at least 44px high — comfortable touch targets on mobile (O3)
const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

/** Shared by <Button> and by <Link>s that must look like buttons. */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}
