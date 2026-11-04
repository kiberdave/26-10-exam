import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { themeStorage } from "@/models/StorageService";
import { ThemeContext, type Theme, type ThemeContextValue } from "./ThemeContext";

function getInitialTheme(): Theme {
  const saved = themeStorage.get();
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * One theme state for the whole app (Header and Profile use the same toggle).
 * The effect syncs React state with the outside world: <html data-theme> + localStorage.
 * Tailwind's `dark:` variant is bound to [data-theme="dark"] in index.css.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    themeStorage.set(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo<ThemeContextValue>(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
