'use client'

import { LucideIcon } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'

interface EmptyStateProps {
  message: string
  icon?: LucideIcon
  iconClassName?: string
  actionLabel?: string
  actionTo?: string
  onAction?: () => void
  className?: string
  maxWidth?: string
}

export function EmptyState({ 
  message, 
  icon: Icon, 
  iconClassName = 'h-12 w-12 text-ink/20',
  actionLabel,
  actionTo,
  onAction,
  className = '',
  maxWidth = 'max-w-4xl'
}: EmptyStateProps) {
  return (
    <div className={`${maxWidth} mx-auto px-4 py-16 text-center ${className}`}>
      {Icon && <Icon className={`${iconClassName} mx-auto mb-4`} />}
      <p className="text-ink/50 text-lg">{message}</p>
      {actionLabel && (actionTo || onAction) && (
        <Button variant="outline" className="mt-4" asChild={!!actionTo} onClick={onAction}>
          {actionTo ? <Link href={actionTo}>{actionLabel}</Link> : actionLabel}
        </Button>
      )}
    </div>
  )
}
