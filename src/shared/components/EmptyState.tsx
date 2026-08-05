'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/shared/utils/cn'

interface EmptyStateProps {
  message: string
  heading?: string
  eyebrow?: string
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
  eyebrow,
  icon: Icon,
  iconClassName,
  actionLabel,
  actionTo,
  onAction,
  className,
  maxWidth = 'max-w-md',
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'mx-auto flex flex-col items-center px-4 py-20 text-center md:py-24',
        maxWidth,
        className
      )}
    >
      {Icon ? (
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface shadow-elevation-1">
          <Icon
            className={cn('h-5 w-5 text-ink-muted', iconClassName)}
            strokeWidth={1.25}
            aria-hidden
          />
        </div>
      ) : null}

      {eyebrow ? (
        <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-muted">
          {eyebrow}
        </p>
      ) : null}

      {heading ? (
        <h3 className="text-[1.25rem] font-semibold tracking-tight text-ink md:text-[1.375rem]">
          {heading}
        </h3>
      ) : null}

      <p
        className={cn(
          'max-w-[32ch] text-[0.9375rem] leading-relaxed text-ink-muted',
          heading ? 'mt-2' : undefined
        )}
      >
        {message}
      </p>

      {actionLabel && (actionTo || onAction) ? (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="secondary"
            className="min-w-[9.5rem]"
            asChild={Boolean(actionTo)}
            onClick={onAction}
          >
            {actionTo ? <Link href={actionTo}>{actionLabel}</Link> : actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
