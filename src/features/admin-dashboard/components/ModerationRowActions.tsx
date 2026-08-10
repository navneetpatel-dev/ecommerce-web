'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { StatusDialog } from '@/shared/components/StatusDialog'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { LABELS } from '@/shared/constants/labels'
import { cn } from '@/shared/utils/cn'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'

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
  approveDisabled?: boolean
  approveDisabledHint?: string
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
  approveDisabled = false,
  approveDisabledHint,
}: ModerationRowActionsProps) {
  const [mode, setMode] = useState<ConfirmMode>(null)
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const close = () => {
    if (submitting) return
    setMode(null)
    setReason('')
    setActionError(null)
  }

  const runApprove = async () => {
    setSubmitting(true)
    setActionError(null)
    try {
      await onConfirmApprove()
      setMode(null)
      setReason('')
    } catch (err) {
      setActionError(getApiErrorMessage(err, LABELS.kycApproveBlocked))
    } finally {
      setSubmitting(false)
    }
  }

  const runReject = async () => {
    if (!reason.trim()) return
    setSubmitting(true)
    setActionError(null)
    try {
      await onConfirmReject(reason.trim())
      setMode(null)
      setReason('')
    } catch (err) {
      setActionError(getApiErrorMessage(err, LABELS.registrationFailed))
    } finally {
      setSubmitting(false)
    }
  }

  const busy = isApproving || isRejecting || submitting

  return (
    <>
      <DisabledActionHint
        disabled={approveDisabled}
        message={approveDisabledHint ?? LABELS.kycApproveBlocked}
      >
        <Button
          size="sm"
          className={cn(approveButtonClass, 'flex-1 sm:flex-none')}
          disabled={busy || approveDisabled}
          onClick={() => {
            setActionError(null)
            setMode('approve')
          }}
        >
          <Check strokeWidth={2.5} aria-hidden />
          <span>{LABELS.approve}</span>
        </Button>
      </DisabledActionHint>
      <Button
        size="sm"
        className={cn(rejectButtonClass, 'flex-1 sm:flex-none')}
        disabled={busy}
        onClick={() => {
          setReason('')
          setActionError(null)
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
        description={
          <>
            <p>{approveDescription}</p>
            {actionError ? <p className="mt-2 text-danger">{actionError}</p> : null}
          </>
        }
        secondaryAction={{
          label: LABELS.cancel,
          disabled: submitting || isApproving,
          onClick: close,
        }}
        primaryAction={{
          label: LABELS.approve,
          loading: submitting || isApproving,
          disabled: approveDisabled,
          disabledHint: approveDisabledHint,
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
        description={
          <>
            <p>{rejectDescription}</p>
            {actionError ? <p className="mt-2 text-danger">{actionError}</p> : null}
          </>
        }
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
