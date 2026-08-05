'use client'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Button } from '@/shared/components/ui/button'
import { useState } from 'react'

interface PlatformSettings {
  defaultCommissionRate: number
  autoApproveProducts: boolean
  defaultReturnWindow: number
  payoutCycle: string
}

interface PlatformSettingsFormProps {
  initialSettings: PlatformSettings
}

export function PlatformSettingsForm({ initialSettings }: PlatformSettingsFormProps) {
  const [form, setForm] = useState(initialSettings)

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
            onChange={(e) => setForm({ ...form, defaultCommissionRate: Number(e.target.value) })} 
          />
        </div>
        <div>
          <Label>Auto-approve Products</Label>
          <Select
            value={form.autoApproveProducts ? 'true' : 'false'}
            onValueChange={(value) => setForm({ ...form, autoApproveProducts: value === 'true' })}
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
            onChange={(e) => setForm({ ...form, defaultReturnWindow: Number(e.target.value) })} 
          />
        </div>
        <div>
          <Label>Payout Cycle</Label>
          <Select value={form.payoutCycle} onValueChange={(value) => setForm({ ...form, payoutCycle: value })}>
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
