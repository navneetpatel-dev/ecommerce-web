"use client";

import { useMemo } from "react";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { useGstPricePreview } from "../../api/listing/products.queries";
import {
  buildPreviewProduct,
  type PreviewProductInput,
} from "../../utils/preview/buildPreviewProduct";
import { isBlankDraft } from "../../utils/product-editor/variantDrafts";
import { useProductDetailPreviewProps } from "./useProductDetailPreviewProps.hook";

const positive = (text: string) =>
  text.trim() !== "" && Number(text) > 0 ? Number(text) : undefined;

/**
 * The customer page for the product being filled in: built from the form as it is now. Prices with
 * GST, the strikethrough MRP and the % off come from the API for the entered price, MRP and variant
 * prices (asked for once typing pauses).
 */
export function useLiveProductPreview(
  input: Omit<PreviewProductInput, "pricing">,
) {
  const { values, mode, saved, variantRows } = input;
  const variantPrices =
    mode === "edit"
      ? undefined
      : variantRows
          .filter((row) => !isBlankDraft(row))
          .map((row) => positive(row.price))
          .filter((price): price is number => price !== undefined);

  const price = useDebouncedValue(positive(values.price) ?? 0, 400);
  const mrp = useDebouncedValue(positive(values.compareAtPrice) ?? 0, 400);
  const variantKey = useDebouncedValue((variantPrices ?? []).join(","), 400);
  const debouncedVariantPrices = variantKey
    ? variantKey.split(",").map(Number)
    : undefined;

  const { data: pricing } = useGstPricePreview(
    values.categoryId,
    price,
    mrp > 0 ? mrp : undefined,
    debouncedVariantPrices,
  );

  const product = useMemo(
    () =>
      buildPreviewProduct({
        ...input,
        pricing: pricing ?? null,
      }),
    // `input` is rebuilt each render; its parts are what matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      values,
      mode,
      saved,
      variantRows,
      input.imageUrls,
      input.category,
      pricing,
    ],
  );

  return useProductDetailPreviewProps(product);
}
