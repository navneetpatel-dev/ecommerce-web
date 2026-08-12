'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { captureBrowseUrl } from '@/shared/utils/lastBrowseUrl'

/**
 * Records the current page as the "last browsed URL" on every client navigation, so bug report
 * forms can prefill a useful page context even when `document.referrer` is empty (SPA nav).
 */
export function BrowseUrlTracker() {
  const pathname = usePathname()

  useEffect(() => {
    captureBrowseUrl(pathname)
  }, [pathname])

  return null
}
