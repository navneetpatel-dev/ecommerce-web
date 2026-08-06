'use client'

import { useState, type ReactNode } from 'react'
import { Archive, Check, Trash2, Ban, Play } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  StatusDialog,
  type StatusDialogVariant,
} from '@/shared/components/StatusDialog'
import { LABELS } from '@/shared/constants/labels'
import { cn } from '@/shared/utils/cn'
import { adminActionTone, type AdminActionTone } from '../utils/adminActionTone'

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive'

interface AdminConfirmActionProps {
  label: string
  title: string
  description: ReactNode
  dialogVariant?: StatusDialogVariant
  /** Visual tone for the table trigger chip. */
  tone?: AdminActionTone
  triggerVariant?: ButtonVariant
  confirmVariant?: ButtonVariant
  confirmLabel?: string
  triggerClassName?: string
  requireReason?: boolean
  reasonLabel?: string
  reasonHint?: string
  onConfirm: (reason?: string) => void | Promise<unknown>
  disabled?: boolean
  showIcon?: boolean
}

function toneIcon(tone: AdminActionTone) {
  switch (tone) {
    case 'archive':
      return Archive
    case 'danger':
      return Trash2
    case 'success':
      return Check
    case 'neutral':
      return Ban
    default:
      return Play
  }
}

function toneFromDialog(variant: StatusDialogVariant): AdminActionTone {
  if (variant === 'danger') return 'danger'
  if (variant === 'success') return 'success'
  /** Warning is used for archive, suspend, block — callers should pass `tone` when not archive. */
  if (variant === 'warning') return 'archive'
  return 'neutral'
}

/** Button + StatusDialog confirmation for admin list actions. */
export function AdminConfirmAction({
  label,
  title,
  description,
  dialogVariant = 'warning',
  tone,
  triggerVariant = 'outline',
  confirmVariant,
  confirmLabel,
  triggerClassName,
  requireReason = false,
  reasonLabel = LABELS.reasonRequired,
  reasonHint = LABELS.enterRejectionReason,
  onConfirm,
  disabled = false,
  showIcon = true,
}: AdminConfirmActionProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reason, setReason] = useState('')

  const resolvedTone = tone ?? toneFromDialog(dialogVariant)
  const Icon = toneIcon(resolvedTone)

  const close = () => {
    if (loading) return
    setOpen(false)
    setReason('')
  }

  const run = async () => {
    if (requireReason && !reason.trim()) return
    setLoading(true)
    try {
      await onConfirm(requireReason ? reason.trim() : undefined)
      setOpen(false)
      setReason('')
    } finally {
      setLoading(false)
    }
  }

  const primaryVariant =
    confirmVariant ?? (dialogVariant === 'danger' ? 'destructive' : 'default')

  return (
    <>
      <Button
        size="sm"
        variant={triggerVariant}
        className={cn(
          'shrink-0 overflow-visible',
          adminActionTone[resolvedTone],
          triggerClassName,
        )}
        disabled={disabled || loading}
        onClick={() => {
          setReason('')
          setOpen(true)
        }}
      >
        {showIcon ? <Icon strokeWidth={2.25} aria-hidden /> : null}
        <span>{label}</span>
      </Button>

      <StatusDialog
        open={open}
        onOpenChange={(next) => {
          if (!next) close()
        }}
        variant={dialogVariant}
        title={title}
        description={description}
        secondaryAction={{
          label: LABELS.cancel,
          disabled: loading,
          onClick: close,
        }}
        primaryAction={{
          label: confirmLabel ?? label,
          variant: primaryVariant,
          loading,
          disabled: requireReason && !reason.trim(),
          disabledHint: requireReason && !reason.trim() ? reasonHint : undefined,
          onClick: () => {
            void run()
          },
        }}
      >
        {requireReason ? (
          <label className="block space-y-2">
            <span className="text-[0.8125rem] font-medium text-ink">{reasonLabel}</span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder={reasonLabel}
              className={cn(
                'w-full resize-none rounded-md border border-line bg-surface px-3 py-2.5',
                'text-[0.9375rem] text-ink outline-none',
                'placeholder:text-ink-faint focus-visible:border-brand',
              )}
            />
            {!reason.trim() ? (
              <p className="text-[0.8125rem] text-ink-muted">{reasonHint}</p>
            ) : null}
          </label>
        ) : null}
      </StatusDialog>
    </>
  )
}
