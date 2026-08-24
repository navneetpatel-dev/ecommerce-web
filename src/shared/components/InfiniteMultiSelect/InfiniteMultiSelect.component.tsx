"use client";

import { useMemo } from "react";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination";
import { cn } from "@/shared/utils/cn";
import { formatLabel } from "@/shared/utils/formatLabel";
import { OptionRow } from "./OptionRow.component";
import type { InfiniteMultiSelectProps } from "./types";
import { useInfiniteSelectOptions } from "./useInfiniteSelectOptions.hook";

export function InfiniteMultiSelect({
  value,
  onChange,
  fetchPage,
  resetKey = null,
  searchPlaceholder = LABELS.search,
  emptyMessage = LABELS.noResults,
  noneSelectedLabel = LABELS.noneSelected,
  selectedCountLabel = LABELS.selectedCount,
  error = false,
  disabled = false,
  pageSize = DEFAULT_PAGE_LIMIT,
  className,
  listClassName,
  idPrefix = "infinite-multi-select",
}: InfiniteMultiSelectProps) {
  const {
    options,
    query,
    setQuery,
    initialLoading,
    loadingMore,
    loadError,
    sentinelRef,
  } = useInfiniteSelectOptions({ disabled, fetchPage, resetKey, pageSize });

  const selectedSet = useMemo(() => new Set(value), [value]);

  const toggle = (id: string) => {
    if (disabled) return;
    if (selectedSet.has(id)) {
      onChange(value.filter((item) => item !== id));
      return;
    }
    onChange([...value, id]);
  };

  const showEmpty = !initialLoading && options.length === 0;

  return (
    <div className={cn("space-y-2", className)}>
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        disabled={disabled}
      />
      <div
        className={cn(
          "max-h-48 space-y-1 overflow-y-auto overscroll-contain rounded-md border border-line p-2",
          error && "border-danger",
          disabled && "pointer-events-none opacity-60",
          listClassName,
        )}
        role="group"
        aria-busy={initialLoading || loadingMore}
      >
        {initialLoading ? (
          <p className="px-1 py-2 text-body-sm text-ink-muted">
            {LABELS.loading}
          </p>
        ) : showEmpty ? (
          <p className="px-1 py-2 text-body-sm text-ink-muted">
            {loadError ? LABELS.couldNotLoadOptions : emptyMessage}
          </p>
        ) : (
          <>
            {options.map((option) => (
              <OptionRow
                key={option.id}
                option={option}
                checked={selectedSet.has(option.id)}
                disabled={disabled}
                inputId={`${idPrefix}-${option.id}`}
                onToggle={toggle}
              />
            ))}
            <div ref={sentinelRef} className="h-1 w-full" aria-hidden />
            {loadingMore ? (
              <p className="px-1 py-1 text-body-sm text-ink-muted">
                {LABELS.loadingMore}
              </p>
            ) : null}
          </>
        )}
      </div>
      <p className="text-body-sm text-ink-muted">
        {value.length === 0
          ? noneSelectedLabel
          : formatLabel(selectedCountLabel, { count: String(value.length) })}
      </p>
    </div>
  );
}
