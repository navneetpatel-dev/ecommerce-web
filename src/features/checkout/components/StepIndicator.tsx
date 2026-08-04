interface StepIndicatorProps {
  currentStep: number
  onStepClick: (step: number) => void
}

const STEPS = ['Address', 'Shipping', 'Payment', 'Review']

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex gap-2 mb-8">
      {STEPS.map((label, i) => (
        <button
          key={i}
          onClick={() => onStepClick(i + 1)}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
            currentStep === i + 1 ? 'border-brand text-brand' : 'border-line text-ink/40'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
