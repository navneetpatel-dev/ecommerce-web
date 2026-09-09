import { resolveStageGesture } from "./imageGalleryGeometry";

interface DispatchGestureParams {
  dx: number;
  dy: number;
  wasZooming: boolean;
  moved: boolean;
  onSwipe?: (direction: -1 | 1) => void;
  onTap?: () => void;
  armSwallow: () => void;
}

export function dispatchStageGesture({
  dx,
  dy,
  wasZooming,
  moved,
  onSwipe,
  onTap,
  armSwallow,
}: DispatchGestureParams) {
  const action = resolveStageGesture({ dx, dy, wasZooming, moved });
  if (action === "none") return;

  armSwallow();
  if (action === "swipe-next") {
    onSwipe?.(1);
  } else if (action === "swipe-prev") {
    onSwipe?.(-1);
  } else {
    onTap?.();
  }
}
