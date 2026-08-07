import { ArrowRight, CreditCard, Banknote } from 'lucide-react'
import type { CheckoutQuote } from '@/shared/api/types'
import { Button } from '@/shared/components/ui/button'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { LABELS } from '@/shared/constants/labels'
import { cn } from '@/shared/utils/cn'
import { WalletApplySection } from './WalletApplySection'

interface PaymentStepProps {
  isPending: boolean
  selectedMethod?: string | null
  quote?: CheckoutQuote | null
  walletAmountToUse: number
  onSelect: (method: string) => void
  onWalletAmountChange: (amount: number) => void
  onContinue: () => void
  onBack: () => void
}

const METHODS = [
  {
    id: 'razorpay',
    title: LABELS.paymentMethodRazorpay,
    description: LABELS.paymentMethodRazorpayDesc,
    icon: CreditCard,
  },
  {
    id: 'cod',
    title: LABELS.paymentMethodCod,
    description: LABELS.paymentMethodCodDesc,
    icon: Banknote,
  },
] as const

export function PaymentStep({
  isPending,
  selectedMethod,
  quote,
  walletAmountToUse,
  onSelect,
  onWalletAmountChange,
  onContinue,
  onBack,
}: PaymentStepProps) {
  const canContinue = Boolean(selectedMethod)
  const walletBalance = quote?.walletBalance ?? 0
  const grandTotal = quote?.grandTotal ?? 0
  const maxApplicable = Math.min(walletBalance, grandTotal)
  const amountDue = quote?.amountDue ?? Math.max(0, grandTotal - walletAmountToUse)
  const codSelected = selectedMethod === 'cod'

  return (
    <div className="space-y-5">
      <WalletApplySection
        walletBalance={walletBalance}
        maxApplicable={maxApplicable}
        walletAmountToUse={codSelected ? 0 : walletAmountToUse}
        amountDue={codSelected ? grandTotal : amountDue}
        disabled={isPending || !quote}
        codSelected={codSelected}
        onAmountChange={onWalletAmountChange}
      />

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
                  : 'border-line bg-surface hover:border-ink/25',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border',
                  selected ? 'border-brand/40 bg-surface text-brand' : 'border-line bg-paper text-ink-muted',
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
                  selected ? 'border-brand bg-brand' : 'border-line bg-surface',
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
          {LABELS.backToShipping}
        </Button>
        <DisabledActionHint
          disabled={!canContinue}
          message={LABELS.selectPaymentMethodToContinue}
          className="w-full sm:w-auto"
        >
          <Button
            size="lg"
            onClick={onContinue}
            disabled={!canContinue || isPending}
            className="w-full gap-2 sm:w-auto"
          >
            {LABELS.continueToReview}
            <ArrowRight size={16} />
          </Button>
        </DisabledActionHint>
      </div>
    </div>
  )
}
