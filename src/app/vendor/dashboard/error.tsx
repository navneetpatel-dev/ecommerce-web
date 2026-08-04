'use client'

import { useEffect } from 'react'
import { Button } from '@/shared/components/ui/button'

export default function VendorDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-paper">
      <header className="h-14 border-b border-line" />
      <div className="flex">
        <aside className="w-56 shrink-0 border-r border-line min-h-[calc(100vh-3.5rem)]" />
        <main className="flex-1 p-6 flex flex-col items-center justify-center gap-4">
          <h2 className="text-xl font-semibold text-ink">Something went wrong</h2>
          <p className="text-ink/60 text-sm max-w-md text-center">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <Button onClick={reset}>Try again</Button>
        </main>
      </div>
    </div>
  )
}
