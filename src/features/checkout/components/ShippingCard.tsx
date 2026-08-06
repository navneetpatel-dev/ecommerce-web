import { VendorStrip } from '@/shared/components/VendorStrip'
import { cn } from '@/shared/utils/cn'
import type { ShippingRate } from '@/shared/api/types'

interface ShippingCardProps {
  vendor: { id: string; businessName: string; slug: string; logoUrl: string | null }
  options: ShippingRate[]
  isLoading: boolean
  isError: boolean
  selected?: string
  onSelect: (method: 'STANDARD' | 'EXPRESS') => void
}

function formatDays(days: number) {
  if (days <= 1) return '1 business day'
  return `${days} business days`
}

export function ShippingCard({
  vendor,
  options,
  isLoading,
  isError,
  selected,
  onSelect,
}: ShippingCardProps) {
  return (
    <section className="border border-line bg-surface-raised p-4 shadow-elevation-1 md:p-5">
      <VendorStrip vendor={vendor} />

      {isLoading && <p className="mt-4 text-[0.875rem] text-ink-muted">Loading shipping rates…</p>}
      {isError && (
        <p className="mt-4 text-[0.875rem] text-red-600">Could not load shipping rates for this pincode.</p>
      )}
      {!isLoading && !isError && options.length === 0 && (
        <p className="mt-4 text-[0.875rem] text-ink-muted">
          No shipping rates are configured for this delivery area yet.
        </p>
      )}

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = selected === option.method
          const label = option.method === 'EXPRESS' ? 'Express' : 'Standard'
          return (
            <button
              key={option.method}
              type="button"
              onClick={() => onSelect(option.method)}
              className={cn(
                'border px-4 py-3.5 text-left transition-colors',
                isSelected
                  ? 'border-brand bg-brand-subtle shadow-[inset_3px_0_0_0_var(--brand)]'
                  : 'border-line bg-surface hover:border-ink/25',
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium text-ink">{label}</span>
                <span className="font-mono text-[0.875rem] tabular-nums text-ink">
                  {Number(option.cost) === 0 ? 'Free' : `₹${Number(option.cost)}`}
                </span>
              </div>
              <p className="mt-1 text-[0.8125rem] text-ink-muted">
                {formatDays(Number(option.estimatedDays || 5))}
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
