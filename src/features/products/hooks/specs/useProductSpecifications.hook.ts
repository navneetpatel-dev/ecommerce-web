"use client";

import { useMemo } from "react";
import { LABELS } from "@/shared/constants/labels";
import { WARRANTY_TYPE } from "@/shared/constants/statuses";
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
  brand?: string | null;
  vendorName?: string | null;
  hsnCode?: string | null;
  warrantyMonths?: number | null;
  warrantyType?: string | null;
  returnsAllowed?: boolean;
  returnWindowDays?: number | null;
  returnNote?: string | null;
  deliveryNote?: string | null;
  codAvailable?: boolean;
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

    // 4. Policy, warranty, return and delivery specifications from admin/vendor
    if (warrantyMonths != null && warrantyMonths > 0) {
      const typeText =
        warrantyType === WARRANTY_TYPE.SELLER
          ? LABELS.warrantySeller
          : LABELS.warrantyManufacturer;
      pushUniqueRow(
        list,
        seenLabels,
        LABELS.warranty,
        formatLabel(LABELS.warrantyMonthsLabel, {
          months: warrantyMonths,
          type: typeText,
        }),
      );
    }

    if (returnsAllowed === false) {
      pushUniqueRow(
        list,
        seenLabels,
        LABELS.returnsPolicy,
        LABELS.notReturnable,
      );
    } else if (typeof returnWindowDays === "number") {
      const returnText = formatLabel(LABELS.easyReturnsDays, {
        days: returnWindowDays,
      });
      pushUniqueRow(
        list,
        seenLabels,
        LABELS.returnsPolicy,
        returnNote?.trim()
          ? `${returnText} · ${returnNote.trim()}`
          : returnText,
      );
    } else if (returnNote?.trim()) {
      pushUniqueRow(list, seenLabels, LABELS.returnsPolicy, returnNote.trim());
    }

    if (deliveryNote?.trim()) {
      pushUniqueRow(
        list,
        seenLabels,
        LABELS.deliveryAreaHeading,
        deliveryNote.trim(),
      );
    }

    if (typeof codAvailable === "boolean") {
      pushUniqueRow(
        list,
        seenLabels,
        LABELS.cashOnDelivery,
        codAvailable ? LABELS.codAvailable : LABELS.codUnavailable,
      );
    }

    if (hsnCode?.trim() && !/default/i.test(hsnCode)) {
      pushUniqueRow(list, seenLabels, LABELS.hsnCode, hsnCode.trim());
    }

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
