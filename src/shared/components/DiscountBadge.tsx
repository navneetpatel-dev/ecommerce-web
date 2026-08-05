import { cn } from '@/shared/utils/cn'

interface DiscountBadgeProps {
  children: React.ReactNode
  className?: string
}

export function DiscountBadge({ children, className }: DiscountBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-sm bg-accent text-white px-2 py-1 text-[0.8125rem] font-semibold",
      className
    )}>
      {children}
    </span>
  )
}
