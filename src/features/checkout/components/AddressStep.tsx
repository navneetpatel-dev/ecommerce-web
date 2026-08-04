import type { Address } from '@/shared/api/types'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'

interface AddressStepProps {
  addresses?: Address[]
  selectedId: string | null
  onSelect: (id: string) => void
  onContinue: () => void
}

export function AddressStep({ addresses, selectedId, onSelect, onContinue }: AddressStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-semibold">Select delivery address</h2>
      {addresses?.length === 0 && (
        <p className="text-ink/50">No saved addresses. Add one to continue.</p>
      )}
      {addresses?.map((addr) => (
        <Card
          key={addr.id}
          className={`cursor-pointer transition-colors ${selectedId === addr.id ? 'border-brand bg-brand-light' : ''}`}
          onClick={() => { onSelect(addr.id); onContinue() }}
        >
          <CardContent className="py-4">
            <p className="font-medium">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
            <p className="text-sm text-ink/60">{addr.city}, {addr.state} {addr.pincode}</p>
            {addr.isDefault && <span className="text-xs text-brand font-medium">Default</span>}
          </CardContent>
        </Card>
      ))}
      <Button onClick={onContinue} disabled={!selectedId}>Continue</Button>
    </div>
  )
}
