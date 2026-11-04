import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Spinner } from "@/components/ui/Spinner";
import { CrashTest } from "./CrashTest";
import { ErrorBoundary } from "./ErrorBoundary";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ScrollToTop } from "./ScrollToTop";

/**
 * One layout for every route: Header + current page (<Outlet />) + Footer.
 * The Header is written once, not on every page.
 */
export function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="focus-ring sr-only z-50 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <Header />

      <main id="main" className="page-container flex-1 py-6 md:py-10">
        {/* key={pathname}: navigating away from a crashed page resets the boundary */}
        <ErrorBoundary key={pathname}>
          {/* Lazy-loaded pages show this spinner while their JS chunk downloads */}
          <Suspense fallback={<Spinner label="Loading page…" />}>
            <CrashTest />
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
}
