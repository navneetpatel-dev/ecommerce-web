import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface FormActionsProps {
  children: ReactNode
  /** Optional status / helper text on the leading side. */
  leading?: ReactNode
  className?: string
}

/** Footer action row for forms and dialogs — stacks on mobile, row on `sm+`. */
export function FormActions({ children, leading, className }: FormActionsProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-t border-line/70 pt-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      {leading != null ? (
        <div className="min-h-[1.25rem] text-[0.8125rem] text-ink-muted" aria-live="polite">
          {leading}
        </div>
      ) : (
        <span className="hidden sm:block" />
      )}
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">
        {children}
      </div>
    </div>
  )
}
