export interface Point2D {
  x: number
  y: number
}

export interface PinchTransform {
  scale: number
  x: number
  y: number
}

export function detectHorizontalSwipe(
  start: Point2D,
  end: Point2D,
  swipeThreshold: number,
): -1 | 1 | null {
  const dx = end.x - start.x
  const dy = end.y - start.y
  if (Math.abs(dx) < swipeThreshold || Math.abs(dx) <= Math.abs(dy)) return null
  return dx < 0 ? 1 : -1
}

export function distanceBetween(a: Point2D, b: Point2D) {
  return Math.hypot(b.x - a.x, b.y - a.y)
}

export function midpointBetween(a: Point2D, b: Point2D): Point2D {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

export function clampScale(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function clampPan(value: number, maxOffset: number) {
  return Math.min(maxOffset, Math.max(-maxOffset, value))
}

export function maxPanOffset(containerSize: number, scale: number) {
  if (scale <= 1) return 0
  return ((scale - 1) * containerSize) / 2
}

export function applyPinchScale(
  current: PinchTransform,
  startDistance: number,
  nextDistance: number,
  minScale: number,
  maxScale: number,
): PinchTransform {
  if (startDistance <= 0) return current
  const nextScale = clampScale(
    current.scale * (nextDistance / startDistance),
    minScale,
    maxScale,
  )
  return {
    scale: nextScale,
    x: nextScale <= 1 ? 0 : current.x,
    y: nextScale <= 1 ? 0 : current.y,
  }
}
