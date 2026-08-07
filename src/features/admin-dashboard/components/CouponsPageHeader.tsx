'use client'

import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { NumberInput } from '@/shared/components/NumberInput'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { DataTable, type DataTableColumn } from '@/shared/components/DataTable'
import { Plus, Layers } from 'lucide-react'
import { CreateCouponForm } from './CreateCouponForm'
import { adminApi } from '../api/admin.api'
import {
  CouponSchema,
  COUPON_FORM_DEFAULTS,
  toCouponCreateBody,
  type CouponFormInput,
} from '../schemas/coupons.schema'
import { LABELS } from '@/shared/constants/labels'
import { formatDateTime } from '@/shared/utils/formatDate'
import type { CouponBatch } from '@/shared/api/types'
import { z } from 'zod'

const BulkFormSchema = z.object({
  name: z.string().trim().min(1, LABELS.couponBatchNameRequired),
  count: z
    .number({ message: LABELS.couponBulkCountInvalid })
    .int()
    .min(1, LABELS.couponBulkCountInvalid)
    .max(500, LABELS.couponBulkCountInvalid),
  prefix: z.string().trim().max(8).optional(),
})

type BulkMetaInput = z.infer<typeof BulkFormSchema>

interface CouponsPageHeaderProps {
  open: boolean
  setOpen: (open: boolean) => void
  form: UseFormReturn<CouponFormInput>
  onSubmit: (data: CouponFormInput) => void
  isPending: boolean
}

export function CouponsPageHeader({ open, setOpen, form, onSubmit, isPending }: CouponsPageHeaderProps) {
  const queryClient = useQueryClient()
  const [bulkOpen, setBulkOpen] = useState(false)

  const templateForm = useForm<CouponFormInput>({
    resolver: zodResolver(CouponSchema),
    mode: 'onTouched',
    defaultValues: { ...COUPON_FORM_DEFAULTS, code: 'BULK' },
  })

  const bulkMetaForm = useForm<BulkMetaInput>({
    resolver: zodResolver(BulkFormSchema),
    defaultValues: { name: '', count: 10, prefix: 'CS' },
  })

  const batchesQuery = useQuery({
    queryKey: ['admin', 'coupon-batches'],
    queryFn: () => adminApi.couponBatches(),
  })

  const bulkMutation = useMutation({
    mutationFn: async () => {
      const metaValid = await bulkMetaForm.trigger()
      const templateValid = await templateForm.trigger()
      if (!metaValid || !templateValid) throw new Error('validation')
      const meta = bulkMetaForm.getValues()
      const template = templateForm.getValues()
      const { code: _code, ...templateFields } = toCouponCreateBody(template)
      return adminApi.bulkGenerateCoupons({
        name: meta.name,
        count: meta.count,
        prefix: meta.prefix || undefined,
        template: templateFields,
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'coupon-batches'] })
      bulkMetaForm.reset({ name: '', count: 10, prefix: 'CS' })
      templateForm.reset({ ...COUPON_FORM_DEFAULTS, code: 'BULK' })
      setBulkOpen(false)
    },
  })

  const batchColumns: DataTableColumn<CouponBatch>[] = [
    { id: 'name', header: LABELS.bulkBatchName, accessor: 'name' },
    {
      id: 'count',
      header: LABELS.batchGeneratedCount,
      cell: (row) => row.generatedCount,
    },
    {
      id: 'created',
      header: LABELS.startDate,
      cell: (row) => formatDateTime(row.createdAt),
    },
  ]

  const bulkMeta = bulkMetaForm.watch()
  const canBulk =
    BulkFormSchema.safeParse(bulkMeta).success &&
    CouponSchema.safeParse(templateForm.watch()).success

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[1.25rem] font-semibold text-ink sm:text-[1.375rem]">{LABELS.coupons}</h2>
        <div className="flex flex-wrap gap-2">
          <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="shrink-0">
                <Layers className="h-4 w-4" /> {LABELS.bulkGenerate}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{LABELS.bulkGenerateTitle}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="bulk-name">{LABELS.bulkBatchName}</Label>
                    <Input id="bulk-name" {...bulkMetaForm.register('name')} />
                  </div>
                  <div className="space-y-2">
                    <Label>{LABELS.bulkCount}</Label>
                    <Controller
                      name="count"
                      control={bulkMetaForm.control}
                      render={({ field }) => (
                        <NumberInput
                          value={field.value}
                          min={1}
                          max={500}
                          step={1}
                          onChange={(value) => field.onChange(value ?? 1)}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bulk-prefix">{LABELS.bulkPrefix}</Label>
                    <Input id="bulk-prefix" {...bulkMetaForm.register('prefix')} />
                  </div>
                </div>
                <CreateCouponForm
                  form={templateForm}
                  isPending={false}
                  hideSubmit
                  hideCodeField
                />
                <DisabledActionHint
                  disabled={!canBulk}
                  message={LABELS.bulkGenerateHint}
                  className="w-full"
                >
                  <Button
                    type="button"
                    className="w-full"
                    loading={bulkMutation.isPending}
                    disabled={!canBulk || bulkMutation.isPending}
                    onClick={() => bulkMutation.mutate()}
                  >
                    {LABELS.bulkGenerate}
                  </Button>
                </DisabledActionHint>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="shrink-0">
                <Plus className="h-4 w-4" /> {LABELS.createCoupon}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{LABELS.createCoupon}</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={form.handleSubmit(onSubmit, () => {
                  void form.trigger()
                })}
                className="space-y-1"
              >
                <CreateCouponForm form={form} isPending={isPending} />
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="text-[1rem] font-semibold text-ink">{LABELS.couponBatches}</h3>
        <DataTable
          columns={batchColumns}
          rows={batchesQuery.data ?? []}
          loading={batchesQuery.isLoading}
          emptyMessage={LABELS.noCouponBatches}
          getRowId={(row) => row.id}
        />
      </section>
    </div>
  )
}
