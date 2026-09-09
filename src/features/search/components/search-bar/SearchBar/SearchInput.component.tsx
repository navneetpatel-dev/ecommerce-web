"use client";

import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { SEARCH_LIST_ID } from "../../../constants/search-bar/constants";
import { searchBarStyles as styles } from "../../../styles/search-bar/searchBar.styles";

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
    <form onSubmit={onSubmit} className={styles.form}>
      <Search
        size={size === "sm" ? 16 : 20}
        className={cn(
          styles.searchIcon,
          shellExpanded || !onDark
            ? styles.searchIconMuted
            : styles.searchIconDark,
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
          styles.inputBase,
          size === "sm" ? styles.inputSm : styles.inputLg,
          shellExpanded
            ? styles.inputExpanded
            : cn(styles.inputCollapsed, onDark && styles.inputOnDark),
        )}
      />
    </form>
  );
}
