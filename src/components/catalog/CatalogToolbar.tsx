import { useEffect, useState } from "react";
import { inputClasses } from "@/components/ui/formStyles";
import { useDebounce } from "@/hooks/useDebounce";
import type { SortOption } from "@/types/api";
import type { Category } from "@/types/product";
import { SEARCH_DEBOUNCE_MS } from "@/utils/constants";
import { SORT_OPTIONS, isSortOption } from "@/utils/url";

interface CatalogToolbarProps {
  q: string; // current values come from the URL (single source of truth)
  category: string;
  sort: SortOption;
  categories: Category[];
  onSearch: (q: string) => void;
  onCategoryChange: (slug: string) => void;
  onSortChange: (sort: SortOption) => void;
}

export function CatalogToolbar({
  q,
  category,
  sort,
  categories,
  onSearch,
  onCategoryChange,
  onSortChange,
}: CatalogToolbarProps) {
  // The input updates instantly (local state) — the URL only after a 400 ms pause.
  const [searchInput, setSearchInput] = useState(q);
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);

  // When the URL changes from outside (Back/Forward, "Clear filters"), show it in the input.
  // This is React's "adjust state when a prop changes" pattern: done during render,
  // so effects below never see an outdated input value.
  const [syncedQ, setSyncedQ] = useState(q);
  if (q !== syncedQ) {
    setSyncedQ(q);
    if (searchInput.trim() !== q) setSearchInput(q);
  }

  // Input -> URL, once the user has stopped typing
  useEffect(() => {
    if (debouncedSearch !== searchInput) return; // still typing — the debounce has not caught up
    const next = debouncedSearch.trim();
    if (next !== q) onSearch(next);
  }, [debouncedSearch, searchInput, q, onSearch]);

  return (
    <div role="search" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
      <div className="sm:col-span-2 lg:col-span-1">
        <label htmlFor="catalog-search" className="sr-only">
          Search products
        </label>
        <input
          id="catalog-search"
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search products, e.g. phone"
          autoComplete="off"
          className={inputClasses()}
        />
      </div>

      <div>
        <label htmlFor="catalog-category" className="sr-only">
          Category
        </label>
        <select
          id="catalog-category"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className={inputClasses()}
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="catalog-sort" className="sr-only">
          Sort by
        </label>
        <select
          id="catalog-sort"
          value={sort}
          onChange={(event) => {
            const value = event.target.value;
            if (isSortOption(value)) onSortChange(value); // type guard instead of `as SortOption`
          }}
          className={inputClasses()}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
