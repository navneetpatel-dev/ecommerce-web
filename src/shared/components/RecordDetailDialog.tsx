'use client'

import { StatusBadge } from '@/shared/components/StatusBadge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { LABELS } from '@/shared/constants/labels'
import { tryFormatDateTime } from '@/shared/utils/formatDate'
import {
  buildRecordDetailFields,
  getRecordDetailTitle,
} from '@/shared/utils/recordDetails'

interface RecordDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: Record<string, unknown> | null
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}

function formatDetailValue(key: string, value: unknown) {
  if (value == null || value === '') {
    return <span className="text-ink-faint">—</span>
  }

  if (typeof value === 'boolean') {
    return value ? LABELS.yes : LABELS.no
  }

  if (key === 'status' || key.endsWith('Status') || key === 'paymentStatus') {
    if (typeof value === 'string' && value.trim()) {
      return <StatusBadge status={value} />
    }
  }

  const asDate = tryFormatDateTime(value)
  if (asDate) return asDate

  if (typeof value === 'string') {
    return <span className="break-words whitespace-pre-wrap">{value}</span>
  }

  if (typeof value === 'number') {
    return <span className="font-mono tabular-nums">{value}</span>
  }

  if (Array.isArray(value) || isPlainObject(value)) {
    return (
      <pre className="max-h-48 overflow-auto rounded-md border border-line bg-paper px-3 py-2 font-mono text-[0.75rem] leading-relaxed text-ink whitespace-pre-wrap break-words">
        {JSON.stringify(value, null, 2)}
      </pre>
    )
  }

  return String(value)
}

/** Presentational modal listing every safe field on a table row. */
export function RecordDetailDialog({ open, onOpenChange, record }: RecordDetailDialogProps) {
  const fields = record ? buildRecordDetailFields(record) : []
  const title = record ? getRecordDetailTitle(record) : LABELS.recordDetails

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-4 sm:gap-5">
        <DialogHeader>
          <DialogTitle className="pr-8">{title}</DialogTitle>
          <DialogDescription>{LABELS.recordDetailsHint}</DialogDescription>
        </DialogHeader>

        {fields.length === 0 ? (
          <p className="text-[0.9375rem] text-ink-muted">{LABELS.noDetailFields}</p>
        ) : (
          <dl className="max-h-[min(60dvh,32rem)] divide-y divide-line overflow-y-auto rounded-md border border-line">
            {fields.map((field) => (
              <div
                key={field.key}
                className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(7rem,11rem)_minmax(0,1fr)] sm:gap-4"
              >
                <dt className="text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted">
                  {field.label}
                </dt>
                <dd className="min-w-0 text-[0.9375rem] text-ink">
                  {formatDetailValue(field.key, field.value)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </DialogContent>
    </Dialog>
  )
}
