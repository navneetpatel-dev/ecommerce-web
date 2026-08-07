'use client'

import { useEffect, useState } from 'react'
import { settingsApi, type AdminPlatformSettings } from '../api/settings.api'
import { LABELS } from '@/shared/constants/labels'

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
      .catch(() => setLoadError(LABELS.couldNotLoadSettings))
      .finally(() => setLoading(false))
  }, [])

  const save = () => {
    if (!form) return
    settingsApi
      .update(form)
      .then((saved) => {
        setForm(saved)
        setMessage(LABELS.settingsSaved)
      })
      .catch(() => setMessage(LABELS.couldNotSaveSettings))
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
    setTcsRatePercent: (value: number) => {
      setMessage(null)
      setForm((current) => (current ? { ...current, tcsRatePercent: value } : current))
    },
    setTdsRatePercent: (value: number) => {
      setMessage(null)
      setForm((current) => (current ? { ...current, tdsRatePercent: value } : current))
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
    setReturnShippingFee: (value: number) => {
      setMessage(null)
      setForm((current) => (current ? { ...current, returnShippingFee: value } : current))
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
