import { useCallback, useState } from "react";
import type { SearchSuggestion } from "../../types/search/index";

interface UseSuggestionKeyboardNavOptions {
  open: boolean;
  canSuggest: boolean;
  suggestions: SearchSuggestion[];
  term: string;
  activeIndex: number;
  setActiveIndex: (updater: (index: number) => number) => void;
  closeDropdown: () => void;
  handleSelect: (suggestion: SearchSuggestion) => void;
  onAfterSubmit?: () => void;
}

/** Arrow-key/Escape/Enter routing for the search suggestion dropdown. */
export function useSuggestionKeyboardNav({
  open,
  canSuggest,
  suggestions,
  term,
  activeIndex,
  setActiveIndex,
  closeDropdown,
  handleSelect,
  onAfterSubmit,
}: UseSuggestionKeyboardNavOptions) {
  // Reset the highlight when the term or suggestion list changes (during
  // render — no sync-in-effect).
  const [syncedNavKey, setSyncedNavKey] = useState<string | null>(null);
  const navKey = `${term}#${suggestions.map((suggestion) => suggestion.id).join(",")}`;
  if (navKey !== syncedNavKey) {
    setSyncedNavKey(navKey);
    setActiveIndex(() => -1);
  }

  return useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open || !canSuggest) {
        if (event.key === "Escape") closeDropdown();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!suggestions.length) return;
        setActiveIndex((index) => (index + 1) % suggestions.length);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!suggestions.length) return;
        setActiveIndex((index) =>
          index <= 0 ? suggestions.length - 1 : index - 1,
        );
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeDropdown();
        onAfterSubmit?.();
        return;
      }

      if (
        event.key === "Enter" &&
        activeIndex >= 0 &&
        suggestions[activeIndex]
      ) {
        event.preventDefault();
        handleSelect(suggestions[activeIndex]);
      }
    },
    [
      activeIndex,
      canSuggest,
      closeDropdown,
      handleSelect,
      onAfterSubmit,
      open,
      setActiveIndex,
      suggestions,
    ],
  );
}
