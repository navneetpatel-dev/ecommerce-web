/**
 * Pure geometry/gesture math for the image gallery stage (Rule 1: extracted
 * from hooks so it is testable and platform-agnostic).
 */

import { IMAGE_GALLERY_SWIPE_PX } from "@/shared/constants/media/imageGallery";

export interface GalleryPoint {
  x: number;
  y: number;
}

/** Clamps a percentage coordinate to 0–100. */
export function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value));
}

/** Maps a pointer position to a percentage origin within `rect`. */
export function originFromPointer(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): GalleryPoint {
  if (!rect.width || !rect.height) return { x: 50, y: 50 };
  return {
    x: clampPercent(((clientX - rect.left) / rect.width) * 100),
    y: clampPercent(((clientY - rect.top) / rect.height) * 100),
  };
}

export type StageGestureAction = "none" | "tap" | "swipe-next" | "swipe-prev";

interface ResolveGestureArgs {
  dx: number;
  dy: number;
  wasZooming: boolean;
  moved: boolean;
}

/**
 * Classifies a touch release as tap / next-swipe / prev-swipe / none.
 * A horizontal displacement beyond the swipe threshold wins over tap;
 * movement in any direction suppresses accidental taps.
 */
export function resolveStageGesture(
  args: ResolveGestureArgs,
): StageGestureAction {
  const { dx, dy, wasZooming, moved } = args;
  if (wasZooming) return "none";
  if (Math.abs(dx) >= IMAGE_GALLERY_SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
    return dx < 0 ? "swipe-next" : "swipe-prev";
  }
  return moved ? "none" : "tap";
}
