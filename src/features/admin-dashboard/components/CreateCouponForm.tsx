'use client'

import type { UseFormReturn } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import {
  CouponSchema,
  couponRequiresValue,
  type CouponFormInput,
} from '../schemas/coupons.schema'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { NumberInput } from '@/shared/components/NumberInput'
import { DateTimePicker } from '@/shared/components/DateTimePicker'
import { LABELS } from '@/shared/constants/labels'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { cn } from '@/shared/utils/cn'

const COUPON_TYPES: Array<{ value: CouponFormInput['type']; label: string }> = [
  { value: 'PERCENTAGE', label: LABELS.couponTypePercentage },
  { value: 'FLAT', label: LABELS.couponTypeFlat },
  { value: 'FREE_SHIPPING', label: LABELS.couponTypeFreeShipping },
  { value: 'BOGO', label: LABELS.couponTypeBogo },
  { value: 'TIERED', label: LABELS.couponTypeTiered },
  { value: 'CASHBACK', label: LABELS.couponTypeCashback },
  { value: 'BUNDLE', label: LABELS.couponTypeBundle },
]

interface CreateCouponFormProps {
  form: UseFormReturn<CouponFormInput>
  isPending: boolean
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

function couponDisableHint(values: CouponFormInput): string {
  if (!values.code?.trim()) return LABELS.enterCouponCode
  if (couponRequiresValue(values.type) && (values.value == null || Number.isNaN(values.value))) {
    return LABELS.enterCouponValue
  }
  if (!values.startDate) return LABELS.enterCouponStartDate
  if (!values.endDate) return LABELS.enterCouponEndDate
  const parsed = CouponSchema.safeParse(values)
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? LABELS.couponCreateHint
  }
  return LABELS.couponCreateHint
}

export function CreateCouponForm({ form, isPending }: CreateCouponFormProps) {
  const {
    register,
    control,
    watch,
    formState: { errors, touchedFields, isSubmitted },
  } = form

  const values = watch()
  const type = values.type
  const needsValue = couponRequiresValue(type)
  const canSubmit = CouponSchema.safeParse(values).success
  const disableHint = couponDisableHint(values)

  const showFieldError = (name: keyof CouponFormInput) => {
    const touched = Boolean(touchedFields[name as keyof typeof touchedFields])
    if (!touched && !isSubmitted) return undefined
    return errors[name]?.message
  }

  const fieldHasError = (name: keyof CouponFormInput) => Boolean(showFieldError(name))

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="coupon-code">
          {LABELS.couponCode}
          <RequiredMark />
        </Label>
        <Input
          id="coupon-code"
          error={fieldHasError('code')}
          placeholder={LABELS.couponCode}
          {...register('code')}
        />
        <FieldError message={showFieldError('code')} />
      </div>

      <div className="space-y-2">
        <Label>
          {LABELS.couponType}
          <RequiredMark />
        </Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={cn(fieldHasError('type') && 'border-danger')}>
                <SelectValue placeholder={LABELS.couponType} />
              </SelectTrigger>
              <SelectContent>
                {COUPON_TYPES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={showFieldError('type')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>
            {LABELS.couponValue}
            {needsValue ? <RequiredMark /> : null}
          </Label>
          <Controller
            name="value"
            control={control}
            render={({ field }) => (
              <NumberInput
                value={field.value}
                min={0}
                max={type === 'PERCENTAGE' ? 100 : undefined}
                step={1}
                suffix={type === 'PERCENTAGE' ? '%' : undefined}
                prefix={type === 'FLAT' || type === 'CASHBACK' ? '₹' : undefined}
                error={fieldHasError('value')}
                onChange={(value) => field.onChange(value)}
                onBlur={field.onBlur}
              />
            )}
          />
          <FieldError message={showFieldError('value')} />
        </div>
        <div className="space-y-2">
          <Label>{LABELS.maxDiscountCap}</Label>
          <Controller
            name="maxDiscountCap"
            control={control}
            render={({ field }) => (
              <NumberInput
                value={field.value}
                min={0}
                step={10}
                prefix="₹"
                error={fieldHasError('maxDiscountCap')}
                onChange={(value) => field.onChange(value)}
                onBlur={field.onBlur}
              />
            )}
          />
          <FieldError message={showFieldError('maxDiscountCap')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{LABELS.minOrderValue}</Label>
        <Controller
          name="minOrderValue"
          control={control}
          render={({ field }) => (
            <NumberInput
              value={field.value}
              min={0}
              step={50}
              prefix="₹"
              error={fieldHasError('minOrderValue')}
              onChange={(value) => field.onChange(value)}
              onBlur={field.onBlur}
            />
          )}
        />
        <FieldError message={showFieldError('minOrderValue')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>
            {LABELS.startDate}
            <RequiredMark />
          </Label>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                value={field.value}
                onChange={(iso) => {
                  field.onChange(iso)
                  field.onBlur()
                }}
                error={fieldHasError('startDate')}
              />
            )}
          />
          <FieldError message={showFieldError('startDate')} />
        </div>
        <div className="space-y-2">
          <Label>
            {LABELS.endDate}
            <RequiredMark />
          </Label>
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                value={field.value}
                onChange={(iso) => {
                  field.onChange(iso)
                  field.onBlur()
                }}
                error={fieldHasError('endDate')}
              />
            )}
          />
          <FieldError message={showFieldError('endDate')} />
        </div>
      </div>

      <DisabledActionHint disabled={!canSubmit} message={disableHint} className="w-full">
        <Button type="submit" className="w-full" loading={isPending} disabled={!canSubmit || isPending}>
          {LABELS.createCoupon}
        </Button>
      </DisabledActionHint>
    </div>
  )
}
