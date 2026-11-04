import { useSearchParams } from "react-router-dom";

/**
 * Demo helper for the defense: open any page with ?crash (e.g. /cart?crash)
 * and this component throws during render — the ErrorBoundary fallback appears
 * while the Header keeps working.
 */
export function CrashTest() {
  const [searchParams] = useSearchParams();
  if (searchParams.has("crash")) {
    throw new Error("Test error: thrown on purpose because the URL contains ?crash");
  }
  return null;
}
