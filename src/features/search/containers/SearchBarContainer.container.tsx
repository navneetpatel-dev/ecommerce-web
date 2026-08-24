"use client";

import { useSearchNavigation } from "../hooks/useSearchNavigation.hook";
import { SearchBar } from "../components/SearchBar.component";
import type { SearchPanelLayout } from "../constants";

interface SearchBarContainerProps {
  size?: "lg" | "sm";
  className?: string;
  onDark?: boolean;
  /** Dropdown overlay for desktop header; inline list for mobile bottom sheet. */
  panelLayout?: SearchPanelLayout;
  /** e.g. close the mobile search sheet after navigating to results */
  onAfterSubmit?: () => void;
}

export function SearchBarContainer({
  size,
  className,
  onDark,
  panelLayout = "dropdown",
  onAfterSubmit,
}: SearchBarContainerProps) {
  const search = useSearchNavigation(onAfterSubmit);

  return (
    <SearchBar
      size={size}
      className={className}
      onDark={onDark}
      panelLayout={panelLayout}
      term={search.term}
      showPanel={search.showPanel}
      suggestions={search.suggestions}
      activeIndex={search.activeIndex}
      isFetching={search.isFetching}
      inputRef={search.inputRef}
      onTermChange={search.updateTerm}
      onFocus={search.openDropdown}
      onBlur={search.closeDropdown}
      onKeyDown={search.handleKeyDown}
      onSubmit={search.handleSubmit}
      onSelect={search.handleSelect}
    />
  );
}
