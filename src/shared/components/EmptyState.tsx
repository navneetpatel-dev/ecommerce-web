'use client'

import { LucideIcon } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'

interface EmptyStateProps {
  message: string
  heading?: string
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
  heading,
  icon: Icon,
  iconClassName = 'h-12 w-12 text-ink-faint',
  actionLabel,
  actionTo,
  onAction,
  className = '',
  maxWidth = 'max-w-4xl'
}: EmptyStateProps) {
  return (
    <div className={`${maxWidth} mx-auto px-4 py-16 text-center ${className}`}>
      {Icon && <Icon className={`${iconClassName} mx-auto mb-4`} />}
      {heading && <h3 className="text-[1.125rem] font-semibold text-ink mb-2">{heading}</h3>}
      <p className="text-ink-muted text-[0.9375rem] max-w-xs mx-auto">{message}</p>
      {actionLabel && (actionTo || onAction) && (
        <Button variant="default" className="mt-6" asChild={!!actionTo} onClick={onAction}>
          {actionTo ? <Link href={actionTo}>{actionLabel}</Link> : actionLabel}
        </Button>
      )}
    </div>
  )
}
