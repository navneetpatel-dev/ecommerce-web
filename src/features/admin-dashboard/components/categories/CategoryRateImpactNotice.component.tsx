"use client";

import { PriceChangeReasonField } from "@/features/products";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { CategoryRates } from "../../hooks/categories/useCategoryRateImpact.hook";
import { categoryRateImpactStyles as styles } from "../../styles/categories/categoryRateImpact.styles";
import { MrpImpactNotice } from "../shared/MrpImpactNotice.component";

interface CategoryRateImpactNoticeProps {
  rates: CategoryRates;
  disabled: boolean;
}

/**
 * Before a move or commission change: that it changes what vendors are charged (and why it is
 * being done), or that this admin may not make it.
 */
export function CategoryRateImpactNotice({
  rates,
  disabled,
}: CategoryRateImpactNoticeProps) {
  const { impact, affected, blocked, reason } = rates;
  const hasAboveMrp = (impact?.aboveMrp?.variantCount ?? 0) > 0;
  if (!impact || (!affected && !hasAboveMrp)) {
    return null;
  }
  return (
    <div className={styles.box} role="status">
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
      {blocked ? (
        <p className={styles.blocked}>{LABELS.categoryRateImpactBlocked}</p>
      ) : (
        <PriceChangeReasonField reason={reason} disabled={disabled} />
      )}
    </div>
  );
}
