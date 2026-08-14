'use client'

import {
  useCallback,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  IMAGE_GALLERY_LONG_PRESS_MS,
  IMAGE_GALLERY_MOVE_PX,
  IMAGE_GALLERY_SWIPE_PX,
} from '@/shared/constants/imageGallery'

interface Point {
  x: number
  y: number
}

interface UseImageGalleryZoomOptions {
  enabled?: boolean
  onTap?: () => void
  onSwipe?: (direction: -1 | 1) => void
}

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value))
}

function originFromPointer(clientX: number, clientY: number, rect: DOMRect): Point {
  if (!rect.width || !rect.height) return { x: 50, y: 50 }
  return {
    x: clampPercent(((clientX - rect.left) / rect.width) * 100),
    y: clampPercent(((clientY - rect.top) / rect.height) * 100),
  }
}

export function useImageGalleryZoom({
  enabled = true,
  onTap,
  onSwipe,
}: UseImageGalleryZoomOptions = {}) {
  const [zooming, setZooming] = useState(false)
  const [origin, setOrigin] = useState<Point>({ x: 50, y: 50 })
  const startRef = useRef<{ x: number; y: number } | null>(null)
  const longPressRef = useRef<number | null>(null)
  const movedRef = useRef(false)
  const zoomingRef = useRef(false)
  const swallowClickRef = useRef(false)
  const stageRef = useRef<HTMLElement | null>(null)

  const clearLongPress = useCallback(() => {
    if (longPressRef.current == null) return
    window.clearTimeout(longPressRef.current)
    longPressRef.current = null
  }, [])

  const stopZoom = useCallback(() => {
    zoomingRef.current = false
    setZooming(false)
  }, [])

  const onPointerEnter = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || event.pointerType !== 'mouse') return
      stageRef.current = event.currentTarget
    },
    [enabled],
  )

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled) return
      const start = startRef.current
      if (start) {
        const distance = Math.hypot(event.clientX - start.x, event.clientY - start.y)
        if (distance > IMAGE_GALLERY_MOVE_PX) {
          movedRef.current = true
          clearLongPress()
        }
      }
      if (event.pointerType === 'mouse' && !zoomingRef.current) {
        zoomingRef.current = true
        setZooming(true)
      }
      if (!zoomingRef.current) return
      const rect = event.currentTarget.getBoundingClientRect()
      setOrigin(originFromPointer(event.clientX, event.clientY, rect))
    },
    [clearLongPress, enabled],
  )

  const onPointerLeave = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return
    clearLongPress()
    stopZoom()
  }, [clearLongPress, stopZoom])

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || event.pointerType === 'mouse') return
      stageRef.current = event.currentTarget
      startRef.current = { x: event.clientX, y: event.clientY }
      movedRef.current = false
      longPressRef.current = window.setTimeout(() => {
        const target = stageRef.current
        const start = startRef.current
        if (!target || !start) return
        zoomingRef.current = true
        setZooming(true)
        setOrigin(originFromPointer(start.x, start.y, target.getBoundingClientRect()))
      }, IMAGE_GALLERY_LONG_PRESS_MS)
    },
    [enabled],
  )

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const start = startRef.current
      const wasZooming = zoomingRef.current
      clearLongPress()
      stopZoom()
      startRef.current = null

      if (!start || event.pointerType === 'mouse') return

      const dx = event.clientX - start.x
      const dy = event.clientY - start.y
      if (wasZooming) {
        swallowClickRef.current = true
        return
      }
      if (Math.abs(dx) >= IMAGE_GALLERY_SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
        swallowClickRef.current = true
        onSwipe?.(dx < 0 ? 1 : -1)
        return
      }
      if (!movedRef.current) onTap?.()
    },
    [clearLongPress, onSwipe, onTap, stopZoom],
  )

  const onPointerCancel = useCallback(() => {
    clearLongPress()
    stopZoom()
    startRef.current = null
  }, [clearLongPress, stopZoom])

  const onClickCapture = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    if (!swallowClickRef.current) return
    event.preventDefault()
    event.stopPropagation()
    swallowClickRef.current = false
  }, [])

  return {
    zooming: Boolean(enabled && zooming),
    origin,
    stageHandlers: {
      onPointerEnter,
      onPointerMove,
      onPointerLeave,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onClickCapture,
    },
  }
}
