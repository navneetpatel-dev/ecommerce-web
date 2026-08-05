'use client'

import { useState } from 'react'

export interface PlatformSettings {
  defaultCommissionRate: number
  autoApproveProducts: boolean
  defaultReturnWindow: number
  payoutCycle: string
}

export function usePlatformSettingsForm(initialSettings: PlatformSettings) {
  const [form, setForm] = useState(initialSettings)

  return {
    form,
    setCommissionRate: (value: number) =>
      setForm((current) => ({ ...current, defaultCommissionRate: value })),
    setAutoApproveProducts: (value: boolean) =>
      setForm((current) => ({ ...current, autoApproveProducts: value })),
    setReturnWindow: (value: number) =>
      setForm((current) => ({ ...current, defaultReturnWindow: value })),
    setPayoutCycle: (value: string) =>
      setForm((current) => ({ ...current, payoutCycle: value })),
  }
}
