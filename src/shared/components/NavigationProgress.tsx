'use client'

import { cn } from '@/shared/utils/cn'

interface NavigationProgressProps {
  active: boolean
}

/** Thin top progress bar shown during client-side route changes. */
export function NavigationProgress({ active }: NavigationProgressProps) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden"
      aria-hidden={!active}
      role="presentation"
    >
      <div
        className={cn(
          'h-full origin-left bg-brand transition-[transform,opacity] duration-300 ease-out',
          active ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          transform: active ? 'scaleX(0.72)' : 'scaleX(0)',
          transitionDuration: active ? '8s' : '280ms',
        }}
      />
    </div>
  )
}
