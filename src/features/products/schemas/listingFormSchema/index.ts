import { z } from "zod";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { PRODUCT_FIELD_LIMITS } from "../../constants/productFields";
import { WARRANTY_TYPE_VALUES } from "@/shared/constants/statuses";
import {
  sanitizeProductListingValues,
  splitCommaList,
  type ProductListingFormValues,
} from "../../types/productListingForm.types";

const tooLong = (max: number) =>
  formatLabel(LABELS.productFieldTooLong, { max });
const listTooLong = (max: number) =>
  formatLabel(LABELS.productListTooLong, { max });

const optionalNote = z
  .string()
  .trim()
  .max(PRODUCT_FIELD_LIMITS.NOTE_MAX, tooLong(PRODUCT_FIELD_LIMITS.NOTE_MAX))
  .transform((value) => (value ? value : undefined));

const optionalUrl = z
  .string()
  .trim()
  .max(2048, tooLong(2048))
  .refine((value) => !value || z.string().url().safeParse(value).success, {
    message: LABELS.productMediaUrlInvalid,
  })
  .transform((value) => (value ? value : undefined));

const optionalWarrantyMonths = z
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
  .superRefine((values, ctx) => {
    const tags = splitCommaList(values.tagsInput);
    if (tags.length > PRODUCT_FIELD_LIMITS.TAGS_MAX) {
      ctx.addIssue({
        code: "custom",
        path: ["tagsInput"],
        message: listTooLong(PRODUCT_FIELD_LIMITS.TAGS_MAX),
      });
    }
    const tooLongTag = tags.find(
      (tag) => tag.length > PRODUCT_FIELD_LIMITS.TAG_MAX,
    );
    if (tooLongTag) {
      ctx.addIssue({
        code: "custom",
        path: ["tagsInput"],
        message: tooLong(PRODUCT_FIELD_LIMITS.TAG_MAX),
      });
    }

    if (!values.compareAtPrice) return;
    if (Number(values.compareAtPrice) < Number(values.price)) {
      ctx.addIssue({
        code: "custom",
        path: ["compareAtPrice"],
        message: LABELS.productCompareAtBelowPrice,
      });
    }
  });

export type ProductListingFormInput = z.infer<typeof ProductListingFormSchema>;

export function parseProductListingForm(values: ProductListingFormValues) {
  return ProductListingFormSchema.safeParse(
    sanitizeProductListingValues(values),
  );
}
