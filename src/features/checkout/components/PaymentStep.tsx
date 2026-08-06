import { ArrowRight, CreditCard, Banknote } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { cn } from '@/shared/utils/cn'

interface PaymentStepProps {
  isPending: boolean
  selectedMethod?: string | null
  onSelect: (method: string) => void
  onContinue: () => void
  onBack: () => void
}

const METHODS = [
  {
    id: 'razorpay',
    title: 'Card / UPI / Netbanking',
    description: 'Pay securely via Razorpay',
    icon: CreditCard,
  },
  {
    id: 'cod',
    title: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: Banknote,
  },
] as const

export function PaymentStep({
  isPending,
  selectedMethod,
  onSelect,
  onContinue,
  onBack,
}: PaymentStepProps) {
  const canContinue = Boolean(selectedMethod)

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {METHODS.map((method) => {
          const Icon = method.icon
          const selected = selectedMethod === method.id
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelect(method.id)}
              disabled={isPending}
              className={cn(
                'flex w-full items-start gap-4 border px-4 py-4 text-left transition-colors',
                selected
                  ? 'border-brand bg-brand-subtle shadow-[inset_3px_0_0_0_var(--brand)]'
                  : 'border-line bg-surface hover:border-ink/25'
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border',
                  selected ? 'border-brand/40 bg-surface text-brand' : 'border-line bg-paper text-ink-muted'
                )}
              >
                <Icon size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-ink">{method.title}</span>
                <span className="mt-0.5 block text-[0.875rem] text-ink-muted">{method.description}</span>
              </span>
              <span
                className={cn(
                  'mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                  selected ? 'border-brand bg-brand' : 'border-line bg-surface'
                )}
                aria-hidden
              >
                {selected && <span className="h-1.5 w-1.5 rounded-full bg-paper" />}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
          Back to shipping
        </Button>
        <DisabledActionHint
          disabled={!canContinue}
          message="Select a payment method to continue."
          className="w-full sm:w-auto"
        >
          <Button
            size="lg"
            onClick={onContinue}
            disabled={!canContinue || isPending}
            className="w-full gap-2 sm:w-auto"
          >
            Continue to review
            <ArrowRight size={16} />
          </Button>
        </DisabledActionHint>
      </div>
    </div>
  )
}
