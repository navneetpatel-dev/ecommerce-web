'use client'

import { useEffect, useState } from 'react'
import { vendorApi } from '../api/vendor.api'
import { LABELS } from '@/shared/constants/labels'
import { STORAGE_KEYS } from '@/shared/constants/storage'
import type { VendorEntityType } from '@/shared/constants/statuses'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'

export function useVendorShopSettingsForm() {
  const [vendorId, setVendorId] = useState('')
  const [returnShippingFee, setReturnShippingFee] = useState<number | null>(null)
  const [codEnabled, setCodEnabled] = useState(true)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [bannerUrl, setBannerUrl] = useState<string | null>(null)
  const [businessName, setBusinessName] = useState('')
  const [entityType, setEntityType] = useState<VendorEntityType | null>(null)
  const [categoryIds, setCategoryIds] = useState<string[]>([])
  const [checklistKey, setChecklistKey] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const flag = sessionStorage.getItem(STORAGE_KEYS.KYC_NAME_MISMATCH_WARNING)
      if (flag) {
        sessionStorage.removeItem(STORAGE_KEYS.KYC_NAME_MISMATCH_WARNING)
        setMessage(LABELS.kycNameMismatchWarningAcknowledged)
      }
    }

    vendorApi
      .getMyShop()
      .then((shop) => {
        setVendorId(shop.id)
        setBusinessName(shop.businessName)
        setLogoUrl(shop.logoUrl ?? null)
        setBannerUrl(shop.bannerUrl ?? null)
        setEntityType((shop.entityType as VendorEntityType | null) ?? null)
        setCategoryIds(shop.categoryIds ?? [])
        setReturnShippingFee(
          shop.returnShippingFee == null ? null : Number(shop.returnShippingFee),
        )
        setCodEnabled(shop.codEnabled !== false)
      })
      .catch(() => setLoadError(LABELS.couldNotLoadVendorShopSettings))
      .finally(() => setLoading(false))
  }, [])

  const save = (override?: {
    returnShippingFee?: number | null
    logoUrl?: string | null
    bannerUrl?: string | null
    entityType?: VendorEntityType | null
    categoryIds?: string[]
    codEnabled?: boolean
  }) => {
    setSaving(true)
    setMessage(null)
    const nextEntityType =
      override && 'entityType' in override ? override.entityType : entityType
    const nextCategoryIds =
      override && 'categoryIds' in override ? override.categoryIds : categoryIds

    vendorApi
      .updateMyShop({
        returnShippingFee:
          override && 'returnShippingFee' in override
            ? override.returnShippingFee
            : returnShippingFee,
        codEnabled: override && 'codEnabled' in override ? override.codEnabled : codEnabled,
        logoUrl: override && 'logoUrl' in override ? override.logoUrl : logoUrl,
        bannerUrl: override && 'bannerUrl' in override ? override.bannerUrl : bannerUrl,
        ...(nextEntityType ? { entityType: nextEntityType } : {}),
        ...(nextCategoryIds && nextCategoryIds.length > 0
          ? { categoryIds: nextCategoryIds }
          : {}),
      })
      .then((shop) => {
        setReturnShippingFee(
          shop.returnShippingFee == null ? null : Number(shop.returnShippingFee),
        )
        setCodEnabled(shop.codEnabled !== false)
        setLogoUrl(shop.logoUrl ?? null)
        setBannerUrl(shop.bannerUrl ?? null)
        setEntityType((shop.entityType as VendorEntityType | null) ?? null)
        setCategoryIds(shop.categoryIds ?? [])
        setChecklistKey((key) => key + 1)
        setMessage(
          override && ('categoryIds' in override || 'entityType' in override)
            ? LABELS.categoriesSaved
            : LABELS.vendorShopSettingsSaved,
        )
      })
      .catch((err) =>
        setMessage(
          getApiErrorMessage(
            err,
            override && ('categoryIds' in override || 'entityType' in override)
              ? LABELS.couldNotSaveCategories
              : LABELS.couldNotSaveVendorShopSettings,
          ),
        ),
      )
      .finally(() => setSaving(false))
  }

  const clearOverride = () => {
    setMessage(null)
    setReturnShippingFee(null)
    save({ returnShippingFee: null })
  }

  return {
    vendorId,
    businessName,
    returnShippingFee,
    codEnabled,
    logoUrl,
    bannerUrl,
    entityType,
    categoryIds,
    checklistKey,
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
    setCodEnabled: (value: boolean) => {
      setMessage(null)
      setCodEnabled(value)
    },
    setLogoUrl: (url: string) => {
      setMessage(null)
      setLogoUrl(url)
      save({ logoUrl: url })
    },
    setBannerUrl: (url: string) => {
      setMessage(null)
      setBannerUrl(url)
      save({ bannerUrl: url })
    },
    setEntityType: (value: VendorEntityType) => {
      setMessage(null)
      setEntityType(value)
    },
    setCategoryIds: (ids: string[]) => {
      setMessage(null)
      setCategoryIds(ids)
    },
    saveCategories: () =>
      save({
        entityType,
        categoryIds,
      }),
  }
}
