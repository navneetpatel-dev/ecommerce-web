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
}

export function SidebarNav({
  items,
  currentPath,
  header,
  variant = 'dashboard',
}: SidebarNavProps) {
  return (
    <aside
      className={cn(
        'w-60 shrink-0 border-r border-line min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-72px)] p-4 space-y-1',
        variant === 'dashboard' ? 'bg-paper' : 'bg-surface'
      )}
    >
      {header}
      {items.map(({ href, icon: Icon, label }) => {
        const isActive = currentPath === href || currentPath.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 h-11 rounded-md text-[0.8125rem] font-medium transition-colors border-l-[3px]",
              isActive
                ? "bg-brand-subtle text-brand border-l-brand"
                : "text-ink-muted border-l-transparent hover:bg-paper hover:text-ink"
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
