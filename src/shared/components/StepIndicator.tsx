'use client'

import { Check, MapPin, Truck, CreditCard, ClipboardCheck } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface StepIndicatorProps {
  currentStep: number
  steps: readonly string[]
  isMobile: boolean
  onStepClick: (step: number) => void
}

const STEP_META: Record<string, { description: string; icon: typeof MapPin }> = {
  Address: { description: 'Delivery details', icon: MapPin },
  Shipping: { description: 'Arrival speed', icon: Truck },
  Payment: { description: 'How you pay', icon: CreditCard },
  Review: { description: 'Confirm & place', icon: ClipboardCheck },
}

export function StepIndicator({
  currentStep,
  steps,
  isMobile,
  onStepClick,
}: StepIndicatorProps) {
  const progress = ((currentStep - 1) / Math.max(steps.length - 1, 1)) * 100

  if (isMobile) {
    return (
      <div className="overflow-hidden border border-line bg-surface-raised shadow-elevation-1">
        <div aria-hidden className="h-1 bg-line">
          <div
            className="h-full bg-brand transition-[width] duration-300 ease-[cubic-bezier(0.2,0,0,1)]"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between gap-4 px-5 py-5">
          <div className="min-w-0">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-brand">
              Step {currentStep} of {steps.length}
            </p>
            <p className="mt-1 font-display text-[1.25rem] leading-tight text-ink">
              {steps[currentStep - 1]}
            </p>
            <p className="mt-1 text-[0.8125rem] text-ink-muted">
              {STEP_META[steps[currentStep - 1]]?.description}
            </p>
          </div>
          <div className="flex shrink-0 gap-2" aria-hidden>
            {steps.map((label, i) => {
              const stepNum = i + 1
              const done = stepNum < currentStep
              const active = stepNum === currentStep
              return (
                <span
                  key={label}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-[0.75rem] font-semibold',
                    (done || active) && 'bg-ink text-paper',
                    !done && !active && 'border border-line text-ink-muted'
                  )}
                >
                  {done ? <Check size={13} strokeWidth={2.5} /> : stepNum}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <nav
      aria-label="Checkout progress"
      className="relative overflow-hidden border border-line bg-surface-raised shadow-elevation-1"
    >
      <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-line">
        <div
          className="h-full bg-brand transition-[width] duration-300 ease-[cubic-bezier(0.2,0,0,1)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="grid grid-cols-4 divide-x divide-line">
        {steps.map((label, i) => {
          const stepNum = i + 1
          const isCompleted = stepNum < currentStep
          const isCurrent = stepNum === currentStep
          const isUpcoming = stepNum > currentStep
          const meta = STEP_META[label]
          const Icon = meta?.icon ?? MapPin

          return (
            <li key={label} className="min-w-0">
              <button
                type="button"
                onClick={() => onStepClick(stepNum)}
                disabled={isUpcoming}
                aria-current={isCurrent ? 'step' : undefined}
                className={cn(
                  'group relative flex h-full w-full flex-col items-start gap-4 px-5 py-6 text-left transition-colors md:px-6 md:py-7 lg:px-8 lg:py-8',
                  isCurrent && 'bg-[color-mix(in_srgb,var(--brand)_8%,transparent)]',
                  isCompleted && 'hover:bg-paper/70',
                  isUpcoming && 'cursor-not-allowed'
                )}
              >
                {isCurrent && (
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-brand" />
                )}

                <span className="flex w-full items-center justify-between gap-3">
                  <span
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full text-[0.9375rem] font-semibold transition-colors',
                      (isCompleted || isCurrent) && 'bg-ink text-paper',
                      isUpcoming && 'border border-line bg-surface text-ink-muted'
                    )}
                  >
                    {isCompleted ? <Check size={18} strokeWidth={2.5} /> : stepNum}
                  </span>
                  <Icon
                    size={18}
                    className={cn(
                      'shrink-0',
                      isCurrent ? 'text-brand' : 'text-ink-faint'
                    )}
                    aria-hidden
                  />
                </span>

                <span className="min-w-0">
                  <span
                    className={cn(
                      'block text-[0.6875rem] font-semibold uppercase tracking-[0.08em]',
                      isCurrent ? 'text-brand' : 'text-ink-muted'
                    )}
                  >
                    Step {stepNum}
                  </span>
                  <span
                    className={cn(
                      'mt-1 block font-display text-[1.25rem] leading-tight lg:text-[1.375rem]',
                      isUpcoming ? 'text-ink-muted' : 'text-ink'
                    )}
                  >
                    {label}
                  </span>
                  <span className="mt-1.5 block text-[0.8125rem] leading-snug text-ink-muted">
                    {meta?.description}
                  </span>
                  {isCurrent && (
                    <span className="mt-3 inline-block text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-brand">
                      Current
                    </span>
                  )}
                  {isCompleted && (
                    <span className="mt-3 inline-block text-[0.75rem] font-medium text-ink-muted">
                      Done — tap to edit
                    </span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
