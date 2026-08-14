'use client'

import { useState } from 'react'
import { FormFieldFrame } from '@/shared/components/forms'
import { Textarea } from '@/shared/components/ui/textarea'
import { StatusDialog } from '@/shared/components/StatusDialog'
import { LABELS } from '@/shared/constants/labels'

interface VendorReviewRespondDialogProps {
  open: boolean
  submitting?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (response: string) => void
}

/** In-app review reply dialog — replaces window.prompt. */
export function VendorReviewRespondDialog({
  open,
  submitting = false,
  onOpenChange,
  onSubmit,
}: VendorReviewRespondDialogProps) {
  const [response, setResponse] = useState('')

  const close = () => {
    if (submitting) return
    onOpenChange(false)
  }

  const canSend = Boolean(response.trim())

  return (
    <StatusDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          close()
          setResponse('')
          return
        }
        onOpenChange(true)
      }}
      variant="info"
      title={LABELS.reviewResponseTitle}
      description={LABELS.reviewResponseBody}
      secondaryAction={{
        label: LABELS.cancel,
        disabled: submitting,
        onClick: close,
      }}
      primaryAction={{
        label: LABELS.respondToReview,
        loading: submitting,
        disabled: !canSend,
        disabledHint: !response.trim() ? LABELS.reviewResponseEmptyHint : undefined,
        onClick: () => onSubmit(response.trim()),
      }}
    >
      <FormFieldFrame
        label={LABELS.reviewResponseLabel}
        htmlFor="vendor-review-response"
        hint={!response.trim() ? LABELS.reviewResponseEmptyHint : undefined}
      >
        <Textarea
          id="vendor-review-response"
          value={response}
          onChange={(event) => setResponse(event.target.value)}
          disabled={submitting}
          autoFocus
        />
      </FormFieldFrame>
    </StatusDialog>
  )
}
