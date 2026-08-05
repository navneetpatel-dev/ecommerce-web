'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { AnimatedQuantityValue } from '@/shared/components/AnimatedQuantityValue'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  const [draft, setDraft] = useState<string | null>(null)
  const editing = draft !== null

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
    <div className="inline-flex items-center overflow-hidden rounded-sm border border-line">
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

      {editing ? (
        <input
          type="number"
          inputMode="numeric"
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => commit(draft ?? String(value))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur()
            if (e.key === 'Escape') setDraft(null)
          }}
          className="h-11 w-11 border-x border-line bg-transparent text-center font-mono text-[0.9375rem] font-medium tabular-nums text-ink outline-none [appearance:textfield] focus-visible:shadow-[inset_0_0_0_1px_var(--brand)] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          aria-label="Quantity"
        />
      ) : (
        <button
          type="button"
          onClick={() => setDraft(String(value))}
          className="flex h-11 w-11 items-center justify-center border-x border-line bg-transparent"
          aria-label={`Quantity ${value}. Click to edit.`}
        >
          <AnimatedQuantityValue
            value={value}
            className="h-5 w-8"
            digitClassName="font-mono text-[0.9375rem] font-medium text-ink"
          />
        </button>
      )}

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
