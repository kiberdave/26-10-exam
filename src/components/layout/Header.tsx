import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import { ThemeToggle } from "./ThemeToggle";

// NavLink passes { isActive } — the current page's link gets the "active" look
function navLinkClass({ isActive }: { isActive: boolean }): string {
  return cn(
    "focus-ring relative inline-flex h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors",
    isActive
      ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200"
      : "text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white",
  );
}

function CartBadge({ count }: { count: number }) {
  if (count <= 0) return null; // 0 items -> no badge at all
  return (
    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-tag px-1 text-xs font-bold text-tag-ink tabular-nums">
      {count}
    </span>
  );
}

export function Header() {
  const { isLoggedIn, displayName, logout } = useAuth();
  const { totals } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close the mobile menu after navigating to another page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  function handleLogout() {
    logout(); // the cart stays as it is
    showToast("You're logged out", "info");
    navigate("/");
  }

  const cartLabel = `Cart, ${totals.itemCount} ${totals.itemCount === 1 ? "item" : "items"}`;

  // The same links are rendered in the desktop bar and in the mobile panel
  const links = (
    <>
      <NavLink to="/" end className={navLinkClass}>
        Catalog
      </NavLink>
      <NavLink to="/cart" className={navLinkClass} aria-label={cartLabel}>
        Cart
        <CartBadge count={totals.itemCount} />
      </NavLink>
      {isLoggedIn && (
        <NavLink to="/orders" className={navLinkClass}>
          Orders
        </NavLink>
      )}
    </>
  );

  const accountLinks = isLoggedIn ? (
    <>
      <NavLink to="/profile" className={navLinkClass}>
        <span className="max-w-40 truncate">{displayName}</span>
      </NavLink>
      <button
        type="button"
        onClick={handleLogout}
        className="focus-ring inline-flex h-11 items-center rounded-lg px-3 text-sm font-semibold text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white"
      >
        Log out
      </button>
    </>
  ) : (
    <NavLink to="/login" className={navLinkClass}>
      Log in
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/90 backdrop-blur dark:border-ink-800 dark:bg-ink-950/90">
      <div className="page-container flex h-16 items-center gap-2">
        <Link to="/" className="focus-ring -ml-1 mr-2 flex items-center gap-1.5 rounded-lg p-1" aria-label="10X Shop — catalog">
          <span className="grid h-8 place-items-center rounded-md bg-brand-600 px-1.5 text-sm font-extrabold text-white [font-variation-settings:'wdth'_125]">
            10X
          </span>
          <span className="text-lg font-extrabold tracking-tight [font-variation-settings:'wdth'_118]">Shop</span>
        </Link>

        {/* Desktop navigation (≥ 768px) */}
        <nav aria-label="Main" className="hidden flex-1 items-center gap-1 md:flex">
          {links}
        </nav>
        <div className="hidden items-center gap-1 md:flex">
          <ThemeToggle />
          {accountLinks}
        </div>

        {/* Mobile: cart stays visible, everything else goes into the burger menu */}
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <NavLink to="/cart" className={navLinkClass} aria-label={cartLabel}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6h15l-1.5 9h-12z M6 6 5 3H2 M9 20h.01 M18 20h.01" />
            </svg>
            <CartBadge count={totals.itemCount} />
          </NavLink>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="focus-ring grid size-11 place-items-center rounded-lg text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
              {isMenuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-ink-200 bg-white pb-3 md:hidden dark:border-ink-800 dark:bg-ink-950"
        >
          <div className="page-container flex flex-col gap-1 pt-2">
            {links}
            <div className="my-1 border-t border-ink-100 dark:border-ink-800" />
            {accountLinks}
            <ThemeToggle withLabel className="justify-start" />
          </div>
        </nav>
      )}
    </header>
  );
}
