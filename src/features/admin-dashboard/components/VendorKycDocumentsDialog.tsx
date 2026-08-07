'use client'

import { useCallback, useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { StatusDialog } from '@/shared/components/StatusDialog'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import { cn } from '@/shared/utils/cn'
import { adminApi } from '../api/admin.api'

type VendorDocumentRow = {
  id: string
  type: 'GST_CERT' | 'PAN' | 'BANK_PROOF'
  url: string
  verified: boolean
}

type ConfirmMode = 'verify' | 'reject' | null

function documentTypeLabel(type: VendorDocumentRow['type']): string {
  switch (type) {
    case 'GST_CERT':
      return LABELS.documentTypeGst
    case 'PAN':
      return LABELS.documentTypePan
    case 'BANK_PROOF':
      return LABELS.documentTypeBank
    default:
      return LABELS.documentType
  }
}

interface VendorKycDocumentsDialogProps {
  vendorId: string
  vendorName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VendorKycDocumentsDialog({
  vendorId,
  vendorName,
  open,
  onOpenChange,
}: VendorKycDocumentsDialogProps) {
  const [documents, setDocuments] = useState<VendorDocumentRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<ConfirmMode>(null)
  const [activeDoc, setActiveDoc] = useState<VendorDocumentRow | null>(null)
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const rows = await adminApi.getVendorDocuments(vendorId)
      setDocuments(
        rows.map((row) => ({
          id: row.id,
          type: row.type,
          url: row.url,
          verified: Boolean(row.verified),
        })),
      )
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadDocuments))
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }, [vendorId])

  useEffect(() => {
    if (!open) return
    void load()
  }, [open, load])

  const closeConfirm = () => {
    if (submitting) return
    setMode(null)
    setActiveDoc(null)
    setReason('')
  }

  const runVerify = async () => {
    if (!activeDoc) return
    setSubmitting(true)
    try {
      await adminApi.verifyVendorDocument(activeDoc.id)
      closeConfirm()
      await load()
    } finally {
      setSubmitting(false)
    }
  }

  const runReject = async () => {
    if (!activeDoc || !reason.trim()) return
    setSubmitting(true)
    try {
      await adminApi.rejectVendorDocument(activeDoc.id, reason.trim())
      closeConfirm()
      await load()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{LABELS.kycDocuments}</DialogTitle>
            <DialogDescription>{vendorName}</DialogDescription>
          </DialogHeader>

          {loading ? (
            <p className="py-6 text-center text-[0.9375rem] text-ink-muted">{LABELS.loading}</p>
          ) : null}

          {!loading && error ? (
            <p className="py-6 text-center text-[0.9375rem] text-danger">{error}</p>
          ) : null}

          {!loading && !error && documents.length === 0 ? (
            <p className="py-6 text-center text-[0.9375rem] text-ink-muted">
              {LABELS.noKycDocuments}
            </p>
          ) : null}

          {!loading && !error && documents.length > 0 ? (
            <ul className="space-y-3">
              {documents.map((doc) => {
                const typeLabel = documentTypeLabel(doc.type)
                return (
                  <li
                    key={doc.id}
                    className="flex flex-col gap-3 rounded-md border border-line bg-surface px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="truncate text-[0.9375rem] font-medium text-ink">{typeLabel}</p>
                      <p className="text-[0.8125rem] text-ink-muted">
                        {doc.verified ? LABELS.documentVerified : LABELS.documentPending}
                      </p>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-brand hover:underline"
                      >
                        <FileText className="size-3.5" aria-hidden />
                        {LABELS.openDocument}
                      </a>
                    </div>
                    {!doc.verified ? (
                      <div className="flex shrink-0 gap-2">
                        <Button
                          size="sm"
                          className="bg-brand text-paper hover:bg-brand-hover"
                          onClick={() => {
                            setActiveDoc(doc)
                            setMode('verify')
                          }}
                        >
                          {LABELS.verifyDocument}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setActiveDoc(doc)
                            setReason('')
                            setMode('reject')
                          }}
                        >
                          {LABELS.rejectDocument}
                        </Button>
                      </div>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          ) : null}
        </DialogContent>
      </Dialog>

      <StatusDialog
        open={mode === 'verify' && Boolean(activeDoc)}
        onOpenChange={(next) => {
          if (!next) closeConfirm()
        }}
        variant="success"
        title={LABELS.confirmVerifyDocumentTitle}
        description={
          activeDoc
            ? formatLabel(LABELS.confirmVerifyDocumentBody, {
                type: documentTypeLabel(activeDoc.type),
                name: vendorName,
              })
            : undefined
        }
        secondaryAction={{
          label: LABELS.cancel,
          disabled: submitting,
          onClick: closeConfirm,
        }}
        primaryAction={{
          label: LABELS.verifyDocument,
          loading: submitting,
          onClick: () => {
            void runVerify()
          },
        }}
      />

      <StatusDialog
        open={mode === 'reject' && Boolean(activeDoc)}
        onOpenChange={(next) => {
          if (!next) closeConfirm()
        }}
        variant="danger"
        title={LABELS.confirmRejectDocumentTitle}
        description={
          activeDoc
            ? formatLabel(LABELS.confirmRejectDocumentBody, {
                type: documentTypeLabel(activeDoc.type),
                name: vendorName,
              })
            : undefined
        }
        secondaryAction={{
          label: LABELS.cancel,
          disabled: submitting,
          onClick: closeConfirm,
        }}
        primaryAction={{
          label: LABELS.rejectDocument,
          variant: 'destructive',
          loading: submitting,
          disabled: !reason.trim(),
          disabledHint: !reason.trim() ? LABELS.enterRejectionReason : undefined,
          onClick: () => {
            void runReject()
          },
        }}
      >
        <label className="block space-y-2">
          <span className="text-[0.8125rem] font-medium text-ink">{LABELS.reasonRequired}</span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder={LABELS.reasonRequired}
            className={cn(
              'w-full resize-none rounded-md border border-line bg-surface px-3 py-2.5',
              'text-[0.9375rem] text-ink outline-none',
              'placeholder:text-ink-faint focus-visible:border-brand',
            )}
          />
          {!reason.trim() ? (
            <p className="text-[0.8125rem] text-ink-muted">{LABELS.enterRejectionReason}</p>
          ) : null}
        </label>
      </StatusDialog>
    </>
  )
}
