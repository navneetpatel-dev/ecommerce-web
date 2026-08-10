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
import { FormActions, FormFieldFrame, FormSection, FormStack } from '@/shared/components/forms'
import { LABELS } from '@/shared/constants/labels'
import { COUPON_USER_SEGMENT, DISCOUNT_BEARER } from '@/shared/constants/statuses'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { CouponScopeMultiSelect } from './CouponScopeMultiSelect'
import {
  InfiniteMultiSelect,
  type InfiniteMultiSelectPageQuery,
  type InfiniteMultiSelectPageResult,
} from '@/shared/components/InfiniteMultiSelect'
import { adminUsersApi } from '../api/users.api'
import { cn } from '@/shared/utils/cn'
import { useCallback } from 'react'

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

function couponDisableHint(values: CouponFormInput): string {
  if (!values.code?.trim()) return LABELS.enterCouponCode
  if (couponRequiresValue(values.type) && (values.value == null || Number.isNaN(values.value))) {
    return LABELS.enterCouponValue
  }
  if (!values.startDate) return LABELS.enterCouponStartDate
  if (!values.endDate) return LABELS.enterCouponEndDate
  if (values.type === 'BUNDLE' && (!values.bundleProductIds || values.bundleProductIds.length === 0)) {
    return LABELS.couponBundleProductsRequired
  }
  if (values.userRestrictionType === 'segment' && !values.userRestrictionSegment) {
    return LABELS.couponSegmentRequired
  }
  if (
    values.userRestrictionType === 'specific' &&
    (!values.userRestrictionUserIds || values.userRestrictionUserIds.length === 0)
  ) {
    return LABELS.couponSpecificUsersRequired
  }
  if (
    values.type !== 'BUNDLE' &&
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
  const isBundle = type === 'BUNDLE'
  const isTiered = type === 'TIERED'
  const showScopeIds =
    !isBundle &&
    (scopeType === 'product' || scopeType === 'category' || (!vendorMode && scopeType === 'vendor'))
  const showSegment = values.userRestrictionType === 'segment'
  const showSpecificUsers = values.userRestrictionType === 'specific'

  const fetchUsersPage = useCallback(
    async (query: InfiniteMultiSelectPageQuery): Promise<InfiniteMultiSelectPageResult> => {
      const result = await adminUsersApi.list({
        page: query.page,
        limit: query.limit,
        search: query.search,
      })
      return {
        items: result.items.map((user) => ({
          id: user.id,
          label: user.name ? `${user.name} (${user.email})` : user.email,
        })),
        page: result.page,
        totalPages: result.totalPages,
        total: result.total,
      }
    },
    [],
  )

  const showFieldError = (name: keyof CouponFormInput) => {
    const touched = Boolean(touchedFields[name as keyof typeof touchedFields])
    if (!touched && !isSubmitted) return undefined
    return errors[name]?.message
  }

  const fieldHasError = (name: keyof CouponFormInput) => Boolean(showFieldError(name))

  const availableScopeTypes = vendorMode
    ? SCOPE_TYPES.filter((option) => option.value !== 'all')
    : SCOPE_TYPES

  const availableUserRestrictions = vendorMode
    ? USER_RESTRICTIONS.filter((option) => option.value !== 'specific')
    : USER_RESTRICTIONS

  return (
    <FormStack>
      <FormSection title={LABELS.couponSectionBasics} columns={1}>
        {!hideCodeField ? (
          <FormFieldFrame
            label={LABELS.couponCode}
            htmlFor="coupon-code"
            required
            error={showFieldError('code')}
          >
            <Input
              id="coupon-code"
              error={fieldHasError('code')}
              placeholder={LABELS.couponCode}
              {...register('code')}
            />
          </FormFieldFrame>
        ) : null}

        <FormFieldFrame label={LABELS.couponType} required error={showFieldError('type')}>
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
        </FormFieldFrame>

        <FormFieldFrame
          label={LABELS.discountBearer}
          required
          error={showFieldError('discountBearer')}
        >
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
        </FormFieldFrame>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormFieldFrame label={LABELS.startDate} required error={showFieldError('startDate')}>
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
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.endDate} required error={showFieldError('endDate')}>
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
          </FormFieldFrame>
        </div>
      </FormSection>

      <FormSection title={LABELS.couponSectionValue} columns={1}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormFieldFrame
            label={LABELS.couponValue}
            required={needsValue}
            error={showFieldError('value')}
          >
            <Controller
              name="value"
              control={control}
              render={({ field }) => (
                <NumberInput
                  value={field.value ?? undefined}
                  min={0}
                  max={type === 'PERCENTAGE' || type === 'TIERED' ? 100 : undefined}
                  step={1}
                  suffix={type === 'PERCENTAGE' || type === 'TIERED' ? '%' : undefined}
                  prefix={
                    type === 'FLAT' || type === 'CASHBACK' || type === 'BUNDLE' ? '₹' : undefined
                  }
                  error={fieldHasError('value')}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                />
              )}
            />
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.maxDiscountCap} error={showFieldError('maxDiscountCap')}>
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
          </FormFieldFrame>
        </div>
        {isTiered ? (
          <div className="space-y-3">
            <p className="text-[0.8125rem] text-ink-muted">{LABELS.couponTierHint}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormFieldFrame label={LABELS.couponTier2Min}>
                <Controller
                  name="tier2MinSubtotal"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      value={field.value ?? undefined}
                      min={0}
                      step={50}
                      prefix="₹"
                      onChange={(value) => field.onChange(value)}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </FormFieldFrame>
              <FormFieldFrame label={LABELS.couponTier2Percent}>
                <Controller
                  name="tier2Percent"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      value={field.value ?? undefined}
                      min={0}
                      max={100}
                      step={1}
                      suffix="%"
                      onChange={(value) => field.onChange(value)}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </FormFieldFrame>
            </div>
          </div>
        ) : null}
      </FormSection>

      <FormSection title={LABELS.couponSectionScope} columns={1}>
        {vendorMode ? (
          <p className="text-[0.8125rem] text-ink-muted">{LABELS.couponVendorScopeLocked}</p>
        ) : null}
        {isBundle ? (
          <FormFieldFrame
            label={LABELS.selectBundleProducts}
            required
            error={showFieldError('bundleProductIds')}
          >
            <Controller
              name="bundleProductIds"
              control={control}
              render={({ field }) => (
                <CouponScopeMultiSelect
                  scopeType="product"
                  value={field.value ?? []}
                  onChange={field.onChange}
                  vendorId={vendorMode ? vendorId : null}
                  error={fieldHasError('bundleProductIds')}
                />
              )}
            />
          </FormFieldFrame>
        ) : (
          <>
            <FormFieldFrame
              label={LABELS.applicableScope}
              error={showFieldError('applicableScopeType')}
            >
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
            </FormFieldFrame>
            {showScopeIds ? (
              <FormFieldFrame
                label={scopePickerLabel(scopeType)}
                required
                error={showFieldError('applicableScopeIds')}
              >
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
              </FormFieldFrame>
            ) : null}
          </>
        )}
      </FormSection>

      <FormSection title={LABELS.couponSectionConstraints} columns={1}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormFieldFrame label={LABELS.minOrderValue} error={showFieldError('minOrderValue')}>
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
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.minQuantity} error={showFieldError('minQuantity')}>
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
          </FormFieldFrame>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormFieldFrame label={LABELS.usageLimitTotal} error={showFieldError('usageLimitTotal')}>
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
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.usageLimitPerUser}
            error={showFieldError('usageLimitPerUser')}
          >
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
          </FormFieldFrame>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormFieldFrame label={LABELS.priority} error={showFieldError('priority')}>
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
          </FormFieldFrame>
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
      </FormSection>

      <FormSection title={LABELS.couponSectionRestrictions} columns={1}>
        <FormFieldFrame
          label={LABELS.userRestriction}
          error={showFieldError('userRestrictionType')}
        >
          <Controller
            name="userRestrictionType"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ?? 'all'}
                onValueChange={(next) => {
                  field.onChange(next)
                  if (next !== 'segment') {
                    setValue('userRestrictionSegment', null)
                  }
                  if (next !== 'specific') {
                    setValue('userRestrictionUserIds', [])
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={LABELS.userRestriction} />
                </SelectTrigger>
                <SelectContent>
                  {availableUserRestrictions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormFieldFrame>
        {showSegment ? (
          <FormFieldFrame
            label={LABELS.userRestrictionSegment}
            required
            error={showFieldError('userRestrictionSegment')}
          >
            <Controller
              name="userRestrictionSegment"
              control={control}
              render={({ field }) => (
                <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={LABELS.userRestrictionSegment} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={COUPON_USER_SEGMENT.NEW}>
                      {LABELS.userRestrictionSegmentNew}
                    </SelectItem>
                    <SelectItem value={COUPON_USER_SEGMENT.RETURNING}>
                      {LABELS.userRestrictionSegmentReturning}
                    </SelectItem>
                    <SelectItem value={COUPON_USER_SEGMENT.LOYAL}>
                      {LABELS.userRestrictionSegmentLoyal}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormFieldFrame>
        ) : null}
        {showSpecificUsers ? (
          <FormFieldFrame
            label={LABELS.selectSpecificUsers}
            required
            error={showFieldError('userRestrictionUserIds')}
          >
            <Controller
              name="userRestrictionUserIds"
              control={control}
              render={({ field }) => (
                <InfiniteMultiSelect
                  value={field.value ?? []}
                  onChange={field.onChange}
                  fetchPage={fetchUsersPage}
                  resetKey="coupon-specific-users"
                  searchPlaceholder={LABELS.searchUsers}
                  emptyMessage={LABELS.noUsersFound}
                  error={fieldHasError('userRestrictionUserIds')}
                  idPrefix="coupon-specific-users"
                />
              )}
            />
          </FormFieldFrame>
        ) : null}
      </FormSection>

      {!hideSubmit ? (
        <FormActions>
          <DisabledActionHint disabled={!canSubmit} message={disableHint} className="w-full">
            <Button
              type="submit"
              className="w-full"
              loading={isPending}
              disabled={!canSubmit || isPending}
            >
              {submitLabel}
            </Button>
          </DisabledActionHint>
        </FormActions>
      ) : null}
    </FormStack>
  )
}
