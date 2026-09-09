"use client";

import { useLastBrowseUrlTracker } from "@/shared/hooks/navigation/useLastBrowseUrlTracker.hook";

/**
 * Mount-only component that keeps the "last browsed URL" up to date.
 * Logic lives in the hook; this is a rendering shell (Rule 1/14).
 */
export function BrowseUrlTracker() {
  useLastBrowseUrlTracker();

  return null;
}
