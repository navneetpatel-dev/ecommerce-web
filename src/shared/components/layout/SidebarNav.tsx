import Link from 'next/link'
import { cn } from '@/shared/utils/cn'
import type { LucideIcon } from 'lucide-react'

export interface SidebarNavItem {
  href: string
  icon: LucideIcon
  label: string
}

interface SidebarNavProps {
  items: SidebarNavItem[]
  currentPath: string
  header?: React.ReactNode
  variant?: 'dashboard' | 'account'
  className?: string
}

export function SidebarNav({
  items,
  currentPath,
  header,
  variant = 'dashboard',
  className,
}: SidebarNavProps) {
  return (
    <aside
      className={cn(
        'hidden w-60 shrink-0 overflow-y-auto border-r border-line p-4 space-y-1 lg:block',
        'min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-72px)]',
        variant === 'dashboard' ? 'bg-paper' : 'bg-surface',
        className,
      )}
    >
      {header}
      {items.map(({ href, icon: Icon, label }) => {
        const isActive = currentPath === href || currentPath.startsWith(`${href}/`)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex h-11 items-center gap-3 rounded-md border-l-[3px] px-3 text-[0.8125rem] font-medium transition-colors',
              isActive
                ? 'border-l-brand bg-brand-subtle text-brand'
                : 'border-l-transparent text-ink-muted hover:bg-paper hover:text-ink',
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        )
      })}
    </aside>
  )
}
