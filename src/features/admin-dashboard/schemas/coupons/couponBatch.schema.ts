import { z } from "zod";
import { LABELS } from "@/shared/constants/labels";
import {
  CouponObjectSchema,
  refineCouponValueAndDates,
} from "./couponShape.schema";

export const BulkCouponSchema = z.object({
  name: z.string().trim().min(1, LABELS.couponBatchNameRequired).max(120),
  count: z
    .number({ message: LABELS.couponBulkCountInvalid })
    .int()
    .min(1, LABELS.couponBulkCountInvalid)
    .max(500, LABELS.couponBulkCountInvalid),
  prefix: z.string().trim().max(8).optional(),
  template: CouponObjectSchema.omit({ code: true }).superRefine(
    refineCouponValueAndDates,
  ),
});

export type BulkCouponFormInput = z.infer<typeof BulkCouponSchema>;
