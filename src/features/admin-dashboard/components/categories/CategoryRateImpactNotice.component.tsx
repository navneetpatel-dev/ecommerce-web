"use client";

import { PriceChangeReasonField } from "@/features/products";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { CategoryRates } from "../../hooks/categories/useCategoryRateImpact.hook";
import { categoryRateImpactStyles as styles } from "../../styles/categories/categoryRateImpact.styles";
import { CategoryBlockedVendorsList } from "./CategoryBlockedVendorsList.component";
import { MrpImpactNotice } from "../shared/MrpImpactNotice.component";

interface CategoryRateImpactNoticeProps {
  rates: CategoryRates;
  disabled: boolean;
}

/**
 * Before a move or reassignment: who it is blocked by, or that it changes what vendors are
 * charged (and why it is being done).
 */
export function CategoryRateImpactNotice({
  rates,
  disabled,
}: CategoryRateImpactNoticeProps) {
  const { impact, affected, notAllowed, blockedVendors, reason } = rates;
  const hasAboveMrp = (impact?.aboveMrp?.variantCount ?? 0) > 0;
  if (!impact || (!affected && blockedVendors.length === 0 && !hasAboveMrp)) {
    return null;
  }
  return (
    <div className={styles.box} role="status">
      <CategoryBlockedVendorsList vendors={blockedVendors} />
      <MrpImpactNotice impact={impact.aboveMrp} />
      {affected ? (
        <p className={styles.summary}>
          {formatLabel(LABELS.categoryRateImpactSummary, {
            products: impact.productCount,
            vendors: impact.vendors.length,
            gst: impact.gstChanged,
            commission: impact.commissionChanged,
          })}
        </p>
      ) : null}
      {notAllowed ? (
        <p className={styles.blocked}>{LABELS.categoryRateImpactBlocked}</p>
      ) : (
        <PriceChangeReasonField reason={reason} disabled={disabled} />
      )}
    </div>
  );
}
