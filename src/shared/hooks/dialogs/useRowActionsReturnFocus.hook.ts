"use client";

import { useState } from "react";

function focusedRowActionsTrigger(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const active = document.activeElement;
  return active instanceof HTMLElement &&
    active.matches("[data-row-actions-trigger]")
    ? active
    : null;
}

/** Sends focus back to the row ⋮ button when a dialog opened from its menu closes. */
export function useRowActionsReturnFocus(
  onCloseAutoFocus?: (event: Event) => void,
) {
  // Read during the first render, before an `autoFocus` field inside the dialog takes over.
  const [opener] = useState(focusedRowActionsTrigger);

  return (event: Event) => {
    onCloseAutoFocus?.(event);
    if (event.defaultPrevented || !opener?.isConnected) return;
    event.preventDefault();
    opener.focus({ preventScroll: true });
  };
}
