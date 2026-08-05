'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  startNavigationProgress,
  subscribeNavigationProgress,
} from '@/shared/utils/navigation-progress'

export function useNavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [active, setActive] = useState(false)
  const hideTimerRef = useRef<number | null>(null)
  const routeKey = `${pathname}?${searchParams?.toString() ?? ''}`

  useEffect(() => subscribeNavigationProgress(setActive), [])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as HTMLElement | null)?.closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return

      try {
        const url = new URL(href, window.location.origin)
        if (url.origin !== window.location.origin) return
        const nextKey = `${url.pathname}?${url.searchParams.toString()}`
        const currentKey = `${window.location.pathname}?${window.location.search.replace(/^\?/, '')}`
        if (nextKey === currentKey) return
        startNavigationProgress()
      } catch {
        /* ignore invalid href */
      }
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  useEffect(() => {
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current)
    hideTimerRef.current = window.setTimeout(() => setActive(false), 220)
    return () => {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current)
    }
  }, [routeKey])

  return { active }
}
