'use client'

import { useCookieBanner } from '@/shared/hooks/useCookieBanner'
import { CookieBanner } from '@/shared/components/CookieBanner'

export function CookieBannerContainer() {
  const banner = useCookieBanner()

  return (
    <CookieBanner
      visible={banner.visible}
      onAccept={banner.accept}
      onDismiss={banner.dismiss}
    />
  )
}
