'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { NumberInput } from '@/shared/components/NumberInput'
import { FileUpload } from '@/shared/components/FileUpload'
import { FormActions, FormFieldFrame, FormSection, FormStack } from '@/shared/components/forms'
import { Button } from '@/shared/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { LABELS } from '@/shared/constants/labels'
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from '@/shared/constants/uploads'
import {
  VENDOR_ENTITY_TYPE_VALUES,
  type VendorDocumentType,
  type VendorEntityType,
} from '@/shared/constants/statuses'
import { vendorsApi, type KycChecklistItem } from '@/features/vendors/api/vendors.api'
import { categoriesApi } from '@/features/categories/api/categories.api'
import { vendorDocumentTypeLabel } from '@/shared/utils/vendorDocumentTypeLabel'
import { vendorDocumentChecklistStatusLabel } from '@/shared/utils/vendorDocumentChecklistStatusLabel'
import { vendorEntityTypeLabel } from '@/shared/utils/vendorEntityTypeLabel'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import type { Category } from '@/shared/api/types'

interface VendorShopSettingsFormProps {
  vendorId: string
  businessName: string
  returnShippingFee: number | null
  logoUrl: string | null
  bannerUrl: string | null
  entityType: VendorEntityType | null
  categoryIds: string[]
  checklistKey: number
  message?: string | null
  saving: boolean
  onReturnShippingFeeChange: (value: number | null) => void
  onLogoUploaded: (url: string) => void
  onBannerUploaded: (url: string) => void
  onEntityTypeChange: (value: VendorEntityType) => void
  onCategoryIdsChange: (ids: string[]) => void
  onSaveCategories: () => void
  onSave: () => void
  onClearOverride: () => void
}

export function VendorShopSettingsForm({
  vendorId,
  businessName,
  returnShippingFee,
  logoUrl,
  bannerUrl,
  entityType,
  categoryIds,
  checklistKey,
  message,
  saving,
  onReturnShippingFeeChange,
  onLogoUploaded,
  onBannerUploaded,
  onEntityTypeChange,
  onCategoryIdsChange,
  onSaveCategories,
  onSave,
  onClearOverride,
}: VendorShopSettingsFormProps) {
  const [items, setItems] = useState<KycChecklistItem[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [checklistError, setChecklistError] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<VendorDocumentType | null>(null)
  const [kycMessage, setKycMessage] = useState<string | null>(null)
  const [kycSaving, setKycSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const selectedSet = useMemo(() => new Set(categoryIds), [categoryIds])

  const loadChecklist = useCallback(async () => {
    if (!vendorId) return
    try {
      const checklist = await vendorsApi.getMyKycChecklist()
      setItems(checklist.items)
      setIsComplete(checklist.isComplete)
      setChecklistError(null)
      setActiveType((current) => {
        if (current && checklist.items.some((item) => item.documentType === current)) {
          return current
        }
        return checklist.items[0]?.documentType ?? null
      })
    } catch (err) {
      setChecklistError(getApiErrorMessage(err, LABELS.couldNotLoadKycChecklist))
      setItems([])
    }
  }, [vendorId])

  useEffect(() => {
    void loadChecklist()
  }, [loadChecklist, checklistKey])

  useEffect(() => {
    void categoriesApi.list().then(setCategories).catch(() => setCategories([]))
  }, [])

  const activeItem = items.find((item) => item.documentType === activeType) ?? null

  const openKycDocument = async (documentId: string) => {
    try {
      const { url } = await vendorsApi.getDocumentViewUrl(documentId)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      setKycMessage(getApiErrorMessage(err, LABELS.couldNotOpenDocument))
    }
  }

  const onKycUploaded = async (url: string) => {
    if (!activeType) return
    setKycSaving(true)
    setKycMessage(null)
    try {
      await vendorsApi.uploadMyDocument({ type: activeType, url })
      setKycMessage(LABELS.kycDocumentUploaded)
      await loadChecklist()
    } catch (err) {
      setKycMessage(getApiErrorMessage(err, LABELS.couldNotUploadKycDocument))
    } finally {
      setKycSaving(false)
    }
  }

  const toggleCategory = (id: string) => {
    const next = selectedSet.has(id)
      ? categoryIds.filter((value) => value !== id)
      : [...categoryIds, id]
    onCategoryIdsChange(next)
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <FormStack>
      <div className="space-y-1">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {LABELS.vendorShopSettings}
        </h2>
        <p className="max-w-2xl text-[0.9375rem] text-ink-muted">{LABELS.vendorShopSettingsHint}</p>
        {businessName ? (
          <p className="text-[0.8125rem] text-ink-faint">{businessName}</p>
        ) : null}
      </div>

      <FormSection title={LABELS.vendorCategories} hint={LABELS.vendorCategoriesHint}>
        <FormFieldFrame label={LABELS.entityType} className="sm:col-span-2 sm:max-w-md">
          <Select
            value={entityType ?? undefined}
            onValueChange={(value) => onEntityTypeChange(value as VendorEntityType)}
          >
            <SelectTrigger>
              <SelectValue placeholder={LABELS.entityType} />
            </SelectTrigger>
            <SelectContent>
              {VENDOR_ENTITY_TYPE_VALUES.map((value) => (
                <SelectItem key={value} value={value}>
                  {vendorEntityTypeLabel(value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldFrame>
        <div className="sm:col-span-2 max-h-48 space-y-2 overflow-y-auto rounded-md border border-line p-3">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2 text-[0.875rem] text-ink">
              <input
                type="checkbox"
                checked={selectedSet.has(category.id)}
                onChange={() => toggleCategory(category.id)}
              />
              {category.name}
            </label>
          ))}
        </div>
        <div className="sm:col-span-2">
          <Button
            type="button"
            disabled={saving || !entityType || categoryIds.length === 0}
            onClick={onSaveCategories}
          >
            {LABELS.saveCategories}
          </Button>
        </div>
      </FormSection>

      <FormSection title={LABELS.vendorLogoUpload} hint={LABELS.uploadProfilePhotoHint}>
        <div className="sm:col-span-2">
          <FileUpload
            entityType={UPLOAD_ENTITY.VENDORS}
            entityId={vendorId}
            purpose={UPLOAD_PURPOSE.LOGO}
            accept="image/png,image/jpeg,image/webp"
            valueUrl={logoUrl}
            onUploaded={onLogoUploaded}
            disabled={!vendorId || saving}
            label={LABELS.vendorLogoUpload}
          />
        </div>
        <div className="sm:col-span-2">
          <FileUpload
            entityType={UPLOAD_ENTITY.VENDORS}
            entityId={vendorId}
            purpose={UPLOAD_PURPOSE.BANNER}
            accept="image/png,image/jpeg,image/webp"
            valueUrl={bannerUrl}
            onUploaded={onBannerUploaded}
            disabled={!vendorId || saving}
            label={LABELS.vendorBannerUpload}
          />
        </div>
      </FormSection>

      <FormSection title={LABELS.kycChecklist} hint={LABELS.kycChecklistHint}>
        <p className="sm:col-span-2 text-[0.8125rem] text-ink-muted">
          {isComplete ? LABELS.kycChecklistComplete : LABELS.kycChecklistIncomplete}
        </p>
        {checklistError ? (
          <p className="sm:col-span-2 text-[0.8125rem] text-danger">{checklistError}</p>
        ) : null}
        {items.length === 0 && !checklistError ? (
          <p className="sm:col-span-2 text-[0.8125rem] text-ink-muted">{LABELS.noKycDocuments}</p>
        ) : null}
        <ul className="sm:col-span-2 space-y-2">
          {items.map((item) => (
            <li key={item.documentType}>
              <button
                type="button"
                onClick={() => setActiveType(item.documentType)}
                className={`flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2 text-left text-[0.8125rem] ${
                  activeType === item.documentType
                    ? 'border-brand bg-brand-subtle/40'
                    : 'border-line bg-surface'
                }`}
              >
                <span className="font-medium text-ink">
                  {vendorDocumentTypeLabel(item.documentType)}
                </span>
                <span className="text-ink-muted">
                  {vendorDocumentChecklistStatusLabel(item.status)}
                </span>
              </button>
              {item.rejectionReason ? (
                <p className="mt-1 px-1 text-[0.75rem] text-danger">
                  {LABELS.documentRejectionReason}: {item.rejectionReason}
                </p>
              ) : null}
              {item.documentId && item.url ? (
                <button
                  type="button"
                  className="mt-1 px-1 text-[0.75rem] font-medium text-brand hover:underline"
                  onClick={() => void openKycDocument(item.documentId!)}
                >
                  {LABELS.openDocument}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
        {activeType ? (
          <div className="sm:col-span-2">
            <FileUpload
              entityType={UPLOAD_ENTITY.VENDORS}
              entityId={vendorId}
              purpose={UPLOAD_PURPOSE.KYC}
              accept="image/png,image/jpeg,image/webp,application/pdf"
              onUploaded={(url) => void onKycUploaded(url)}
              disabled={!vendorId || saving || kycSaving}
              label={`${LABELS.uploadKycDocument}: ${vendorDocumentTypeLabel(activeType)}`}
            />
          </div>
        ) : null}
        {kycMessage ? (
          <p className="sm:col-span-2 text-[0.8125rem] text-ink-muted" aria-live="polite">
            {kycMessage}
          </p>
        ) : null}
      </FormSection>

      <FormSection title={LABELS.settingsFulfillment} hint={LABELS.settingsFulfillmentHint}>
        <FormFieldFrame label={LABELS.returnShippingFee} hint={LABELS.returnShippingFeeHint} className="sm:col-span-2 sm:max-w-md">
          <NumberInput
            value={returnShippingFee ?? undefined}
            min={0}
            step={10}
            prefix="₹"
            onChange={(value) => onReturnShippingFeeChange(value == null ? null : value)}
          />
        </FormFieldFrame>
      </FormSection>

      <FormActions leading={message}>
          <Button type="button" variant="outline" disabled={saving} onClick={onClearOverride}>
            {LABELS.vendorReturnShippingFeeClear}
          </Button>
          <Button type="button" disabled={saving} onClick={onSave}>
            {LABELS.saveSettings}
          </Button>
        </FormActions>
      </FormStack>
    </div>
  )
}
