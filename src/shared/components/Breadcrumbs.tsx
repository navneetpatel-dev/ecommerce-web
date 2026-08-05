import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-[0.8125rem] text-ink-muted', className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-ink-faint">/</span>}
            {isLast || !item.href ? (
              <span className={isLast ? 'text-ink' : ''}>{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-ink transition-colors">
                {item.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
