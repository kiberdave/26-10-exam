import { useEffect } from "react";

/** Keeps the browser tab title in sync with the page: "Cart · 10X Shop". */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title ? `${title} · 10X Shop` : "10X Shop";
  }, [title]);
}
