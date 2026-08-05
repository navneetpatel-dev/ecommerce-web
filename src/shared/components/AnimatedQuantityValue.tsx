'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/shared/utils/cn'

interface AnimatedQuantityValueProps {
  value: number
  className?: string
  /** Classes for the animated digit itself. */
  digitClassName?: string
}

export function AnimatedQuantityValue({
  value,
  className,
  digitClassName,
}: AnimatedQuantityValueProps) {
  const prevValue = useRef(value)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    if (value === prevValue.current) return
    setDirection(value > prevValue.current ? 1 : -1)
    prevValue.current = value
  }, [value])

  return (
    <span className={cn('relative inline-flex overflow-hidden', className)}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.span
          key={value}
          custom={direction}
          initial={{ y: direction * 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: direction * -14, opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
          className={cn(
            'absolute inset-0 flex items-center justify-center tabular-nums',
            digitClassName
          )}
        >
          {value}
        </motion.span>
      </AnimatePresence>
      {/* Reserve layout size so +/- never shift */}
      <span className={cn('invisible tabular-nums', digitClassName)} aria-hidden>
        {value}
      </span>
    </span>
  )
}
