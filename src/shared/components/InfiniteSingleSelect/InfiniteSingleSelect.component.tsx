"use client";

import { useId, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { LABELS } from "@/shared/constants/labels";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import { cn } from "@/shared/utils/dom/cn";
import { infiniteSingleSelectStyles } from "../../styles/infinite-single-select/infiniteSingleSelect.styles";
import type { InfiniteSingleSelectProps } from "../../types/infinite-single-select/types";
import { useInfiniteSelectOptions } from "../../hooks/infinite-single-select/useInfiniteSelectOptions.hook";
import {
  SearchField,
  SingleSelectListbox,
  TriggerButton,
} from "./SingleSelectListbox.component";

export function InfiniteSingleSelect(props: InfiniteSingleSelectProps) {
  return (
    <InfiniteSingleSelectBody key={String(props.resetKey ?? "")} {...props} />
  );
}

function InfiniteSingleSelectBody(props: InfiniteSingleSelectProps) {
  const {
    value,
    onChange,
    fetchPage,
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
  } = props;

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
    pinnedOption,
    pageSize,
    searchable,
  });

  // Keep the selected label in step with the value/options during render
  // (React's "adjust state on prop change" pattern; no sync-in-effect). The
  // label persists when the current options page has no match yet.
  const [syncedLabelInputs, setSyncedLabelInputs] = useState<{
    value: string | null;
    pinnedId: string | null;
    options: typeof options;
  } | null>(null);
  if (
    syncedLabelInputs?.value !== value ||
    syncedLabelInputs?.pinnedId !== (pinnedOption?.id ?? null) ||
    syncedLabelInputs?.options !== options
  ) {
    setSyncedLabelInputs({
      value,
      pinnedId: pinnedOption?.id ?? null,
      options,
    });
    if (!value) {
      setSelectedLabel(null);
    } else if (pinnedOption?.id === value) {
      setSelectedLabel(pinnedOption.label);
    } else {
      const match = options.find((option) => option.id === value);
      if (match) setSelectedLabel(match.label);
    }
  }

  const showSearchField = searchable;

  const triggerLabel = !value
    ? allowNone
      ? noneLabel
      : placeholder
    : selectedLabel ||
      (pinnedOption?.id === value ? pinnedOption.label : null) ||
      placeholder;

  const handlePopoverChange = (next: boolean) => {
    if (disabled) return;
    setOpen(next);
    if (!next) resetQuery();
  };

  const preventAutoFocusWhenNotSearchable = (event: Event) => {
    if (!searchable) event.preventDefault();
  };

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
    <div className={cn(infiniteSingleSelectStyles.root, className)}>
      <Popover open={open} onOpenChange={handlePopoverChange}>
        <PopoverTrigger asChild>
          <TriggerButton
            open={open}
            listboxId={listboxId}
            label={triggerLabel}
            error={error}
            muted={!value && !allowNone}
            disabled={disabled}
          />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className={infiniteSingleSelectStyles.popoverContent}
          onOpenAutoFocus={preventAutoFocusWhenNotSearchable}
        >
          {showSearchField ? (
            <SearchField
              query={query}
              placeholder={searchPlaceholder}
              disabled={disabled}
              onQueryChange={setQuery}
            />
          ) : null}
          <SingleSelectListbox
            listboxId={listboxId}
            options={options}
            value={value}
            disabled={disabled}
            allowNone={allowNone}
            noneValue={noneValue}
            noneLabel={noneLabel}
            emptyMessage={emptyMessage}
            initialLoading={initialLoading}
            loadingMore={loadingMore}
            loadError={loadError}
            listRef={listRef}
            sentinelRef={sentinelRef}
            onSelect={handleSelect}
            listClassName={listClassName}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
