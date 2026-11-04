import { useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface ProductTabsProps {
  tabs: TabItem[];
}

/** Accessible tabs: role="tablist" / "tab" / "tabpanel", only the active panel is rendered. */
export function ProductTabs({ tabs }: ProductTabsProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  return (
    <div>
      <div role="tablist" aria-label="Product information" className="flex gap-1 border-b border-ink-200 dark:border-ink-800">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab?.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveId(tab.id)}
              className={cn(
                "focus-ring -mb-px h-11 border-b-2 px-4 text-sm font-semibold transition-colors",
                isActive
                  ? "border-brand-600 text-ink-900 dark:border-brand-400 dark:text-white"
                  : "border-transparent text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {activeTab && (
        <div role="tabpanel" id={`panel-${activeTab.id}`} aria-labelledby={`tab-${activeTab.id}`} className="pt-5">
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
