import { FormFieldFrame } from '@/shared/components/forms'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { LABELS } from '@/shared/constants/labels'

interface TrackingFormProps {
  trackingNumber: string
  onTrackingNumberChange: (value: string) => void
  onSubmit: () => void
}

export function TrackingForm({ trackingNumber, onTrackingNumberChange, onSubmit }: TrackingFormProps) {
  return (
    <FormFieldFrame label={LABELS.trackingNumber} htmlFor="tracking-number">
      <div className="flex gap-2">
        <Input
          id="tracking-number"
          placeholder={LABELS.trackingNumber}
          className="min-w-0 flex-1"
          value={trackingNumber}
          onChange={(e) => onTrackingNumberChange(e.target.value)}
        />
        <Button type="button" className="shrink-0" onClick={onSubmit}>
          {LABELS.track}
        </Button>
      </div>
    </FormFieldFrame>
  )
}
