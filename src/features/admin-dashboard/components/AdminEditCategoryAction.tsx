'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { LABELS } from '@/shared/constants/labels'
import { CATEGORY_STATUS, type CategoryStatus } from '@/shared/constants/statuses'
import { cn } from '@/shared/utils/cn'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import { adminActionTone } from '../utils/adminActionTone'
import {
  CategoryFormSchema,
  toCategoryUpdateBody,
  type CategoryFormInput,
} from '../schemas/categories.schema'
import { AdminCategoryFormFields } from './AdminCategoryFormFields'
import { categoriesApi } from '@/features/categories/api/categories.api'

interface AdminEditCategoryActionProps {
  category: {
    id: string
    name: string
    parentId?: string | null
    imageUrl?: string | null
    status?: string | null
    seoTitle?: string | null
    seoDescription?: string | null
    commissionRate?: number | null
  }
  onSaved: () => void
}

export function AdminEditCategoryAction({ category, onSaved }: AdminEditCategoryActionProps) {
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CategoryFormInput>({
    resolver: zodResolver(CategoryFormSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      name: category.name,
      parentId: category.parentId ?? '',
      imageUrl: category.imageUrl ?? '',
      status:
        category.status === CATEGORY_STATUS.ARCHIVED
          ? CATEGORY_STATUS.ARCHIVED
          : CATEGORY_STATUS.ACTIVE,
      seoTitle: '',
      seoDescription: '',
      commissionRate: '',
    },
  })

  const values = form.watch()
  const canSubmit = CategoryFormSchema.safeParse(values).success

  const openEditor = () => {
    setError(null)
    form.reset({
      name: category.name,
      parentId: category.parentId ?? '',
      imageUrl: category.imageUrl ?? '',
      status: (category.status as CategoryStatus) || CATEGORY_STATUS.ACTIVE,
      seoTitle: category.seoTitle ?? '',
      seoDescription: category.seoDescription ?? '',
      commissionRate:
        category.commissionRate != null && category.commissionRate !== undefined
          ? String(category.commissionRate)
          : '',
    })
    setOpen(true)
  }

  const onSubmit = form.handleSubmit(async (data) => {
    setIsPending(true)
    setError(null)
    try {
      await categoriesApi.update(category.id, toCategoryUpdateBody(data))
      setOpen(false)
      onSaved()
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadData))
    } finally {
      setIsPending(false)
    }
  })

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className={cn('shrink-0 overflow-visible', adminActionTone.edit)}
        disabled={isPending}
        onClick={openEditor}
      >
        <Pencil strokeWidth={2.25} aria-hidden />
        <span>{LABELS.edit}</span>
      </Button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) {
            setError(null)
            form.clearErrors()
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{LABELS.editCategoryTitle}</DialogTitle>
          </DialogHeader>
          <p className="text-[0.875rem] text-ink-muted">{LABELS.editCategoryBody}</p>
          <form onSubmit={onSubmit} className="space-y-4">
            <AdminCategoryFormFields
              form={form}
              excludeCategoryId={category.id}
              idPrefix={`category-edit-${category.id}`}
            />
            {error ? <p className="text-[0.8125rem] text-danger">{error}</p> : null}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={isPending}>
                {LABELS.cancel}
              </Button>
              <DisabledActionHint disabled={!canSubmit || isPending} message={LABELS.enterCategoryNameToSave}>
                <Button type="submit" disabled={!canSubmit || isPending}>
                  {LABELS.save}
                </Button>
              </DisabledActionHint>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
