"use client";

import type { CategoryGstInfo } from "@/shared/api/types";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { LABELS } from "@/shared/constants/labels";
import { taxPathForCategory } from "../../utils/tax/taxPath";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";

export function useCategoryTaxSection(
  categoryId: string,
  gst?: CategoryGstInfo,
) {
  const { hasPermission } = usePermissions();
  const sourceText = !gst
    ? ""
    : gst.source === "own"
      ? LABELS.taxSourceOwn
      : gst.source === "inherited"
        ? formatLabel(LABELS.taxSourceInherited, {
            name: gst.fromCategoryName ?? "",
          })
        : gst.source === "default"
          ? LABELS.taxSourceDefault
          : LABELS.taxSourceFallback;
  return {
    sourceText,
    canManageTax: hasPermission(PERMISSIONS.TAX_MANAGE),
    taxPath: taxPathForCategory(categoryId),
  };
}
