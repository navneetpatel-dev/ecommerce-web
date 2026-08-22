import { z } from "zod";
import { LABELS } from "@/shared/constants/labels";
import {
  DISCOUNT_BEARER,
  DISCOUNT_BEARER_VALUES,
  COUPON_USER_SEGMENT_VALUES,
} from "@/shared/constants/statuses";
import {
  COUPON_TYPES,
  SCOPE_TYPES,
  USER_RESTRICTION_TYPES,
  TYPES_REQUIRING_VALUE,
} from "./couponShape.constants";

const optionalNonNegative = (message: string) =>
  z.number().nonnegative(message).optional().nullable();

/** Base object shape for the coupon create/edit form (before cross-field rules). */
export const CouponObjectSchema = z.object({
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
  applicableScopeType: z.enum(SCOPE_TYPES, {
    message: LABELS.couponScopeTypeRequired,
  }),
  applicableScopeIds: z.array(z.string().uuid()),
  userRestrictionType: z.enum(USER_RESTRICTION_TYPES).optional(),
  userRestrictionSegment: z
    .enum(COUPON_USER_SEGMENT_VALUES)
    .optional()
    .nullable(),
  userRestrictionUserIds: z.array(z.string().uuid()).optional(),
  bundleProductIds: z.array(z.string().uuid()).optional(),
  tier2MinSubtotal: optionalNonNegative(LABELS.couponMinOrderNegative),
  tier2Percent: optionalNonNegative(LABELS.couponValueNegative),
  usageLimitTotal: z.number().int().positive().optional().nullable(),
  usageLimitPerUser: z.number().int().positive().optional().nullable(),
  stackable: z.boolean().optional(),
  priority: z.number().int().optional(),
  discountBearer: z.enum(DISCOUNT_BEARER_VALUES, {
    message: LABELS.couponBearerRequired,
  }),
  startDate: z
    .string()
    .min(1, LABELS.couponStartDateRequired)
    .refine((v) => !Number.isNaN(Date.parse(v)), LABELS.couponStartDateInvalid),
  endDate: z
    .string()
    .min(1, LABELS.couponEndDateRequired)
    .refine((v) => !Number.isNaN(Date.parse(v)), LABELS.couponEndDateInvalid),
});

/** Form values produced by the coupon schema (shape identical after refine). */
export type CouponFormInput = z.infer<typeof CouponObjectSchema>;

export const COUPON_FORM_DEFAULTS: CouponFormInput = {
  code: "",
  type: "PERCENTAGE",
  value: null,
  maxDiscountCap: null,
  minOrderValue: null,
  minQuantity: null,
  applicableScopeType: "all",
  applicableScopeIds: [],
  userRestrictionType: "all",
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
  startDate: "",
  endDate: "",
};

export const VENDOR_COUPON_FORM_DEFAULTS: CouponFormInput = {
  ...COUPON_FORM_DEFAULTS,
  applicableScopeType: "vendor",
  discountBearer: DISCOUNT_BEARER.VENDOR,
};

export function couponRequiresValue(type: CouponFormInput["type"] | undefined) {
  if (type == null) return false;
  return TYPES_REQUIRING_VALUE.has(type) || type === "TIERED";
}
