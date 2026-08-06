import type { FormEvent } from 'react'
import { Button } from '@/shared/components/ui/button'

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
  return (
    <form
      className="flex flex-wrap gap-2 border border-line p-4"
      onSubmit={onSubmit}
    >
      <input
        className="border border-line px-3 py-2"
        placeholder="GST %"
        type="number"
        min="0"
        value={gstPercentage}
        onChange={(e) => onGstChange(e.target.value)}
        required
      />
      <input
        className="border border-line px-3 py-2"
        placeholder="HSN (optional)"
        value={hsnCode}
        onChange={(e) => onHsnChange(e.target.value)}
      />
      <Button type="submit">Add tax rule</Button>
    </form>
  )
}
