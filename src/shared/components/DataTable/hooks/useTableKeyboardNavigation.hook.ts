"use client";

import { useEffect, useState } from "react";

export interface UseTableKeyboardNavigationOptions<T> {
  rows: T[];
  enabled: boolean;
  getRowId?: (row: T, index: number) => string;
  onActivateRow?: (row: T, index: number) => void;
  selectable?: boolean;
  onToggleSelectRow?: (rowId: string) => void;
}

export function useTableKeyboardNavigation<T>({
  rows,
  enabled,
  getRowId,
  onActivateRow,
  selectable,
  onToggleSelectRow,
}: UseTableKeyboardNavigationOptions<T>) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled || rows.length === 0) return;

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      // Don't hijack keys if user is typing in form controls or dialogs
      const target = e.target as HTMLElement | null;
      const tag = (target?.tagName || "").toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        Boolean(target?.isContentEditable) ||
        target?.closest("[role='dialog']")
      ) {
        return;
      }

      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          if (prev === null) return 0;
          return Math.min(rows.length - 1, prev + 1);
        });
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          if (prev === null) return rows.length - 1;
          return Math.max(0, prev - 1);
        });
      } else if (e.key === "x" && selectable) {
        if (
          focusedIndex !== null &&
          focusedIndex >= 0 &&
          focusedIndex < rows.length
        ) {
          e.preventDefault();
          const targetRow = rows[focusedIndex];
          const rowId =
            getRowId?.(targetRow, focusedIndex) ??
            String((targetRow as { id?: unknown }).id ?? focusedIndex);
          onToggleSelectRow?.(rowId);
        }
      } else if (e.key === "Enter") {
        if (
          focusedIndex !== null &&
          focusedIndex >= 0 &&
          focusedIndex < rows.length
        ) {
          e.preventDefault();
          onActivateRow?.(rows[focusedIndex], focusedIndex);
        }
      } else if (e.key === "Escape") {
        setFocusedIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    enabled,
    rows,
    focusedIndex,
    selectable,
    getRowId,
    onActivateRow,
    onToggleSelectRow,
  ]);

  return {
    focusedIndex,
    setFocusedIndex,
  };
}
