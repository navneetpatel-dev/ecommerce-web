import type { UseFormReturn } from 'react-hook-form'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { Plus } from 'lucide-react'
import { CreateCouponForm } from './CreateCouponForm'
import type { CouponFormInput } from '../schemas/coupons.schema'
import { LABELS } from '@/shared/constants/labels'

interface CouponsPageHeaderProps {
  open: boolean
  setOpen: (open: boolean) => void
  form: UseFormReturn<CouponFormInput>
  onSubmit: (data: CouponFormInput) => void
  isPending: boolean
}

export function CouponsPageHeader({ open, setOpen, form, onSubmit, isPending }: CouponsPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-[1.25rem] font-semibold text-ink sm:text-[1.375rem]">{LABELS.coupons}</h2>
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
  )
}
