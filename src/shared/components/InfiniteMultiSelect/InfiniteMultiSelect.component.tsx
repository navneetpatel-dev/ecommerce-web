"use client";

import { useMemo } from "react";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import { cn } from "@/shared/utils/dom/cn";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { infiniteMultiSelectStyles } from "../../styles/infinite-multi-select/infiniteMultiSelect.styles";
import { OptionRow } from "./OptionRow.component";
import type { InfiniteMultiSelectProps } from "../../types/infinite-multi-select/types";
import { useInfiniteSelectOptions } from "../../hooks/infinite-multi-select/useInfiniteSelectOptions.hook";

export function InfiniteMultiSelect(props: InfiniteMultiSelectProps) {
  return (
    <InfiniteMultiSelectBody
      key={String(props.resetKey ?? "")}
      {...props}
    />
  );
}

function InfiniteMultiSelectBody({
  value,
  onChange,
  fetchPage,
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
  } = useInfiniteSelectOptions({ disabled, fetchPage, pageSize });

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
    <div className={cn(infiniteMultiSelectStyles.root, className)}>
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        disabled={disabled}
      />
      <div
        className={cn(
          infiniteMultiSelectStyles.listbox,
          error && infiniteMultiSelectStyles.listboxError,
          disabled && infiniteMultiSelectStyles.listboxDisabled,
          listClassName,
        )}
        role="group"
        aria-busy={initialLoading || loadingMore}
      >
        {initialLoading ? (
          <p className={infiniteMultiSelectStyles.loading}>{LABELS.loading}</p>
        ) : showEmpty ? (
          <p className={infiniteMultiSelectStyles.empty}>
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
            <div
              ref={sentinelRef}
              className={infiniteMultiSelectStyles.sentinel}
              aria-hidden
            />
            {loadingMore ? (
              <p className={infiniteMultiSelectStyles.loadingMore}>
                {LABELS.loadingMore}
              </p>
            ) : null}
          </>
        )}
      </div>
      <p className={infiniteMultiSelectStyles.summaryText}>
        {value.length === 0
          ? noneSelectedLabel
          : formatLabel(selectedCountLabel, { count: String(value.length) })}
      </p>
    </div>
  );
}
