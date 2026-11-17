"use client";

import { useMemo } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { ProductVariant } from "@/shared/api/types";
import { formatInr } from "@/shared/utils/formatting/orderFormat";

export interface SpecRow {
  label: string;
  value: string;
}

interface UseProductSpecificationsParams {
  specs?:
    | Record<string, unknown>
    | Array<{ key?: string; name?: string; value?: unknown }>
    | string
    | null;
  matchedVariant?: ProductVariant | null;
  categoryName?: string | null;
  displayStock: number;
}

function formatWeightGrams(grams?: number) {
  if (!grams || grams <= 0) return null;
  return formatLabel(LABELS.productWeightGrams, {
    grams: grams.toLocaleString("en-IN"),
  });
}

function pushUniqueRow(
  rows: SpecRow[],
  seen: Set<string>,
  label: string,
  value: unknown,
) {
  if (value == null) return;
  const stringValue = typeof value === "string" ? value : String(value);
  const normalized = label.trim().toLowerCase();
  if (!stringValue.trim() || seen.has(normalized)) return;
  seen.add(normalized);
  rows.push({ label: label.trim(), value: stringValue.trim() });
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

    // 1. Direct specifications from the admin/vendor side exactly as provided
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

    // 2. Category, variant attributes, and physical product metadata
    if (categoryName) {
      pushUniqueRow(list, seenLabels, LABELS.categoryLabel, categoryName);
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

    return list;
  }, [specs, matchedVariant, categoryName, displayStock]);

  return {
    rows,
  };
}
