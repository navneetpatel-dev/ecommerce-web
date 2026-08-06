'use client'

import { PlatformSettingsForm } from '../components/PlatformSettingsForm'
import { usePlatformSettingsForm } from '../hooks/usePlatformSettingsForm'

export function PlatformSettingsPage() {
  const settings = usePlatformSettingsForm()

  if (settings.loading) {
    return <p className="text-ink-muted">Loading platform settings…</p>
  }

  if (settings.loadError || !settings.form) {
    return <p className="text-red-600">{settings.loadError ?? 'Settings unavailable.'}</p>
  }

  return (
    <PlatformSettingsForm
      form={settings.form}
      message={settings.message}
      onCommissionRateChange={settings.setCommissionRate}
      onAutoApproveChange={settings.setAutoApproveProducts}
      onReturnWindowChange={settings.setReturnWindow}
      onPayoutCycleChange={settings.setPayoutCycle}
      onFreeShippingThresholdChange={settings.setFreeShippingThreshold}
      onSupportEmailChange={settings.setSupportEmail}
      onSupportHoursChange={settings.setSupportHours}
      onSave={settings.save}
    />
  )
}
