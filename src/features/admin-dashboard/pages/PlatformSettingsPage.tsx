'use client'
import { PlatformSettingsForm } from '../components/PlatformSettingsForm'

const placeholderSettings = {
  defaultCommissionRate: 10,
  autoApproveProducts: true,
  defaultReturnWindow: 7,
  payoutCycle: 'weekly',
}

export function PlatformSettingsPage() {
  return <PlatformSettingsForm initialSettings={placeholderSettings} />
}
