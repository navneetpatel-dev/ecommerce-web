import Link from 'next/link'
import { cn } from '@/shared/utils/cn'
import type { LucideIcon } from 'lucide-react'

export interface SidebarNavItem {
  href: string
  icon: LucideIcon
  label: string
}

export function SidebarNav({
  items,
  currentPath,
  header,
}: {
  items: SidebarNavItem[]
  currentPath: string
  header?: React.ReactNode
}) {
  return (
    <aside className="w-56 shrink-0 border-r border-line min-h-[calc(100vh-3.5rem)] bg-surface p-4 space-y-1">
      {header}
      {items.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            currentPath === href
              ? "bg-brand-light text-brand"
              : "text-ink/70 hover:bg-paper hover:text-ink"
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </aside>
  )
}
