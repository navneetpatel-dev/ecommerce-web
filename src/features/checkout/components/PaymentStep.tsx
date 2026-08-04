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
      <h2 className="font-display text-xl font-semibold">Payment method</h2>
      <div className="space-y-3">
        <button onClick={() => onPay('razorpay')} disabled={isPending} className="w-full text-left p-4 rounded-lg border border-brand bg-brand-light">
          <p className="font-medium">Card / UPI / Netbanking</p>
          <p className="text-sm text-ink/60">Pay securely via Razorpay</p>
        </button>
        {walletBalance !== undefined && (
          <button onClick={() => onPay('wallet')} disabled={walletDisabled} className="w-full text-left p-4 rounded-lg border border-line hover:border-brand disabled:opacity-50">
            <p className="font-medium">Wallet Balance (₹{walletBalance})</p>
            <p className="text-sm text-ink/60">Pay using your wallet</p>
          </button>
        )}
        <button onClick={() => onPay('cod')} disabled={isPending} className="w-full text-left p-4 rounded-lg border border-line hover:border-brand">
          <p className="font-medium">Cash on Delivery</p>
          <p className="text-sm text-ink/60">Pay when you receive</p>
        </button>
      </div>
      <Button variant="outline" onClick={onBack} className="mt-4">Back</Button>
    </div>
  )
}
