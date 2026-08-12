'use client'

import { useEffect } from 'react'

let lockCount = 0
let savedScrollY = 0
let savedOverflow = ''
let savedPaddingRight = ''
let savedPosition = ''
let savedTop = ''
let savedWidth = ''

function applyLock() {
  const { body, documentElement } = document
  savedScrollY = window.scrollY
  savedOverflow = body.style.overflow
  savedPaddingRight = body.style.paddingRight
  savedPosition = body.style.position
  savedTop = body.style.top
  savedWidth = body.style.width

  const scrollbarGap = window.innerWidth - documentElement.clientWidth
  body.style.overflow = 'hidden'
  if (scrollbarGap > 0) {
    body.style.paddingRight = `${scrollbarGap}px`
  }
  body.style.position = 'fixed'
  body.style.top = `-${savedScrollY}px`
  body.style.width = '100%'
}

function releaseLock() {
  const { body } = document
  body.style.overflow = savedOverflow
  body.style.paddingRight = savedPaddingRight
  body.style.position = savedPosition
  body.style.top = savedTop
  body.style.width = savedWidth
  window.scrollTo(0, savedScrollY)
}

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    if (lockCount === 0) applyLock()
    lockCount += 1

    return () => {
      lockCount = Math.max(0, lockCount - 1)
      if (lockCount === 0) releaseLock()
    }
  }, [locked])
}
