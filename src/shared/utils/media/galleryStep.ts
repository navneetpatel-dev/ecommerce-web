/**
 * Prev / next through a set of images or videos. Stepping stops at both ends —
 * no wrap-around — so the first item disables "Previous" and the last disables
 * "Next", and the shopper always knows where they are in the set.
 */
export interface GalleryEdges {
  canPrev: boolean;
  canNext: boolean;
}

export function galleryEdges(index: number, count: number): GalleryEdges {
  return {
    canPrev: count > 1 && index > 0,
    canNext: count > 1 && index < count - 1,
  };
}

/** The index one step away, held inside [0, count - 1]. */
export function galleryStep(
  index: number,
  direction: -1 | 1,
  count: number,
): number {
  if (count <= 0) return 0;
  return Math.min(count - 1, Math.max(0, index + direction));
}
