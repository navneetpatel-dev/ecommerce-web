"use client";

import { useEffect, useState } from "react";
import { cn } from "@/shared/utils/cn";
import type { SearchPanelLayout } from "../../constants";
import type { SearchSuggestion } from "../../types";
import { SearchInput } from "./SearchInput.component";
import { SearchPanel } from "./SearchPanel.component";

interface SearchBarProps {
  size?: "lg" | "sm";
  className?: string;
  /** High-contrast treatment when the header sits over a dark surface. */
  onDark?: boolean;
  /** Dropdown overlays input (desktop header). Inline flows below (mobile sheet). */
  panelLayout?: SearchPanelLayout;
  term: string;
  showPanel: boolean;
  suggestions?: SearchSuggestion[];
  activeIndex?: number;
  isFetching?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onTermChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
  onSelect: (suggestion: SearchSuggestion) => void;
}

export function SearchBar({
  size = "lg",
  className,
  onDark = false,
  panelLayout = "dropdown",
  term,
  showPanel,
  suggestions,
  activeIndex,
  isFetching,
  inputRef,
  onTermChange,
  onFocus,
  onBlur,
  onKeyDown,
  onSubmit,
  onSelect,
}: SearchBarProps) {
  const isInline = panelLayout === "inline";
  const overlayDropdown = !isInline;
  const [shellExpanded, setShellExpanded] = useState(false);

  useEffect(() => {
    if (showPanel) setShellExpanded(true);
  }, [showPanel]);

  return (
    <div className={cn("relative w-full", className)}>
      {shellExpanded && overlayDropdown ? (
        <div className="h-11 shrink-0" aria-hidden />
      ) : null}

      <div
        className={cn(
          "w-full",
          shellExpanded && overlayDropdown && "absolute inset-x-0 top-0 z-50",
          shellExpanded &&
            "overflow-hidden rounded-2xl border border-line bg-surface-raised shadow-elevation-2",
        )}
      >
        <SearchInput
          size={size}
          onDark={onDark}
          shellExpanded={shellExpanded}
          term={term}
          showPanel={showPanel}
          activeIndex={activeIndex}
          inputRef={inputRef}
          onTermChange={onTermChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onSubmit={onSubmit}
        />

        <SearchPanel
          showPanel={showPanel}
          suggestions={suggestions}
          activeIndex={activeIndex}
          isFetching={isFetching}
          isInline={isInline}
          onSelect={onSelect}
          onExitComplete={() => setShellExpanded(false)}
        />
      </div>
    </div>
  );
}
