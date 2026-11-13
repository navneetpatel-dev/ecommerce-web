"use client";

import { useCallback, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { ReviewMediaItem } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { galleryEdges, galleryStep } from "@/shared/utils/media/galleryStep";

/** A finger has to travel this far sideways to count as a swipe. */
const SWIPE_PX = 40;

/**
 * Which of a review's photos/video is open in the viewer (null when closed),
 * and stepping through them: buttons, ← / → keys and a sideways swipe. Stepping
 * stops at both ends, so "Previous" is disabled on the first item and "Next"
 * on the last.
 */
export function useReviewMediaGallery(media: readonly ReviewMediaItem[]) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const swipeStartX = useRef<number | null>(null);
  const count = media.length;
  const index = openIndex ?? 0;
  const edges = galleryEdges(index, count);

  const handleOpen = useCallback((next: number) => setOpenIndex(next), []);
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) setOpenIndex(null);
  }, []);
  const step = (direction: -1 | 1) =>
    setOpenIndex((current) =>
      current === null ? current : galleryStep(current, direction, count),
    );
  const goPrev = () => step(-1);
  const goNext = () => step(1);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    // Leave the arrows to a focused video's own seek bar.
    if (event.target instanceof HTMLVideoElement) return;
    event.preventDefault();
    step(event.key === "ArrowLeft" ? -1 : 1);
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    swipeStartX.current = event.pointerType === "mouse" ? null : event.clientX;
  };
  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    const start = swipeStartX.current;
    swipeStartX.current = null;
    if (start === null) return;
    const delta = event.clientX - start;
    if (Math.abs(delta) >= SWIPE_PX) step(delta > 0 ? -1 : 1);
  };

  return {
    open: openIndex !== null,
    index,
    current: openIndex !== null ? (media[openIndex] ?? null) : null,
    hasMultiple: count > 1,
    edges,
    positionLabel: formatLabel(LABELS.imagePosition, {
      current: index + 1,
      total: count,
    }),
    handleOpen,
    handleOpenChange,
    goPrev,
    goNext,
    handleKeyDown,
    swipeHandlers: {
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
    },
  };
}

export type ReviewMediaGalleryState = ReturnType<typeof useReviewMediaGallery>;
