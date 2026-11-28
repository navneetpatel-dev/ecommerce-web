"use client";

import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { useArchiveCategoryDescription } from "../../../hooks/categories/useArchiveCategoryDescription.hook";

interface ArchiveDescriptionProps {
  categoryId: string;
  name: string;
  /** "archive" hides it from the shop; "delete" removes it for good. */
  mode?: "archive" | "delete";
}

/** The confirmation text with what the action really touches: products, subcategories, its tax rule. */
export function ArchiveDescription({
  categoryId,
  name,
  mode = "archive",
}: ArchiveDescriptionProps) {
  const { impact } = useArchiveCategoryDescription(categoryId);
  if (!impact) return <>{LABELS.categoryImpactLoading}</>;

  const base = formatLabel(
    mode === "archive"
      ? LABELS.categoryImpactArchive
      : LABELS.categoryImpactDelete,
    {
      name,
      products: String(impact.productCount),
      children: String(impact.childCount),
    },
  );
  const cascade =
    mode === "archive" && impact.activeChildCount > 0
      ? formatLabel(LABELS.categoryImpactArchiveCascade, {
          count: String(impact.activeChildCount),
        })
      : null;
  const rule =
    mode === "delete" && impact.ownTaxRule
      ? formatLabel(LABELS.categoryImpactTaxRule, {
          percent: String(impact.ownTaxRule.gstPercentage),
        })
      : null;

  const deleted =
    mode === "delete" && impact.deletedProductCount
      ? formatLabel(LABELS.categoryImpactDeletedProducts, {
          count: String(impact.deletedProductCount),
        })
      : null;
  const secondary = impact.secondaryCount
    ? formatLabel(
        mode === "delete"
          ? LABELS.categoryImpactSecondaryDelete
          : LABELS.categoryImpactSecondaryArchive,
        { count: String(impact.secondaryCount) },
      )
    : null;

  return (
    <>{[base, deleted, secondary, cascade, rule].filter(Boolean).join(" ")}</>
  );
}
