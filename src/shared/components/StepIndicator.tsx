import { Check } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface StepIndicatorProps {
  currentStep: number
  steps: readonly string[]
  isMobile: boolean
  onStepClick: (step: number) => void
}

export function StepIndicator({
  currentStep,
  steps,
  isMobile,
  onStepClick,
}: StepIndicatorProps) {
  if (isMobile) {
    return (
      <div className="mb-8 text-center">
        <span className="text-[0.8125rem] font-medium text-ink-muted">
          Step {currentStep} of {steps.length}
        </span>
        <p className="text-[1.125rem] font-semibold text-ink mt-1">{steps[currentStep - 1]}</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((label, i) => {
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
                  isCompleted && 'bg-ink text-paper',
                  isCurrent && 'bg-ink text-paper',
                  isUpcoming && 'border-2 border-line text-ink-muted bg-surface'
                )}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : stepNum}
              </span>
              <span
                className={cn(
                  'text-[0.8125rem] font-medium transition-colors',
                  isCompleted && 'text-ink',
                  isCurrent && 'text-ink',
                  isUpcoming && 'text-ink-muted'
                )}
              >
                {label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  'w-12 md:w-16 h-0.5 mx-2 transition-colors',
                  isCompleted ? 'bg-ink' : 'bg-line'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
