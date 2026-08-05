import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Button } from '@/shared/components/ui/button'
import type { PlatformSettings } from '../hooks/usePlatformSettingsForm'

interface PlatformSettingsFormProps {
  form: PlatformSettings
  onCommissionRateChange: (value: number) => void
  onAutoApproveChange: (value: boolean) => void
  onReturnWindowChange: (value: number) => void
  onPayoutCycleChange: (value: string) => void
}

export function PlatformSettingsForm({
  form,
  onCommissionRateChange,
  onAutoApproveChange,
  onReturnWindowChange,
  onPayoutCycleChange,
}: PlatformSettingsFormProps) {
  return (
    <div className="max-w-lg space-y-6">
      <h2 className="font-display text-[1.375rem] font-semibold text-ink">Platform Settings</h2>
      <p className="text-[0.9375rem] text-ink-muted">
        Manage default commission, return window, payout cycle, and moderation behavior.
      </p>
      <div className="space-y-4">
        <div>
          <Label>Default Commission Rate (%)</Label>
          <Input
            type="number"
            value={form.defaultCommissionRate}
            onChange={(e) => onCommissionRateChange(Number(e.target.value))}
          />
        </div>
        <div>
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
        <div>
          <Label>Default Return Window (days)</Label>
          <Input
            type="number"
            value={form.defaultReturnWindow}
            onChange={(e) => onReturnWindowChange(Number(e.target.value))}
          />
        </div>
        <div>
          <Label>Payout Cycle</Label>
          <Select value={form.payoutCycle} onValueChange={onPayoutCycleChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Bi-weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="pt-2">
          <Button size="sm">Save settings</Button>
        </div>
      </div>
    </div>
  )
}
