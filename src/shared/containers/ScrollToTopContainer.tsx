'use client'

import { useScrollToTop } from '@/shared/hooks/useScrollToTop'
import { ScrollToTop } from '@/shared/components/ScrollToTop'

export function ScrollToTopContainer() {
  const scroll = useScrollToTop()

  return (
    <ScrollToTop
      visible={scroll.visible}
      onScrollToTop={scroll.scrollToTop}
    />
  )
}
