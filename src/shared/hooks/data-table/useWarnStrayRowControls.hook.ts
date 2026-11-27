"use client";

import { useEffect, type RefObject } from "react";

/** Development aid: a control rendered straight into a row menu would be invisible. */
export function useWarnStrayRowControls(
  hostRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const stray = hostRef.current?.querySelector("button, a[href], input");
    if (stray) {
      console.warn(
        "Row actions must use RowActionButton; this control is hidden:",
        stray,
      );
    }
  });
}
