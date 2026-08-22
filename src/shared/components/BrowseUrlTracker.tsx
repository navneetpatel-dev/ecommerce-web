"use client";

import { useLastBrowseUrlTracker } from "@/shared/hooks/useLastBrowseUrlTracker";

/**
 * Mount-only component that keeps the "last browsed URL" up to date.
 * Logic lives in the hook; this is a rendering shell (Rule 1/14).
 */
export function BrowseUrlTracker() {
  useLastBrowseUrlTracker();

  return null;
}
