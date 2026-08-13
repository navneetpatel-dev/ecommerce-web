'use client'

import { PlatformSettingsForm } from '../components/PlatformSettingsForm'
import { usePlatformSettingsForm } from '../hooks/usePlatformSettingsForm'
import { LABELS } from '@/shared/constants/labels'

export function PlatformSettingsPage() {
  const settings = usePlatformSettingsForm()

  if (settings.loading) {
    return <p className="text-ink-muted">{LABELS.loadingPlatformSettings}</p>
  }

  if (settings.loadError || !settings.form) {
    return (
      <p className="text-danger">{settings.loadError ?? LABELS.settingsUnavailable}</p>
    )
  }

  return (
    <PlatformSettingsForm
      form={settings.form}
      message={settings.message}
      onCommissionRateChange={settings.setCommissionRate}
      onTcsRateChange={settings.setTcsRatePercent}
      onTdsRateChange={settings.setTdsRatePercent}
      onAutoApproveChange={settings.setAutoApproveProducts}
      onReturnWindowChange={settings.setReturnWindow}
      onPayoutCycleChange={settings.setPayoutCycle}
      onFreeShippingThresholdChange={settings.setFreeShippingThreshold}
      onReturnShippingFeeChange={settings.setReturnShippingFee}
      onSupportEmailChange={settings.setSupportEmail}
      onSupportHoursChange={settings.setSupportHours}
      onTicketReopenWindowDaysChange={settings.setTicketReopenWindowDays}
      onBugVerifyWindowDaysChange={settings.setBugVerifyWindowDays}
      onBugCloseWindowDaysChange={settings.setBugCloseWindowDays}
      onCodEnabledChange={settings.setCodEnabled}
      onCodMinOrderValueChange={settings.setCodMinOrderValue}
      onCodMaxOrderValueChange={settings.setCodMaxOrderValue}
      onSave={settings.save}
    />
  )
}
