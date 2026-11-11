"use client";

import { useCallback, useState } from "react";

/**
 * Whether to show an image or its fallback. A missing src, or one that failed
 * to load, shows the fallback; a new src gets a fresh try.
 */
export function useImageFallback(src?: string | null) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const handleError = useCallback(() => setFailedSrc(src ?? null), [src]);
  return {
    showImage: Boolean(src) && failedSrc !== src,
    handleError,
  };
}
