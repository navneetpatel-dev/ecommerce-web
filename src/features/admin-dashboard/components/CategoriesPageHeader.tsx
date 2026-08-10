'use client'

import type { ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { ButtonGroup } from '@/shared/components/ui/button-group'
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
  error?: string | null
  toolbar?: ReactNode
}

export function CategoriesPageHeader({
  open,
  setOpen,
  form,
  onSubmit,
  isPending,
  error = null,
  toolbar,
}: CategoriesPageHeaderProps) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0 space-y-1">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {LABELS.categories}
        </h2>
        <p className="max-w-xl text-[0.875rem] text-ink-muted">{LABELS.createCategoryHint}</p>
      </div>
      <ButtonGroup className="sm:shrink-0">
        {toolbar}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" size="sm" fullWidth="mobile">
              <Plus aria-hidden />
              {LABELS.createCategory}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[min(92vh,48rem)] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{LABELS.createCategory}</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(onSubmit, () => {
                void form.trigger()
              })}
              className="space-y-1"
            >
              <AdminCategoryCreateForm form={form} isPending={isPending} error={error} />
            </form>
          </DialogContent>
        </Dialog>
      </ButtonGroup>
    </div>
  )
}
