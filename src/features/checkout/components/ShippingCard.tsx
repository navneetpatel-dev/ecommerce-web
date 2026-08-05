import { VendorStrip } from '@/shared/components/VendorStrip'
import { cn } from '@/shared/utils/cn'

interface ShippingCardProps {
  vendorId: string
  vendor: { id: string; businessName: string; slug: string; logoUrl: string | null }
  selected?: string
  onSelect: (method: 'STANDARD' | 'EXPRESS') => void
}

const SHIPPING_OPTIONS = [
  {
    method: 'STANDARD' as const,
    label: 'Standard',
    cost: 0,
    days: '5–7 business days',
    note: 'Best value',
  },
  {
    method: 'EXPRESS' as const,
    label: 'Express',
    cost: 149,
    days: '2–3 business days',
    note: 'Faster delivery',
  },
]

export function ShippingCard({ vendor, selected, onSelect }: ShippingCardProps) {
  return (
    <section className="border border-line bg-surface-raised p-4 shadow-elevation-1 md:p-5">
      <VendorStrip vendor={vendor} />

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {SHIPPING_OPTIONS.map((option) => {
          const isSelected = selected === option.method
          return (
            <button
              key={option.method}
              type="button"
              onClick={() => onSelect(option.method)}
              className={cn(
                'border px-4 py-3.5 text-left transition-colors',
                isSelected
                  ? 'border-brand bg-brand-subtle shadow-[inset_3px_0_0_0_var(--brand)]'
                  : 'border-line bg-surface hover:border-ink/25'
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium text-ink">{option.label}</span>
                <span className="font-mono text-[0.875rem] tabular-nums text-ink">
                  {option.cost === 0 ? 'Free' : `₹${option.cost}`}
                </span>
              </div>
              <p className="mt-1 text-[0.8125rem] text-ink-muted">{option.days}</p>
              <p className="mt-2 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-brand">
                {option.note}
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
