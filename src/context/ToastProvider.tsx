import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { ToastItem } from "@/components/ui/ToastItem";
import { ToastContext, type Toast, type ToastContextValue, type ToastVariant } from "./ToastContext";

const MAX_TOASTS = 3;

interface ToastProviderProps {
  children: ReactNode;
}

/** Shared toast system: any component calls showToast("Added to cart ✓"). */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
    const toast: Toast = { id: nextId.current++, message, variant };
    // keep only the newest few
    setToasts((current) => [...current, toast].slice(-MAX_TOASTS));
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* aria-live: screen readers announce new toasts without moving focus */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
