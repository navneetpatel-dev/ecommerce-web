"use client";

import { useEffect, useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { LABELS } from "@/shared/constants/labels";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination";
import { cn } from "@/shared/utils/cn";
import { OptionRow } from "./OptionRow";
import type { InfiniteSingleSelectProps } from "./types";
import { useInfiniteSelectOptions } from "./useInfiniteSelectOptions";

export function InfiniteSingleSelect({
  value,
  onChange,
  fetchPage,
  resetKey = null,
  pinnedOption = null,
  allowNone = false,
  noneValue = "__none__",
  noneLabel = LABELS.noneSelected,
  placeholder = LABELS.search,
  searchPlaceholder = LABELS.search,
  searchable = true,
  emptyMessage = LABELS.noResults,
  error = false,
  disabled = false,
  pageSize = DEFAULT_PAGE_LIMIT,
  className,
  listClassName,
}: InfiniteSingleSelectProps) {
  const listboxId = useId();
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const {
    options,
    query,
    setQuery,
    resetQuery,
    initialLoading,
    loadingMore,
    loadError,
    listRef,
    sentinelRef,
  } = useInfiniteSelectOptions({
    open,
    disabled,
    fetchPage,
    resetKey,
    pinnedOption,
    pageSize,
    searchable,
  });

  useEffect(() => {
    if (!value) {
      setSelectedLabel(null);
      return;
    }
    if (pinnedOption?.id === value) {
      setSelectedLabel(pinnedOption.label);
      return;
    }
    const match = options.find((option) => option.id === value);
    if (match) setSelectedLabel(match.label);
  }, [value, pinnedOption, options]);

  const showEmpty = !initialLoading && options.length === 0 && !allowNone;

  const triggerLabel = !value
    ? allowNone
      ? noneLabel
      : placeholder
    : selectedLabel ||
      (pinnedOption?.id === value ? pinnedOption.label : null) ||
      placeholder;

  const handleSelect = (next: string) => {
    if (disabled) return;
    const id = next === noneValue ? "" : next;
    if (id) {
      const match = options.find((option) => option.id === id);
      if (match) setSelectedLabel(match.label);
      else if (pinnedOption?.id === id) setSelectedLabel(pinnedOption.label);
    } else {
      setSelectedLabel(null);
    }
    onChange(id);
    setOpen(false);
  };

  return (
    <div className={cn("w-full", className)}>
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (disabled) return;
          setOpen(next);
          if (!next) {
            resetQuery();
          }
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            className={cn(
              "flex h-11 w-full cursor-pointer items-center justify-between rounded-sm border border-line-strong bg-surface-raised px-4 text-left text-[0.9375rem] outline-none hover:bg-paper/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-danger",
              !value && !allowNone && "text-ink-muted",
            )}
          >
            <span className="line-clamp-1 min-w-0 flex-1">{triggerLabel}</span>
            <ChevronDown size={16} className="shrink-0 text-ink-muted" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] space-y-2 p-1"
          onOpenAutoFocus={(event) => {
            if (!searchable) event.preventDefault();
          }}
        >
          {searchable ? (
            <div className="px-1 pt-1">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                disabled={disabled}
                autoFocus
              />
            </div>
          ) : null}
          <div
            ref={listRef}
            id={listboxId}
            role="listbox"
            className={cn(
              "max-h-56 overflow-y-auto overscroll-contain p-1",
              disabled && "pointer-events-none opacity-60",
              listClassName,
            )}
            aria-busy={initialLoading || loadingMore}
          >
            {initialLoading ? (
              <p className="px-4 py-2 text-[0.8125rem] text-ink-muted">
                {LABELS.loading}
              </p>
            ) : showEmpty ? (
              <p className="px-4 py-2 text-[0.8125rem] text-ink-muted">
                {loadError ? LABELS.couldNotLoadOptions : emptyMessage}
              </p>
            ) : (
              <>
                {allowNone ? (
                  <OptionRow
                    selected={!value}
                    label={noneLabel}
                    disabled={disabled}
                    onSelect={() => handleSelect(noneValue)}
                  />
                ) : null}
                {options.map((option) => (
                  <OptionRow
                    key={option.id}
                    selected={value === option.id}
                    label={option.label}
                    disabled={disabled}
                    onSelect={() => handleSelect(option.id)}
                  />
                ))}
                {!initialLoading && options.length === 0 && allowNone ? (
                  <p className="px-4 py-2 text-[0.8125rem] text-ink-muted">
                    {loadError ? LABELS.couldNotLoadOptions : emptyMessage}
                  </p>
                ) : null}
                <div ref={sentinelRef} className="h-1 w-full" aria-hidden />
                {loadingMore ? (
                  <p className="px-4 py-1 text-[0.8125rem] text-ink-muted">
                    {LABELS.loadingMore}
                  </p>
                ) : null}
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
