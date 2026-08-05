import * as React from 'react'
import { cn } from '@/shared/utils/cn'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[132px] w-full rounded-sm border border-line bg-surface px-4 py-3 text-[0.9375rem] placeholder:text-ink-faint outline-none focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
