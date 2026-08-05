'use client'

import { useEffect, useRef, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
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
  const prevValue = useRef(value)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    if (value === prevValue.current) return
    setDirection(value > prevValue.current ? 1 : -1)
    prevValue.current = value
  }, [value])

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

      <span className="relative h-5 w-8 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.span
            key={value}
            custom={direction}
            initial={{ y: direction * 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: direction * -14, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
            className="absolute inset-0 flex items-center justify-center font-mono text-[0.875rem] font-semibold tabular-nums text-ink"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>

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
