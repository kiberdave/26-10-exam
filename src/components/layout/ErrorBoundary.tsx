import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches errors thrown while RENDERING the components inside it and shows a fallback
 * instead of a blank white page. It must be a class: function components have no
 * equivalent of getDerivedStateFromError / componentDidCatch.
 * (It does not catch errors in event handlers or async code — those use try/catch.)
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  // 1) render phase: switch to the fallback UI
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  // 2) commit phase: a place for logging (a real app would send it to Sentry etc.)
  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught:", error, info.componentStack);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
          <h1 className="text-2xl">Something went wrong.</h1>
          <p className="text-ink-500 dark:text-ink-400">
            This part of the page crashed. Reloading usually fixes it.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="focus-ring h-11 rounded-lg bg-brand-600 px-5 font-semibold text-white hover:bg-brand-700"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
