import { useEffect, useState } from "react";

/**
 * The current time, refreshed every `intervalMs`.
 * Order statuses are calculated from "now", so the page updates by itself
 * (Processing -> Shipped -> Delivered) without a reload.
 * Without the cleanup, the interval would keep running after leaving the page (memory leak).
 */
export function useNow(intervalMs: number): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(intervalId);
  }, [intervalMs]);

  return now;
}
