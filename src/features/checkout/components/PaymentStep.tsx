import { Button } from '@/shared/components/ui/button'

interface PaymentStepProps {
  walletBalance: number | undefined
  grandTotal: number | undefined
  isPending: boolean
  onPay: (method: string) => void
  onBack: () => void
}

export function PaymentStep({ walletBalance, grandTotal, isPending, onPay, onBack }: PaymentStepProps) {
  const walletDisabled = isPending || (walletBalance ?? 0) < (grandTotal ?? 0)

  return (
    <div className="space-y-4">
      <h2 className="font-display text-[1.375rem] font-semibold text-ink">Payment method</h2>
      <div className="space-y-3">
        <button onClick={() => onPay('razorpay')} disabled={isPending} className="w-full text-left p-4 rounded-md border border-brand bg-brand-subtle">
          <p className="font-medium">Card / UPI / Netbanking</p>
          <p className="text-[0.9375rem] text-ink-muted">Pay securely via Razorpay</p>
        </button>
        {walletBalance !== undefined && (
          <button onClick={() => onPay('wallet')} disabled={walletDisabled} className="w-full text-left p-4 rounded-md border border-line hover:border-brand disabled:opacity-50">
            <p className="font-medium">Wallet Balance (₹{walletBalance})</p>
            <p className="text-[0.9375rem] text-ink-muted">Pay using your wallet</p>
          </button>
        )}
        <button onClick={() => onPay('cod')} disabled={isPending} className="w-full text-left p-4 rounded-md border border-line hover:border-brand">
          <p className="font-medium">Cash on Delivery</p>
          <p className="text-[0.9375rem] text-ink-muted">Pay when you receive</p>
        </button>
      </div>
      <Button variant="outline" onClick={onBack} className="mt-4">Back</Button>
    </div>
  )
}
