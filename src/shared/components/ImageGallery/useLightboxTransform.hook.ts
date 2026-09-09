"use client";

import { useCallback, useState, type RefObject } from "react";
import {
  IMAGE_GALLERY_LIGHTBOX_PINCH_MAX_SCALE,
  IMAGE_GALLERY_LIGHTBOX_PINCH_MIN_SCALE,
} from "@/shared/constants/imageGallery";
import {
  applyPinchScale,
  clampPan,
  maxPanOffset,
  type PinchTransform,
} from "@/shared/utils/imageGalleryGestures";

const INITIAL_TRANSFORM: PinchTransform = { scale: 1, x: 0, y: 0 };

export interface UseLightboxTransformParams {
  viewportRef: RefObject<HTMLElement | null>;
}

/**
 * Transform state for the lightbox stage: scale/pan value plus clamped
 * mutators. Pan clamps against the measured viewport so a zoomed image can
 * never be dragged fully out of view. Gesture routing lives in
 * `useImageLightboxGestures` (Rule 3: one concern per hook).
 */
export function useLightboxTransform(params: UseLightboxTransformParams) {
  const { viewportRef } = params;
  const [transform, setTransform] = useState<PinchTransform>(INITIAL_TRANSFORM);

  const resetTransform = useCallback(() => {
    setTransform(INITIAL_TRANSFORM);
  }, []);

  const clampTransform = useCallback(
    (next: PinchTransform): PinchTransform => {
      const node = viewportRef.current;
      if (!node || next.scale <= 1) {
        return { scale: next.scale, x: 0, y: 0 };
      }

      const rect = node.getBoundingClientRect();
      return {
        scale: next.scale,
        x: clampPan(next.x, maxPanOffset(rect.width, next.scale)),
        y: clampPan(next.y, maxPanOffset(rect.height, next.scale)),
      };
    },
    [viewportRef],
  );

  /** Applies a two-finger distance change to the pinch-start snapshot. */
  const applyPinchMove = useCallback(
    (
      start: { distance: number; transform: PinchTransform },
      nextDistance: number,
    ) => {
      setTransform(
        clampTransform(
          applyPinchScale(
            start.transform,
            start.distance,
            nextDistance,
            IMAGE_GALLERY_LIGHTBOX_PINCH_MIN_SCALE,
            IMAGE_GALLERY_LIGHTBOX_PINCH_MAX_SCALE,
          ),
        ),
      );
    },
    [clampTransform],
  );

  /** Applies a one-finger pan delta to a zoomed transform. */
  const applyPanMove = useCallback(
    (
      panStart: { x: number; y: number; transform: PinchTransform },
      clientX: number,
      clientY: number,
    ) => {
      setTransform(
        clampTransform({
          scale: panStart.transform.scale,
          x: panStart.transform.x + (clientX - panStart.x),
          y: panStart.transform.y + (clientY - panStart.y),
        }),
      );
    },
    [clampTransform],
  );

  return {
    transform,
    resetTransform,
    clampTransform,
    applyPinchMove,
    applyPanMove,
  };
}
