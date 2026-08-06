'use client'

import type { UseFormReturn } from 'react-hook-form'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { LABELS } from '@/shared/constants/labels'
import { AdminCategoryCreateForm } from './AdminCategoryCreateForm'
import type { CategoryFormInput } from '../schemas/categories.schema'

interface CategoriesPageHeaderProps {
  open: boolean
  setOpen: (open: boolean) => void
  form: UseFormReturn<CategoryFormInput>
  onSubmit: (data: CategoryFormInput) => void
  isPending: boolean
}

export function CategoriesPageHeader({
  open,
  setOpen,
  form,
  onSubmit,
  isPending,
}: CategoriesPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0 space-y-1">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {LABELS.categories}
        </h2>
        <p className="max-w-xl text-[0.875rem] text-ink-muted">{LABELS.createCategoryHint}</p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="shrink-0">
            <Plus className="h-4 w-4" />
            {LABELS.createCategory}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{LABELS.createCategory}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(onSubmit, () => {
              void form.trigger()
            })}
            className="space-y-1"
          >
            <AdminCategoryCreateForm form={form} isPending={isPending} />
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
