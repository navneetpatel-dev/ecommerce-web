'use client'

import { useEffect, useState } from 'react'
import { vendorApi } from '../api/vendor.api'
import { LABELS } from '@/shared/constants/labels'

export function useVendorShopSettingsForm() {
  const [returnShippingFee, setReturnShippingFee] = useState<number | null>(null)
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    vendorApi
      .getMyShop()
      .then((shop) => {
        setBusinessName(shop.businessName)
        setReturnShippingFee(
          shop.returnShippingFee == null ? null : Number(shop.returnShippingFee),
        )
      })
      .catch(() => setLoadError(LABELS.couldNotLoadVendorShopSettings))
      .finally(() => setLoading(false))
  }, [])

  const save = (overrideFee?: number | null) => {
    setSaving(true)
    setMessage(null)
    const fee = overrideFee !== undefined ? overrideFee : returnShippingFee
    vendorApi
      .updateMyShop({ returnShippingFee: fee })
      .then((shop) => {
        setReturnShippingFee(
          shop.returnShippingFee == null ? null : Number(shop.returnShippingFee),
        )
        setMessage(LABELS.vendorShopSettingsSaved)
      })
      .catch(() => setMessage(LABELS.couldNotSaveVendorShopSettings))
      .finally(() => setSaving(false))
  }

  const clearOverride = () => {
    setMessage(null)
    setReturnShippingFee(null)
    save(null)
  }

  return {
    businessName,
    returnShippingFee,
    loading,
    loadError,
    message,
    saving,
    save: () => save(),
    clearOverride,
    setReturnShippingFee: (value: number | null) => {
      setMessage(null)
      setReturnShippingFee(value)
    },
  }
}
