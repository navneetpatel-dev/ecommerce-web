'use client'

import { useEffect, useRef } from 'react'

export function useSuccessCheckmark(delayMs = 100) {
  const circleRef = useRef<SVGCircleElement>(null)
  const checkRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      circleRef.current?.classList.add('animate-checkmark-circle')
      checkRef.current?.classList.add('animate-checkmark-check')
    }, delayMs)
    return () => clearTimeout(timer)
  }, [delayMs])

  return { circleRef, checkRef }
}
