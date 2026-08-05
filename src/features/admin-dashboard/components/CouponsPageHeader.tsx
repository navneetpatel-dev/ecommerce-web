import { UseFormReturn } from 'react-hook-form'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { Plus } from 'lucide-react'
import { CreateCouponForm } from './CreateCouponForm'

interface CouponsPageHeaderProps {
  open: boolean
  setOpen: (open: boolean) => void
  form: UseFormReturn<any>
  onSubmit: (data: any) => void
  isPending: boolean
}

export function CouponsPageHeader({ open, setOpen, form, onSubmit, isPending }: CouponsPageHeaderProps) {
  const { register, handleSubmit } = form

  return (
    <div className="flex items-center justify-between">
      <h2 className="font-display text-[1.375rem] font-semibold text-ink">Coupons</h2>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="h-4 w-4" /> Create Coupon
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Coupon</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <CreateCouponForm register={register} isPending={isPending} />
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
