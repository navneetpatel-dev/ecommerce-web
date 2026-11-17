"use client";

import type { ReactNode } from "react";
import { CheckSquare, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/dom/cn";

export interface FloatingBulkActionBarProps {
  selectedCount: number;
  totalCount?: number;
  onClearSelection: () => void;
  children?: ReactNode;
  className?: string;
  itemLabel?: string;
}

export function FloatingBulkActionBar({
  selectedCount,
  totalCount,
  onClearSelection,
  children,
  className,
  itemLabel = "selected",
}: FloatingBulkActionBarProps) {
  if (selectedCount <= 0) return null;

  return (
    <aside
      role="region"
      aria-label="Bulk actions"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-40",
        "flex max-w-[calc(100vw-2rem)] flex-wrap items-center justify-between gap-3 sm:gap-4",
        "rounded-xl border border-line bg-surface-raised/95 px-4 py-3 sm:px-5 sm:py-3.5",
        "backdrop-blur-md shadow-elevation-3 text-ink",
        "animate-in fade-in slide-in-from-bottom-4 duration-200 ease-out",
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <CheckSquare className="size-4" aria-hidden />
        </span>
        <p className="text-body-sm text-ink whitespace-nowrap">
          <span className="font-semibold text-ink">{selectedCount}</span>
          {totalCount != null ? (
            <span className="text-ink-muted"> of {totalCount}</span>
          ) : null}{" "}
          <span className="text-ink-muted">{itemLabel}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {children}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onClearSelection}
          className="h-8 gap-1.5 px-2.5 text-body-sm text-ink-muted hover:text-ink"
          aria-label="Clear selection"
        >
          <X className="size-3.5" aria-hidden />
          <span>Clear</span>
        </Button>
      </div>
    </aside>
  );
}
