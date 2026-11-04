import { Button } from "./Button";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

/** Error state: says what happened and offers the way out (Retry). */
export function ErrorMessage({ title = "Couldn't load this", message, onRetry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-xl border border-out/30 bg-out/5 px-6 py-10 text-center"
    >
      <h2 className="text-lg">{title}</h2>
      <p className="text-sm text-ink-600 dark:text-ink-300">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
