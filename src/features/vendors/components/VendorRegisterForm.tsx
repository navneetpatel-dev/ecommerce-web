'use client'

import { useEffect, useMemo, useState } from 'react'
import { UseFormReturn, Controller } from 'react-hook-form'
import { Button } from '@/shared/components/ui/button'
import { FormActions, FormFieldFrame, FormSection, FormStack } from '@/shared/components/forms'
import { Input } from '@/shared/components/ui/input'
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
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-[1.75rem]">{LABELS.registerAsVendor}</CardTitle>
          <CardDescription>{LABELS.registerAsVendorHint}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormStack>
              <FormSection
                title={LABELS.vendorRegisterSectionBasics}
                hint={LABELS.vendorRegisterSectionBasicsHint}
              >
                <FormFieldFrame
                  label={LABELS.businessName}
                  htmlFor="businessName"
                  required
                  error={errors.businessName?.message}
                  className="sm:col-span-2"
                >
                  <Input id="businessName" {...register('businessName')} />
                </FormFieldFrame>

                <FormFieldFrame
                  label={LABELS.entityType}
                  required
                  error={errors.entityType?.message}
                >
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
                </FormFieldFrame>

                <FormFieldFrame
                  label={LABELS.businessDescriptionOptional}
                  htmlFor="description"
                >
                  <Textarea id="description" {...register('description')} />
                </FormFieldFrame>

                <FormFieldFrame label={LABELS.gstNumberOptional} htmlFor="gstNumber">
                  <Input id="gstNumber" {...register('gstNumber')} />
                </FormFieldFrame>
              </FormSection>

              <FormSection
                title={LABELS.vendorRegisterSectionCategories}
                hint={LABELS.vendorRegisterSectionCategoriesHint}
                columns={1}
              >
                <FormFieldFrame
                  label={LABELS.vendorCategories}
                  hint={LABELS.vendorCategoriesHint}
                  error={errors.categoryIds ? LABELS.vendorCategories : undefined}
                >
                  <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-line p-3">
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center gap-2 text-[0.875rem] text-ink"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSet.has(category.id)}
                          onChange={() => toggleCategory(category.id)}
                        />
                        {category.name}
                      </label>
                    ))}
                  </div>
                </FormFieldFrame>

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
              </FormSection>

              <FormSection
                title={LABELS.vendorRegisterSectionIdentity}
                hint={LABELS.vendorRegisterSectionIdentityHint}
              >
                <FormFieldFrame label={LABELS.panHolderName} htmlFor="panHolderName">
                  <Input id="panHolderName" {...register('panHolderName')} />
                </FormFieldFrame>
                <FormFieldFrame
                  label={LABELS.bankAccountHolderName}
                  htmlFor="bankAccountHolderName"
                >
                  <Input id="bankAccountHolderName" {...register('bankAccountHolderName')} />
                </FormFieldFrame>
                {showNameWarning ? (
                  <p className="rounded-sm bg-warning-subtle px-3 py-2 text-[0.8125rem] text-warning sm:col-span-2">
                    {LABELS.kycNameMismatchWarning}
                  </p>
                ) : null}
              </FormSection>

              {error ? (
                <p className="text-[0.9375rem] text-danger">{LABELS.registrationFailed}</p>
              ) : null}

              <FormActions>
                <Button type="submit" className="w-full sm:w-auto" loading={isPending}>
                  {LABELS.registerAsVendor}
                </Button>
              </FormActions>
            </FormStack>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
