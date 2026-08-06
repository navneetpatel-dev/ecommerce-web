'use client'

import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { cn } from '@/shared/utils/cn'

export type StatusDialogVariant = 'info' | 'success' | 'warning' | 'danger'

interface StatusDialogAction {
  label: string
  onClick: () => void
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive'
  loading?: boolean
  disabled?: boolean
}

interface StatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: ReactNode
  variant?: StatusDialogVariant
  icon?: LucideIcon
  primaryAction?: StatusDialogAction
  secondaryAction?: StatusDialogAction
  children?: ReactNode
}

const VARIANT_STYLES: Record<
  StatusDialogVariant,
  { iconWrap: string; icon: string; Icon: LucideIcon }
> = {
  info: {
    iconWrap: 'border-line bg-paper text-ink-muted',
    icon: 'text-ink-muted',
    Icon: Info,
  },
  success: {
    iconWrap: 'border-success/25 bg-success-subtle text-success',
    icon: 'text-success',
    Icon: CheckCircle2,
  },
  warning: {
    iconWrap: 'border-warning/25 bg-warning-subtle text-warning',
    icon: 'text-warning',
    Icon: AlertCircle,
  },
  danger: {
    iconWrap: 'border-danger/25 bg-danger-subtle text-danger',
    icon: 'text-danger',
    Icon: XCircle,
  },
}

export function StatusDialog({
  open,
  onOpenChange,
  title,
  description,
  variant = 'info',
  icon,
  primaryAction,
  secondaryAction,
  children,
}: StatusDialogProps) {
  const styles = VARIANT_STYLES[variant]
  const Icon = icon ?? styles.Icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] gap-5 sm:text-left">
        <DialogHeader className="space-y-4 sm:text-left">
          <div
            className={cn(
              'mx-auto flex h-12 w-12 items-center justify-center rounded-full border sm:mx-0',
              styles.iconWrap
            )}
          >
            <Icon size={22} strokeWidth={1.5} className={styles.icon} aria-hidden />
          </div>
          <div className="space-y-1.5">
            <DialogTitle className="font-display text-[1.25rem] tracking-tight text-ink">
              {title}
            </DialogTitle>
            <DialogDescription className="text-[0.9375rem] leading-relaxed text-ink-muted">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        {children ? <div className="space-y-3">{children}</div> : null}

        {(primaryAction || secondaryAction) && (
          <DialogFooter className="dialog-footer-start">
            {secondaryAction ? (
              <Button
                type="button"
                variant={secondaryAction.variant ?? 'outline'}
                loading={secondaryAction.loading}
                disabled={secondaryAction.disabled}
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            ) : null}
            {primaryAction ? (
              <Button
                type="button"
                variant={primaryAction.variant ?? 'default'}
                loading={primaryAction.loading}
                disabled={primaryAction.disabled}
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Button>
            ) : null}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
