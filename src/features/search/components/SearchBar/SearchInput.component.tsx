"use client";

import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import { SEARCH_LIST_ID } from "./constants";

interface SearchInputProps {
  size: "lg" | "sm";
  onDark: boolean;
  shellExpanded: boolean;
  term: string;
  showPanel: boolean;
  activeIndex?: number;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onTermChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export function SearchInput({
  size,
  onDark,
  shellExpanded,
  term,
  showPanel,
  activeIndex = -1,
  inputRef,
  onTermChange,
  onFocus,
  onBlur,
  onKeyDown,
  onSubmit,
}: SearchInputProps) {
  return (
    <form onSubmit={onSubmit} className="relative">
      <Search
        size={size === "sm" ? 16 : 20}
        className={cn(
          "pointer-events-none absolute left-4 top-1/2 z-[1] -translate-y-1/2",
          shellExpanded || !onDark ? "text-ink-muted" : "text-paper/70",
        )}
        aria-hidden
      />
      <Input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls={showPanel ? SEARCH_LIST_ID : undefined}
        aria-activedescendant={
          showPanel && activeIndex >= 0
            ? `${SEARCH_LIST_ID}-option-${activeIndex}`
            : undefined
        }
        aria-autocomplete="list"
        value={term}
        onChange={(e) => onTermChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={LABELS.searchProductsVendors}
        className={cn(
          "h-11",
          "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
          size === "sm" ? "pl-9 text-body-sm" : "pl-11",
          shellExpanded
            ? "rounded-none border-0 bg-transparent text-ink shadow-none placeholder:text-ink-faint focus-visible:border-transparent"
            : cn(
                "rounded-full",
                onDark &&
                  "border-paper/25 bg-paper/10 text-paper placeholder:text-paper/55 focus-visible:border-paper/50",
              ),
        )}
      />
    </form>
  );
}
