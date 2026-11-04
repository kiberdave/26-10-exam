import { cn } from "@/utils/cn";

interface QuantityStepperProps {
  value: number;
  max: number;
  min?: number;
  onChange: (next: number) => void; // callback prop: the parent owns the state
  disabled?: boolean;
  label?: string;
  size?: "sm" | "md";
}

/** − [ 2 ] +   — buttons are disabled at the edges: min ≤ value ≤ max */
export function QuantityStepper({
  value,
  max,
  min = 1,
  onChange,
  disabled = false,
  label = "Quantity",
  size = "md",
}: QuantityStepperProps) {
  const buttonSize = size === "md" ? "size-11" : "size-9";
  const buttonClass = cn(
    "focus-ring grid place-items-center text-lg font-semibold text-ink-700 transition-colors hover:bg-ink-100 disabled:cursor-not-allowed disabled:text-ink-300 dark:text-ink-200 dark:hover:bg-ink-800 dark:disabled:text-ink-600",
    buttonSize,
  );

  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center overflow-hidden rounded-lg border border-ink-200 bg-white dark:border-ink-700 dark:bg-ink-900"
    >
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <output aria-live="polite" className="min-w-10 text-center text-sm font-semibold tabular-nums">
        {value}
      </output>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
