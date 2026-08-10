'use client'

import { useEffect } from 'react'
import { Button } from '@/shared/components/ui/button'
import { LABELS } from '@/shared/constants/labels'

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
          <h2 className="text-[1.375rem] font-semibold text-ink">{LABELS.unexpectedErrorHeading}</h2>
          <p className="max-w-md text-center text-[0.9375rem] text-ink-muted">
            {LABELS.unexpectedErrorBody}
          </p>
          <Button onClick={reset}>Try again</Button>
        </main>
      </div>
    </div>
  )
}
