import { VendorStrip } from '@/shared/components/VendorStrip'
import { Card, CardHeader, CardContent } from '@/shared/components/ui/card'

interface ShippingCardProps {
  vendorId: string
  vendor: { id: string; businessName: string; slug: string; logoUrl: string | null }
  selected?: string
  onSelect: (method: 'STANDARD' | 'EXPRESS') => void
}

const SHIPPING_OPTIONS = [
  { method: 'STANDARD' as const, label: 'Standard', cost: 0, days: '5-7' },
  { method: 'EXPRESS' as const, label: 'Express', cost: 149, days: '2-3' },
]

export function ShippingCard({ vendor, selected, onSelect }: ShippingCardProps) {
  return (
    <Card>
      <CardHeader><VendorStrip vendor={vendor} /></CardHeader>
      <CardContent className="space-y-2">
        {SHIPPING_OPTIONS.map((r) => (
          <button
            key={r.method}
            onClick={() => onSelect(r.method)}
            className={`w-full text-left p-3 rounded-md border transition-colors ${
              selected === r.method ? 'border-brand bg-brand-subtle' : 'border-line hover:border-brand'
            }`}
          >
            <div className="flex justify-between">
              <span className="font-medium">{r.label}</span>
              <span className="font-mono">{r.cost === 0 ? 'Free' : `₹${r.cost}`}</span>
            </div>
            <p className="text-[0.8125rem] text-ink-muted">{r.days} days</p>
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
