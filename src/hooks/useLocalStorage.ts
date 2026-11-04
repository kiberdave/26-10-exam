import { useCallback, useState } from "react";
import type { StorageService } from "@/models/StorageService";

/**
 * useState that is also saved to localStorage.
 * Reading goes through StorageService, so broken data falls back to `initialValue`.
 */
export function useLocalStorage<T>(
  storage: StorageService<T>,
  initialValue: T,
): [T, (value: T) => void] {
  // Lazy initial state: localStorage is read only on the first render
  const [value, setValue] = useState<T>(() => storage.get() ?? initialValue);

  // Saving happens in the setter (an event), not in an effect — so a component
  // that only reads never writes anything back.
  const setAndStore = useCallback(
    (next: T) => {
      setValue(next);
      storage.set(next);
    },
    [storage],
  );

  return [value, setAndStore];
}
