'use client'

import { Check } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useMediaQuery } from '@/shared/hooks/use-media-query'

interface StepIndicatorProps {
  currentStep: number
  onStepClick: (step: number) => void
}

const STEPS = ['Address', 'Shipping', 'Payment', 'Review']

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  const isMobile = useMediaQuery('(max-width: 767px)')

  if (isMobile) {
    return (
      <div className="mb-8 text-center">
        <span className="text-[0.8125rem] font-medium text-ink-muted">
          Step {currentStep} of {STEPS.length}
        </span>
        <p className="text-[1.125rem] font-semibold text-ink mt-1">{STEPS[currentStep - 1]}</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((label, i) => {
        const stepNum = i + 1
        const isCompleted = stepNum < currentStep
        const isCurrent = stepNum === currentStep
        const isUpcoming = stepNum > currentStep

        return (
          <div key={i} className="flex items-center">
            <button
              onClick={() => onStepClick(stepNum)}
              className="flex flex-col items-center gap-1 group"
              disabled={isUpcoming}
            >
              <span
                className={cn(
                  'flex items-center justify-center w-11 h-11 rounded-full text-[0.8125rem] font-semibold transition-all',
                  isCompleted && 'bg-brand text-white',
                  isCurrent && 'bg-brand text-white',
                  isUpcoming && 'border-2 border-line text-ink-muted bg-surface'
                )}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : stepNum}
              </span>
              <span
                className={cn(
                  'text-[0.8125rem] font-medium transition-colors',
                  isCompleted && 'text-brand',
                  isCurrent && 'text-ink',
                  isUpcoming && 'text-ink-muted'
                )}
              >
                {label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'w-12 md:w-16 h-0.5 mx-2 transition-colors',
                  isCompleted ? 'bg-brand' : 'bg-line'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
