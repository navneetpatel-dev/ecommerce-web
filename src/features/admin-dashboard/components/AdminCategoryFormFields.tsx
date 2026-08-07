'use client'

import { useEffect, useMemo, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import type { CategoryFormInput } from '../schemas/categories.schema'
import { categoriesApi } from '@/features/categories/api/categories.api'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
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
import type { Category } from '@/shared/api/types'

const NONE_PARENT = '__none__'

interface AdminCategoryFormFieldsProps {
  form: UseFormReturn<CategoryFormInput>
  /** Exclude this category from parent options (edit self). */
  excludeCategoryId?: string
  idPrefix?: string
}

function RequiredMark() {
  return (
    <span className="text-danger" aria-hidden>
      {' '}
      *
    </span>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="text-[0.8125rem] text-danger">
      {message}
    </p>
  )
}

export function AdminCategoryFormFields({
  form,
  excludeCategoryId,
  idPrefix = 'category',
}: AdminCategoryFormFieldsProps) {
  const {
    register,
    control,
    formState: { errors, touchedFields, isSubmitted },
  } = form

  const [parents, setParents] = useState<Category[]>([])

  useEffect(() => {
    void categoriesApi
      .listPaginated({ page: 1, limit: MAX_PAGE_LIMIT })
      .then((result) => setParents(result.items))
  }, [])

  const parentOptions = useMemo(
    () =>
      parents.filter(
        (category) =>
          category.status !== CATEGORY_STATUS.ARCHIVED && category.id !== excludeCategoryId,
      ),
    [parents, excludeCategoryId],
  )

  const showFieldError = (name: keyof CategoryFormInput) => {
    const touched = Boolean(touchedFields[name as keyof typeof touchedFields])
    if (!touched && !isSubmitted) return undefined
    return errors[name]?.message
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-name`}>
          {LABELS.categoryName}
          <RequiredMark />
        </Label>
        <Input
          id={`${idPrefix}-name`}
          error={Boolean(showFieldError('name'))}
          placeholder={LABELS.categoryName}
          {...register('name')}
        />
        <FieldError message={showFieldError('name')} />
      </div>

      <div className="space-y-2">
        <Label>{LABELS.parentCategory}</Label>
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
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-image`}>{LABELS.categoryImageUrl}</Label>
        <Input
          id={`${idPrefix}-image`}
          error={Boolean(showFieldError('imageUrl'))}
          placeholder={LABELS.categoryImageUrlPlaceholder}
          {...register('imageUrl')}
        />
        <FieldError message={showFieldError('imageUrl')} />
      </div>

      <div className="space-y-2">
        <Label>{LABELS.categoryStatus}</Label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CATEGORY_STATUS.ACTIVE}>{LABELS.categoryStatusActive}</SelectItem>
                <SelectItem value={CATEGORY_STATUS.ARCHIVED}>
                  {LABELS.categoryStatusArchived}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-seo-title`}>{LABELS.categorySeoTitle}</Label>
        <Input id={`${idPrefix}-seo-title`} {...register('seoTitle')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-seo-desc`}>{LABELS.categorySeoDescription}</Label>
        <Input id={`${idPrefix}-seo-desc`} {...register('seoDescription')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-commission`}>{LABELS.categoryCommissionRate}</Label>
        <Input
          id={`${idPrefix}-commission`}
          inputMode="decimal"
          placeholder="0–100"
          {...register('commissionRate')}
        />
        <p className="text-[0.75rem] text-ink-muted">{LABELS.categoryCommissionRateHint}</p>
        <FieldError message={showFieldError('commissionRate')} />
      </div>
    </div>
  )
}
