"use client";

import { useEffect } from "react";

/**
 * Warns before the browser leaves the page while a form has unsaved edits —
 * refresh, tab close, or back to another site. Without it a long form (product,
 * coupon, vendor registration, review) is lost to one accidental swipe.
 *
 * The App Router has no supported history-blocking API, so in-app link
 * navigation cannot be intercepted here: forms that can be left by a link must
 * keep their own confirm-on-cancel behaviour.
 */
export function useUnsavedChanges(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;

    const blockUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Legacy browsers only show the prompt when returnValue is set.
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", blockUnload);
    return () => window.removeEventListener("beforeunload", blockUnload);
  }, [isDirty]);
}
