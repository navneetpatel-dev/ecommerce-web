'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { StatusDialog } from '@/shared/components/StatusDialog'
import { LABELS } from '@/shared/constants/labels'
import { cn } from '@/shared/utils/cn'

type ConfirmMode = 'approve' | 'reject' | null

interface ModerationRowActionsProps {
  approveTitle: string
  approveDescription: string
  rejectTitle: string
  rejectDescription: string
  rejectFieldLabel: string
  rejectEmptyHint: string
  onConfirmApprove: () => void | Promise<unknown>
  onConfirmReject: (reason: string) => void | Promise<unknown>
  isApproving?: boolean
  isRejecting?: boolean
}

const approveButtonClass = cn(
  'shrink-0 overflow-visible border-transparent bg-brand text-paper shadow-sm',
  'hover:bg-brand-hover hover:text-paper',
  'gap-1.5 px-3 font-semibold tracking-wide',
  '[&_svg]:!size-3.5 [&_svg]:shrink-0',
)

const rejectButtonClass = cn(
  'shrink-0 overflow-visible border-transparent bg-danger text-paper shadow-sm',
  'hover:bg-danger/90 hover:text-paper',
  'gap-1.5 px-3 font-semibold tracking-wide',
  '[&_svg]:!size-3.5 [&_svg]:shrink-0',
)

/** Classy approve/reject controls with StatusDialog confirmation. */
export function ModerationRowActions({
  approveTitle,
  approveDescription,
  rejectTitle,
  rejectDescription,
  rejectFieldLabel,
  rejectEmptyHint,
  onConfirmApprove,
  onConfirmReject,
  isApproving = false,
  isRejecting = false,
}: ModerationRowActionsProps) {
  const [mode, setMode] = useState<ConfirmMode>(null)
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const close = () => {
    if (submitting) return
    setMode(null)
    setReason('')
  }

  const runApprove = async () => {
    setSubmitting(true)
    try {
      await onConfirmApprove()
      setMode(null)
      setReason('')
    } finally {
      setSubmitting(false)
    }
  }

  const runReject = async () => {
    if (!reason.trim()) return
    setSubmitting(true)
    try {
      await onConfirmReject(reason.trim())
      setMode(null)
      setReason('')
    } finally {
      setSubmitting(false)
    }
  }

  const busy = isApproving || isRejecting || submitting

  return (
    <>
      <Button
        size="sm"
        className={cn(approveButtonClass, 'flex-1 sm:flex-none')}
        disabled={busy}
        onClick={() => setMode('approve')}
      >
        <Check strokeWidth={2.5} aria-hidden />
        <span>{LABELS.approve}</span>
      </Button>
      <Button
        size="sm"
        className={cn(rejectButtonClass, 'flex-1 sm:flex-none')}
        disabled={busy}
        onClick={() => {
          setReason('')
          setMode('reject')
        }}
      >
        <X strokeWidth={2.5} aria-hidden />
        <span>{LABELS.reject}</span>
      </Button>

      <StatusDialog
        open={mode === 'approve'}
        onOpenChange={(open) => {
          if (!open) close()
        }}
        variant="success"
        title={approveTitle}
        description={approveDescription}
        secondaryAction={{
          label: LABELS.cancel,
          disabled: submitting || isApproving,
          onClick: close,
        }}
        primaryAction={{
          label: LABELS.approve,
          loading: submitting || isApproving,
          onClick: () => {
            void runApprove()
          },
        }}
      />

      <StatusDialog
        open={mode === 'reject'}
        onOpenChange={(open) => {
          if (!open) close()
        }}
        variant="danger"
        title={rejectTitle}
        description={rejectDescription}
        secondaryAction={{
          label: LABELS.cancel,
          disabled: submitting || isRejecting,
          onClick: close,
        }}
        primaryAction={{
          label: LABELS.reject,
          variant: 'destructive',
          loading: submitting || isRejecting,
          disabled: !reason.trim(),
          disabledHint: !reason.trim() ? rejectEmptyHint : undefined,
          onClick: () => {
            void runReject()
          },
        }}
      >
        <label className="block space-y-2">
          <span className="text-[0.8125rem] font-medium text-ink">{rejectFieldLabel}</span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder={rejectFieldLabel}
            className={cn(
              'w-full resize-none rounded-md border border-line bg-surface px-3 py-2.5',
              'text-[0.9375rem] text-ink outline-none',
              'placeholder:text-ink-faint focus-visible:border-brand',
            )}
          />
          {!reason.trim() ? (
            <p className="text-[0.8125rem] text-ink-muted">{rejectEmptyHint}</p>
          ) : null}
        </label>
      </StatusDialog>
    </>
  )
}
