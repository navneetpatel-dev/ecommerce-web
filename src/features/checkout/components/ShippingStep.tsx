import { ArrowRight } from 'lucide-react'
import type { CartItem } from '@/shared/api/types'
import { ShippingCard } from './ShippingCard'
import { Button } from '@/shared/components/ui/button'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'

interface ShippingStepProps {
  groupedByVendor: Record<string, CartItem[]>
  selectedMethods: Record<string, string>
  canContinue: boolean
  onSelect: (vendorId: string, method: 'STANDARD' | 'EXPRESS') => void
  onContinue: () => void
}

export function ShippingStep({
  groupedByVendor,
  selectedMethods,
  canContinue,
  onSelect,
  onContinue,
}: ShippingStepProps) {
  const vendors = Object.entries(groupedByVendor)

  return (
    <div className="space-y-5">
      <p className="text-[0.875rem] text-ink-muted">
        {vendors.length} {vendors.length === 1 ? 'vendor' : 'vendors'} in this order
      </p>

      <div className="space-y-4">
        {vendors.map(([vid, items]) => (
          <ShippingCard
            key={vid}
            vendorId={vid}
            vendor={items[0].product.vendor}
            selected={selectedMethods[vid]}
            onSelect={(m) => onSelect(vid, m)}
          />
        ))}
      </div>

      <DisabledActionHint
        disabled={!canContinue}
        message="Select a shipping method for each vendor to continue."
        className="w-full sm:w-auto"
      >
        <Button
          size="lg"
          onClick={onContinue}
          disabled={!canContinue}
          className="w-full gap-2 sm:w-auto"
        >
          Continue to payment
          <ArrowRight size={16} />
        </Button>
      </DisabledActionHint>
    </div>
  )
}
