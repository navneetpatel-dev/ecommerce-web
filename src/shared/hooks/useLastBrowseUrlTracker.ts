"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureBrowseUrl } from "@/shared/utils/lastBrowseUrl";

/**
 * Records the current page as the "last browsed URL" on every client
 * navigation, so bug report forms can prefill page context (Rule 14).
 */
export function useLastBrowseUrlTracker() {
  const pathname = usePathname();

  useEffect(() => {
    captureBrowseUrl(pathname);
  }, [pathname]);
}
