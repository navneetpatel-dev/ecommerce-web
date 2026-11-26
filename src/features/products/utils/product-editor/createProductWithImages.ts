"use client";

import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { notifyError } from "@/shared/stores/notifications/errorToast.store";
import { productsApi } from "../../api/listing/products.api";
import type { VariantWriteBody } from "../../api/listing/products.api";
import type { ProductWriteBody } from "../../schemas/listing-form/products.schema";

interface CreateProductOptions {
  /** Admin only: list the product through the on-behalf endpoint, for `vendorId` (none: a platform product). */
  onBehalf?: boolean;
  vendorId?: string;
  variants?: readonly VariantWriteBody[];
}

/**
 * Creates the product, then attaches its variants and draft images one by one. Failures are
 * isolated per item so one bad upload cannot hide the rest, and so the person is never tempted
 * to re-submit the form and create a duplicate product; the failed counts are surfaced instead.
 */
export async function createProductWithImages(
  body: ProductWriteBody,
  imageUrls: readonly string[],
  { onBehalf = false, vendorId, variants = [] }: CreateProductOptions = {},
): Promise<void> {
  const product = onBehalf
    ? await productsApi.createOnBehalf(vendorId, body)
    : await productsApi.create(body);

  let failedVariants = 0;
  for (const variant of variants) {
    try {
      await productsApi.addVariant(product.id, variant);
    } catch {
      failedVariants += 1;
    }
  }

  let failedImages = 0;
  for (const [index, url] of imageUrls.entries()) {
    try {
      await productsApi.addImage(product.id, {
        url,
        isPrimary: index === 0,
      });
    } catch {
      failedImages += 1;
    }
  }

  if (failedVariants > 0) {
    notifyError(
      formatLabel(LABELS.variantsPartialFailure, { count: failedVariants }),
    );
  }
  if (failedImages > 0) {
    notifyError(
      formatLabel(LABELS.productImagesPartialFailure, {
        count: failedImages,
      }),
    );
  }
}
