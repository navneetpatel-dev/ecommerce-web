'use client'

import { Suspense } from 'react'
import { NavigationProgress } from '@/shared/components/NavigationProgress'
import { useNavigationProgress } from '@/shared/hooks/useNavigationProgress'

function NavigationProgressInner() {
  const progress = useNavigationProgress()
  return <NavigationProgress active={progress.active} />
}

export function NavigationProgressContainer() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  )
}
