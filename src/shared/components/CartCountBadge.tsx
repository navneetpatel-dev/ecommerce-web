'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/shared/utils/cn'

interface CartCountBadgeProps {
  count: number
  className?: string
  /** Slightly smaller type for the mobile tab bar. */
  size?: 'default' | 'sm'
}

export function CartCountBadge({ count, className, size = 'default' }: CartCountBadgeProps) {
  const prevCount = useRef(count)
  const [pulseKey, setPulseKey] = useState(0)

  useEffect(() => {
    if (count === prevCount.current) return
    prevCount.current = count
    if (count > 0) setPulseKey((k) => k + 1)
  }, [count])

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key="cart-badge"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 520, damping: 22 }}
          className={cn(
            'absolute',
            size === 'sm' ? 'right-1 top-0' : 'right-0.5 top-0.5',
            className
          )}
        >
          <motion.span
            key={pulseKey}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.28, 1] }}
            transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
            className={cn(
              'flex items-center justify-center rounded-full bg-brand px-1 font-mono font-medium leading-none text-paper tabular-nums',
              size === 'sm' ? 'h-4 min-w-4 text-[0.5625rem]' : 'h-4 min-w-4 text-[0.625rem]'
            )}
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        </motion.span>
      )}
    </AnimatePresence>
  )
}
