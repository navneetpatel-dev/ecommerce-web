"use client";

import { useState, type ChangeEvent } from "react";

/**
 * A comma-separated text box backed by a list value.
 *
 * Re-joining the list on every keystroke deletes a trailing comma or space as it is
 * typed, so a second entry can never be started. This keeps the raw text locally while
 * the user types and only replaces it when the list changes from outside (a reload,
 * the server normalising the saved values).
 */
export function useDelimitedListInput<T>(
  value: readonly T[],
  parse: (text: string) => T[],
  onChange: (next: T[]) => void,
) {
  const valueKey = JSON.stringify(value);
  const [text, setText] = useState(() => value.join(", "));
  const [syncedKey, setSyncedKey] = useState(valueKey);

  if (valueKey !== syncedKey) {
    setSyncedKey(valueKey);
    setText(value.join(", "));
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextText = event.target.value;
    const parsed = parse(nextText);
    setText(nextText);
    setSyncedKey(JSON.stringify(parsed));
    onChange(parsed);
  };

  return { text, handleChange };
}
