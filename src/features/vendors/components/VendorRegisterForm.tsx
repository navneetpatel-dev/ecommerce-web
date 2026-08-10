'use client'

import { useEffect, useMemo, useState } from 'react'
import { UseFormReturn, Controller } from 'react-hook-form'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/card'
import { LABELS } from '@/shared/constants/labels'
import {
  VENDOR_ENTITY_TYPE_VALUES,
  type VendorDocumentType,
  type VendorEntityType,
} from '@/shared/constants/statuses'
import { vendorEntityTypeLabel } from '@/shared/utils/vendorEntityTypeLabel'
import { vendorDocumentTypeLabel } from '@/shared/utils/vendorDocumentTypeLabel'
import { categoriesApi } from '@/features/categories/api/categories.api'
import { vendorsApi } from '../api/vendors.api'
import type { VendorRegisterInput } from '../schemas/vendor.schema'
import type { Category } from '@/shared/api/types'

interface VendorRegisterFormProps {
  form: UseFormReturn<VendorRegisterInput>
  onSubmit: (data: VendorRegisterInput) => void
  error: boolean
  isPending: boolean
}

function namesMismatch(pan?: string, bank?: string) {
  const a = (pan ?? '').trim().toLowerCase().replace(/\s+/g, ' ')
  const b = (bank ?? '').trim().toLowerCase().replace(/\s+/g, ' ')
  return Boolean(a && b && a !== b)
}

export function VendorRegisterForm({ form, onSubmit, error, isPending }: VendorRegisterFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form
  const [categories, setCategories] = useState<Category[]>([])
  const [requiredDocs, setRequiredDocs] = useState<VendorDocumentType[]>([])
  const entityType = watch('entityType')
  const categoryIds = watch('categoryIds') ?? []
  const panHolderName = watch('panHolderName')
  const bankAccountHolderName = watch('bankAccountHolderName')
  const showNameWarning = namesMismatch(panHolderName, bankAccountHolderName)

  useEffect(() => {
    void categoriesApi.list().then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    if (!entityType || categoryIds.length === 0) {
      setRequiredDocs([])
      return
    }
    void vendorsApi
      .previewRequiredDocuments(entityType, categoryIds)
      .then((res) => setRequiredDocs(res.requiredDocumentTypes))
      .catch(() => setRequiredDocs([]))
  }, [entityType, categoryIds])

  const selectedSet = useMemo(() => new Set(categoryIds), [categoryIds])

  const toggleCategory = (id: string) => {
    const next = selectedSet.has(id)
      ? categoryIds.filter((value) => value !== id)
      : [...categoryIds, id]
    setValue('categoryIds', next, { shouldValidate: true })
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-[1.75rem]">{LABELS.registerAsVendor}</CardTitle>
          <CardDescription>{LABELS.registerAsVendorHint}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">{LABELS.businessName}</Label>
              <Input id="businessName" {...register('businessName')} />
              {errors.businessName ? (
                <p className="text-[0.9375rem] text-danger">{errors.businessName.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>{LABELS.entityType}</Label>
              <Controller
                control={control}
                name="entityType"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value as VendorEntityType)}
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
                )}
              />
              {errors.entityType ? (
                <p className="text-[0.9375rem] text-danger">{errors.entityType.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>{LABELS.vendorCategories}</Label>
              <p className="text-[0.8125rem] text-ink-muted">{LABELS.vendorCategoriesHint}</p>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-line p-3">
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
              {errors.categoryIds ? (
                <p className="text-[0.9375rem] text-danger">{LABELS.vendorCategories}</p>
              ) : null}
            </div>

            {requiredDocs.length > 0 ? (
              <div className="space-y-2 rounded-md border border-line bg-paper/40 p-3">
                <p className="text-[0.875rem] font-medium text-ink">{LABELS.requiredDocuments}</p>
                <ul className="list-disc space-y-1 pl-5 text-[0.8125rem] text-ink-muted">
                  {requiredDocs.map((type) => (
                    <li key={type}>{vendorDocumentTypeLabel(type)}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="panHolderName">{LABELS.panHolderName}</Label>
              <Input id="panHolderName" {...register('panHolderName')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAccountHolderName">{LABELS.bankAccountHolderName}</Label>
              <Input id="bankAccountHolderName" {...register('bankAccountHolderName')} />
            </div>
            {showNameWarning ? (
              <p className="rounded-sm bg-warning-subtle px-3 py-2 text-[0.8125rem] text-warning">
                {LABELS.kycNameMismatchWarning}
              </p>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="description">{LABELS.businessDescriptionOptional}</Label>
              <Textarea id="description" {...register('description')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gstNumber">{LABELS.gstNumberOptional}</Label>
              <Input id="gstNumber" {...register('gstNumber')} />
            </div>

            {error ? (
              <p className="text-[0.9375rem] text-danger">{LABELS.registrationFailed}</p>
            ) : null}
            <Button type="submit" className="w-full" loading={isPending}>
              {LABELS.registerAsVendor}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
