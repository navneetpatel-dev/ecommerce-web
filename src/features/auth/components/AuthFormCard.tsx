import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface AuthFormCardProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

/** Shared surface for login / register / password / OTP forms. */
export function AuthFormCard({ title, description, children, footer, className }: AuthFormCardProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-line bg-surface shadow-elevation-2',
        className,
      )}
    >
      <header className="space-y-2 border-b border-line/80 bg-paper/45 px-6 py-6 sm:px-8 sm:py-8">
        <h1 className="font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2rem]">
          {title}
        </h1>
        <p className="max-w-prose text-[0.9375rem] leading-relaxed text-ink-muted sm:text-[1rem]">
          {description}
        </p>
      </header>
      <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">{children}</div>
      {footer ? (
        <footer className="border-t border-line/80 bg-paper/30 px-6 py-5 sm:px-8">{footer}</footer>
      ) : null}
    </div>
  )
}
