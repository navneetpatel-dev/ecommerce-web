"use client";

import { ChevronDown } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { infiniteSingleSelectStyles } from "./infiniteSingleSelect.styles";
import type { InfiniteSingleSelectOption } from "./types";
import { OptionRow } from "./OptionRow.component";

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
        infiniteSingleSelectStyles.listbox.container,
        disabled && infiniteSingleSelectStyles.listbox.disabled,
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
          <div
            ref={sentinelRef}
            className={infiniteSingleSelectStyles.listbox.sentinel}
            aria-hidden
          />
          {loadingMore ? (
            <p className={infiniteSingleSelectStyles.listbox.loadingMore}>
              {LABELS.loadingMore}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}

function ListHint({ children }: { children: React.ReactNode }) {
  return <p className={infiniteSingleSelectStyles.listbox.hint}>{children}</p>;
}

export function SearchField(props: {
  query: string;
  placeholder: string;
  disabled: boolean;
  onQueryChange: (query: string) => void;
}) {
  return (
    <div className={infiniteSingleSelectStyles.listbox.searchFieldContainer}>
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
        infiniteSingleSelectStyles.listbox.triggerButton,
        props.error && infiniteSingleSelectStyles.listbox.triggerButtonError,
        props.muted && infiniteSingleSelectStyles.listbox.triggerButtonMuted,
      )}
    >
      <span className={infiniteSingleSelectStyles.listbox.triggerButtonLabel}>
        {props.label}
      </span>
      <ChevronDown
        size={16}
        className={infiniteSingleSelectStyles.listbox.triggerButtonIcon}
      />
    </button>
  );
}
