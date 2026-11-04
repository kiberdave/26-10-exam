import { useCallback, useEffect, useState } from "react";
import { api } from "@/api/ApiClient";
import { getErrorMessage, isAbortError, isApiError } from "@/api/ApiError";
import type { AsyncState } from "@/types/api";

interface UseFetchResult<T> {
  state: AsyncState<T>;
  reload: () => void;
}

interface FetchResult<T> {
  path: string | null; // which request this state belongs to
  state: AsyncState<T>;
}

/**
 * Generic data-loading hook: useFetch<Product>("/products/1").
 * - path === null -> nothing to load ("idle"), e.g. an invalid id in the URL
 * - a new path    -> the effect re-runs (path is in the dependency array)
 * - cleanup aborts the previous request, so a slow old answer can never overwrite
 *   a newer one (race condition). Same idea as the `ignore` flag from the useEffect
 *   lecture, but it also cancels the network request itself.
 */
export function useFetch<T>(path: string | null): UseFetchResult<T> {
  const [result, setResult] = useState<FetchResult<T>>({ path: null, state: { status: "idle" } });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (path === null) return;

    const controller = new AbortController();
    setResult({ path, state: { status: "loading" } });

    api
      .get<T>(path, controller.signal)
      .then((data) => setResult({ path, state: { status: "success", data } }))
      .catch((error: unknown) => {
        if (isAbortError(error)) return; // we cancelled it ourselves — not an error
        setResult({
          path,
          state: {
            status: "error",
            message: getErrorMessage(error),
            httpStatus: isApiError(error) ? error.status : undefined,
          },
        });
      });

    return () => controller.abort();
  }, [path, reloadKey]);

  // "Retry" button: same path, new reloadKey -> the effect runs again
  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  // Derived, not synced: if the stored result belongs to an OLD path, we are loading
  // the new one. So the page never flashes the previous product for one frame.
  let state: AsyncState<T>;
  if (path === null) state = { status: "idle" };
  else if (result.path !== path) state = { status: "loading" };
  else state = result.state;

  return { state, reload };
}
