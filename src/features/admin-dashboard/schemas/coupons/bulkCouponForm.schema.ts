import { z } from "zod";
import { LABELS } from "@/shared/constants/labels";

export const BulkFormSchema = z.object({
  name: z.string().trim().min(1, LABELS.couponBatchNameRequired),
  count: z
    .number({ message: LABELS.couponBulkCountInvalid })
    .int()
    .min(1, LABELS.couponBulkCountInvalid)
    .max(500, LABELS.couponBulkCountInvalid),
  prefix: z
    .string()
    .trim()
    .max(8)
    .regex(/^[A-Za-z0-9-]*$/, LABELS.couponPrefixFormat)
    .optional(),
});

export type BulkMetaInput = z.infer<typeof BulkFormSchema>;

export const BULK_FORM_DEFAULTS: BulkMetaInput = {
  name: "",
  count: 10,
  prefix: "CS",
};
