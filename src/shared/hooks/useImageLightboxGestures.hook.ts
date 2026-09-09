"use client";

import {
  useCallback,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { IMAGE_GALLERY_SWIPE_PX } from "@/shared/constants/imageGallery";
import {
  detectHorizontalSwipe,
  distanceBetween,
} from "@/shared/utils/imageGalleryGestures";
import { useLightboxTransform } from "./useLightboxTransform.hook";

export interface UseImageLightboxGesturesOptions {
  enabled: boolean;
  viewportRef: RefObject<HTMLElement | null>;
  onSwipe: (direction: -1 | 1) => void;
}

/**
 * Pointer routing for the lightbox viewport (pinch / pan / swipe). Transform
 * math and clamping live in `useLightboxTransform`; this hook only maps raw
 * pointer events onto those operations (Rule 3/14).
 */
export function useImageLightboxGestures({
  enabled,
  viewportRef,
  onSwipe,
}: UseImageLightboxGesturesOptions) {
  const { transform, resetTransform, applyPinchMove, applyPanMove } =
    useLightboxTransform({ viewportRef });

  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartRef = useRef<{
    distance: number;
    transform: { scale: number; x: number; y: number };
  } | null>(null);
  const panStartRef = useRef<{
    x: number;
    y: number;
    transform: { scale: number; x: number; y: number };
  } | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });

      if (pointersRef.current.size === 1) {
        swipeStartRef.current = { x: event.clientX, y: event.clientY };
        if (transform.scale > 1) {
          panStartRef.current = {
            x: event.clientX,
            y: event.clientY,
            transform,
          };
        }
      }

      if (pointersRef.current.size === 2) {
        swipeStartRef.current = null;
        panStartRef.current = null;
        const points = [...pointersRef.current.values()];
        pinchStartRef.current = {
          distance: distanceBetween(points[0], points[1]),
          transform,
        };
      }
    },
    [enabled, transform],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || !pointersRef.current.has(event.pointerId)) return;
      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });

      if (pointersRef.current.size >= 2) {
        const start = pinchStartRef.current;
        if (!start) return;
        const points = [...pointersRef.current.values()];
        applyPinchMove(start, distanceBetween(points[0], points[1]));
        return;
      }

      const panStart = panStartRef.current;
      if (panStart && transform.scale > 1) {
        applyPanMove(panStart, event.clientX, event.clientY);
      }
    },
    [applyPanMove, applyPinchMove, enabled, transform.scale],
  );

  const finishPointer = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled) return;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      pointersRef.current.delete(event.pointerId);

      if (pointersRef.current.size < 2) {
        pinchStartRef.current = null;
      }

      if (pointersRef.current.size === 0) {
        const swipeStart = swipeStartRef.current;
        swipeStartRef.current = null;
        panStartRef.current = null;

        if (swipeStart && transform.scale <= 1) {
          const direction = detectHorizontalSwipe(
            swipeStart,
            { x: event.clientX, y: event.clientY },
            IMAGE_GALLERY_SWIPE_PX,
          );
          if (direction != null) onSwipe(direction);
        }
      }
    },
    [enabled, onSwipe, transform.scale],
  );

  const viewportHandlers = {
    onPointerDown,
    onPointerMove,
    onPointerUp: finishPointer,
    onPointerCancel: finishPointer,
  };

  return {
    transform,
    resetTransform,
    viewportHandlers,
  };
}
