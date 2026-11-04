export type PageItem = number | "gap";

/**
 * Which page buttons to show: first, last, current and its neighbours.
 * getPageItems(5, 17) -> [1, "gap", 4, 5, 6, "gap", 17]
 */
export function getPageItems(page: number, totalPages: number): PageItem[] {
  const pages = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const items: PageItem[] = [];
  sorted.forEach((current, index) => {
    const previous = sorted[index - 1];
    if (previous !== undefined && current - previous > 1) items.push("gap");
    items.push(current);
  });
  return items;
}
