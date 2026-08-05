'use client'

import { MessageCircle } from 'lucide-react'
import { useState } from 'react'

export function ChatWidget() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open && (
        <div className="mb-4 w-80 rounded-lg border border-line bg-surface-raised p-4 shadow-elevation-3">
          <h3 className="text-[1.125rem] font-semibold text-ink">Need help?</h3>
          <p className="mt-2 text-[0.9375rem] text-ink-muted">
            Chat support is available for orders, returns, and account questions.
          </p>
          <button
            type="button"
            className="mt-4 inline-flex text-[0.8125rem] font-medium text-brand hover:underline"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      )}
      <button
        type="button"
        aria-label="Open chat support"
        onClick={() => setOpen((value) => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface-raised shadow-elevation-2 hover:shadow-elevation-3 transition-all"
      >
        <MessageCircle className="h-6 w-6 text-ink" />
      </button>
    </div>
  )
}
