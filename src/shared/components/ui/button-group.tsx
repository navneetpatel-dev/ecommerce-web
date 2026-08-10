import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface ButtonGroupProps {
  children: ReactNode
  className?: string
  /** Horizontal alignment from `sm` up. Defaults to `end`. */
  align?: 'start' | 'end' | 'center' | 'stretch'
}

/**
 * Responsive action cluster: stacked full-width buttons on mobile,
 * horizontal intrinsic-width row from `sm` up.
 * Targets nested `<button>` / `[data-size]` so DialogTrigger wrappers still stretch.
 */
export function ButtonGroup({ children, className, align = 'end' }: ButtonGroupProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-2',
        'sm:w-auto sm:flex-row sm:flex-wrap sm:items-center',
        align === 'start' && 'sm:justify-start',
        align === 'end' && 'sm:justify-end',
        align === 'center' && 'sm:justify-center',
        align === 'stretch' && 'sm:w-full sm:justify-stretch',
        /* Stretch labeled controls; leave square icon buttons alone */
        '[&_button:not([data-size=icon]):not([data-size=icon-sm])]:w-full',
        'sm:[&_button:not([data-size=icon]):not([data-size=icon-sm])]:w-auto',
        '[&_a:not([data-size=icon]):not([data-size=icon-sm])]:w-full',
        'sm:[&_a:not([data-size=icon]):not([data-size=icon-sm])]:w-auto',
        className,
      )}
    >
      {children}
    </div>
  )
}
