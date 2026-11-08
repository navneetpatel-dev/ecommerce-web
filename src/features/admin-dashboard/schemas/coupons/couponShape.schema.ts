import { z } from "zod";
import { CouponObjectSchema } from "./couponShape/couponShape.object";
import { refineCouponValueAndDates } from "./couponShape/couponShape.refinements";

export {
  CouponObjectSchema,
  COUPON_FORM_DEFAULTS,
  VENDOR_COUPON_FORM_DEFAULTS,
  couponRequiresValue,
  type CouponFormInput,
} from "./couponShape/couponShape.object";
export {
  COUPON_TYPES,
  SCOPE_TYPES,
  USER_RESTRICTION_TYPES,
} from "./couponShape/couponShape.constants";
export { refineCouponValueAndDates } from "./couponShape/couponShape.refinements";

/** Keep in sync with backend CreateCouponSchema. */
export const CouponSchema = CouponObjectSchema.superRefine(
  refineCouponValueAndDates,
);

/** Editing: a past end date may stay as it is, and an older code keeps its format. */
export const CouponEditSchema = CouponObjectSchema.extend({
  code: z.string().trim().min(1),
}).superRefine((data, ctx) =>
  refineCouponValueAndDates(data, ctx, { endMustBeFuture: false }),
);
