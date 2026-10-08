import { useCallback, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { useAutocomplete } from "../../api/search/search.queries";
import { navigate } from "@/shared/utils/navigation/navigate";
import { PATHS } from "@/shared/constants/paths/paths";
import { SEARCH_DROPDOWN_CLOSE_MS } from "@/shared/constants/timing/timing";
import {
  SEARCH_AUTOCOMPLETE_DEBOUNCE_MS,
  SEARCH_AUTOCOMPLETE_MIN_CHARS,
} from "../../constants/search/index";
import { suggestionHref } from "../../utils/suggestions/suggestionHref";
import { useSuggestionKeyboardNav } from "../keyboard/useSuggestionKeyboardNav.hook";
import { useSearchHotkey } from "../keyboard/useSearchHotkey.hook";
import { useRecentSearches } from "../recent/useRecentSearches.hook";
import type { SearchSuggestion } from "../../types/search/index";

export function useSearchNavigation(onAfterSubmit?: () => void) {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedTerm = useDebouncedValue(
    term,
    SEARCH_AUTOCOMPLETE_DEBOUNCE_MS,
  );
  const router = useRouter();
  const pathname = usePathname();
  const trimmedDebounced = debouncedTerm.trim();
  const canSuggest = trimmedDebounced.length >= SEARCH_AUTOCOMPLETE_MIN_CHARS;
  const {
    data: suggestions = [],
    isFetching,
    isFetched,
  } = useAutocomplete(debouncedTerm, open && canSuggest);

  const recents = useRecentSearches();
  const { refreshRecentSearches, rememberSearch } = recents;
  useSearchHotkey(inputRef);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  // Close the dropdown and clear the term when the route changes.
  const [syncedPathname, setSyncedPathname] = useState(pathname);
  if (pathname !== syncedPathname) {
    setSyncedPathname(pathname);
    closeDropdown();
    setTerm("");
  }
  const handleSelect = useCallback(
    (suggestion: SearchSuggestion) => {
      closeDropdown();
      setTerm("");
      inputRef.current?.blur();
      navigate(router, suggestionHref(suggestion));
      onAfterSubmit?.();
    },
    [closeDropdown, onAfterSubmit, router],
  );

  /** Navigates to the results page for a term — shared by submit and recents. */
  const submitSearch = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      closeDropdown();
      setTerm("");
      inputRef.current?.blur();
      navigate(
        router,
        `${PATHS.products}?search=${encodeURIComponent(trimmed)}`,
      );
      rememberSearch(trimmed);
      onAfterSubmit?.();
    },
    [closeDropdown, onAfterSubmit, rememberSearch, router],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelect(suggestions[activeIndex]);
        return;
      }
      submitSearch(term);
    },
    [activeIndex, handleSelect, submitSearch, suggestions, term],
  );

  const updateTerm = useCallback((value: string) => {
    setTerm(value);
    setOpen(true);
  }, []);

  const openDropdown = useCallback(() => {
    setOpen(true);
    refreshRecentSearches();
  }, [refreshRecentSearches]);

  const scheduleCloseDropdown = useCallback(() => {
    window.setTimeout(() => closeDropdown(), SEARCH_DROPDOWN_CLOSE_MS);
  }, [closeDropdown]);

  const handleKeyDown = useSuggestionKeyboardNav({
    open,
    canSuggest,
    suggestions,
    term: trimmedDebounced,
    activeIndex,
    setActiveIndex,
    closeDropdown,
    handleSelect,
    onAfterSubmit,
  });

  /** Empty field with remembered terms → the panel opens on the recent list. */
  const showRecent =
    open && term.trim() === "" && recents.recentSearches.length > 0;
  const showPanel =
    showRecent ||
    (open &&
      canSuggest &&
      (isFetching || suggestions.length > 0 || (isFetched && !isFetching)));

  return {
    term,
    open,
    suggestions,
    activeIndex,
    inputRef,
    showPanel,
    showRecent,
    recentSearches: recents.recentSearches,
    isFetching: canSuggest && isFetching,
    updateTerm,
    handleSelect,
    handleSubmit,
    submitSearch,
    handleKeyDown,
    clearRecentSearches: recents.clearRecentSearches,
    openDropdown,
    closeDropdown: scheduleCloseDropdown,
  };
}
