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
}

export function AdminCategoryCreateForm({ form, isPending }: AdminCategoryCreateFormProps) {
  const values = form.watch()
  const canSubmit = CategoryFormSchema.safeParse(values).success

  return (
    <div className="space-y-4">
      <AdminCategoryFormFields form={form} idPrefix="category-create" />
      <DisabledActionHint disabled={!canSubmit || isPending} message={LABELS.enterCategoryName}>
        <Button type="submit" className="w-full sm:w-auto" disabled={!canSubmit || isPending}>
          {LABELS.createCategory}
        </Button>
      </DisabledActionHint>
    </div>
  )
}
