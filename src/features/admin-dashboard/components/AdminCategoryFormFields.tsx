'use client'

import { useEffect, useMemo, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import type { CategoryFormInput } from '../schemas/categories.schema'
import { categoriesApi } from '@/features/categories/api/categories.api'
import { FileUpload } from '@/shared/components/FileUpload'
import { FormFieldFrame, FormSection, FormStack } from '@/shared/components/forms'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { LABELS } from '@/shared/constants/labels'
import { CATEGORY_STATUS } from '@/shared/constants/statuses'
import { MAX_PAGE_LIMIT } from '@/shared/constants/pagination'
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from '@/shared/constants/uploads'
import type { Category } from '@/shared/api/types'

const NONE_PARENT = '__none__'

interface AdminCategoryFormFieldsProps {
  form: UseFormReturn<CategoryFormInput>
  /** Exclude this category from parent options (edit self). */
  excludeCategoryId?: string
  idPrefix?: string
}

export function AdminCategoryFormFields({
  form,
  excludeCategoryId,
  idPrefix = 'category',
}: AdminCategoryFormFieldsProps) {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors, touchedFields, isSubmitted },
  } = form

  const [parents, setParents] = useState<Category[]>([])
  const draftUploadId = useMemo(() => crypto.randomUUID(), [])
  const uploadEntityId = excludeCategoryId ?? draftUploadId
  const watchedImageUrl = watch('imageUrl')

  useEffect(() => {
    void categoriesApi
      .listPaginated({ page: 1, limit: MAX_PAGE_LIMIT })
      .then((result) => setParents(result.items))
  }, [])

  const parentOptions = useMemo(() => {
    const byId = new Map(parents.map((category) => [category.id, category]))
    const depthOf = (category: Category): number => {
      let depth = 0
      let cursor: Category | undefined = category
      const seen = new Set<string>()
      while (cursor?.parentId) {
        if (seen.has(cursor.id)) break
        seen.add(cursor.id)
        depth += 1
        cursor = byId.get(cursor.parentId)
      }
      return depth
    }
    // Max taxonomy depth is 3 — only depth 0–1 nodes may be parents.
    return parents.filter(
      (category) =>
        category.status !== CATEGORY_STATUS.ARCHIVED &&
        category.id !== excludeCategoryId &&
        depthOf(category) < 2,
    )
  }, [parents, excludeCategoryId])

  const showFieldError = (name: keyof CategoryFormInput) => {
    const touched = Boolean(touchedFields[name as keyof typeof touchedFields])
    if (!touched && !isSubmitted) return undefined
    return errors[name]?.message
  }

  return (
    <FormStack>
      <FormSection
        title={LABELS.categoryFormSectionBasics}
        hint={LABELS.categoryFormSectionBasicsHint}
      >
        <FormFieldFrame
          label={LABELS.categoryName}
          htmlFor={`${idPrefix}-name`}
          required
          error={showFieldError('name')}
          className="sm:col-span-2"
        >
          <Input
            id={`${idPrefix}-name`}
            error={Boolean(showFieldError('name'))}
            placeholder={LABELS.categoryName}
            {...register('name')}
          />
        </FormFieldFrame>

        <FormFieldFrame label={LABELS.parentCategory}>
          <Controller
            name="parentId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ? field.value : NONE_PARENT}
                onValueChange={(value) => field.onChange(value === NONE_PARENT ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={LABELS.selectParentCategory} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE_PARENT}>{LABELS.parentCategoryNone}</SelectItem>
                  {parentOptions.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormFieldFrame>

        <FormFieldFrame label={LABELS.categoryStatus}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CATEGORY_STATUS.ACTIVE}>
                    {LABELS.categoryStatusActive}
                  </SelectItem>
                  <SelectItem value={CATEGORY_STATUS.ARCHIVED}>
                    {LABELS.categoryStatusArchived}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormFieldFrame>
      </FormSection>

      <FormSection
        title={LABELS.categoryFormSectionImage}
        hint={LABELS.categoryFormSectionImageHint}
        columns={1}
      >
        <FormFieldFrame label={LABELS.categoryImageUpload} error={showFieldError('imageUrl')}>
          <FileUpload
            entityType={UPLOAD_ENTITY.CATEGORIES}
            entityId={uploadEntityId}
            purpose={UPLOAD_PURPOSE.IMAGE}
            accept="image/png,image/jpeg,image/webp"
            valueUrl={watchedImageUrl?.trim() ? watchedImageUrl.trim() : null}
            onUploaded={(url) =>
              setValue('imageUrl', url, { shouldDirty: true, shouldValidate: true })
            }
          />
        </FormFieldFrame>
      </FormSection>

      <FormSection
        title={LABELS.categoryFormSectionSeo}
        hint={LABELS.categoryFormSectionSeoHint}
      >
        <FormFieldFrame label={LABELS.categorySeoTitle} htmlFor={`${idPrefix}-seo-title`}>
          <Input id={`${idPrefix}-seo-title`} {...register('seoTitle')} />
        </FormFieldFrame>

        <FormFieldFrame label={LABELS.categorySeoDescription} htmlFor={`${idPrefix}-seo-desc`}>
          <Input id={`${idPrefix}-seo-desc`} {...register('seoDescription')} />
        </FormFieldFrame>

        <FormFieldFrame
          label={LABELS.categoryCommissionRate}
          htmlFor={`${idPrefix}-commission`}
          hint={LABELS.categoryCommissionRateHint}
          error={showFieldError('commissionRate')}
          className="sm:col-span-2 sm:max-w-md"
        >
          <Input
            id={`${idPrefix}-commission`}
            inputMode="decimal"
            placeholder={LABELS.categoryCommissionPlaceholder}
            {...register('commissionRate')}
          />
        </FormFieldFrame>
      </FormSection>
    </FormStack>
  )
}
