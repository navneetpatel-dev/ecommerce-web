"use client";

import { useCallback, useState } from "react";
import type { ReviewMediaItem } from "@/shared/api/types";

/** Which of a review's photos/video is open in the viewer (null when closed). */
export function useReviewMediaGallery(media: readonly ReviewMediaItem[]) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const handleOpen = useCallback((index: number) => setOpenIndex(index), []);
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) setOpenIndex(null);
  }, []);

  return {
    open: openIndex !== null,
    current: openIndex !== null ? (media[openIndex] ?? null) : null,
    handleOpen,
    handleOpenChange,
  };
}
