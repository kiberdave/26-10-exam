import type { InputHTMLAttributes } from "react";
import { inputClasses } from "./formStyles";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}

/**
 * Label + input + error message under the field.
 * htmlFor/id connect the label to the input; aria-describedby makes
 * screen readers read the error together with the field.
 */
export function TextField({ id, label, error, hint, className, ...inputProps }: TextFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ");

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={inputClasses(Boolean(error))}
        {...inputProps}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1 text-xs text-ink-500 dark:text-ink-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1 text-sm text-out dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
