import type { CartItem } from '@/shared/api/types'
import { ShippingCard } from './ShippingCard'
import { Button } from '@/shared/components/ui/button'

interface ShippingStepProps {
  groupedByVendor: Record<string, CartItem[]>
  selectedMethods: Record<string, string>
  onSelect: (vendorId: string, method: 'STANDARD' | 'EXPRESS') => void
  onContinue: () => void
}

export function ShippingStep({ groupedByVendor, selectedMethods, onSelect, onContinue }: ShippingStepProps) {
  const allSelected = Object.keys(groupedByVendor).every((vid) => selectedMethods[vid])

  return (
    <div className="space-y-6">
      <h2 className="font-display text-[1.375rem] font-semibold text-ink">Select shipping method</h2>
      {Object.entries(groupedByVendor).map(([vid, items]) => (
        <ShippingCard
          key={vid}
          vendorId={vid}
          vendor={items[0].product.vendor}
          selected={selectedMethods[vid]}
          onSelect={(m) => onSelect(vid, m)}
        />
      ))}
      <Button onClick={onContinue} disabled={!allSelected}>Continue</Button>
    </div>
  )
}
