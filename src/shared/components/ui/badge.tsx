import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import { Button } from '@/shared/components/ui/button'
import { LABELS } from '@/shared/constants/labels'

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
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="ml-0.5 h-auto min-h-0 max-h-none w-auto rounded-full p-0.5 hover:bg-brand/20"
          aria-label={LABELS.remove}
        >
          <X size={12} />
        </Button>
      </span>
    )
  }

  return <span className={cn(badgeVariants({ variant }), className)} {...props}>{children}</span>
}

export { Badge, badgeVariants }
