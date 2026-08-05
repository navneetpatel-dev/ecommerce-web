import { cn } from '@/shared/utils/cn'

interface TextEyebrowProps {
  children: React.ReactNode
  className?: string
  /** Brand (brass) color — for interactive / brand-relevant eyebrows only */
  brand?: boolean
  as?: 'p' | 'span' | 'div'
}

/** Boutique section micro-label — use sparingly above genuine section breaks. */
export function TextEyebrow({
  children,
  className,
  brand = false,
  as: Tag = 'p',
}: TextEyebrowProps) {
  return (
    <Tag className={cn('text-eyebrow', brand && 'text-eyebrow-brand', className)}>
      {children}
    </Tag>
  )
}
