'use client'

import type { FormEvent } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { NumberInput } from '@/shared/components/NumberInput'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { LABELS } from '@/shared/constants/labels'

interface AdminTaxRuleFormProps {
  gstPercentage: string
  hsnCode: string
  onGstChange: (value: string) => void
  onHsnChange: (value: string) => void
  onSubmit: (e: FormEvent) => void
}

export function AdminTaxRuleForm({
  gstPercentage,
  hsnCode,
  onGstChange,
  onHsnChange,
  onSubmit,
}: AdminTaxRuleFormProps) {
  const canCreate = gstPercentage.trim() !== '' && Number(gstPercentage) >= 0

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
      <NumberInput
        className="w-36"
        value={gstPercentage === '' ? undefined : Number(gstPercentage)}
        min={0}
        max={100}
        step={0.5}
        suffix="%"
        placeholder={LABELS.gstPercentage}
        onChange={(value) => onGstChange(value == null ? '' : String(value))}
      />
      <Input
        className="min-w-[10rem] flex-1"
        placeholder={LABELS.hsnOptional}
        value={hsnCode}
        onChange={(e) => onHsnChange(e.target.value)}
      />
      <DisabledActionHint disabled={!canCreate} message={LABELS.enterGstPercentage}>
        <Button type="submit" disabled={!canCreate}>
          {LABELS.addTaxRule}
        </Button>
      </DisabledActionHint>
    </form>
  )
}
