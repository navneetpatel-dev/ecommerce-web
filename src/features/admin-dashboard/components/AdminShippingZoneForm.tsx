'use client'

import type { FormEvent } from 'react'
import { Button } from '@/shared/components/ui/button'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { LABELS } from '@/shared/constants/labels'
import { cn } from '@/shared/utils/cn'

interface AdminShippingZoneFormProps {
  name: string
  onNameChange: (value: string) => void
  onSubmit: (e: FormEvent) => void
}

export function AdminShippingZoneForm({
  name,
  onNameChange,
  onSubmit,
}: AdminShippingZoneFormProps) {
  const canCreate = Boolean(name.trim())

  return (
    <form
      className="flex flex-wrap items-center gap-2 rounded-md border border-line bg-surface p-3"
      onSubmit={(e) => {
        if (!canCreate) {
          e.preventDefault()
          return
        }
        onSubmit(e)
      }}
    >
      <input
        className={cn(
          'h-11 min-w-[14rem] flex-1 rounded-md border border-line bg-paper px-3',
          'text-[0.9375rem] text-ink outline-none placeholder:text-ink-faint',
          'focus-visible:border-brand',
        )}
        placeholder={LABELS.zoneName}
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <DisabledActionHint disabled={!canCreate} message={LABELS.enterZoneName}>
        <Button type="submit" disabled={!canCreate}>
          {LABELS.addShippingZone}
        </Button>
      </DisabledActionHint>
    </form>
  )
}
