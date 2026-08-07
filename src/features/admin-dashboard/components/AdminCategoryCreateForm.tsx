'use client'

import type { UseFormReturn } from 'react-hook-form'
import { CategoryFormSchema, type CategoryFormInput } from '../schemas/categories.schema'
import { Button } from '@/shared/components/ui/button'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { LABELS } from '@/shared/constants/labels'
import { AdminCategoryFormFields } from './AdminCategoryFormFields'

interface AdminCategoryCreateFormProps {
  form: UseFormReturn<CategoryFormInput>
  isPending: boolean
  error?: string | null
}

export function AdminCategoryCreateForm({
  form,
  isPending,
  error = null,
}: AdminCategoryCreateFormProps) {
  const values = form.watch()
  const canSubmit = CategoryFormSchema.safeParse(values).success

  return (
    <div className="space-y-4">
      <AdminCategoryFormFields form={form} idPrefix="category-create" />
      {error ? <p className="text-[0.8125rem] text-danger">{error}</p> : null}
      <DisabledActionHint disabled={!canSubmit || isPending} message={LABELS.enterCategoryName}>
        <Button type="submit" className="w-full sm:w-auto" disabled={!canSubmit || isPending}>
          {LABELS.createCategory}
        </Button>
      </DisabledActionHint>
    </div>
  )
}
