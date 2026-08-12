'use client'

import { Suspense } from 'react'
import { BrowseUrlTracker } from '@/shared/components/BrowseUrlTracker'

export function BrowseUrlTrackerContainer() {
  return (
    <Suspense fallback={null}>
      <BrowseUrlTracker />
    </Suspense>
  )
}
