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
      className="flex flex-col gap-3 rounded-md border border-line bg-surface p-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2"
      onSubmit={(e) => {
        if (!canCreate) {
          e.preventDefault()
          return
        }
        onSubmit(e)
      }}
    >
      <NumberInput
        className="w-full sm:w-36"
        value={gstPercentage === '' ? undefined : Number(gstPercentage)}
        min={0}
        max={100}
        step={0.5}
        suffix="%"
        placeholder={LABELS.gstPercentage}
        onChange={(value) => onGstChange(value == null ? '' : String(value))}
      />
      <Input
        className="w-full min-w-0 flex-1 sm:min-w-[10rem]"
        placeholder={LABELS.hsnOptional}
        value={hsnCode}
        onChange={(e) => onHsnChange(e.target.value)}
      />
      <DisabledActionHint disabled={!canCreate} message={LABELS.enterGstPercentage}>
        <Button type="submit" className="w-full sm:w-auto" disabled={!canCreate}>
          {LABELS.addTaxRule}
        </Button>
      </DisabledActionHint>
    </form>
  )
}
