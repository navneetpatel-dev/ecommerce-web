import { z } from 'zod'
import { LABELS } from '@/shared/constants/labels'
import {
  DISCOUNT_BEARER,
  DISCOUNT_BEARER_VALUES,
  COUPON_USER_SEGMENT_VALUES,
} from '@/shared/constants/statuses'

const COUPON_TYPES = [
  'PERCENTAGE',
  'FLAT',
  'FREE_SHIPPING',
  'BOGO',
  'TIERED',
  'CASHBACK',
  'BUNDLE',
] as const

const SCOPE_TYPES = ['all', 'vendor', 'product', 'category'] as const
const USER_RESTRICTION_TYPES = ['all', 'firstOrder', 'specific', 'segment'] as const

const TYPES_REQUIRING_VALUE = new Set<(typeof COUPON_TYPES)[number]>([
  'PERCENTAGE',
  'FLAT',
  'CASHBACK',
  'BUNDLE',
])

const optionalNonNegative = (message: string) =>
  z.number().nonnegative(message).optional().nullable()

const CouponObjectSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, LABELS.couponCodeRequired)
    .max(64, LABELS.couponCodeTooLong),
  type: z.enum(COUPON_TYPES, { message: LABELS.couponTypeRequired }),
  value: optionalNonNegative(LABELS.couponValueNegative),
  maxDiscountCap: optionalNonNegative(LABELS.couponMaxDiscountNegative),
  minOrderValue: optionalNonNegative(LABELS.couponMinOrderNegative),
  minQuantity: z.number().int().nonnegative().optional().nullable(),
  applicableScopeType: z.enum(SCOPE_TYPES, { message: LABELS.couponScopeTypeRequired }),
  applicableScopeIds: z.array(z.string().uuid()),
  userRestrictionType: z.enum(USER_RESTRICTION_TYPES).optional(),
  userRestrictionSegment: z.enum(COUPON_USER_SEGMENT_VALUES).optional().nullable(),
  userRestrictionUserIds: z.array(z.string().uuid()).optional(),
  bundleProductIds: z.array(z.string().uuid()).optional(),
  tier2MinSubtotal: optionalNonNegative(LABELS.couponMinOrderNegative),
  tier2Percent: optionalNonNegative(LABELS.couponValueNegative),
  usageLimitTotal: z.number().int().positive().optional().nullable(),
  usageLimitPerUser: z.number().int().positive().optional().nullable(),
  stackable: z.boolean().optional(),
  priority: z.number().int().optional(),
  discountBearer: z.enum(DISCOUNT_BEARER_VALUES, { message: LABELS.couponBearerRequired }),
  startDate: z
    .string()
    .min(1, LABELS.couponStartDateRequired)
    .refine((v) => !Number.isNaN(Date.parse(v)), LABELS.couponStartDateInvalid),
  endDate: z
    .string()
    .min(1, LABELS.couponEndDateRequired)
    .refine((v) => !Number.isNaN(Date.parse(v)), LABELS.couponEndDateInvalid),
})

function refineCouponValueAndDates(
  data: {
    type: (typeof COUPON_TYPES)[number]
    value?: number | null
    startDate: string
    endDate: string
    applicableScopeType: (typeof SCOPE_TYPES)[number]
    applicableScopeIds: string[]
    userRestrictionType?: (typeof USER_RESTRICTION_TYPES)[number]
    userRestrictionSegment?: string | null
    userRestrictionUserIds?: string[]
    bundleProductIds?: string[]
    tier2MinSubtotal?: number | null
    tier2Percent?: number | null
  },
  ctx: z.RefinementCtx,
) {
  if (TYPES_REQUIRING_VALUE.has(data.type) && (data.value == null || Number.isNaN(data.value))) {
    ctx.addIssue({
      code: 'custom',
      path: ['value'],
      message: LABELS.couponValueRequired,
    })
  }

  if (
    (data.type === 'PERCENTAGE' || data.type === 'TIERED') &&
    data.value != null &&
    data.value > 100
  ) {
    ctx.addIssue({
      code: 'custom',
      path: ['value'],
      message: LABELS.couponPercentageMax,
    })
  }

  if (data.type === 'TIERED' && (data.value == null || Number.isNaN(data.value))) {
    ctx.addIssue({
      code: 'custom',
      path: ['value'],
      message: LABELS.couponValueRequired,
    })
  }

  if (data.type === 'BUNDLE' && (!data.bundleProductIds || data.bundleProductIds.length === 0)) {
    ctx.addIssue({
      code: 'custom',
      path: ['bundleProductIds'],
      message: LABELS.couponBundleProductsRequired,
    })
  }

  if (data.userRestrictionType === 'segment' && !data.userRestrictionSegment) {
    ctx.addIssue({
      code: 'custom',
      path: ['userRestrictionSegment'],
      message: LABELS.couponSegmentRequired,
    })
  }

  if (
    data.userRestrictionType === 'specific' &&
    (!data.userRestrictionUserIds || data.userRestrictionUserIds.length === 0)
  ) {
    ctx.addIssue({
      code: 'custom',
      path: ['userRestrictionUserIds'],
      message: LABELS.couponSpecificUsersRequired,
    })
  }

  const start = Date.parse(data.startDate)
  const end = Date.parse(data.endDate)
  if (!Number.isNaN(start) && !Number.isNaN(end) && end <= start) {
    ctx.addIssue({
      code: 'custom',
      path: ['endDate'],
      message: LABELS.couponEndAfterStart,
    })
  }

  if (
    data.applicableScopeType !== 'all' &&
    data.type !== 'BUNDLE' &&
    (!data.applicableScopeIds || data.applicableScopeIds.length === 0)
  ) {
    ctx.addIssue({
      code: 'custom',
      path: ['applicableScopeIds'],
      message: LABELS.couponScopeIdsRequired,
    })
  }
}

/** Keep in sync with backend CreateCouponSchema. */
export const CouponSchema = CouponObjectSchema.superRefine(refineCouponValueAndDates)

export type CouponFormInput = z.infer<typeof CouponSchema>

export const COUPON_FORM_DEFAULTS: CouponFormInput = {
  code: '',
  type: 'PERCENTAGE',
  value: null,
  maxDiscountCap: null,
  minOrderValue: null,
  minQuantity: null,
  applicableScopeType: 'all',
  applicableScopeIds: [],
  userRestrictionType: 'all',
  userRestrictionSegment: null,
  userRestrictionUserIds: [],
  bundleProductIds: [],
  tier2MinSubtotal: null,
  tier2Percent: null,
  usageLimitTotal: null,
  usageLimitPerUser: null,
  stackable: false,
  priority: 0,
  discountBearer: DISCOUNT_BEARER.PLATFORM,
  startDate: '',
  endDate: '',
}

export const VENDOR_COUPON_FORM_DEFAULTS: CouponFormInput = {
  ...COUPON_FORM_DEFAULTS,
  applicableScopeType: 'vendor',
  discountBearer: DISCOUNT_BEARER.VENDOR,
}

export function couponRequiresValue(type: CouponFormInput['type'] | undefined) {
  return type != null && (TYPES_REQUIRING_VALUE.has(type) || type === 'TIERED')
}

export function toCouponCreateBody(values: CouponFormInput, opts?: { forceVendorId?: string }) {
  const isBundle = values.type === 'BUNDLE'
  const scopeType = isBundle
    ? 'product'
    : opts?.forceVendorId
      ? values.applicableScopeType === 'product' || values.applicableScopeType === 'category'
        ? values.applicableScopeType
        : 'vendor'
      : values.applicableScopeType

  const scopeIds = isBundle
    ? values.bundleProductIds ?? []
    : opts?.forceVendorId
      ? scopeType === 'vendor'
        ? [opts.forceVendorId]
        : values.applicableScopeIds
      : values.applicableScopeIds

  const tiers = [
    {
      minSubtotal: Number(values.minOrderValue ?? 0),
      percent: Number(values.value ?? 0),
    },
  ]
  if (
    values.type === 'TIERED' &&
    values.tier2MinSubtotal != null &&
    values.tier2Percent != null &&
    values.tier2Percent > 0
  ) {
    tiers.push({
      minSubtotal: Number(values.tier2MinSubtotal),
      percent: Number(values.tier2Percent),
    })
  }

  const config =
    values.type === 'TIERED'
      ? { tiers }
      : values.type === 'BUNDLE'
        ? { bundleProductIds: values.bundleProductIds ?? [] }
        : {}

  const userRestriction =
    values.userRestrictionType === 'segment'
      ? { type: 'segment' as const, value: values.userRestrictionSegment ?? undefined }
      : values.userRestrictionType === 'specific'
        ? { type: 'specific' as const, value: values.userRestrictionUserIds ?? [] }
        : values.userRestrictionType
          ? { type: values.userRestrictionType }
          : undefined

  return {
    code: values.code.trim(),
    type: values.type,
    value: values.value ?? null,
    maxDiscountCap: values.maxDiscountCap ?? null,
    minOrderValue: values.minOrderValue ?? null,
    minQuantity: values.minQuantity ?? null,
    applicableScope: {
      type: scopeType,
      ids: scopeIds,
    },
    userRestriction,
    config,
    usageLimitTotal: values.usageLimitTotal ?? null,
    usageLimitPerUser: values.usageLimitPerUser ?? null,
    stackable: values.stackable ?? false,
    priority: values.priority ?? 0,
    discountBearer: opts?.forceVendorId ? DISCOUNT_BEARER.VENDOR : values.discountBearer,
    startDate: values.startDate,
    endDate: values.endDate,
    ...(opts?.forceVendorId ? { vendorId: opts.forceVendorId } : {}),
  }
}

export const BulkCouponSchema = z.object({
  name: z.string().trim().min(1, LABELS.couponBatchNameRequired).max(120),
  count: z
    .number({ message: LABELS.couponBulkCountInvalid })
    .int()
    .min(1, LABELS.couponBulkCountInvalid)
    .max(500, LABELS.couponBulkCountInvalid),
  prefix: z.string().trim().max(8).optional(),
  template: CouponObjectSchema.omit({ code: true }).superRefine(refineCouponValueAndDates),
})

export type BulkCouponFormInput = z.infer<typeof BulkCouponSchema>
