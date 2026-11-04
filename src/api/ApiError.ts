import { isRecord } from "@/utils/guards";

/**
 * An HTTP error with a status code.
 * Inheritance: ApiError IS an Error (extends), so `throw`/`catch` work as usual,
 * but it also carries `status` — 404 -> NotFound page, other codes -> message + Retry.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message); // call the parent (Error) constructor
    this.name = "ApiError";
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
}

// Type guard for `catch (error: unknown)`
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

// fetch() rejects with an AbortError when we cancel a request in an effect cleanup.
// That is not a real error — the component simply does not need the answer anymore.
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

/** Turns any thrown value into a message the UI can show. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (isRecord(error) && typeof error.message === "string") return error.message;
  return "Something went wrong. Please try again.";
}
