"use client";

import { useMemo } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { ProductVariant } from "@/shared/api/types";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";

export interface SpecRow {
  label: string;
  value: string;
}

interface UseProductSpecificationsParams {
  specs?: Record<string, string> | null;
  matchedVariant?: ProductVariant | null;
  categoryName?: string | null;
  displayStock: number;
}

function formatWeightGrams(grams?: number) {
  if (!grams || grams <= 0) return null;
  return formatLabel(LABELS.productWeightGrams, {
    grams: formatInrAmount(grams),
  });
}

function pushUniqueRow(
  rows: SpecRow[],
  seen: Set<string>,
  label: string,
  value: string,
) {
  const normalized = label.trim().toLowerCase();
  if (!value || seen.has(normalized)) return;
  seen.add(normalized);
  rows.push({ label, value });
}

export function useProductSpecifications({
  specs,
  matchedVariant,
  categoryName,
  displayStock,
}: UseProductSpecificationsParams) {
  const rows = useMemo(() => {
    const list: SpecRow[] = [];
    const seenLabels = new Set<string>();

    if (matchedVariant?.sku) {
      pushUniqueRow(list, seenLabels, LABELS.sku, matchedVariant.sku);
    }

    if (matchedVariant?.price != null) {
      pushUniqueRow(
        list,
        seenLabels,
        LABELS.variantPrice,
        `₹${formatInrAmount(matchedVariant.price)}`,
      );
    }

    if (matchedVariant?.attributes) {
      for (const [key, value] of Object.entries(matchedVariant.attributes)) {
        pushUniqueRow(list, seenLabels, key, value);
      }
    }

    const weight = formatWeightGrams(matchedVariant?.weightGrams);
    if (weight) {
      pushUniqueRow(list, seenLabels, LABELS.productWeight, weight);
    }

    if (categoryName) {
      pushUniqueRow(list, seenLabels, LABELS.categoryLabel, categoryName);
    }

    if (specs) {
      for (const [key, value] of Object.entries(specs)) {
        pushUniqueRow(list, seenLabels, key, value);
      }
    }

    pushUniqueRow(
      list,
      seenLabels,
      LABELS.stock,
      displayStock > 0
        ? formatLabel(LABELS.stockAvailable, { count: displayStock })
        : LABELS.outOfStock,
    );

    return list;
  }, [specs, matchedVariant, categoryName, displayStock]);

  return {
    rows,
  };
}
