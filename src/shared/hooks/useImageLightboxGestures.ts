'use client'

import {
  useCallback,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import {
  IMAGE_GALLERY_LIGHTBOX_PINCH_MAX_SCALE,
  IMAGE_GALLERY_LIGHTBOX_PINCH_MIN_SCALE,
  IMAGE_GALLERY_SWIPE_PX,
} from '@/shared/constants/imageGallery'
import {
  applyPinchScale,
  clampPan,
  detectHorizontalSwipe,
  distanceBetween,
  maxPanOffset,
  type PinchTransform,
} from '@/shared/utils/imageGalleryGestures'

interface UseImageLightboxGesturesOptions {
  enabled: boolean
  viewportRef: RefObject<HTMLElement | null>
  onSwipe: (direction: -1 | 1) => void
}

const INITIAL_TRANSFORM: PinchTransform = { scale: 1, x: 0, y: 0 }

export function useImageLightboxGestures({
  enabled,
  viewportRef,
  onSwipe,
}: UseImageLightboxGesturesOptions) {
  const [transform, setTransform] = useState<PinchTransform>(INITIAL_TRANSFORM)
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map())
  const pinchStartRef = useRef<{ distance: number; transform: PinchTransform } | null>(null)
  const panStartRef = useRef<{ x: number; y: number; transform: PinchTransform } | null>(null)
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null)

  const resetTransform = useCallback(() => {
    setTransform(INITIAL_TRANSFORM)
  }, [])

  const clampTransform = useCallback(
    (next: PinchTransform): PinchTransform => {
      const node = viewportRef.current
      if (!node || next.scale <= 1) {
        return { scale: next.scale, x: 0, y: 0 }
      }

      const rect = node.getBoundingClientRect()
      return {
        scale: next.scale,
        x: clampPan(next.x, maxPanOffset(rect.width, next.scale)),
        y: clampPan(next.y, maxPanOffset(rect.height, next.scale)),
      }
    },
    [viewportRef],
  )

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled) return
      event.currentTarget.setPointerCapture(event.pointerId)
      pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

      if (pointersRef.current.size === 1) {
        swipeStartRef.current = { x: event.clientX, y: event.clientY }
        if (transform.scale > 1) {
          panStartRef.current = {
            x: event.clientX,
            y: event.clientY,
            transform,
          }
        }
      }

      if (pointersRef.current.size === 2) {
        swipeStartRef.current = null
        panStartRef.current = null
        const points = [...pointersRef.current.values()]
        pinchStartRef.current = {
          distance: distanceBetween(points[0], points[1]),
          transform,
        }
      }
    },
    [enabled, transform],
  )

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || !pointersRef.current.has(event.pointerId)) return
      pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

      if (pointersRef.current.size >= 2) {
        const points = [...pointersRef.current.values()]
        const start = pinchStartRef.current
        if (!start) return
        const nextDistance = distanceBetween(points[0], points[1])
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
        )
        return
      }

      const panStart = panStartRef.current
      if (panStart && transform.scale > 1) {
        setTransform(
          clampTransform({
            scale: panStart.transform.scale,
            x: panStart.transform.x + (event.clientX - panStart.x),
            y: panStart.transform.y + (event.clientY - panStart.y),
          }),
        )
      }
    },
    [clampTransform, enabled, transform.scale],
  )

  const finishPointer = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled) return
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      pointersRef.current.delete(event.pointerId)

      if (pointersRef.current.size < 2) {
        pinchStartRef.current = null
      }

      if (pointersRef.current.size === 0) {
        const swipeStart = swipeStartRef.current
        swipeStartRef.current = null
        panStartRef.current = null

        if (swipeStart && transform.scale <= 1) {
          const direction = detectHorizontalSwipe(
            swipeStart,
            { x: event.clientX, y: event.clientY },
            IMAGE_GALLERY_SWIPE_PX,
          )
          if (direction != null) onSwipe(direction)
        }
      }
    },
    [enabled, onSwipe, transform.scale],
  )

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      finishPointer(event)
    },
    [finishPointer],
  )

  const onPointerCancel = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      finishPointer(event)
    },
    [finishPointer],
  )

  return {
    transform,
    resetTransform,
    viewportHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
    },
  }
}
