"use client";

import type { ReactNode } from "react";
import { LABELS } from "@/shared/constants/labels";
import { productEditorFormStyles as styles } from "../../styles/product-editor/productEditorForm.styles";

/** Selling price and MRP together, with a short explanation of how GST fits in. */
export function ProductPricingGroup({ children }: { children: ReactNode }) {
  return (
    <div className={styles.pricingGroup}>
      <div className={styles.pricingGroupHeader}>
        <h4 className={styles.pricingGroupTitle}>
          {LABELS.productPricingGroupTitle}
        </h4>
        <p className={styles.pricingGroupHint}>
          {LABELS.productPricingGroupHint}
        </p>
      </div>
      <div className={styles.pricingGrid}>{children}</div>
    </div>
  );
}
