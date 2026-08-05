'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  const [draft, setDraft] = useState<string | null>(null)
  const display = draft ?? String(value)

  const commit = (raw: string) => {
    setDraft(null)
    const parsed = parseInt(raw, 10)
    if (Number.isNaN(parsed)) {
      onChange(min)
      return
    }
    onChange(Math.min(max, Math.max(min, parsed)))
  }

  return (
    <div className="inline-flex items-center border border-line rounded-sm overflow-hidden">
      <DisabledActionHint
        disabled={value <= min}
        message={`Minimum quantity is ${min}.`}
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-11 w-11 rounded-none border-0"
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </Button>
      </DisabledActionHint>
      <input
        type="number"
        inputMode="numeric"
        value={display}
        onFocus={() => setDraft(String(value))}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => commit(draft ?? String(value))}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur()
          }
        }}
        className="h-11 w-11 border-x border-line bg-transparent text-center text-[0.9375rem] font-medium text-ink outline-none [appearance:textfield] focus-visible:shadow-[inset_0_0_0_1px_var(--brand)] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Quantity"
      />
      <DisabledActionHint
        disabled={value >= max}
        message={max <= 1 ? 'Only 1 available in stock.' : `Maximum quantity is ${max}.`}
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-11 w-11 rounded-none border-0"
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </Button>
      </DisabledActionHint>
    </div>
  )
}
