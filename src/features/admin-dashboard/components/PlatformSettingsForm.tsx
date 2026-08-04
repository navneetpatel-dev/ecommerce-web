'use client'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
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
      <h2 className="font-display text-xl font-semibold">Platform Settings</h2>
      <p className="text-sm text-accent">⚠ Settings API is not yet implemented on the backend. This is a placeholder UI.</p>
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
          <select 
            className="w-full h-9 rounded-md border border-line bg-surface px-3 text-sm"
            value={form.autoApproveProducts ? 'true' : 'false'}
            onChange={(e) => setForm({ ...form, autoApproveProducts: e.target.value === 'true' })}
          >
            <option value="true">Enabled (auto-approve)</option>
            <option value="false">Disabled (moderated)</option>
          </select>
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
          <select 
            className="w-full h-9 rounded-md border border-line bg-surface px-3 text-sm"
            value={form.payoutCycle}
            onChange={(e) => setForm({ ...form, payoutCycle: e.target.value })}
          >
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <p className="text-xs text-ink/40">Requires backend: GET/PATCH /api/admin/settings</p>
      </div>
    </div>
  )
}
