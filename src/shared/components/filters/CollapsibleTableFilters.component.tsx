"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/dom/cn";
import { useFilterHotkey } from "../../hooks/filters/useFilterHotkey.hook";

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
  /** Controlled open state. When set, the parent decides when the panel opens. */
  open?: boolean;
  /** Called when the user toggles the panel (or the hotkey opens it). */
  onOpenChange?: (open: boolean) => void;
  /** Optional right-aligned summary or secondary action. */
  summary?: ReactNode;
  /** Enables pressing '/' to expand and focus the search filter (defaults to true). */
  enableHotkey?: boolean;
  /** Optional result count indicator, e.g. { count: 8, total: 30 }. */
  resultCount?: { count: number; total?: number };
}

/**
 * Collapsible wrapper for table filters that gives tables maximum room
 * in one sight while keeping filter/search controls easily accessible.
 * Supports keyboard shortcut ('/'), instant clear, active count badge,
 * and smooth soft practical expand/collapse animation.
 */
export function CollapsibleTableFilters({
  title = "Filters",
  activeCount = 0,
  onClear,
  children,
  defaultOpen = false,
  className,
  open,
  onOpenChange,
  summary,
  enableHotkey = true,
  resultCount,
}: CollapsibleTableFiltersProps) {
  const [openState, setOpenState] = useState(defaultOpen);
  const isOpen = open ?? openState;
  const setIsOpen = useCallback(
    (next: boolean) => {
      setOpenState(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );
  const containerRef = useRef<HTMLDivElement | null>(null);

  useFilterHotkey(enableHotkey, containerRef, setIsOpen);

  return (
    <div ref={containerRef} className={cn("space-y-3 mb-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={isOpen ? "secondary" : "outline"}
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            className="h-9 gap-2 text-body-sm font-medium transition-all"
          >
            <SlidersHorizontal className="size-4 text-ink-muted" aria-hidden />
            <span>{isOpen ? `Hide ${title}` : title}</span>
            {Boolean(activeCount && activeCount > 0) ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-ink text-paper text-caption font-semibold">
                {activeCount}
              </span>
            ) : null}
            <ChevronDown
              className={cn(
                "size-3.5 text-ink-muted transition-transform duration-200",
                isOpen && "rotate-180",
              )}
              aria-hidden
            />
            {enableHotkey && (
              <kbd
                aria-hidden
                className="hidden lg:inline-flex h-4 items-center justify-center rounded border border-line bg-surface-muted px-1 font-mono text-[10px] font-medium text-ink-muted/80 ml-0.5"
              >
                /
              </kbd>
            )}
          </Button>

          {Boolean(activeCount && activeCount > 0) && onClear ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-9 gap-1.5 text-body-sm text-ink-muted hover:text-ink cursor-pointer"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              <span>Clear filters</span>
            </Button>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {resultCount != null && (
            <span className="text-body-sm text-ink-muted">
              Showing{" "}
              <strong className="text-ink font-semibold">
                {resultCount.count}
              </strong>
              {resultCount.total != null &&
              resultCount.total > resultCount.count ? (
                <> of {resultCount.total}</>
              ) : null}{" "}
              {resultCount.count === 1 ? "result" : "results"}
            </span>
          )}

          {summary && (
            <div className="text-body-sm text-ink-muted">{summary}</div>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="collapsible-filters-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              transition: {
                height: { duration: 0.22, ease: [0.25, 1, 0.5, 1] },
                opacity: { duration: 0.18, delay: 0.04 },
              },
            }}
            exit={{
              opacity: 0,
              height: 0,
              transition: {
                height: { duration: 0.18, ease: [0.25, 1, 0.5, 1] },
                opacity: { duration: 0.12 },
              },
            }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
