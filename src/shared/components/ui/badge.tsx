import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2 py-1 text-[0.8125rem] font-medium transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  {
    variants: {
      variant: {
        default: "bg-ink text-paper",
        secondary: "bg-paper text-ink",
        destructive: "bg-danger text-paper",
        success: "bg-success-subtle text-success",
        outline: "border border-line text-ink",
        brand: "bg-brand-subtle text-brand",
        warning: "bg-warning-subtle text-warning font-semibold",
        filter: "rounded-full bg-brand-subtle text-brand gap-1 cursor-default",
        tag: "bg-line text-ink-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  removable?: boolean
  onRemove?: () => void
}

function Badge({ className, variant, removable, onRemove, children, ...props }: BadgeProps) {
  if (variant === 'filter' && removable && onRemove) {
    return (
      <span className={cn(badgeVariants({ variant }), className)} {...props}>
        {children}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="ml-0.5 rounded-full hover:bg-brand/20 p-0.5"
        >
          <X size={12} />
          <span className="sr-only">Remove</span>
        </button>
      </span>
    )
  }

  return <span className={cn(badgeVariants({ variant }), className)} {...props}>{children}</span>
}

export { Badge, badgeVariants }
