'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { StatusDialog } from '@/shared/components/StatusDialog'
import { LABELS } from '@/shared/constants/labels'
import { cn } from '@/shared/utils/cn'
import { adminActionTone } from '../utils/adminActionTone'

interface AdminEditNameActionProps {
  currentName: string
  title: string
  description: string
  fieldLabel: string
  emptyHint: string
  onSave: (name: string) => void | Promise<unknown>
}

/** Classy rename action with custom dialog (replaces window.prompt). */
export function AdminEditNameAction({
  currentName,
  title,
  description,
  fieldLabel,
  emptyHint,
  onSave,
}: AdminEditNameActionProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(currentName)

  const close = () => {
    if (loading) return
    setOpen(false)
  }

  const run = async () => {
    const next = name.trim()
    if (!next || next === currentName.trim()) return
    setLoading(true)
    try {
      await onSave(next)
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const canSave = Boolean(name.trim()) && name.trim() !== currentName.trim()

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className={cn('shrink-0 overflow-visible', adminActionTone.edit)}
        disabled={loading}
        onClick={() => {
          setName(currentName)
          setOpen(true)
        }}
      >
        <Pencil strokeWidth={2.25} aria-hidden />
        <span>{LABELS.edit}</span>
      </Button>

      <StatusDialog
        open={open}
        onOpenChange={(next) => {
          if (!next) close()
        }}
        variant="info"
        title={title}
        description={description}
        secondaryAction={{
          label: LABELS.cancel,
          disabled: loading,
          onClick: close,
        }}
        primaryAction={{
          label: LABELS.save,
          loading,
          disabled: !canSave,
          disabledHint: !name.trim() ? emptyHint : undefined,
          onClick: () => {
            void run()
          },
        }}
      >
        <label className="block space-y-2">
          <span className="text-[0.8125rem] font-medium text-ink">{fieldLabel}</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className={cn(
              'h-11 w-full rounded-md border border-line bg-surface px-3',
              'text-[0.9375rem] text-ink outline-none',
              'placeholder:text-ink-faint focus-visible:border-brand',
            )}
            placeholder={fieldLabel}
          />
          {!name.trim() ? (
            <p className="text-[0.8125rem] text-ink-muted">{emptyHint}</p>
          ) : null}
        </label>
      </StatusDialog>
    </>
  )
}
