"use client";

import {
  useCallback,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  IMAGE_GALLERY_LONG_PRESS_MS,
  IMAGE_GALLERY_MOVE_PX,
} from "@/shared/constants/imageGallery";
import {
  originFromPointer,
  resolveStageGesture,
  type GalleryPoint,
} from "@/shared/utils/imageGalleryGeometry";
import { useSwallowNextClick } from "./useSwallowNextClick.hook";
import { useLongPressAction } from "./useLongPressAction.hook";

export interface UseImageGalleryZoomOptions {
  enabled?: boolean;
  onTap?: () => void;
  onSwipe?: (direction: -1 | 1) => void;
}

/** Stage pointer behavior: hover-zoom (mouse), long-press zoom, swipe, tap. */
export function useImageGalleryZoom({
  enabled = true,
  onTap,
  onSwipe,
}: UseImageGalleryZoomOptions = {}) {
  const [zooming, setZooming] = useState(false);
  const [origin, setOrigin] = useState<GalleryPoint>({ x: 50, y: 50 });
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const zoomingRef = useRef(false);
  const stageRef = useRef<HTMLElement | null>(null);
  const swallow = useSwallowNextClick();

  const stopZoom = useCallback(() => {
    zoomingRef.current = false;
    setZooming(false);
  }, []);

  const beginZoomAt = useCallback((percent: GalleryPoint) => {
    zoomingRef.current = true;
    setZooming(true);
    setOrigin(percent);
  }, []);

  const { armLongPress, cancelLongPress } = useLongPressAction({
    delayMs: IMAGE_GALLERY_LONG_PRESS_MS,
    onLongPress: () => {
      const target = stageRef.current;
      const start = startRef.current;
      if (!target || !start) return;
      beginZoomAt(
        originFromPointer(start.x, start.y, target.getBoundingClientRect()),
      );
    },
  });

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled) return;
      if (event.pointerType === "mouse") stageRef.current = event.currentTarget;
      const start = startRef.current;
      if (start) {
        const distance = Math.hypot(
          event.clientX - start.x,
          event.clientY - start.y,
        );
        if (distance > IMAGE_GALLERY_MOVE_PX) {
          movedRef.current = true;
          cancelLongPress();
        }
      }
      if (event.pointerType === "mouse" && !zoomingRef.current) {
        zoomingRef.current = true;
        setZooming(true);
      }
      if (!zoomingRef.current) return;
      const rect = event.currentTarget.getBoundingClientRect();
      setOrigin(originFromPointer(event.clientX, event.clientY, rect));
    },
    [cancelLongPress, enabled],
  );

  const onPointerLeave = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType !== "mouse") return;
      cancelLongPress();
      stopZoom();
    },
    [cancelLongPress, stopZoom],
  );

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || event.pointerType === "mouse") return;
      stageRef.current = event.currentTarget;
      startRef.current = { x: event.clientX, y: event.clientY };
      movedRef.current = false;
      armLongPress();
    },
    [armLongPress, enabled],
  );

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const start = startRef.current;
      const wasZooming = zoomingRef.current;
      cancelLongPress();
      stopZoom();
      startRef.current = null;

      if (!start || event.pointerType === "mouse") return;

      const action = resolveStageGesture({
        dx: event.clientX - start.x,
        dy: event.clientY - start.y,
        wasZooming,
        moved: movedRef.current,
      });
      if (action === "none") return;

      swallow.arm();
      if (action === "swipe-next") onSwipe?.(1);
      else if (action === "swipe-prev") onSwipe?.(-1);
      else onTap?.();
    },
    [cancelLongPress, onSwipe, onTap, stopZoom, swallow],
  );

  const onPointerCancel = useCallback(() => {
    cancelLongPress();
    stopZoom();
    startRef.current = null;
  }, [cancelLongPress, stopZoom]);

  const stageHandlers = {
    onPointerMove,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onClickCapture: swallow.onClickCapture,
  };

  return { zooming: Boolean(enabled && zooming), origin, stageHandlers };
}
