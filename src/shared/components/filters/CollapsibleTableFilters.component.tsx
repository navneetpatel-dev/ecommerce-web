"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/dom/cn";

export interface CollapsibleTableFiltersProps {
  /** Optional title for the toggle button, defaults to "Filters". */
  title?: string;
  /** Number of currently active filters, displayed as a badge. */
  activeCount?: number;
  /** Callback to clear/reset all filters. */
  onClear?: () => void;
  /** The filter controls to be rendered when expanded. */
  children: ReactNode;
  /** Initial open state, defaults to false for maximum table visibility. */
  defaultOpen?: boolean;
  /** Optional custom class name for the wrapper. */
  className?: string;
  /** Optional right-aligned summary or secondary action. */
  summary?: ReactNode;
}

/**
 * Collapsible wrapper for table filters that gives tables maximum room
 * in one sight while keeping filter/search controls easily accessible.
 */
export function CollapsibleTableFilters({
  title = "Filters",
  activeCount = 0,
  onClear,
  children,
  defaultOpen = false,
  className,
  summary,
}: CollapsibleTableFiltersProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("space-y-3 mb-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={isOpen ? "secondary" : "outline"}
            size="sm"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            className="h-9 gap-2 text-body-sm font-medium transition-all"
          >
            <SlidersHorizontal className="size-4 text-ink-muted" aria-hidden />
            <span>{isOpen ? `Hide ${title}` : title}</span>
            {activeCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-ink text-paper text-caption font-semibold">
                {activeCount}
              </span>
            )}
            <ChevronDown
              className={cn(
                "size-3.5 text-ink-muted transition-transform duration-200",
                isOpen && "rotate-180",
              )}
              aria-hidden
            />
          </Button>

          {activeCount > 0 && onClear && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-9 gap-1 text-body-sm text-ink-muted hover:text-ink"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              <span>Reset</span>
            </Button>
          )}
        </div>

        {summary && (
          <div className="text-body-sm text-ink-muted">{summary}</div>
        )}
      </div>

      {isOpen && (
        <div className="overflow-hidden rounded-xl border border-line bg-surface p-4 shadow-sm animate-in fade-in-50 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
