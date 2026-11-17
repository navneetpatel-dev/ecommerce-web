"use client";

import { ChevronDown, ChevronUp, Columns3, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import type { DataTableColumn } from "../../types/data-table/types";

export interface ColumnVisibilityDropdownProps<T> {
  columns: DataTableColumn<T>[];
  visibleColumnIds: string[];
  onChange: (visibleIds: string[]) => void;
  onReset: () => void;
  onReorder?: (orderedIds: string[]) => void;
  className?: string;
}

export function ColumnVisibilityDropdown<T>({
  columns,
  visibleColumnIds,
  onChange,
  onReset,
  onReorder,
  className,
}: ColumnVisibilityDropdownProps<T>) {
  const hiddenCount = columns.length - visibleColumnIds.length;

  const handleToggle = (colId: string) => {
    if (visibleColumnIds.includes(colId)) {
      // Don't allow hiding the last column
      if (visibleColumnIds.length <= 1) return;
      onChange(visibleColumnIds.filter((id) => id !== colId));
    } else {
      onChange([...visibleColumnIds, colId]);
    }
  };

  const handleMove = (
    colId: string,
    direction: "up" | "down",
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onReorder) return;
    const currentIds = columns.map((c) => c.id);
    const index = currentIds.indexOf(colId);
    if (index === -1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentIds.length) return;
    const nextIds = [...currentIds];
    const [moved] = nextIds.splice(index, 1);
    nextIds.splice(targetIndex, 0, moved);
    onReorder(nextIds);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={className ?? "h-9 gap-1.5 text-body-sm font-medium"}
          aria-label="Toggle visible columns"
        >
          <Columns3 className="size-4 text-ink-muted" aria-hidden />
          <span>Columns</span>
          {hiddenCount > 0 ? (
            <span className="flex size-5 items-center justify-center rounded-full bg-surface-muted text-caption font-semibold text-ink">
              {visibleColumnIds.length}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-56 p-3 space-y-2.5 z-50 bg-surface-raised border-line shadow-elevation-2"
      >
        <div className="flex items-center justify-between border-b border-line pb-2">
          <p className="text-body-sm font-semibold text-ink">Display Columns</p>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-muted hover:text-ink transition-colors"
          >
            <RotateCcw className="size-3" aria-hidden />
            <span>Reset</span>
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
          {columns.map((col, idx) => {
            const isFirst = idx === 0;
            const isVisible = visibleColumnIds.includes(col.id);
            const label =
              typeof col.header === "string"
                ? col.header
                : col.mobileLabel || col.id;

            return (
              <label
                key={col.id}
                className="flex items-center gap-2.5 rounded px-2 py-1 text-body-sm text-ink hover:bg-surface-muted/60 cursor-pointer select-none transition-colors"
              >
                <Checkbox
                  checked={isVisible}
                  disabled={isFirst && isVisible}
                  onCheckedChange={() => handleToggle(col.id)}
                  aria-label={`Toggle column ${label}`}
                />
                <span className="truncate flex-1">{label}</span>
                {isFirst && (
                  <span className="text-[10px] text-ink-muted/70 font-mono">
                    required
                  </span>
                )}
                {onReorder && (
                  <div className="flex items-center gap-0.5 opacity-60 hover:opacity-100">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={(e) => handleMove(col.id, "up", e)}
                      className="p-0.5 rounded hover:bg-surface-muted disabled:opacity-20 text-ink-muted hover:text-ink"
                      aria-label={`Move column ${label} up`}
                      title="Move up"
                    >
                      <ChevronUp className="size-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === columns.length - 1}
                      onClick={(e) => handleMove(col.id, "down", e)}
                      className="p-0.5 rounded hover:bg-surface-muted disabled:opacity-20 text-ink-muted hover:text-ink"
                      aria-label={`Move column ${label} down`}
                      title="Move down"
                    >
                      <ChevronDown className="size-3" />
                    </button>
                  </div>
                )}
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
