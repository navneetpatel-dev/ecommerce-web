'use client'

import { Minus, Plus } from 'lucide-react'
import { AnimatedQuantityValue } from '@/shared/components/AnimatedQuantityValue'
import { cn } from '@/shared/utils/cn'

interface CardQuantityControlProps {
  value: number
  max?: number
  disabled?: boolean
  onChange: (value: number) => void
  className?: string
}

export function CardQuantityControl({
  value,
  max = 99,
  disabled = false,
  onChange,
  className,
}: CardQuantityControlProps) {
  const atMax = value >= max

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between rounded-full border border-line bg-surface/95 backdrop-blur-xs shadow-elevation-1',
        className
      )}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <button
        type="button"
        disabled={disabled || value <= 0}
        aria-label="Decrease quantity"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper disabled:opacity-40"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onChange(value - 1)
        }}
      >
        <Minus size={16} strokeWidth={2.25} />
      </button>

      <AnimatedQuantityValue
        value={value}
        className="h-5 w-8"
        digitClassName="font-mono text-[0.875rem] font-semibold text-ink"
      />

      <button
        type="button"
        disabled={disabled || atMax}
        aria-label="Increase quantity"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper disabled:opacity-40"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onChange(value + 1)
        }}
      >
        <Plus size={16} strokeWidth={2.25} />
      </button>
    </div>
  )
}
