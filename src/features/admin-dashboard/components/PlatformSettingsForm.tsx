import { NumberInput } from '@/shared/components/NumberInput'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Button } from '@/shared/components/ui/button'
import { LABELS } from '@/shared/constants/labels'
import type { PlatformSettings } from '../hooks/usePlatformSettingsForm'

interface PlatformSettingsFormProps {
  form: PlatformSettings
  message?: string | null
  onCommissionRateChange: (value: number) => void
  onAutoApproveChange: (value: boolean) => void
  onReturnWindowChange: (value: number) => void
  onPayoutCycleChange: (value: string) => void
  onFreeShippingThresholdChange: (value: number) => void
  onSupportEmailChange: (value: string) => void
  onSupportHoursChange: (value: string) => void
  onSave: () => void
}

export function PlatformSettingsForm({
  form,
  message,
  onCommissionRateChange,
  onAutoApproveChange,
  onReturnWindowChange,
  onPayoutCycleChange,
  onFreeShippingThresholdChange,
  onSupportEmailChange,
  onSupportHoursChange,
  onSave,
}: PlatformSettingsFormProps) {
  return (
    <div className="max-w-lg space-y-6">
      <h2 className="text-[1.375rem] font-semibold text-ink">Platform Settings</h2>
      <p className="text-[0.9375rem] text-ink-muted">
        Manage commission, returns, shipping thresholds, support contact, and moderation defaults.
      </p>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Default Commission Rate (%)</Label>
          <NumberInput
            value={form.defaultCommissionRate}
            min={0}
            max={100}
            step={0.5}
            suffix="%"
            onChange={(value) => onCommissionRateChange(value ?? 0)}
          />
        </div>
        <div className="space-y-2">
          <Label>Auto-approve Products</Label>
          <Select
            value={form.autoApproveProducts ? 'true' : 'false'}
            onValueChange={(value) => onAutoApproveChange(value === 'true')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Enabled (auto-approve)</SelectItem>
              <SelectItem value="false">Disabled (moderated)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Default Return Window (days)</Label>
          <NumberInput
            value={form.defaultReturnWindow}
            min={0}
            max={365}
            step={1}
            suffix={LABELS.daysShort}
            onChange={(value) => onReturnWindowChange(value ?? 0)}
          />
        </div>
        <div className="space-y-2">
          <Label>Free shipping threshold (₹)</Label>
          <NumberInput
            value={form.freeShippingThreshold}
            min={0}
            step={50}
            prefix="₹"
            onChange={(value) => onFreeShippingThresholdChange(value ?? 0)}
          />
        </div>
        <div className="space-y-2">
          <Label>Payout Cycle</Label>
          <Select value={form.payoutCycle} onValueChange={onPayoutCycleChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="BIWEEKLY">Bi-weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="weekly">Weekly (legacy)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Support email</Label>
          <Input
            type="email"
            value={form.supportEmail}
            onChange={(e) => onSupportEmailChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Support hours</Label>
          <Input
            value={form.supportHours}
            onChange={(e) => onSupportHoursChange(e.target.value)}
          />
        </div>
        <div className="space-y-2 pt-2">
          <Button size="sm" type="button" onClick={onSave}>
            Save settings
          </Button>
          {message && <p className="text-[0.8125rem] text-ink-muted">{message}</p>}
        </div>
      </div>
    </div>
  )
}
