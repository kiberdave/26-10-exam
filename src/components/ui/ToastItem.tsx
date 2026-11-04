import { useEffect } from "react";
import type { Toast } from "@/context/ToastContext";
import { cn } from "@/utils/cn";

const TOAST_DURATION_MS = 3000;

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: number) => void;
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  // Each toast removes itself after 3 s. Cleanup clears the timer if the toast
  // is closed earlier — no setState on an unmounted component.
  useEffect(() => {
    const timerId = setTimeout(() => onDismiss(toast.id), TOAST_DURATION_MS);
    return () => clearTimeout(timerId);
  }, [toast.id, onDismiss]);

  return (
    <div
      role={toast.variant === "error" ? "alert" : "status"}
      className={cn(
        "pointer-events-auto flex w-full max-w-sm animate-toast-in items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium shadow-lift",
        toast.variant === "success" && "bg-ink-900 text-white dark:bg-white dark:text-ink-900",
        toast.variant === "error" && "bg-out text-white",
        toast.variant === "info" && "bg-brand-600 text-white",
      )}
    >
      <span className="flex-1">{toast.message}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="focus-ring -mr-1 grid size-7 place-items-center rounded-md opacity-70 hover:opacity-100"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}
