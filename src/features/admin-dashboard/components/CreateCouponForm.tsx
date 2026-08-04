import type { UseFormRegister } from 'react-hook-form'
import type { CouponFormInput } from '../schemas/coupons.schema'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'

interface CreateCouponFormProps {
  register: UseFormRegister<CouponFormInput>
  isPending: boolean
}

export function CreateCouponForm({ register, isPending }: CreateCouponFormProps) {
  return (
    <>
      <div><Label>Code</Label><Input {...register('code')} /></div>
      <div>
        <Label>Type</Label>
        <select className="w-full h-9 rounded-md border border-line bg-surface px-3 text-sm" {...register('type')}>
          <option value="PERCENTAGE">Percentage</option>
          <option value="FLAT">Flat Amount</option>
          <option value="FREE_SHIPPING">Free Shipping</option>
          <option value="BOGO">Buy One Get One</option>
          <option value="TIERED">Tiered</option>
          <option value="CASHBACK">Cashback</option>
          <option value="BUNDLE">Bundle</option>
        </select>
      </div>
      <div><Label>Value</Label><Input type="number" {...register('value', { valueAsNumber: true })} /></div>
      <div><Label>Max Discount Cap</Label><Input type="number" {...register('maxDiscountCap', { valueAsNumber: true })} /></div>
      <div><Label>Min Order Value</Label><Input type="number" {...register('minOrderValue', { valueAsNumber: true })} /></div>
      <div><Label>Start Date</Label><Input type="datetime-local" {...register('startDate')} /></div>
      <div><Label>End Date</Label><Input type="datetime-local" {...register('endDate')} /></div>
      <Button type="submit" className="w-full" loading={isPending}>Create</Button>
    </>
  )
}
