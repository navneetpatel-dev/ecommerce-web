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
import { Switch } from '@/shared/components/ui/switch'
import { NumberInput } from '@/shared/components/NumberInput'
import { DateTimePicker } from '@/shared/components/DateTimePicker'
import { LABELS } from '@/shared/constants/labels'
import { DISCOUNT_BEARER } from '@/shared/constants/statuses'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { CouponScopeMultiSelect } from './CouponScopeMultiSelect'
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

const SCOPE_TYPES: Array<{ value: CouponFormInput['applicableScopeType']; label: string }> = [
  { value: 'all', label: LABELS.scopeTypeAll },
  { value: 'vendor', label: LABELS.scopeTypeVendor },
  { value: 'product', label: LABELS.scopeTypeProduct },
  { value: 'category', label: LABELS.scopeTypeCategory },
]

const USER_RESTRICTIONS: Array<{
  value: NonNullable<CouponFormInput['userRestrictionType']>
  label: string
}> = [
  { value: 'all', label: LABELS.userRestrictionAll },
  { value: 'firstOrder', label: LABELS.userRestrictionFirstOrder },
  { value: 'specific', label: LABELS.userRestrictionSpecific },
  { value: 'segment', label: LABELS.userRestrictionSegment },
]

interface CreateCouponFormProps {
  form: UseFormReturn<CouponFormInput>
  isPending: boolean
  /** When true, discountBearer is fixed to VENDOR and scope cannot be platform-wide. */
  vendorMode?: boolean
  /** Required in vendorMode so vendor-scoped coupons keep the locked vendor id. */
  vendorId?: string | null
  submitLabel?: string
  /** Hide the submit button (e.g. when parent owns submit). */
  hideSubmit?: boolean
  /** Hide the coupon code field (bulk template). */
  hideCodeField?: boolean
}

function scopePickerLabel(scopeType: CouponFormInput['applicableScopeType']) {
  if (scopeType === 'category') return LABELS.selectScopeCategories
  if (scopeType === 'product') return LABELS.selectScopeProducts
  return LABELS.selectScopeVendors
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 border-t border-line pt-4 first:border-t-0 first:pt-0">
      <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-ink-muted">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function couponDisableHint(values: CouponFormInput): string {
  if (!values.code?.trim()) return LABELS.enterCouponCode
  if (couponRequiresValue(values.type) && (values.value == null || Number.isNaN(values.value))) {
    return LABELS.enterCouponValue
  }
  if (!values.startDate) return LABELS.enterCouponStartDate
  if (!values.endDate) return LABELS.enterCouponEndDate
  if (
    values.applicableScopeType !== 'all' &&
    (!values.applicableScopeIds || values.applicableScopeIds.length === 0)
  ) {
    return LABELS.enterCouponScopeIds
  }
  const parsed = CouponSchema.safeParse(values)
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? LABELS.couponCreateHint
  }
  return LABELS.couponCreateHint
}

export function CreateCouponForm({
  form,
  isPending,
  vendorMode = false,
  vendorId = null,
  submitLabel = LABELS.createCoupon,
  hideSubmit = false,
  hideCodeField = false,
}: CreateCouponFormProps) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors, touchedFields, isSubmitted },
  } = form

  const values = watch()
  const type = values.type
  const needsValue = couponRequiresValue(type)
  const canSubmit = CouponSchema.safeParse(values).success
  const disableHint = couponDisableHint(values)
  const scopeType = values.applicableScopeType
  const showScopeIds = scopeType === 'product' || scopeType === 'category' || (!vendorMode && scopeType === 'vendor')

  const showFieldError = (name: keyof CouponFormInput) => {
    const touched = Boolean(touchedFields[name as keyof typeof touchedFields])
    if (!touched && !isSubmitted) return undefined
    return errors[name]?.message
  }

  const fieldHasError = (name: keyof CouponFormInput) => Boolean(showFieldError(name))

  const availableScopeTypes = vendorMode
    ? SCOPE_TYPES.filter((option) => option.value !== 'all')
    : SCOPE_TYPES

  return (
    <div className="space-y-1">
      <Section title={LABELS.couponSectionBasics}>
        {!hideCodeField ? (
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
        ) : null}

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

        <div className="space-y-2">
          <Label>
            {LABELS.discountBearer}
            <RequiredMark />
          </Label>
          {vendorMode ? (
            <Input value={LABELS.discountBearerVendor} disabled readOnly />
          ) : (
            <Controller
              name="discountBearer"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={cn(fieldHasError('discountBearer') && 'border-danger')}>
                    <SelectValue placeholder={LABELS.discountBearer} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DISCOUNT_BEARER.PLATFORM}>
                      {LABELS.discountBearerPlatform}
                    </SelectItem>
                    <SelectItem value={DISCOUNT_BEARER.VENDOR}>
                      {LABELS.discountBearerVendor}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          )}
          <FieldError message={showFieldError('discountBearer')} />
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
      </Section>

      <Section title={LABELS.couponSectionValue}>
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
                  value={field.value ?? undefined}
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
                  value={field.value ?? undefined}
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
      </Section>

      <Section title={LABELS.couponSectionScope}>
        {vendorMode ? (
          <p className="text-[0.8125rem] text-ink-muted">{LABELS.couponVendorScopeLocked}</p>
        ) : null}
        <div className="space-y-2">
          <Label>{LABELS.applicableScope}</Label>
          <Controller
            name="applicableScopeType"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(next) => {
                  field.onChange(next)
                  if (next === 'all') {
                    setValue('applicableScopeIds', [], { shouldValidate: true })
                    return
                  }
                  if (vendorMode && next === 'vendor' && vendorId) {
                    setValue('applicableScopeIds', [vendorId], { shouldValidate: true })
                    return
                  }
                  setValue('applicableScopeIds', [], { shouldValidate: true })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={LABELS.applicableScope} />
                </SelectTrigger>
                <SelectContent>
                  {availableScopeTypes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={showFieldError('applicableScopeType')} />
        </div>
        {showScopeIds ? (
          <div className="space-y-2">
            <Label>
              {scopePickerLabel(scopeType)}
              <RequiredMark />
            </Label>
            <Controller
              name="applicableScopeIds"
              control={control}
              render={({ field }) => (
                <CouponScopeMultiSelect
                  scopeType={scopeType as 'vendor' | 'product' | 'category'}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  vendorId={vendorMode ? vendorId : null}
                  error={fieldHasError('applicableScopeIds')}
                />
              )}
            />
            <FieldError message={showFieldError('applicableScopeIds')} />
          </div>
        ) : null}
      </Section>

      <Section title={LABELS.couponSectionConstraints}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{LABELS.minOrderValue}</Label>
            <Controller
              name="minOrderValue"
              control={control}
              render={({ field }) => (
                <NumberInput
                  value={field.value ?? undefined}
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
          <div className="space-y-2">
            <Label>{LABELS.minQuantity}</Label>
            <Controller
              name="minQuantity"
              control={control}
              render={({ field }) => (
                <NumberInput
                  value={field.value ?? undefined}
                  min={0}
                  step={1}
                  error={fieldHasError('minQuantity')}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                />
              )}
            />
            <FieldError message={showFieldError('minQuantity')} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{LABELS.usageLimitTotal}</Label>
            <Controller
              name="usageLimitTotal"
              control={control}
              render={({ field }) => (
                <NumberInput
                  value={field.value ?? undefined}
                  min={1}
                  step={1}
                  error={fieldHasError('usageLimitTotal')}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                />
              )}
            />
            <FieldError message={showFieldError('usageLimitTotal')} />
          </div>
          <div className="space-y-2">
            <Label>{LABELS.usageLimitPerUser}</Label>
            <Controller
              name="usageLimitPerUser"
              control={control}
              render={({ field }) => (
                <NumberInput
                  value={field.value ?? undefined}
                  min={1}
                  step={1}
                  error={fieldHasError('usageLimitPerUser')}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                />
              )}
            />
            <FieldError message={showFieldError('usageLimitPerUser')} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{LABELS.priority}</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <NumberInput
                  value={field.value ?? 0}
                  step={1}
                  error={fieldHasError('priority')}
                  onChange={(value) => field.onChange(value ?? 0)}
                  onBlur={field.onBlur}
                />
              )}
            />
            <FieldError message={showFieldError('priority')} />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-sm border border-line px-3 py-2">
            <Label htmlFor="coupon-stackable">{LABELS.stackable}</Label>
            <Controller
              name="stackable"
              control={control}
              render={({ field }) => (
                <Switch
                  id="coupon-stackable"
                  checked={Boolean(field.value)}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </Section>

      <Section title={LABELS.couponSectionRestrictions}>
        <div className="space-y-2">
          <Label>{LABELS.userRestriction}</Label>
          <Controller
            name="userRestrictionType"
            control={control}
            render={({ field }) => (
              <Select value={field.value ?? 'all'} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder={LABELS.userRestriction} />
                </SelectTrigger>
                <SelectContent>
                  {USER_RESTRICTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={showFieldError('userRestrictionType')} />
        </div>
      </Section>

      {!hideSubmit ? (
        <DisabledActionHint disabled={!canSubmit} message={disableHint} className="w-full pt-2">
          <Button type="submit" className="w-full" loading={isPending} disabled={!canSubmit || isPending}>
            {submitLabel}
          </Button>
        </DisabledActionHint>
      ) : null}
    </div>
  )
}
