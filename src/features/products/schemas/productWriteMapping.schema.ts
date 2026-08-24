import { z } from "zod";
import { WARRANTY_TYPE } from "@/shared/constants/statuses";
import {
  splitCommaList,
  type ProductListingFormField,
} from "../types/productListingForm.types";
import type { ProductListingFormInput } from "./listingFormSchema/index";

export function toProductWriteBody(values: ProductListingFormInput) {
  const specs: Record<string, string> = {};
  for (const row of values.specs) {
    if (row.key && row.value) specs[row.key] = row.value;
  }

  return {
    name: values.name,
    categoryId: values.categoryId,
    basePrice: Number(values.price),
    description: values.description,
    brand: values.brand ?? null,
    compareAtPrice: values.compareAtPrice
      ? Number(values.compareAtPrice)
      : null,
    tags: splitCommaList(values.tagsInput),
    highlights: values.highlights,
    specs,
    deliveryNote: values.deliveryNote ?? null,
    returnNote: values.returnNote ?? null,
    warrantyMonths: values.warrantyMonths
      ? Number(values.warrantyMonths)
      : null,
    warrantyType: values.warrantyType
      ? (values.warrantyType as (typeof WARRANTY_TYPE)[keyof typeof WARRANTY_TYPE])
      : null,
    hsnCode: values.hsnCode.trim() ? values.hsnCode.trim() : null,
    seoTitle: values.seoTitle.trim() ? values.seoTitle.trim() : null,
    seoDescription: values.seoDescription.trim()
      ? values.seoDescription.trim()
      : null,
    videoUrl: values.videoUrl ?? null,
    sizeChartUrl: values.sizeChartUrl ?? null,
    codEnabled: values.codMode === "inherit" ? null : values.codMode === "on",
  };
}

export type ProductWriteBody = ReturnType<typeof toProductWriteBody>;

export function productFormFieldErrors(
  error: z.ZodError,
): Partial<Record<ProductListingFormField, string>> {
  const next: Partial<Record<ProductListingFormField, string>> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "") as ProductListingFormField;
    if (!field || next[field]) continue;
    next[field] = issue.message;
  }
  return next;
}
