import { z } from "zod";
import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_FIELD_LIMITS } from "../../constants/productFields";
import { WARRANTY_TYPE_VALUES } from "@/shared/constants/statuses";
import {
  sanitizeProductListingValues,
  type ProductListingFormValues,
} from "../../types/productListingForm.types";
import {
  listTooLong,
  optionalNote,
  optionalUrl,
  optionalWarrantyMonths,
  tooLong,
} from "./fieldSchemas";
import { validateProductListingCrossFields } from "./crossFieldValidation";

export const ProductListingFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, LABELS.enterProductName)
      .max(
        PRODUCT_FIELD_LIMITS.NAME_MAX,
        tooLong(PRODUCT_FIELD_LIMITS.NAME_MAX),
      ),
    categoryId: z.string().uuid({ message: LABELS.selectProductCategory }),
    price: z
      .string()
      .trim()
      .min(1, LABELS.enterProductPrice)
      .refine((value) => Number(value) >= 1, LABELS.enterProductPrice),
    compareAtPrice: z
      .string()
      .trim()
      .refine(
        (value) => !value || Number(value) >= 1,
        LABELS.enterProductCompareAtPrice,
      ),
    description: z
      .string()
      .trim()
      .min(1, LABELS.enterProductDescription)
      .max(
        PRODUCT_FIELD_LIMITS.DESCRIPTION_MAX,
        tooLong(PRODUCT_FIELD_LIMITS.DESCRIPTION_MAX),
      ),
    brand: z
      .string()
      .trim()
      .max(
        PRODUCT_FIELD_LIMITS.BRAND_MAX,
        tooLong(PRODUCT_FIELD_LIMITS.BRAND_MAX),
      )
      .transform((value) => (value ? value : undefined)),
    tagsInput: z.string(),
    highlights: z
      .array(
        z
          .string()
          .trim()
          .min(1, LABELS.enterProductHighlight)
          .max(
            PRODUCT_FIELD_LIMITS.HIGHLIGHT_MAX,
            tooLong(PRODUCT_FIELD_LIMITS.HIGHLIGHT_MAX),
          ),
      )
      .max(
        PRODUCT_FIELD_LIMITS.HIGHLIGHTS_MAX,
        listTooLong(PRODUCT_FIELD_LIMITS.HIGHLIGHTS_MAX),
      ),
    specs: z
      .array(
        z.object({
          key: z
            .string()
            .trim()
            .max(
              PRODUCT_FIELD_LIMITS.SPEC_KEY_MAX,
              tooLong(PRODUCT_FIELD_LIMITS.SPEC_KEY_MAX),
            ),
          value: z
            .string()
            .trim()
            .max(
              PRODUCT_FIELD_LIMITS.SPEC_VALUE_MAX,
              tooLong(PRODUCT_FIELD_LIMITS.SPEC_VALUE_MAX),
            ),
        }),
      )
      .max(
        PRODUCT_FIELD_LIMITS.SPECS_MAX,
        listTooLong(PRODUCT_FIELD_LIMITS.SPECS_MAX),
      )
      .superRefine((rows, ctx) => {
        const seen = new Set<string>();
        rows.forEach((row, index) => {
          const hasKey = Boolean(row.key);
          const hasValue = Boolean(row.value);
          if (hasKey !== hasValue) {
            ctx.addIssue({
              code: "custom",
              path: [index, hasKey ? "value" : "key"],
              message: LABELS.productSpecPairRequired,
            });
          }
          if (!hasKey) return;
          const normalized = row.key.toLowerCase();
          if (seen.has(normalized)) {
            ctx.addIssue({
              code: "custom",
              path: [index, "key"],
              message: LABELS.productSpecDuplicateKey,
            });
          }
          seen.add(normalized);
        });
      }),
    deliveryNote: optionalNote,
    returnNote: optionalNote,
    warrantyMonths: optionalWarrantyMonths,
    warrantyType: z
      .string()
      .refine(
        (value) =>
          !value || (WARRANTY_TYPE_VALUES as readonly string[]).includes(value),
        LABELS.productWarrantyType,
      ),
    hsnCode: z
      .string()
      .trim()
      .max(PRODUCT_FIELD_LIMITS.HSN_MAX, tooLong(PRODUCT_FIELD_LIMITS.HSN_MAX)),
    seoTitle: z
      .string()
      .trim()
      .max(
        PRODUCT_FIELD_LIMITS.SEO_TITLE_MAX,
        tooLong(PRODUCT_FIELD_LIMITS.SEO_TITLE_MAX),
      ),
    seoDescription: z
      .string()
      .trim()
      .max(
        PRODUCT_FIELD_LIMITS.SEO_DESCRIPTION_MAX,
        tooLong(PRODUCT_FIELD_LIMITS.SEO_DESCRIPTION_MAX),
      ),
    videoUrl: optionalUrl,
    sizeChartUrl: optionalUrl,
    codMode: z.enum(["inherit", "on", "off"]),
  })
  .superRefine(validateProductListingCrossFields);

export type ProductListingFormInput = z.infer<typeof ProductListingFormSchema>;

export function parseProductListingForm(values: ProductListingFormValues) {
  return ProductListingFormSchema.safeParse(
    sanitizeProductListingValues(values),
  );
}
