'use client'

import { Suspense } from 'react'
import { RouteScrollReset } from '@/shared/components/RouteScrollReset'

export function RouteScrollResetContainer() {
  return (
    <Suspense fallback={null}>
      <RouteScrollReset />
    </Suspense>
  )
}
