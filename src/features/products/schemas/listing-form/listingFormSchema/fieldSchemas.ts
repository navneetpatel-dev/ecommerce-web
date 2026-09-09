import { z } from "zod";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { PRODUCT_FIELD_LIMITS } from "../../../constants/listing-form/productFields";

export const tooLong = (max: number) =>
  formatLabel(LABELS.productFieldTooLong, { max });
export const listTooLong = (max: number) =>
  formatLabel(LABELS.productListTooLong, { max });

export const optionalNote = z
  .string()
  .trim()
  .max(PRODUCT_FIELD_LIMITS.NOTE_MAX, tooLong(PRODUCT_FIELD_LIMITS.NOTE_MAX))
  .transform((value) => (value ? value : undefined));

export const optionalUrl = z
  .string()
  .trim()
  .max(2048, tooLong(2048))
  .refine((value) => !value || z.string().url().safeParse(value).success, {
    message: LABELS.productMediaUrlInvalid,
  })
  .transform((value) => (value ? value : undefined));

export const optionalWarrantyMonths = z
  .string()
  .trim()
  .refine(
    (value) =>
      !value ||
      (/^\d+$/.test(value) &&
        Number(value) >= 0 &&
        Number(value) <= PRODUCT_FIELD_LIMITS.WARRANTY_MONTHS_MAX),
    formatLabel(LABELS.enterWarrantyMonths, {
      max: PRODUCT_FIELD_LIMITS.WARRANTY_MONTHS_MAX,
    }),
  );
