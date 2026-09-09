import type { z } from "zod";
import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_FIELD_LIMITS } from "../../constants/productFields";
import { splitCommaList } from "../../types/productListingForm.types";
import { listTooLong, tooLong } from "./fieldSchemas";

interface ProductListingCrossFieldValues {
  tagsInput: string;
  price: string;
  compareAtPrice: string;
}

/** Cross-field rules that can't be expressed on a single field: tag limits, price ordering. */
export function validateProductListingCrossFields(
  values: ProductListingCrossFieldValues,
  ctx: z.RefinementCtx,
) {
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
}
