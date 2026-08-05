'use client'

import { useEffect, useState } from 'react'

export interface PlatformSettings {
  defaultCommissionRate: number
  autoApproveProducts: boolean
  defaultReturnWindow: number
  payoutCycle: string
}

const STORAGE_KEY = 'admin-platform-settings'

export function usePlatformSettingsForm(initialSettings: PlatformSettings) {
  const [form, setForm] = useState(initialSettings)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as Partial<PlatformSettings>
      setForm((current) => ({ ...current, ...parsed }))
    } catch {
      // ignore
    }
  }, [])

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
      setMessage('Saved locally. Server sync is not available yet.')
    } catch {
      setMessage('Could not save settings in this browser.')
    }
  }

  return {
    form,
    message,
    save,
    setCommissionRate: (value: number) => {
      setMessage(null)
      setForm((current) => ({ ...current, defaultCommissionRate: value }))
    },
    setAutoApproveProducts: (value: boolean) => {
      setMessage(null)
      setForm((current) => ({ ...current, autoApproveProducts: value }))
    },
    setReturnWindow: (value: number) => {
      setMessage(null)
      setForm((current) => ({ ...current, defaultReturnWindow: value }))
    },
    setPayoutCycle: (value: string) => {
      setMessage(null)
      setForm((current) => ({ ...current, payoutCycle: value }))
    },
  }
}
