"use client";

import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { notifyError } from "@/shared/stores/notifications/errorToast.store";
import { productsApi, type ProductWriteBody } from "@/features/products";

/**
 * Creates the product, then attaches the draft images one by one. Failures are
 * isolated per image so one bad upload cannot hide the rest — and so the vendor
 * is never tempted to re-submit the form and create a duplicate product; the
 * failed count is surfaced instead.
 */
export async function createProductWithImages(
  body: ProductWriteBody,
  imageUrls: readonly string[],
): Promise<void> {
  const product = await productsApi.create(body);

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

  if (failedImages > 0) {
    notifyError(
      formatLabel(LABELS.productImagesPartialFailure, {
        count: failedImages,
      }),
    );
  }
}
