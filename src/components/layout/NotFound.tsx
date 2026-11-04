import { Link } from "react-router-dom";
import { buttonClasses } from "@/components/ui/buttonStyles";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

/** Shared by the * route, unknown products (/products/999999, /products/abc) and unknown orders. */
export function NotFound() {
  useDocumentTitle("Page not found");

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
      <p aria-hidden="true" className="price-tag text-4xl">
        404
      </p>
      <h1 className="text-3xl">Page not found</h1>
      <p className="text-ink-500 dark:text-ink-400">The page you are looking for does not exist.</p>
      <Link to="/" className={buttonClasses("primary", "lg")}>
        Go to catalog
      </Link>
    </div>
  );
}
