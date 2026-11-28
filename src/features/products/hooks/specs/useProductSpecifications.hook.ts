"use client";

import { useMemo } from "react";
import type {
  SpecRow,
  UseProductSpecificationsParams,
} from "../../types/specs/specifications.types";
import { addProductDetailRows } from "../../utils/specs/productDetailRows";
import { addPolicyRows } from "../../utils/specs/policySpecRows";

export type { SpecRow } from "../../types/specs/specifications.types";

/** The specification table of a product page, without repeated labels. */
export function useProductSpecifications({
  specs,
  matchedVariant,
  categoryName,
  displayStock,
  brand,
  vendorName,
  hsnCode,
  warrantyMonths,
  warrantyType,
  returnsAllowed,
  returnWindowDays,
  returnNote,
  deliveryNote,
  codAvailable,
}: UseProductSpecificationsParams) {
  const rows = useMemo(() => {
    const list: SpecRow[] = [];
    const seenLabels = new Set<string>();
    const params = {
      specs,
      matchedVariant,
      categoryName,
      displayStock,
      brand,
      vendorName,
      hsnCode,
      warrantyMonths,
      warrantyType,
      returnsAllowed,
      returnWindowDays,
      returnNote,
      deliveryNote,
      codAvailable,
    };
    addProductDetailRows(list, seenLabels, params);
    addPolicyRows(list, seenLabels, params);
    return list;
  }, [
    specs,
    matchedVariant,
    categoryName,
    displayStock,
    brand,
    vendorName,
    hsnCode,
    warrantyMonths,
    warrantyType,
    returnsAllowed,
    returnWindowDays,
    returnNote,
    deliveryNote,
    codAvailable,
  ]);

  return {
    rows,
  };
}
