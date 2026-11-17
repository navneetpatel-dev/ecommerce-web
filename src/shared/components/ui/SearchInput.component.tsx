"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";
import {
  joinAriaIds,
  useFieldControl,
} from "@/shared/components/forms/fieldControl.context";
export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  onClear?: () => void;
  showIcon?: boolean;
  showShortcutHint?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      error,
      value,
      onChange,
      onClear,
      onKeyDown,
      showIcon = true,
      showShortcutHint = true,
      ...props
    },
    ref,
  ) => {
    const field = useFieldControl();
    const internalRef = React.useRef<HTMLInputElement | null>(null);
    const [isFocused, setIsFocused] = React.useState(false);

    const hasValue = Boolean(value != null && String(value).length > 0);

    const ariaInvalid =
      props["aria-invalid"] ?? (error || field?.invalid ? true : undefined);

    const handleClearClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (onClear) {
        onClear();
      }

      if (onChange) {
        const syntheticEvent = {
          target: { value: "" },
          currentTarget: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }

      // Keep focus on the input after clearing
      const el = internalRef.current;
      el?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        if (hasValue) {
          e.preventDefault();
          if (onClear) onClear();
          if (onChange) {
            onChange({
              target: { value: "" },
              currentTarget: { value: "" },
            } as React.ChangeEvent<HTMLInputElement>);
          }
        } else {
          e.currentTarget.blur();
        }
      }
      onKeyDown?.(e);
    };

    return (
      <div className="relative flex items-center w-full">
        {showIcon && (
          <Search
            className="pointer-events-none absolute left-3 size-4 text-ink-muted/70"
            strokeWidth={2}
            aria-hidden
          />
        )}
        <input
          ref={(node) => {
            internalRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) {
              (ref as React.MutableRefObject<HTMLInputElement | null>).current =
                node;
            }
          }}
          type="search"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            "flex h-10 w-full rounded-lg border bg-surface-raised px-4 text-body text-ink transition-all placeholder:text-ink-faint outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-50",
            "[&::-webkit-search-cancel-button]:appearance-none",
            showIcon && "pl-9",
            hasValue ? "pr-8" : showShortcutHint ? "pr-8" : "pr-4",
            error
              ? "border-danger focus-visible:border-danger focus-visible:ring-danger/25"
              : "border-line hover:border-line-strong",
            className,
          )}
          {...props}
          id={props.id ?? field?.controlId}
          aria-invalid={ariaInvalid}
          aria-describedby={joinAriaIds(
            props["aria-describedby"],
            field?.describedById,
          )}
        />
        {hasValue ? (
          <button
            type="button"
            onClick={handleClearClick}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-muted hover:text-ink hover:bg-surface-raised transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <X className="size-3.5" strokeWidth={2.25} aria-hidden />
          </button>
        ) : showShortcutHint && !isFocused ? (
          <kbd
            aria-hidden
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-4 items-center justify-center rounded border border-line bg-surface-muted px-1 font-mono text-[10px] font-medium text-ink-muted/80 shadow-xs"
          >
            /
          </kbd>
        ) : null}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
