import { Check, Circle } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface TimelineStep {
  label: string
  timestamp?: string
  status: 'completed' | 'current' | 'upcoming'
}

interface TimelineProps {
  steps: TimelineStep[]
  className?: string
}

export function Timeline({ steps, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4 pb-4 relative">
          {i < steps.length - 1 && (
            <div className="absolute left-[5px] top-3 w-[2px] h-[calc(100%+12px)] bg-line" />
          )}
          <div className="relative z-10 mt-0.5">
            {step.status === 'completed' ? (
              <span className="flex h-3 w-3 items-center justify-center rounded-full bg-brand">
                <Check size={8} className="text-white" strokeWidth={3} />
              </span>
            ) : step.status === 'current' ? (
              <span className="flex h-3 w-3 items-center justify-center rounded-full bg-brand animate-pulse-ring" />
            ) : (
              <span className="flex h-3 w-3 items-center justify-center rounded-full bg-line" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn(
              'text-[0.9375rem]',
              step.status === 'upcoming' ? 'text-ink-muted' : 'text-ink'
            )}>
              {step.label}
            </p>
            {step.timestamp && (
              <p className="text-[0.8125rem] text-ink-muted mt-0.5">{step.timestamp}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
