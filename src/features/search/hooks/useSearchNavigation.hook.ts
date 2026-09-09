import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDebouncedValue } from "@/shared/hooks/use-debounce.hook";
import { useAutocomplete } from "../api/search.queries";
import { navigate } from "@/shared/utils/navigate";
import { PATHS } from "@/shared/constants/paths";
import { SEARCH_DROPDOWN_CLOSE_MS } from "@/shared/constants/timing";
import {
  SEARCH_AUTOCOMPLETE_DEBOUNCE_MS,
  SEARCH_AUTOCOMPLETE_MIN_CHARS,
} from "../constants";
import { suggestionHref } from "../utils/suggestionHref";
import { useSuggestionKeyboardNav } from "./useSuggestionKeyboardNav.hook";
import type { SearchSuggestion } from "../types";

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

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [trimmedDebounced, suggestions]);

  useEffect(() => {
    closeDropdown();
    setTerm("");
  }, [pathname, closeDropdown]);

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

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = term.trim();
      if (!trimmed) return;

      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelect(suggestions[activeIndex]);
        return;
      }

      closeDropdown();
      setTerm("");
      inputRef.current?.blur();
      navigate(
        router,
        `${PATHS.products}?search=${encodeURIComponent(trimmed)}`,
      );
      onAfterSubmit?.();
    },
    [
      activeIndex,
      closeDropdown,
      handleSelect,
      onAfterSubmit,
      router,
      suggestions,
      term,
    ],
  );

  const updateTerm = useCallback((value: string) => {
    setTerm(value);
    setOpen(true);
  }, []);

  const openDropdown = useCallback(() => setOpen(true), []);

  const scheduleCloseDropdown = useCallback(() => {
    window.setTimeout(() => closeDropdown(), SEARCH_DROPDOWN_CLOSE_MS);
  }, [closeDropdown]);

  const handleKeyDown = useSuggestionKeyboardNav({
    open,
    canSuggest,
    suggestions,
    activeIndex,
    setActiveIndex,
    closeDropdown,
    handleSelect,
    onAfterSubmit,
  });

  const showPanel =
    open &&
    canSuggest &&
    (isFetching || suggestions.length > 0 || (isFetched && !isFetching));

  return {
    term,
    open,
    suggestions,
    activeIndex,
    inputRef,
    showPanel,
    isFetching: canSuggest && isFetching,
    updateTerm,
    handleSelect,
    handleSubmit,
    handleKeyDown,
    openDropdown,
    closeDropdown: scheduleCloseDropdown,
  };
}
