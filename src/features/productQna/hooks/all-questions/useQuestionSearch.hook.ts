"use client";

import { useState, type ChangeEvent } from "react";
import { useDebouncedCallback } from "@/shared/hooks/ui/use-debounce.hook";
import { QUESTION_SEARCH_DEBOUNCE_MS } from "../../constants/productQna.constants";

/**
 * The search box types freely; the URL (and so the query) follows once the
 * shopper pauses. `reset` clears both at once for "Clear filters".
 */
export function useQuestionSearch(
  urlValue: string,
  onCommit: (value: string) => void,
) {
  const [value, setValue] = useState(urlValue);
  // Back/forward (or "Clear filters") changes the URL under the box: follow it.
  const [syncedUrlValue, setSyncedUrlValue] = useState(urlValue);
  if (urlValue !== syncedUrlValue) {
    setSyncedUrlValue(urlValue);
    // Our own (trimmed) commit must not eat the space the shopper just typed.
    if (urlValue !== value.trim()) setValue(urlValue);
  }
  const commit = useDebouncedCallback(
    (next: string) => onCommit(next.trim()),
    QUESTION_SEARCH_DEBOUNCE_MS,
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    commit(event.target.value);
  };

  return {
    value,
    handleChange,
    reset: () => setValue(""),
  };
}
