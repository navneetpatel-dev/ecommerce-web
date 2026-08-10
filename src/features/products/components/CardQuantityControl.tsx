'use client'

import { Minus, Plus } from 'lucide-react'
import { AnimatedQuantityValue } from '@/shared/components/AnimatedQuantityValue'
import { Button } from '@/shared/components/ui/button'
import { MAX_CART_LINE_QUANTITY } from '@/shared/constants/cart'
import { LABELS } from '@/shared/constants/labels'
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
  max = MAX_CART_LINE_QUANTITY,
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
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={disabled || value <= 0}
        aria-label={LABELS.decreaseQuantity}
        className="h-9 w-9 min-h-9 max-h-9 shrink-0 rounded-full hover:bg-paper"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onChange(value - 1)
        }}
      >
        <Minus size={16} strokeWidth={2.25} />
      </Button>

      <AnimatedQuantityValue
        value={value}
        className="h-5 w-8"
        digitClassName="font-mono text-[0.875rem] font-semibold text-ink"
      />

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={disabled || atMax}
        aria-label={LABELS.increaseQuantity}
        className="h-9 w-9 min-h-9 max-h-9 shrink-0 rounded-full hover:bg-paper"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onChange(value + 1)
        }}
      >
        <Plus size={16} strokeWidth={2.25} />
      </Button>
    </div>
  )
}
