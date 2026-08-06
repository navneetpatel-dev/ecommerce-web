'use client'

import { useEffect, useState } from 'react'
import { settingsApi, type AdminPlatformSettings } from '../api/settings.api'

export type PlatformSettings = AdminPlatformSettings

export function usePlatformSettingsForm() {
  const [form, setForm] = useState<PlatformSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    settingsApi
      .get()
      .then((settings) => setForm(settings))
      .catch(() => setLoadError('Could not load platform settings from the server.'))
      .finally(() => setLoading(false))
  }, [])

  const save = () => {
    if (!form) return
    settingsApi
      .update(form)
      .then((saved) => {
        setForm(saved)
        setMessage('Settings saved.')
      })
      .catch(() => setMessage('Could not save settings.'))
  }

  return {
    form,
    loading,
    loadError,
    message,
    save,
    setCommissionRate: (value: number) => {
      setMessage(null)
      setForm((current) => (current ? { ...current, defaultCommissionRate: value } : current))
    },
    setAutoApproveProducts: (value: boolean) => {
      setMessage(null)
      setForm((current) => (current ? { ...current, autoApproveProducts: value } : current))
    },
    setReturnWindow: (value: number) => {
      setMessage(null)
      setForm((current) => (current ? { ...current, defaultReturnWindow: value } : current))
    },
    setPayoutCycle: (value: string) => {
      setMessage(null)
      setForm((current) => (current ? { ...current, payoutCycle: value } : current))
    },
    setFreeShippingThreshold: (value: number) => {
      setMessage(null)
      setForm((current) => (current ? { ...current, freeShippingThreshold: value } : current))
    },
    setSupportEmail: (value: string) => {
      setMessage(null)
      setForm((current) => (current ? { ...current, supportEmail: value } : current))
    },
    setSupportHours: (value: string) => {
      setMessage(null)
      setForm((current) => (current ? { ...current, supportHours: value } : current))
    },
  }
}
