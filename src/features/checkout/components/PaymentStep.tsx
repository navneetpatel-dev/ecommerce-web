import { CreditCard, Banknote, Wallet } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { cn } from '@/shared/utils/cn'

interface PaymentStepProps {
  walletBalance: number | undefined
  walletShortfall?: number
  isPending: boolean
  walletDisabled: boolean
  selectedMethod?: string | null
  onSelect: (method: string) => void
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
  walletBalance,
  walletShortfall = 0,
  isPending,
  walletDisabled,
  selectedMethod,
  onSelect,
  onBack,
}: PaymentStepProps) {
  const walletHint =
    walletDisabled && walletShortfall > 0
      ? `Insufficient wallet balance — you need ₹${walletShortfall.toLocaleString('en-IN')} more.`
      : walletDisabled
        ? 'Wallet payment is unavailable right now.'
        : ''

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

        {walletBalance !== undefined && (
          <DisabledActionHint disabled={walletDisabled} message={walletHint} className="w-full">
            <button
              type="button"
              onClick={() => onSelect('wallet')}
              disabled={walletDisabled}
              className={cn(
                'flex w-full items-start gap-4 border px-4 py-4 text-left transition-colors disabled:opacity-50',
                selectedMethod === 'wallet'
                  ? 'border-brand bg-brand-subtle shadow-[inset_3px_0_0_0_var(--brand)]'
                  : 'border-line bg-surface hover:border-ink/25'
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border',
                  selectedMethod === 'wallet'
                    ? 'border-brand/40 bg-surface text-brand'
                    : 'border-line bg-paper text-ink-muted'
                )}
              >
                <Wallet size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-ink">
                  Wallet · ₹{walletBalance.toLocaleString('en-IN')}
                </span>
                <span className="mt-0.5 block text-[0.875rem] text-ink-muted">
                  {walletDisabled && walletShortfall > 0
                    ? `Need ₹${walletShortfall.toLocaleString('en-IN')} more to use wallet`
                    : 'Pay using your store credit'}
                </span>
              </span>
              <span
                className={cn(
                  'mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                  selectedMethod === 'wallet' ? 'border-brand bg-brand' : 'border-line bg-surface'
                )}
                aria-hidden
              >
                {selectedMethod === 'wallet' && <span className="h-1.5 w-1.5 rounded-full bg-paper" />}
              </span>
            </button>
          </DisabledActionHint>
        )}
      </div>

      <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
        Back to shipping
      </Button>
    </div>
  )
}
