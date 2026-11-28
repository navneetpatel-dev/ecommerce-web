"use client";

import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
import type { ProductListingFormValues } from "../../schemas/listing-form/products.schema";
import type { PriceGuide } from "../../types/product-editor/types";

interface UseProductPriceFieldsParams {
  values: ProductListingFormValues;
  patchValues: (patch: Partial<ProductListingFormValues>) => void;
  priceGuide: PriceGuide;
  locked: boolean;
}

/** The price and MRP inputs: their changes, and an MRP that is below what customers pay. */
export function useProductPriceFields({
  values,
  patchValues,
  priceGuide,
  locked,
}: UseProductPriceFieldsParams) {
  const handlePriceChange = (value: number | undefined) => {
    patchValues({ price: value == null ? "" : String(value) });
  };

  const customerPrice = priceGuide.customerPrice;
  const mrp =
    values.compareAtPrice === "" ? null : Number(values.compareAtPrice);
  // Comparable without a category: an MRP below the selling price itself can never be right.
  const sellingPrice = values.price === "" ? null : Number(values.price);
  const mrpBelowPrice =
    mrp !== null && sellingPrice !== null && mrp < sellingPrice
      ? formatLabel(LABELS.productMrpBelowPrice, { price: values.price })
      : undefined;
  const mrpTooLow =
    customerPrice !== null && mrp !== null && mrp < customerPrice;
  const mrpBelowMinimum =
    mrpTooLow && customerPrice !== null
      ? formatLabel(LABELS.productMrpBelowCustomerPrice, {
          amount: formatInrAmount(customerPrice),
        })
      : undefined;
  const handleUseCustomerPrice = () => {
    if (customerPrice !== null) {
      patchValues({ compareAtPrice: String(customerPrice) });
    }
  };
  const showUseCustomerPrice =
    customerPrice !== null && !locked && (mrp === null || mrpTooLow);
  const handleCompareAtPriceChange = (value: number | undefined) => {
    patchValues({ compareAtPrice: value == null ? "" : String(value) });
  };

  return {
    handlePriceChange,
    handleCompareAtPriceChange,
    handleUseCustomerPrice,
    showUseCustomerPrice,
    customerPrice,
    mrpError: mrpBelowPrice ?? mrpBelowMinimum,
  };
}
