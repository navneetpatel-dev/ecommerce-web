import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'

interface TrackingFormProps {
  trackingNumber: string
  onTrackingNumberChange: (value: string) => void
  onSubmit: () => void
}

export function TrackingForm({ trackingNumber, onTrackingNumberChange, onSubmit }: TrackingFormProps) {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Tracking number"
        value={trackingNumber}
        onChange={(e) => onTrackingNumberChange(e.target.value)}
      />
      <Button onClick={onSubmit}>Track</Button>
    </div>
  )
}
