import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type {
  SpecRow,
  UseProductSpecificationsParams,
} from "../../types/specs/specifications.types";
import { pushUniqueRow } from "./pushSpecRow";

function formatWeightGrams(grams?: number) {
  if (!grams || grams <= 0) return null;
  return formatLabel(LABELS.productWeightGrams, {
    grams: grams.toLocaleString("en-IN"),
  });
}

/** Brand and seller, the listed specifications, then the chosen variant and stock. */
export function addProductDetailRows(
  list: SpecRow[],
  seenLabels: Set<string>,
  {
    specs,
    matchedVariant,
    categoryName,
    displayStock,
    brand,
    vendorName,
  }: UseProductSpecificationsParams,
) {
  // 1. Core product metadata from admin/vendor
  if (brand?.trim()) {
    pushUniqueRow(list, seenLabels, LABELS.productBrand, brand);
  }

  if (vendorName?.trim()) {
    pushUniqueRow(list, seenLabels, LABELS.soldBy, vendorName);
  }

  if (categoryName) {
    pushUniqueRow(list, seenLabels, LABELS.categoryLabel, categoryName);
  }

  // 2. Direct specifications from the admin/vendor side exactly as provided
  if (specs) {
    let raw: unknown = specs;
    if (typeof raw === "string") {
      try {
        raw = JSON.parse(raw);
      } catch {
        raw = {};
      }
    }
    if (Array.isArray(raw)) {
      for (const item of raw) {
        if (item && typeof item === "object") {
          const key =
            "key" in item
              ? String(item.key)
              : "name" in item
                ? String(item.name)
                : "";
          const val = "value" in item ? item.value : "";
          if (key) pushUniqueRow(list, seenLabels, key, val);
        }
      }
    } else if (raw && typeof raw === "object") {
      for (const [key, value] of Object.entries(
        raw as Record<string, unknown>,
      )) {
        pushUniqueRow(list, seenLabels, key, value);
      }
    }
  }

  // 3. Variant attributes and physical product metadata
  if (matchedVariant?.attributes) {
    for (const [key, value] of Object.entries(matchedVariant.attributes)) {
      pushUniqueRow(list, seenLabels, key, value);
    }
  }

  const weight = formatWeightGrams(matchedVariant?.weightGrams);
  if (weight) {
    pushUniqueRow(list, seenLabels, LABELS.productWeight, weight);
  }

  if (
    matchedVariant?.sku &&
    !/^[0-9a-f-]{16,}$/i.test(matchedVariant.sku.trim())
  ) {
    pushUniqueRow(list, seenLabels, LABELS.sku, matchedVariant.sku);
  }

  // The price as the customer pays it (GST included), as in the buy box.
  const variantPrice = matchedVariant?.displayPrice ?? matchedVariant?.price;
  if (variantPrice != null) {
    pushUniqueRow(
      list,
      seenLabels,
      LABELS.variantPrice,
      `${formatInr(variantPrice)}`,
    );
  }

  pushUniqueRow(
    list,
    seenLabels,
    LABELS.stock,
    displayStock > 0
      ? formatLabel(LABELS.stockAvailable, { count: displayStock })
      : LABELS.outOfStock,
  );
}
