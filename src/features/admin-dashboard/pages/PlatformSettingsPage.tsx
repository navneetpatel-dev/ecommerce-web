'use client'

import { PlatformSettingsForm } from '../components/PlatformSettingsForm'
import { usePlatformSettingsForm } from '../hooks/usePlatformSettingsForm'

const placeholderSettings = {
  defaultCommissionRate: 10,
  autoApproveProducts: true,
  defaultReturnWindow: 7,
  payoutCycle: 'weekly',
}

export function PlatformSettingsPage() {
  const settings = usePlatformSettingsForm(placeholderSettings)

  return (
    <PlatformSettingsForm
      form={settings.form}
      onCommissionRateChange={settings.setCommissionRate}
      onAutoApproveChange={settings.setAutoApproveProducts}
      onReturnWindowChange={settings.setReturnWindow}
      onPayoutCycleChange={settings.setPayoutCycle}
    />
  )
}
