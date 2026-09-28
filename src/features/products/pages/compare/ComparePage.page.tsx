"use client";

import { GitCompareArrows } from "lucide-react";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { ProductCompareSection } from "../../components/compare/ProductCompareSection.component";
import { useCompare } from "../../hooks/compare/useCompare.hook";
import { comparePageStyles as styles } from "./comparePage.styles";

/** Side-by-side comparison of the products in the compare tray. */
export function ComparePage() {
  const compare = useCompare();

  if (!compare.canCompare) {
    return (
      <EmptyState
        icon={GitCompareArrows}
        eyebrow={LABELS.compare}
        heading={LABELS.compareEmptyHeading}
        message={LABELS.compareMinRequired}
        actionLabel={LABELS.browseAllProducts}
        actionTo={PATHS.products}
      />
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{LABELS.comparePageTitle}</h1>
      <ProductCompareSection products={compare.comparedProducts} />
    </div>
  );
}
