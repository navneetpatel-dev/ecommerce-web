'use client'

import { useEffect } from 'react'
import { Button } from '@/shared/components/ui/button'

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper gap-4 p-8">
      <h2 className="text-xl font-semibold text-ink">Something went wrong</h2>
      <p className="text-ink/60 text-sm max-w-md text-center">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
