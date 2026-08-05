import { Button } from '@/shared/components/ui/button'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'

interface PaymentStepProps {
  walletBalance: number | undefined
  walletShortfall?: number
  isPending: boolean
  walletDisabled: boolean
  selectedMethod?: string | null
  onSelect: (method: string) => void
  onBack: () => void
}

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
    <div className="space-y-4">
      <h2 className="text-[1.375rem] font-semibold text-ink">Payment method</h2>
      <p className="text-[0.9375rem] text-ink-muted">Choose how you want to pay, then review your order.</p>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => onSelect('razorpay')}
          disabled={isPending}
          className={`w-full text-left p-4 rounded-md border ${
            selectedMethod === 'razorpay' ? 'border-brand bg-brand-subtle' : 'border-line hover:border-brand'
          }`}
        >
          <p className="font-medium">Card / UPI / Netbanking</p>
          <p className="text-[0.9375rem] text-ink-muted">Pay securely via Razorpay</p>
        </button>
        {walletBalance !== undefined && (
          <DisabledActionHint disabled={walletDisabled} message={walletHint} className="w-full">
            <button
              type="button"
              onClick={() => onSelect('wallet')}
              disabled={walletDisabled}
              className={`w-full text-left p-4 rounded-md border disabled:opacity-50 ${
                selectedMethod === 'wallet' ? 'border-brand bg-brand-subtle' : 'border-line hover:border-brand'
              }`}
            >
              <p className="font-medium">Wallet Balance (₹{walletBalance.toLocaleString('en-IN')})</p>
              <p className="text-[0.9375rem] text-ink-muted">
                {walletDisabled && walletShortfall > 0
                  ? `Insufficient balance — need ₹${walletShortfall.toLocaleString('en-IN')} more`
                  : 'Pay using your wallet'}
              </p>
            </button>
          </DisabledActionHint>
        )}
        <button
          type="button"
          onClick={() => onSelect('cod')}
          disabled={isPending}
          className={`w-full text-left p-4 rounded-md border ${
            selectedMethod === 'cod' ? 'border-brand bg-brand-subtle' : 'border-line hover:border-brand'
          }`}
        >
          <p className="font-medium">Cash on Delivery</p>
          <p className="text-[0.9375rem] text-ink-muted">Pay when you receive</p>
        </button>
      </div>
      <Button variant="outline" onClick={onBack} className="mt-4">
        Back
      </Button>
    </div>
  )
}
