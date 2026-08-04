import { cn } from '@/shared/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  "inline-flex items-center rounded-md border border-line px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-brand",
  {
    variants: {
      variant: {
        default: "border-transparent bg-ink text-white",
        secondary: "border-transparent bg-paper text-ink",
        destructive: "border-transparent bg-danger text-white",
        success: "border-transparent bg-success text-white",
        outline: "text-ink",
        brand: "border-transparent bg-brand-light text-brand",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
