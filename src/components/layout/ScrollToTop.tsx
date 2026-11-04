import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * In an SPA the browser does not reset the scroll position between "pages".
 * When the pathname changes, scroll back to the top.
 * Only `pathname` is watched: changing ?q= or ?sort= keeps your place in the catalog.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
