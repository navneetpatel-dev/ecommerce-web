'use client'

import { useEffect } from 'react'
import { Button } from '@/shared/components/ui/button'
import { LABELS } from '@/shared/constants/labels'

export default function StorefrontError({
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper p-8">
      <h2 className="text-[1.375rem] font-semibold text-ink">{LABELS.unexpectedErrorHeading}</h2>
      <p className="max-w-md text-center text-[0.9375rem] text-ink-muted">
        {LABELS.unexpectedErrorBody}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
