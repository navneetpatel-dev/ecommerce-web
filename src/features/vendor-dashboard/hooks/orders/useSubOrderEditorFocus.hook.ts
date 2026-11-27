"use client";

import { useEffect, useRef } from "react";

const EDITOR_CONTROL = "input, [role='combobox'], button";

/**
 * The status editor replaces the row ⋮ menu, so focus has to follow it in and come back to
 * the ⋮ button on close. Hidden layouts ignore `focus()`, so only the visible one takes it.
 */
export function useSubOrderEditorFocus(isEditing: boolean) {
  const rootRef = useRef<HTMLDivElement>(null);
  const wasEditingRef = useRef(isEditing);

  useEffect(() => {
    const changed = wasEditingRef.current !== isEditing;
    wasEditingRef.current = isEditing;
    if (!changed) return;
    const focusLost =
      !document.activeElement || document.activeElement === document.body;
    const inside = rootRef.current?.contains(document.activeElement);
    if (isEditing) {
      if (inside) return;
      rootRef.current?.querySelector<HTMLElement>(EDITOR_CONTROL)?.focus();
    } else if (focusLost) {
      rootRef.current
        ?.querySelector<HTMLElement>("[data-row-actions-trigger]")
        ?.focus();
    }
  }, [isEditing]);

  return rootRef;
}
