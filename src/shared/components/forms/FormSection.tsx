import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface FormSectionProps {
  title: string
  hint?: string
  children: ReactNode
  /** Grid columns from `sm` breakpoint. Defaults to 2. Pass 1 for stacked fields. */
  columns?: 1 | 2
  className?: string
  contentClassName?: string
}

/**
 * Bordered settings-style section with optional hint and responsive field grid.
 */
export function FormSection({
  title,
  hint,
  children,
  columns = 2,
  className,
  contentClassName,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-md border border-line bg-surface shadow-[0_1px_0_rgba(15,23,42,0.03)]',
        className,
      )}
    >
      <header className="border-b border-line/80 bg-paper/50 px-4 py-4 sm:px-5">
        <h3 className="text-[0.9375rem] font-semibold tracking-tight text-ink">{title}</h3>
        {hint ? <p className="mt-1 text-[0.8125rem] text-ink-muted">{hint}</p> : null}
      </header>
      <div
        className={cn(
          'grid gap-5 p-4 sm:gap-x-6 sm:gap-y-5 sm:p-5',
          columns === 2 ? 'sm:grid-cols-2' : 'grid-cols-1',
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  )
}
