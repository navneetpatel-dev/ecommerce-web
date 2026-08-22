"use client";

import { ChevronDown } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import type { InfiniteSingleSelectOption } from "./types";
import { OptionRow } from "./OptionRow";

interface SingleSelectListboxProps {
  listboxId: string;
  options: InfiniteSingleSelectOption[];
  value: string | null;
  disabled: boolean;
  allowNone: boolean;
  noneValue: string;
  noneLabel: string;
  emptyMessage: string;
  initialLoading: boolean;
  loadingMore: boolean;
  loadError: boolean;
  listRef: React.RefObject<HTMLDivElement | null>;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  onSelect: (next: string) => void;
  /** Extra classes merged onto the scrollable list container. */
  listClassName?: string;
}

/** Scrollable option list for InfiniteSingleSelect (loading/empty/rows). */
export function SingleSelectListbox(props: SingleSelectListboxProps) {
  const {
    listboxId,
    options,
    value,
    disabled,
    allowNone,
    noneValue,
    noneLabel,
    emptyMessage,
    initialLoading,
    loadingMore,
    loadError,
    listRef,
    sentinelRef,
    onSelect,
    listClassName,
  } = props;

  const emptyCopy = loadError ? LABELS.couldNotLoadOptions : emptyMessage;

  const renderOption = (option: InfiniteSingleSelectOption) => (
    <OptionRow
      key={option.id}
      selected={value === option.id}
      label={option.label}
      disabled={disabled}
      onSelect={() => onSelect(option.id)}
    />
  );

  return (
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
        <ListHint>{LABELS.loading}</ListHint>
      ) : options.length === 0 && !allowNone ? (
        <ListHint>{emptyCopy}</ListHint>
      ) : (
        <>
          {allowNone ? (
            <OptionRow
              selected={!value}
              label={noneLabel}
              disabled={disabled}
              onSelect={() => onSelect(noneValue)}
            />
          ) : null}
          {options.map(renderOption)}
          {options.length === 0 ? <ListHint>{emptyCopy}</ListHint> : null}
          <div ref={sentinelRef} className="h-1 w-full" aria-hidden />
          {loadingMore ? (
            <p className="px-4 py-1 text-[0.8125rem] text-ink-muted">
              {LABELS.loadingMore}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}

function ListHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-4 py-2 text-[0.8125rem] text-ink-muted">{children}</p>
  );
}

export function SearchField(props: {
  query: string;
  placeholder: string;
  disabled: boolean;
  onQueryChange: (query: string) => void;
}) {
  return (
    <div className="px-1 pt-1">
      <Input
        value={props.query}
        onChange={(event) => props.onQueryChange(event.target.value)}
        placeholder={props.placeholder}
        aria-label={props.placeholder}
        disabled={props.disabled}
        autoFocus
      />
    </div>
  );
}

export function TriggerButton(props: {
  open: boolean;
  listboxId: string;
  label: string | null;
  error: boolean;
  muted: boolean;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      disabled={props.disabled}
      aria-haspopup="listbox"
      aria-expanded={props.open}
      aria-controls={props.listboxId}
      className={cn(
        "flex h-11 w-full cursor-pointer items-center justify-between rounded-sm border border-line-strong bg-surface-raised px-4 text-left text-[0.9375rem] outline-none hover:bg-paper/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50",
        props.error && "border-danger",
        props.muted && "text-ink-muted",
      )}
    >
      <span className="line-clamp-1 min-w-0 flex-1">{props.label}</span>
      <ChevronDown size={16} className="shrink-0 text-ink-muted" />
    </button>
  );
}
